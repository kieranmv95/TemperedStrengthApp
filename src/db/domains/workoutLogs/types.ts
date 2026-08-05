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

export function rowToLoggedSet(row: {
  weight: number | null;
  reps: number;
  state: string | null;
}): LoggedSet {
  const set: LoggedSet = {
    weight: row.weight,
    reps: row.reps,
  };
  if (row.state === 'completed' || row.state === 'failed' || row.state === null) {
    set.state = row.state;
  }
  return set;
}
