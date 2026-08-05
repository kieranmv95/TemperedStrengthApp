import { getDatabase } from '@/src/db/database';
import type { LoggedSet } from '@/src/types/storage';
import {
  type LocalWorkoutLogSetRow,
  type RemoteWorkoutLogSetRow,
  type SetState,
  rowToLoggedSet,
  workoutLogSetId,
} from './types';

type SqliteWlRow = {
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
};

function mapRow(row: SqliteWlRow): LocalWorkoutLogSetRow {
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
}

export async function upsertLocalWorkoutLogSetRow(
  row: Omit<LocalWorkoutLogSetRow, 'dirty'> & { dirty?: 0 | 1 }
): Promise<void> {
  const dirty = row.dirty ?? 1;
  await getDatabase().runAsync(
    `INSERT INTO workout_log_sets (
       id, day_index, slot_index, set_index, weight, reps, state, updated_at, deleted_at, dirty
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       day_index = excluded.day_index,
       slot_index = excluded.slot_index,
       set_index = excluded.set_index,
       weight = excluded.weight,
       reps = excluded.reps,
       state = excluded.state,
       updated_at = excluded.updated_at,
       deleted_at = excluded.deleted_at,
       dirty = excluded.dirty`,
    row.id,
    row.day_index,
    row.slot_index,
    row.set_index,
    row.weight,
    row.reps,
    row.state,
    row.updated_at,
    row.deleted_at,
    dirty
  );
}

export async function upsertLocalWorkoutLogSetRows(
  rows: (Omit<LocalWorkoutLogSetRow, 'dirty'> & { dirty?: 0 | 1 })[]
): Promise<void> {
  if (rows.length === 0) {
    return;
  }
  const db = getDatabase();
  await db.withTransactionAsync(async () => {
    for (const row of rows) {
      await upsertLocalWorkoutLogSetRow(row);
    }
  });
}

export async function getLoggedSetsForSlotFromDb(
  dayIndex: number,
  slotIndex: number
): Promise<{ [setIndex: number]: LoggedSet }> {
  const rows = await getDatabase().getAllAsync<SqliteWlRow>(
    `SELECT id, day_index, slot_index, set_index, weight, reps, state, updated_at, deleted_at, dirty
     FROM workout_log_sets
     WHERE day_index = ? AND slot_index = ? AND deleted_at IS NULL`,
    dayIndex,
    slotIndex
  );
  const out: { [setIndex: number]: LoggedSet } = {};
  for (const row of rows) {
    out[row.set_index] = rowToLoggedSet(row);
  }
  return out;
}

export async function getWorkoutLogsForDayFromDb(
  dayIndex: number
): Promise<{ [slotIndex: number]: { [setIndex: number]: LoggedSet } }> {
  const rows = await getDatabase().getAllAsync<SqliteWlRow>(
    `SELECT id, day_index, slot_index, set_index, weight, reps, state, updated_at, deleted_at, dirty
     FROM workout_log_sets
     WHERE day_index = ? AND deleted_at IS NULL
     ORDER BY slot_index ASC, set_index ASC`,
    dayIndex
  );
  const out: { [slotIndex: number]: { [setIndex: number]: LoggedSet } } = {};
  for (const row of rows) {
    if (!out[row.slot_index]) {
      out[row.slot_index] = {};
    }
    out[row.slot_index][row.set_index] = rowToLoggedSet(row);
  }
  return out;
}

export async function listDirtyWorkoutLogSetRows(): Promise<
  LocalWorkoutLogSetRow[]
> {
  const rows = await getDatabase().getAllAsync<SqliteWlRow>(
    `SELECT id, day_index, slot_index, set_index, weight, reps, state, updated_at, deleted_at, dirty
     FROM workout_log_sets
     WHERE dirty = 1`
  );
  return rows.map(mapRow);
}

export async function markWorkoutLogSetRowsClean(
  ids: string[]
): Promise<void> {
  if (ids.length === 0) {
    return;
  }
  const db = getDatabase();
  await db.withTransactionAsync(async () => {
    for (const id of ids) {
      await db.runAsync(
        'UPDATE workout_log_sets SET dirty = 0 WHERE id = ?',
        id
      );
    }
  });
}

export async function softDeleteWorkoutLogSet(
  dayIndex: number,
  slotIndex: number,
  setIndex: number,
  deletedAt: string
): Promise<void> {
  const id = workoutLogSetId(dayIndex, slotIndex, setIndex);
  const result = await getDatabase().runAsync(
    `UPDATE workout_log_sets
     SET deleted_at = ?, updated_at = ?, dirty = 1
     WHERE id = ? AND deleted_at IS NULL`,
    deletedAt,
    deletedAt,
    id
  );
  // No row yet is fine (nothing to clear).
  void result;
}

