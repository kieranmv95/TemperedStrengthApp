import type { LoggedSet, WorkoutLogs } from '@/src/types/storage';
import type { LocalWorkoutLogSetRow } from './types';
import { workoutLogSetId } from './types';

function parseOptionalSetState(
  value: unknown
): 'completed' | 'failed' | null | undefined {
  if (value === 'completed' || value === 'failed' || value === null) {
    return value;
  }
  return undefined;
}

export function parseWorkoutLogsStore(raw: string | null): WorkoutLogs {
  if (!raw) {
    return {};
  }
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      return {};
    }
    return parsed as WorkoutLogs;
  } catch {
    return {};
  }
}

/**
 * Flatten a WorkoutLogs blob into local set rows.
 * `updatedAt` is applied to every expanded row (cutover clock).
 */
export function expandWorkoutLogsBlobToRows(
  store: WorkoutLogs,
  updatedAt: string
): Omit<LocalWorkoutLogSetRow, 'dirty'>[] {
  const rows: Omit<LocalWorkoutLogSetRow, 'dirty'>[] = [];

  for (const [dayKey, slots] of Object.entries(store)) {
    const dayIndex = Number(dayKey);
    if (!Number.isFinite(dayIndex) || !slots || typeof slots !== 'object') {
      continue;
    }
    for (const [slotKey, sets] of Object.entries(slots)) {
      const slotIndex = Number(slotKey);
      if (!Number.isFinite(slotIndex) || !sets || typeof sets !== 'object') {
        continue;
      }
      for (const [setKey, logged] of Object.entries(sets)) {
        const setIndex = Number(setKey);
        if (!Number.isFinite(setIndex) || !logged || typeof logged !== 'object') {
          continue;
        }
        const entry = logged as LoggedSet;
        if (typeof entry.reps !== 'number' || !Number.isFinite(entry.reps)) {
          continue;
        }
        const weight =
          entry.weight === null || entry.weight === undefined
            ? null
            : Number.isFinite(entry.weight)
              ? entry.weight
              : null;
        const parsedState = parseOptionalSetState(entry.state);
        rows.push({
          id: workoutLogSetId(dayIndex, slotIndex, setIndex),
          day_index: dayIndex,
          slot_index: slotIndex,
          set_index: setIndex,
          weight,
          reps: entry.reps,
          // Store absent state as null column (legacy blobs often omit the field).
          state: parsedState === undefined ? null : parsedState,
          updated_at: updatedAt,
          deleted_at: null,
        });
      }
    }
  }

  return rows;
}

/**
 * Rebuild nested WorkoutLogs from active (non-deleted) rows.
 */
export function collapseRowsToWorkoutLogs(
  rows: {
    day_index: number;
    slot_index: number;
    set_index: number;
    weight: number | null;
    reps: number;
    state: string | null;
    deleted_at?: string | null;
  }[]
): WorkoutLogs {
  const store: WorkoutLogs = {};

  for (const row of rows) {
    if (row.deleted_at) {
      continue;
    }
    if (!store[row.day_index]) {
      store[row.day_index] = {};
    }
    if (!store[row.day_index][row.slot_index]) {
      store[row.day_index][row.slot_index] = {};
    }
    const set: LoggedSet = {
      weight: row.weight,
      reps: row.reps,
    };
    if (row.state === 'completed' || row.state === 'failed') {
      set.state = row.state;
    } else if (row.state === null) {
      // Keep null explicit when present (unchecked), same as LoggedSet.state=null.
      set.state = null;
    }
    store[row.day_index][row.slot_index][row.set_index] = set;
  }

  return store;
}
