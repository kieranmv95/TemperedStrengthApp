// Active program selection, schedule (start date, weekdays, session shifts),
// and program-wide data lifecycle (move day, clear future, clear all).
import type { Program } from '@/src/types/program';
import type {
  CompletedSessions,
  ConditioningWorkoutLogs,
  CustomSetCounts,
  ExerciseSwaps,
  WorkoutLogs,
  WorkoutNotes,
} from '@/src/types/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getRuntimeSyncManager } from '@/src/sync/runtime';
import { syncRemoveItem, syncSetItem } from '@/src/sync/syncStorage';
import {
  ACTIVE_SESSION_KEY,
  COMPLETED_SESSIONS_KEY,
  CONDITIONING_WORKOUT_LOGS_KEY,
  CUSTOM_SET_COUNTS_KEY,
  EXERCISE_SWAPS_KEY,
  PROGRAM_SESSION_SHIFTS_KEY,
  PROGRAM_START_DATE_KEY,
  PROGRAM_STORAGE_KEY,
  PROGRAM_WORKOUT_WEEKDAYS_KEY,
  REST_TIMER_KEY,
  WORKOUT_LOGS_KEY,
  WORKOUT_NOTES_KEY,
} from './keys';
import { mutate, parseJsonMap } from './internal';
import { getActiveSession, getCompletedSession } from './sessions';
import {
  getExerciseSwapsForDay,
  getWorkoutLogsForDay,
  getWorkoutNotes,
} from './workoutLogs';
import { getConditioningLogsForDay } from './conditioning';

export type ProgramWorkoutWeekdayKey = NonNullable<
  Program['daysSplit']
>[number];

export type ProgramSessionShift = {
  weekIndex: number;
  fromDayIndex: number;
  toDayIndex: number;
  movedAt: number;
};

export type ProgramSessionShiftsStore = {
  [weekIndex: number]: ProgramSessionShift[];
};

/**
 * Get the active program ID
 */
export const getActiveProgramId = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(PROGRAM_STORAGE_KEY);
  } catch (error) {
    console.error('Error getting active program:', error);
    return null;
  }
};

/**
 * Set the active program ID
 */
export const setActiveProgramId = async (programId: string): Promise<void> => {
  try {
    await syncSetItem(PROGRAM_STORAGE_KEY, programId);
  } catch (error) {
    console.error('Error setting active program:', error);
    throw error;
  }
};

/**
 * Get the program start date
 */
export const getProgramStartDate = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(PROGRAM_START_DATE_KEY);
  } catch (error) {
    console.error('Error getting program start date:', error);
    return null;
  }
};

/**
 * Set the program start date
 */
export const setProgramStartDate = async (startDate: string): Promise<void> => {
  try {
    await syncSetItem(PROGRAM_START_DATE_KEY, startDate);
  } catch (error) {
    console.error('Error setting program start date:', error);
    throw error;
  }
};

/**
 * Get stored workout weekday pattern (rolling-week training days), or null if unset (legacy).
 */
export const getProgramWorkoutWeekdays = async (): Promise<
  ProgramWorkoutWeekdayKey[] | null
> => {
  try {
    const raw = await AsyncStorage.getItem(PROGRAM_WORKOUT_WEEKDAYS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed) || parsed.length === 0) return null;
    return parsed as ProgramWorkoutWeekdayKey[];
  } catch (error) {
    console.error('Error getting program workout weekdays:', error);
    return null;
  }
};

/**
 * Persist workout weekday pattern alongside program start.
 */
export const setProgramWorkoutWeekdays = async (
  weekdays: ProgramWorkoutWeekdayKey[]
): Promise<void> => {
  try {
    await syncSetItem(PROGRAM_WORKOUT_WEEKDAYS_KEY, JSON.stringify(weekdays));
  } catch (error) {
    console.error('Error setting program workout weekdays:', error);
    throw error;
  }
};

export const clearProgramWorkoutWeekdays = async (): Promise<void> => {
  try {
    await syncRemoveItem(PROGRAM_WORKOUT_WEEKDAYS_KEY);
  } catch (error) {
    console.error('Error clearing program workout weekdays:', error);
    throw error;
  }
};

const parseShiftsStore = (raw: string | null): ProgramSessionShiftsStore => {
  if (!raw) {
    return {};
  }
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      Array.isArray(parsed)
    ) {
      return {};
    }
    return parsed as ProgramSessionShiftsStore;
  } catch {
    return {};
  }
};

