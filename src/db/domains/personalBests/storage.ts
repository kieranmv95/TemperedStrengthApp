// Public personal bests API — SQLite is the local source of truth.
// Cloud row sync uses dirty flags; no personal_bests KV writes.
import type {
  ExercisePersonalBestsLedger,
  PersonalBestsStore,
  RepMax,
} from '@/src/types/personalBests';
import {
  appendCascadeToLowerTiersOnly,
  currentMaxWeight,
  logPersonalBestIntoLedger,
  newPbEntryId,
} from '@/src/utils/personalBests';
import { increment } from '@/src/services/metricService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PERSONAL_BESTS_KEY } from '@/src/utils/storage/keys';
import { withKeyLock } from '@/src/utils/storage/internal';
import { SYNC_QUEUE_KEY, SYNC_TS_PREFIX } from '@/src/sync/constants';
import {
  expandPersonalBestsBlobToRows,
  parsePersonalBestsStore,
} from './codec';
import {
  getPersonalBestsStoreFromDb,
  softDeleteLocalPersonalBest,
  upsertLocalPersonalBestRows,
} from './repository';
import {
  isPersonalBestsLocalMigrated,
  markPersonalBestsLocalMigrated,
} from './meta';

async function stripPersonalBestsFromSyncQueue(): Promise<void> {
  const raw = await AsyncStorage.getItem(SYNC_QUEUE_KEY);
  if (!raw) {
    return;
  }
  try {
    const queue = JSON.parse(raw) as unknown;
    if (!Array.isArray(queue)) {
      return;
    }
    const next = queue.filter(
      (item) =>
        !(
          typeof item === 'object' &&
          item !== null &&
          'key' in item &&
          (item as { key: unknown }).key === PERSONAL_BESTS_KEY
        )
    );
    if (next.length !== queue.length) {
      await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(next));
    }
  } catch {
    // Ignore malformed queue; main sync path will re-parse safely.
  }
}

/**
 * One-shot: expand AsyncStorage `personal_bests` blob into SQLite, then drop the key.
 * Safe to call multiple times.
 */
export async function migratePersonalBestsFromKvLocal(): Promise<void> {
  if (await isPersonalBestsLocalMigrated()) {
    return;
  }

  const raw = await AsyncStorage.getItem(PERSONAL_BESTS_KEY);
  const store = parsePersonalBestsStore(raw);
  const updatedAt = new Date().toISOString();
  const rows = expandPersonalBestsBlobToRows(store, updatedAt).map((row) => ({
    ...row,
    dirty: 1 as const,
  }));

  if (rows.length > 0) {
    await upsertLocalPersonalBestRows(rows);
  }

  await AsyncStorage.multiRemove([
    PERSONAL_BESTS_KEY,
    `${SYNC_TS_PREFIX}${PERSONAL_BESTS_KEY}`,
  ]);
  await stripPersonalBestsFromSyncQueue();
  await markPersonalBestsLocalMigrated();
}

async function ensureLocalMigrated(): Promise<void> {
  await migratePersonalBestsFromKvLocal();
}

function entryIdsInLedger(
  exerciseId: number,
  ledger: ExercisePersonalBestsLedger
): Set<string> {
  return new Set(
    expandPersonalBestsBlobToRows(
      { [exerciseId]: ledger },
      new Date().toISOString()
    ).map((row) => row.id)
  );
}

export const getPersonalBestsStore = async (): Promise<PersonalBestsStore> => {
  try {
    await ensureLocalMigrated();
    return await getPersonalBestsStoreFromDb();
  } catch (error) {
    console.error('Error reading personal bests:', error);
    return {};
  }
};

export const getPersonalBestsForExercise = async (
  exerciseId: number
): Promise<ExercisePersonalBestsLedger> => {
  const store = await getPersonalBestsStore();
  return store[exerciseId] ?? {};
};

export type SavePersonalBestResult = {
  isPR: boolean;
  tiersWithNewRows: RepMax[];
};

/**
 * Appends a lift to the chosen rep tier. Downward cascade runs only when it is a PR
 * for that tier. Increments `pbs_logged` when `isPR` is true.
 */