export async function softDeleteWorkoutLogSlot(
  dayIndex: number,
  slotIndex: number,
  deletedAt: string
): Promise<void> {
  await getDatabase().runAsync(
    `UPDATE workout_log_sets
     SET deleted_at = ?, updated_at = ?, dirty = 1
     WHERE day_index = ? AND slot_index = ? AND deleted_at IS NULL`,
    deletedAt,
    deletedAt,
    dayIndex,
    slotIndex
  );
}

/** Soft-delete all active sets with day_index >= fromDayIndex. */
export async function softDeleteWorkoutLogsFromDay(
  fromDayIndex: number,
  deletedAt: string
): Promise<void> {
  await getDatabase().runAsync(
    `UPDATE workout_log_sets
     SET deleted_at = ?, updated_at = ?, dirty = 1
     WHERE day_index >= ? AND deleted_at IS NULL`,
    deletedAt,
    deletedAt,
    fromDayIndex
  );
}

/** Soft-delete every active set (end program). */
export async function softDeleteAllWorkoutLogSets(
  deletedAt: string
): Promise<void> {
  await getDatabase().runAsync(
    `UPDATE workout_log_sets
     SET deleted_at = ?, updated_at = ?, dirty = 1
     WHERE deleted_at IS NULL`,
    deletedAt,
    deletedAt
  );
}

/**
 * Move all sets from one day to another (same shape as legacy blob re-key).
 * Destination day is overwritten: existing destination rows are soft-deleted first.
 */
export async function moveWorkoutLogDay(
  fromDayIndex: number,
  toDayIndex: number,
  movedAt: string
): Promise<void> {
  if (fromDayIndex === toDayIndex) {
    return;
  }
  const db = getDatabase();
  const source = await db.getAllAsync<SqliteWlRow>(
    `SELECT id, day_index, slot_index, set_index, weight, reps, state, updated_at, deleted_at, dirty
     FROM workout_log_sets
     WHERE day_index = ? AND deleted_at IS NULL`,
    fromDayIndex
  );

  await db.withTransactionAsync(async () => {
    await softDeleteWorkoutLogsFromDayForExactDay(toDayIndex, movedAt);
    await softDeleteWorkoutLogsFromDayForExactDay(fromDayIndex, movedAt);

    for (const row of source) {
      await upsertLocalWorkoutLogSetRow({
        id: workoutLogSetId(toDayIndex, row.slot_index, row.set_index),
        day_index: toDayIndex,
        slot_index: row.slot_index,
        set_index: row.set_index,
        weight: row.weight,
        reps: row.reps,
        state:
          row.state === 'completed' || row.state === 'failed' || row.state === null
            ? row.state
            : null,
        updated_at: movedAt,
        deleted_at: null,
        dirty: 1,
      });
    }
  });
}

async function softDeleteWorkoutLogsFromDayForExactDay(
  dayIndex: number,
  deletedAt: string
): Promise<void> {
  await getDatabase().runAsync(
    `UPDATE workout_log_sets
     SET deleted_at = ?, updated_at = ?, dirty = 1
     WHERE day_index = ? AND deleted_at IS NULL`,
    deletedAt,
    deletedAt,
    dayIndex
  );
}

export async function applyRemoteWorkoutLogSetRow(
  remote: RemoteWorkoutLogSetRow
): Promise<void> {
  const db = getDatabase();
  const local = await db.getFirstAsync<{
    updated_at: string;
    dirty: number;
  }>('SELECT updated_at, dirty FROM workout_log_sets WHERE id = ?', remote.id);

  if (
    local &&
    (local.updated_at > remote.updated_at ||
      (local.updated_at === remote.updated_at && local.dirty === 1))
  ) {
    return;
  }

  const state: SetState =
    remote.state === 'completed' ||
    remote.state === 'failed' ||
    remote.state === null
      ? remote.state
      : null;

  await upsertLocalWorkoutLogSetRow({
    id: remote.id,
    day_index: remote.day_index,
    slot_index: remote.slot_index,
    set_index: remote.set_index,
    weight: remote.weight,
    reps: remote.reps,
    state,
    updated_at: remote.updated_at,
    deleted_at: remote.deleted_at,
    dirty: 0,
  });
}

export async function clearAllWorkoutLogSetRows(): Promise<void> {
  await getDatabase().runAsync('DELETE FROM workout_log_sets');
}

export async function countLocalWorkoutLogSetRows(): Promise<number> {
  const row = await getDatabase().getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM workout_log_sets'
  );
  return row?.count ?? 0;
}