export const getProgramSessionShiftsStore =
  async (): Promise<ProgramSessionShiftsStore> => {
    try {
      const raw = await AsyncStorage.getItem(PROGRAM_SESSION_SHIFTS_KEY);
      return parseShiftsStore(raw);
    } catch (error) {
      console.error('Error getting program session shifts:', error);
      return {};
    }
  };

export const setProgramSessionShiftsStore = async (
  store: ProgramSessionShiftsStore
): Promise<void> => {
  try {
    await syncSetItem(PROGRAM_SESSION_SHIFTS_KEY, JSON.stringify(store));
  } catch (error) {
    console.error('Error setting program session shifts:', error);
    throw error;
  }
};

export const appendProgramSessionShift = async (
  shift: ProgramSessionShift
): Promise<void> => {
  await mutate<ProgramSessionShiftsStore>(
    PROGRAM_SESSION_SHIFTS_KEY,
    parseShiftsStore,
    (store) => {
      const weekKey = shift.weekIndex;
      const prev = store[weekKey] ?? [];
      store[weekKey] = [...prev, shift];
      return store;
    }
  );
};

export const clearProgramSessionShifts = async (): Promise<void> => {
  try {
    await syncRemoveItem(PROGRAM_SESSION_SHIFTS_KEY);
  } catch (error) {
    console.error('Error clearing program session shifts:', error);
    throw error;
  }
};

type MoveProgramDayDataResult = { moved: boolean };

/**
 * Confirms the destination day holds no data, to protect the user from an
 * accidental overwrite during a move.
 */
const ensureNoDestinationData = async (toDayIndex: number): Promise<void> => {
  const [
    completedDest,
    logsDest,
    swapsDest,
    notesDest,
    conditioningDest,
    rawCustomCounts,
  ] = await Promise.all([
    getCompletedSession(toDayIndex),
    getWorkoutLogsForDay(toDayIndex),
    getExerciseSwapsForDay(toDayIndex),
    getWorkoutNotes(toDayIndex),
    getConditioningLogsForDay(toDayIndex),
    AsyncStorage.getItem(CUSTOM_SET_COUNTS_KEY),
  ]);

  const customCounts: CustomSetCounts = rawCustomCounts
    ? (JSON.parse(rawCustomCounts) as CustomSetCounts)
    : {};
  const hasCustomCountsDest = customCounts[toDayIndex] !== undefined;

  const hasAny =
    completedDest !== null ||
    Object.keys(logsDest).length > 0 ||
    Object.keys(swapsDest).length > 0 ||
    notesDest.trim() !== '' ||
    Object.keys(conditioningDest).length > 0 ||
    hasCustomCountsDest;

  if (hasAny) {
    throw new Error('Destination day already has data');
  }
};

/**
 * Moves all program day-index keyed data from `fromDayIndex` to `toDayIndex`.
 * Throws if destination already has data (to protect user data).
 *
 * All sources are read and the next values computed up-front, then written in a
 * single `AsyncStorage.multiSet` so the local store cannot end up half-moved.
 * Each changed key is mirrored to the sync provider afterwards.
 */