export const savePersonalBest = async (
  exerciseId: number,
  primaryTier: RepMax,
  weight: number,
  achievedAtIso?: string
): Promise<SavePersonalBestResult> => {
  return withKeyLock(PERSONAL_BESTS_KEY, async () => {
    await ensureLocalMigrated();
    const achievedAt = achievedAtIso ?? new Date().toISOString();
    const store = await getPersonalBestsStoreFromDb();
    const current = store[exerciseId] ?? {};
    const { updated, isPR, tiersWithNewRows } = logPersonalBestIntoLedger(
      current,
      primaryTier,
      weight,
      achievedAt,
      newPbEntryId
    );

    if (tiersWithNewRows.length === 0) {
      return { isPR: false, tiersWithNewRows: [] };
    }

    const updatedAt = new Date().toISOString();
    const previousIds = entryIdsInLedger(exerciseId, current);
    const nextRows = expandPersonalBestsBlobToRows(
      { [exerciseId]: updated },
      updatedAt
    )
      .filter((row) => !previousIds.has(row.id))
      .map((row) => ({ ...row, dirty: 1 as const }));

    if (nextRows.length > 0) {
      await upsertLocalPersonalBestRows(nextRows);
      if (__DEV__) {
        console.log('[sqlite] personal best saved', {
          exerciseId,
          primaryTier,
          weight,
          inserted: nextRows.length,
          rows: nextRows,
        });
        const { logPersonalBestsSqliteDebug } = await import('./debug');
        await logPersonalBestsSqliteDebug('after savePersonalBest');
      }
    }

    if (isPR) {
      await increment('pbs_logged');
    }
    return { isPR, tiersWithNewRows };
  });
};

export const appendSingleTierPersonalBest = savePersonalBest;

export const updatePersonalBestEntry = async (
  exerciseId: number,
  tier: RepMax,
  entryId: string,
  patch: { weight?: number; achievedAt?: string }
): Promise<boolean> => {
  return withKeyLock(PERSONAL_BESTS_KEY, async () => {
    await ensureLocalMigrated();
    const store = await getPersonalBestsStoreFromDb();
    const ledger = store[exerciseId];
    const rows = ledger?.[tier];
    if (!rows?.length) {
      return false;
    }
    const idx = rows.findIndex((r) => r.id === entryId);
    if (idx < 0) {
      return false;
    }
    if (
      patch.weight !== undefined &&
      (!Number.isFinite(patch.weight) || patch.weight <= 0)
    ) {
      throw new Error('Invalid weight');
    }

    const oldTierMax = currentMaxWeight(ledger, tier);
    const nextRows = [...rows];
    nextRows[idx] = { ...nextRows[idx], ...patch };
    let nextLedger: ExercisePersonalBestsLedger = {
      ...ledger,
      [tier]: nextRows,
    };

    const newTierMax = currentMaxWeight(nextLedger, tier);
    if (
      patch.weight !== undefined &&
      newTierMax !== undefined &&
      (oldTierMax === undefined || newTierMax > oldTierMax)
    ) {
      const merged = nextRows[idx];
      const { updated, appendedTiers } = appendCascadeToLowerTiersOnly(
        nextLedger,
        tier,
        newTierMax,
        merged.achievedAt,
        newPbEntryId
      );
      if (appendedTiers.length > 0) {
        nextLedger = updated;
      }
    }

    const updatedAt = new Date().toISOString();
    const previousIds = entryIdsInLedger(exerciseId, ledger);
    const afterRows = expandPersonalBestsBlobToRows(
      { [exerciseId]: nextLedger },
      updatedAt
    );

    const toUpsert = afterRows
      .filter((row) => row.id === entryId || !previousIds.has(row.id))
      .map((row) => ({ ...row, dirty: 1 as const }));

    if (toUpsert.length === 0) {
      return false;
    }

    await upsertLocalPersonalBestRows(toUpsert);
    return true;
  });
};

export const deletePersonalBestEntry = async (
  exerciseId: number,
  tier: RepMax,
  entryId: string
): Promise<boolean> => {
  return withKeyLock(PERSONAL_BESTS_KEY, async () => {
    await ensureLocalMigrated();
    const store = await getPersonalBestsStoreFromDb();
    const ledger = store[exerciseId];
    const rows = ledger?.[tier];
    if (!rows?.length) {
      return false;
    }
    if (!rows.some((r) => r.id === entryId)) {
      return false;
    }
    return softDeleteLocalPersonalBest(entryId, new Date().toISOString());
  });
};
