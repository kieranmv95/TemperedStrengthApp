// Personal bests ledger (per exercise, per rep-max tier).
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
import { syncSetItem } from '@/src/sync/syncStorage';
import { PERSONAL_BESTS_KEY } from './keys';
import { withKeyLock } from './internal';

function parsePersonalBestsStore(raw: string | null): PersonalBestsStore {
  if (!raw) {
    return {};
  }
  const parsed = JSON.parse(raw) as unknown;
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    return {};
  }
  return parsed as PersonalBestsStore;
}

async function readPersonalBestsStore(): Promise<PersonalBestsStore> {
  try {
    const raw = await AsyncStorage.getItem(PERSONAL_BESTS_KEY);
    return parsePersonalBestsStore(raw);
  } catch (error) {
    console.error('Error reading personal bests:', error);
    return {};
  }
}

export const getPersonalBestsStore = async (): Promise<PersonalBestsStore> => {
  return readPersonalBestsStore();
};

export const getPersonalBestsForExercise = async (
  exerciseId: number
): Promise<ExercisePersonalBestsLedger> => {
  const store = await readPersonalBestsStore();
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
    const achievedAt = achievedAtIso ?? new Date().toISOString();
    const raw = await AsyncStorage.getItem(PERSONAL_BESTS_KEY);
    const store = parsePersonalBestsStore(raw);
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

    const nextStore: PersonalBestsStore = { ...store, [exerciseId]: updated };
    await syncSetItem(PERSONAL_BESTS_KEY, JSON.stringify(nextStore));
    if (isPR) {
      await increment('pbs_logged');
    }
    return { isPR, tiersWithNewRows };
  });
};

/**
 * Same as {@link savePersonalBest} (alias for tier history “add” flows).
 */
export const appendSingleTierPersonalBest = savePersonalBest;

export const updatePersonalBestEntry = async (
  exerciseId: number,
  tier: RepMax,
  entryId: string,
  patch: { weight?: number; achievedAt?: string }
): Promise<boolean> => {
  return withKeyLock(PERSONAL_BESTS_KEY, async () => {
    const raw = await AsyncStorage.getItem(PERSONAL_BESTS_KEY);
    const store = parsePersonalBestsStore(raw);
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

    await syncSetItem(
      PERSONAL_BESTS_KEY,
      JSON.stringify({
        ...store,
        [exerciseId]: nextLedger,
      })
    );
    return true;
  });
};

export const deletePersonalBestEntry = async (
  exerciseId: number,
  tier: RepMax,
  entryId: string
): Promise<boolean> => {
  return withKeyLock(PERSONAL_BESTS_KEY, async () => {
    const raw = await AsyncStorage.getItem(PERSONAL_BESTS_KEY);
    const store = parsePersonalBestsStore(raw);
    const ledger = store[exerciseId];
    const rows = ledger?.[tier];
    if (!rows?.length) {
      return false;
    }
    const nextRows = rows.filter((r) => r.id !== entryId);
    if (nextRows.length === rows.length) {
      return false;
    }
    const nextLedger: ExercisePersonalBestsLedger = { ...ledger };
    if (nextRows.length === 0) {
      delete nextLedger[tier];
    } else {
      nextLedger[tier] = nextRows;
    }
    if (Object.keys(nextLedger).length === 0) {
      const nextStore = { ...store };
      delete nextStore[exerciseId];
      await syncSetItem(PERSONAL_BESTS_KEY, JSON.stringify(nextStore));
    } else {
      await syncSetItem(
        PERSONAL_BESTS_KEY,
        JSON.stringify({
          ...store,
          [exerciseId]: nextLedger,
        })
      );
    }
    return true;
  });
};
