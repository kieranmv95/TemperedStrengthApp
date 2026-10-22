import type { LoggedSet } from '@/src/types/storage';

export type SetState = 'completed' | 'failed' | null;

export type LocalWorkoutLogSetRow = {
  id: string;
  day_index: number;
  slot_index: number;
  set_index: number;
  weight: number | null;
  reps: number;
  state: SetState;
  rpe: number | null;
  updated_at: string;
  deleted_at: string | null;
  dirty: 0 | 1;
};

export type RemoteWorkoutLogSetRow = {
  id: string;
  user_id: string;
  day_index: number;
  slot_index: number;
  set_index: number;
  weight: number | null;
  reps: number;
  state: string | null;
  rpe: number | null;
  updated_at: string;
  deleted_at: string | null;
};

export const WORKOUT_LOGS_DOMAIN = 'workout_logs';

export const WORKOUT_LOGS_META = {
  localMigrated: 'local_v2_migrated',
  lastRowSyncedAt: 'last_row_synced_at',
  cloudKvCutover: 'cloud_kv_cutover',
} as const;

/** Stable id for a program set position (day/slot/set). */
export function workoutLogSetId(
  dayIndex: number,
  slotIndex: number,
  setIndex: number
): string {
  return `wls_${dayIndex}_${slotIndex}_${setIndex}`;
}

/** Accept only whole numbers 1–10; anything else becomes null. */
export function normalizeRpe(value: unknown): number | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  const n = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(n) || !Number.isInteger(n) || n < 1 || n > 10) {
    return null;
  }
  return n;
}

export function rowToLoggedSet(row: {
  weight: number | null;
  reps: number;
  state: string | null;
  rpe?: number | null;
}): LoggedSet {
  const set: LoggedSet = {
    weight: row.weight,
    reps: row.reps,
  };
  if (row.state === 'completed' || row.state === 'failed' || row.state === null) {
    set.state = row.state;
  }
  const rpe = normalizeRpe(row.rpe ?? null);
  if (rpe !== null) {
    set.rpe = rpe;
  } else if (row.rpe === null) {
    set.rpe = null;
  }
  return set;
}
