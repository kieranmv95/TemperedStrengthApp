// Dev-only helpers to inspect the local SQLite workout_log_sets table.
import { getDatabase } from '@/src/db/database';
import type { LocalWorkoutLogSetRow, SetState } from './types';

/**
 * Returns every workout_log_sets row (including soft-deleted).
 * For Metro console debugging only.
 */
export async function listAllWorkoutLogSetRowsForDebug(): Promise<
  LocalWorkoutLogSetRow[]
> {
  const rows = await getDatabase().getAllAsync<{
    id: string;
    day_index: number;
    slot_index: number;
    set_index: number;
    weight: number | null;
    reps: number;
    state: string | null;
    updated_at: string;
    deleted_at: string | null;
    dirty: number;
  }>(
    `SELECT id, day_index, slot_index, set_index, weight, reps, state, updated_at, deleted_at, dirty
     FROM workout_log_sets
     ORDER BY day_index ASC, slot_index ASC, set_index ASC`
  );

  return rows.map((row) => {
    const state: SetState =
      row.state === 'completed' || row.state === 'failed' || row.state === null
        ? row.state
        : null;
    return {
      id: row.id,
      day_index: row.day_index,
      slot_index: row.slot_index,
      set_index: row.set_index,
      weight: row.weight,
      reps: row.reps,
      state,
      updated_at: row.updated_at,
      deleted_at: row.deleted_at,
      dirty: row.dirty ? 1 : 0,
    };
  });
}

/**
 * Logs row count + full table dump to Metro. No-op outside __DEV__.
 */
export async function logWorkoutLogSetsSqliteDebug(
  label = 'workout_log_sets'
): Promise<{ total: number; active: number; dirty: number }> {
  if (!__DEV__) {
    return { total: 0, active: 0, dirty: 0 };
  }

  const rows = await listAllWorkoutLogSetRowsForDebug();
  const active = rows.filter((row) => row.deleted_at == null).length;
  const dirty = rows.filter((row) => row.dirty === 1).length;

  console.log(`[sqlite] ${label}`, {
    total: rows.length,
    active,
    dirty,
    rows,
  });

  return { total: rows.length, active, dirty };
}
