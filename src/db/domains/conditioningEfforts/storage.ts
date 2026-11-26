// Public conditioning-effort API. SQLite is the local source of truth.
import { getConditioningDistance } from '@/src/data/conditioningActivities';
import type {
  ConditioningEffort,
  ConditioningEffortsStore,
} from '@/src/types/conditioningEfforts';
import { newConditioningEffortId } from '@/src/utils/conditioningEfforts';
import { increment } from '@/src/services/metricService';
import { withKeyLock } from '@/src/utils/storage/internal';
import {
  listActiveConditioningEffortRows,
  softDeleteLocalConditioningEffort,
  upsertLocalConditioningEffortRow,
} from './repository';
import type { LocalConditioningEffortRow } from './types';

const LOCK_KEY = 'conditioning_efforts';

function toEffort(row: LocalConditioningEffortRow): ConditioningEffort {
  return {
    id: row.id,
    activityId: row.activity_id,
    distanceM: row.distance_m,
    durationMs: row.duration_ms,
    achievedAt: row.achieved_at,
  };
}

function groupEfforts(
  rows: LocalConditioningEffortRow[]
): ConditioningEffortsStore {
  const store: ConditioningEffortsStore = {};
  for (const row of rows) {
    const byDistance = store[row.activity_id] ?? {};
    const entries = byDistance[row.distance_m] ?? [];
    entries.push(toEffort(row));
    byDistance[row.distance_m] = entries;
    store[row.activity_id] = byDistance;
  }
  return store;
}

export const getConditioningEffortsStore =
  async (): Promise<ConditioningEffortsStore> => {
    try {
      const rows = await listActiveConditioningEffortRows();
      return groupEfforts(rows);
    } catch (error) {
      console.error('Error reading conditioning efforts:', error);
      return {};
    }
  };

export type SaveConditioningEffortResult = {
  isPR: boolean;
};

export const saveConditioningEffort = async (
  activityId: string,
  distanceM: number,
  durationMs: number,
  achievedAtIso?: string
): Promise<SaveConditioningEffortResult> => {
  return withKeyLock(LOCK_KEY, async () => {
    if (!getConditioningDistance(activityId, distanceM)) {
      throw new Error('Unknown conditioning distance.');
    }
    if (!Number.isFinite(durationMs) || durationMs <= 0) {
      throw new Error('Invalid duration.');
    }

    const rows = await listActiveConditioningEffortRows();
    const currentBest = fastestMs(
      rows
        .filter(
          (row) =>
            row.activity_id === activityId && row.distance_m === distanceM
        )
        .map(toEffort)
    );
    const isPR = currentBest === undefined || durationMs < currentBest;
    const achievedAt = achievedAtIso ?? new Date().toISOString();
    const updatedAt = new Date().toISOString();

    await upsertLocalConditioningEffortRow({
      id: newConditioningEffortId(),
      activity_id: activityId,
      distance_m: distanceM,
      duration_ms: Math.round(durationMs),
      achieved_at: achievedAt,
      updated_at: updatedAt,
      deleted_at: null,
      dirty: 1,
    });

    if (isPR) {
      await increment('pbs_logged');
    }
    return { isPR };
  });
};

export const updateConditioningEffort = async (
  activityId: string,
  distanceM: number,
  entryId: string,
  patch: { durationMs?: number; achievedAt?: string }
): Promise<boolean> => {
  return withKeyLock(LOCK_KEY, async () => {
    const rows = await listActiveConditioningEffortRows();
    const current = rows.find(
      (row) =>
        row.id === entryId &&
        row.activity_id === activityId &&
        row.distance_m === distanceM
    );
    if (!current) {
      return false;
    }
    if (
      patch.durationMs !== undefined &&
      (!Number.isFinite(patch.durationMs) || patch.durationMs <= 0)
    ) {
      throw new Error('Invalid duration.');
    }

    await upsertLocalConditioningEffortRow({
      ...current,
      duration_ms:
        patch.durationMs !== undefined
          ? Math.round(patch.durationMs)
          : current.duration_ms,
      achieved_at: patch.achievedAt ?? current.achieved_at,
      updated_at: new Date().toISOString(),
      dirty: 1,
    });
    return true;
  });
};

export const deleteConditioningEffort = async (
  activityId: string,
  distanceM: number,
  entryId: string
): Promise<boolean> => {
  return withKeyLock(LOCK_KEY, async () => {
    const rows = await listActiveConditioningEffortRows();
    const current = rows.find(
      (row) =>
        row.id === entryId &&
        row.activity_id === activityId &&
        row.distance_m === distanceM
    );
    if (!current) {
      return false;
    }
    return softDeleteLocalConditioningEffort(entryId, new Date().toISOString());
  });
};

function fastestMs(entries: ConditioningEffort[]): number | undefined {
  if (entries.length === 0) {
    return undefined;
  }
  return Math.min(...entries.map((entry) => entry.durationMs));
}