export const moveProgramDayData = async (
  fromDayIndex: number,
  toDayIndex: number
): Promise<MoveProgramDayDataResult> => {
  if (!Number.isFinite(fromDayIndex) || !Number.isFinite(toDayIndex)) {
    throw new Error('Invalid dayIndex');
  }
  if (fromDayIndex === toDayIndex) {
    return { moved: false };
  }

  await ensureNoDestinationData(toDayIndex);

  const entries: [string, string][] = [];

  // active session
  const active = await getActiveSession();
  if (active?.dayIndex === fromDayIndex) {
    entries.push([
      ACTIVE_SESSION_KEY,
      JSON.stringify({ ...active, dayIndex: toDayIndex }),
    ]);
  }

  // completed sessions
  {
    const data = await AsyncStorage.getItem(COMPLETED_SESSIONS_KEY);
    if (data) {
      const sessions: CompletedSessions = JSON.parse(data);
      const src = sessions[fromDayIndex];
      if (src) {
        sessions[toDayIndex] = { ...src, dayIndex: toDayIndex };
        delete sessions[fromDayIndex];
        entries.push([COMPLETED_SESSIONS_KEY, JSON.stringify(sessions)]);
      }
    }
  }

  // workout logs
  {
    const data = await AsyncStorage.getItem(WORKOUT_LOGS_KEY);
    if (data) {
      const logs: WorkoutLogs = JSON.parse(data);
      const src = logs[fromDayIndex];
      if (src) {
        logs[toDayIndex] = src;
        delete logs[fromDayIndex];
        entries.push([WORKOUT_LOGS_KEY, JSON.stringify(logs)]);
      }
    }
  }

  // exercise swaps
  {
    const data = await AsyncStorage.getItem(EXERCISE_SWAPS_KEY);
    if (data) {
      const swaps: ExerciseSwaps = JSON.parse(data);
      const src = swaps[fromDayIndex];
      if (src) {
        swaps[toDayIndex] = src;
        delete swaps[fromDayIndex];
        entries.push([EXERCISE_SWAPS_KEY, JSON.stringify(swaps)]);
      }
    }
  }

  // custom set counts
  {
    const data = await AsyncStorage.getItem(CUSTOM_SET_COUNTS_KEY);
    if (data) {
      const counts: CustomSetCounts = JSON.parse(data);
      const src = counts[fromDayIndex];
      if (src) {
        counts[toDayIndex] = src;
        delete counts[fromDayIndex];
        entries.push([CUSTOM_SET_COUNTS_KEY, JSON.stringify(counts)]);
      }
    }
  }

  // workout notes
  {
    const data = await AsyncStorage.getItem(WORKOUT_NOTES_KEY);
    if (data) {
      const notes: WorkoutNotes = JSON.parse(data);
      const src = notes[fromDayIndex];
      if (typeof src === 'string') {
        notes[toDayIndex] = src;
        delete notes[fromDayIndex];
        entries.push([WORKOUT_NOTES_KEY, JSON.stringify(notes)]);
      }
    }
  }

  // conditioning logs
  {
    const data = await AsyncStorage.getItem(CONDITIONING_WORKOUT_LOGS_KEY);
    if (data) {
      const logs: ConditioningWorkoutLogs = JSON.parse(data);
      const src = logs[fromDayIndex];
      if (src) {
        logs[toDayIndex] = src;
        delete logs[fromDayIndex];
        entries.push([CONDITIONING_WORKOUT_LOGS_KEY, JSON.stringify(logs)]);
      }
    }
  }

  if (entries.length === 0) {
    return { moved: true };
  }

  await AsyncStorage.multiSet(entries);

  const manager = getRuntimeSyncManager();
  if (manager) {
    for (const [key, value] of entries) {
      try {
        await manager.mirrorSet(key, value);
      } catch (error) {
        console.error(
          'Failed to mirror moved program day to sync provider:',
          error
        );
      }
    }
  }

  return { moved: true };
};

/**
 * Clear workout logs and swaps from a specific day index onwards
 */
export const clearFutureWorkoutData = async (
  fromDayIndex: number
): Promise<void> => {
  try {
    await mutate<WorkoutLogs>(WORKOUT_LOGS_KEY, parseJsonMap, (logs) => {
      const filteredLogs: WorkoutLogs = {};
      Object.keys(logs).forEach((dayKey) => {
        const dayIdx = parseInt(dayKey, 10);
        if (dayIdx < fromDayIndex) {
          filteredLogs[dayIdx] = logs[dayIdx];
        }
      });
      return filteredLogs;
    });

    await mutate<ExerciseSwaps>(EXERCISE_SWAPS_KEY, parseJsonMap, (swaps) => {
      const filteredSwaps: ExerciseSwaps = {};
      Object.keys(swaps).forEach((dayKey) => {
        const dayIdx = parseInt(dayKey, 10);
        if (dayIdx < fromDayIndex) {
          filteredSwaps[dayIdx] = swaps[dayIdx];
        }
      });
      return filteredSwaps;
    });
  } catch (error) {
    console.error('Error clearing future workout data:', error);
    throw error;
  }
};

/**
 * Clear all program data (program ID, start date, swaps, workout logs, notes)
 */
export const clearProgramData = async (): Promise<void> => {
  try {
    await syncRemoveItem(PROGRAM_STORAGE_KEY);
    await syncRemoveItem(PROGRAM_START_DATE_KEY);
    await syncRemoveItem(PROGRAM_WORKOUT_WEEKDAYS_KEY);
    await syncRemoveItem(PROGRAM_SESSION_SHIFTS_KEY);
    await syncRemoveItem(EXERCISE_SWAPS_KEY);
    await syncRemoveItem(WORKOUT_LOGS_KEY);
    await syncRemoveItem(CONDITIONING_WORKOUT_LOGS_KEY);
    await syncRemoveItem(CUSTOM_SET_COUNTS_KEY);
    await syncRemoveItem(WORKOUT_NOTES_KEY);
    await syncRemoveItem(REST_TIMER_KEY);
    await syncRemoveItem(ACTIVE_SESSION_KEY);
    await syncRemoveItem(COMPLETED_SESSIONS_KEY);
  } catch (error) {
    console.error('Error clearing program data:', error);
    throw error;
  }
};
