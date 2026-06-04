// Program workout logging: exercise swaps, swap budget, logged sets,
// custom set counts, and per-day notes.
import type {
  CustomSetCounts,
  ExerciseSwaps,
  LoggedSet,
  WorkoutLogs,
  WorkoutNotes,
} from '@/src/types/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { syncSetItem } from '@/src/sync/syncStorage';
import {
  CUSTOM_SET_COUNTS_KEY,
  EXERCISE_SWAPS_KEY,
  SWAP_COUNT_STATE_KEY,
  WORKOUT_LOGS_KEY,
  WORKOUT_NOTES_KEY,
} from './keys';
import { mutate, parseJsonMap, withKeyLock } from './internal';

/**
 * Save an exercise swap for a specific day and slot
 */
export const saveExerciseSwap = async (
  dayIndex: number,
  slotIndex: number,
  exerciseId: number
): Promise<void> => {
  try {
    await mutate<ExerciseSwaps>(EXERCISE_SWAPS_KEY, parseJsonMap, (swaps) => {
      if (!swaps[dayIndex]) {
        swaps[dayIndex] = {};
      }
      swaps[dayIndex][slotIndex] = exerciseId;
      return swaps;
    });
  } catch (error) {
    console.error('Error saving exercise swap:', error);
    throw error;
  }
};

/**
 * Get exercise swaps for a specific day
 */
export const getExerciseSwapsForDay = async (
  dayIndex: number
): Promise<{ [slotIndex: number]: number }> => {
  try {
    const data = await AsyncStorage.getItem(EXERCISE_SWAPS_KEY);
    const swaps: ExerciseSwaps = data ? JSON.parse(data) : {};
    return swaps[dayIndex] || {};
  } catch (error) {
    console.error('Error getting exercise swaps:', error);
    return {};
  }
};

/**
 * Clear/remove an exercise swap for a specific day and slot (resets to original exercise)
 */
export const clearExerciseSwap = async (
  dayIndex: number,
  slotIndex: number
): Promise<void> => {
  try {
    await mutate<ExerciseSwaps>(EXERCISE_SWAPS_KEY, parseJsonMap, (swaps) => {
      if (swaps[dayIndex]?.[slotIndex] !== undefined) {
        delete swaps[dayIndex][slotIndex];
        // Clean up empty day objects
        if (Object.keys(swaps[dayIndex]).length === 0) {
          delete swaps[dayIndex];
        }
      }
      // Note: Resetting to original exercise does NOT count against swap limit
      return swaps;
    });
  } catch (error) {
    console.error('Error clearing exercise swap:', error);
    throw error;
  }
};

type SwapCountState = { count: number; month: number };

/**
 * Read the persisted swap-count state, defaulting to the current month with a
 * zero count. Tolerates missing/legacy values without throwing.
 */
const readSwapCountState = (raw: string | null): SwapCountState => {
  const currentMonth = new Date().getMonth();
  if (!raw) {
    return { count: 0, month: currentMonth };
  }
  try {
    const parsed = JSON.parse(raw) as Partial<SwapCountState>;
    return {
      count: typeof parsed.count === 'number' ? parsed.count : 0,
      month: typeof parsed.month === 'number' ? parsed.month : currentMonth,
    };
  } catch {
    return { count: 0, month: currentMonth };
  }
};

/**
 * Get remaining swap count for free users (resets on the 1st of each month).
 * @returns Number of swaps remaining (0-10)
 */
export const getRemainingSwapCount = async (): Promise<number> => {
  try {
    const raw = await AsyncStorage.getItem(SWAP_COUNT_STATE_KEY);
    const state = readSwapCountState(raw);
    const currentMonth = new Date().getMonth();
    const count = state.month === currentMonth ? state.count : 0;
    return Math.max(0, 10 - count);
  } catch (error) {
    console.error('Error getting remaining swap count:', error);
    return 10;
  }
};

/**
 * Increment swap count (only call when user actually swaps, not on reset).
 * Count and month are persisted together in a single value so they can never
 * partially write.
 */
export const incrementSwapCount = async (): Promise<number> => {
  return withKeyLock(SWAP_COUNT_STATE_KEY, async () => {
    try {
      const raw = await AsyncStorage.getItem(SWAP_COUNT_STATE_KEY);
      const state = readSwapCountState(raw);
      const currentMonth = new Date().getMonth();
      const newCount = state.month !== currentMonth ? 1 : state.count + 1;
      await syncSetItem(
        SWAP_COUNT_STATE_KEY,
        JSON.stringify({ count: newCount, month: currentMonth })
      );
      return newCount;
    } catch (error) {
      console.error('Error incrementing swap count:', error);
      throw error;
    }
  });
};

/**
 * Save a logged set for a specific day, slot, and set index
 * @param state - Set state (completed, failed, null for unchecked, or undefined to preserve)
 */
export const saveLoggedSet = async (
  dayIndex: number,
  slotIndex: number,
  setIndex: number,
  weight: number | null,
  reps: number,
  state?: 'completed' | 'failed' | null
): Promise<void> => {
  try {
    await mutate<WorkoutLogs>(WORKOUT_LOGS_KEY, parseJsonMap, (logs) => {
      if (!logs[dayIndex]) {
        logs[dayIndex] = {};
      }
      if (!logs[dayIndex][slotIndex]) {
        logs[dayIndex][slotIndex] = {};
      }

      const setData: LoggedSet = { weight, reps };
      if (state !== undefined) {
        // Explicitly set the state (including null for unchecked)
        setData.state = state;
      } else {
        // If state is undefined, preserve the existing state (for auto-save)
        const existing = logs[dayIndex][slotIndex][setIndex];
        if (existing?.state !== undefined) {
          setData.state = existing.state;
        }
      }

      logs[dayIndex][slotIndex][setIndex] = setData;
      return logs;
    });
  } catch (error) {
    console.error('Error saving logged set:', error);
    throw error;
  }
};

/**
 * Get logged sets for a specific day and slot
 */
export const getLoggedSets = async (
  dayIndex: number,
  slotIndex: number
): Promise<{ [setIndex: number]: LoggedSet }> => {
  try {
    const data = await AsyncStorage.getItem(WORKOUT_LOGS_KEY);
    const logs: WorkoutLogs = data ? JSON.parse(data) : {};
    return logs[dayIndex]?.[slotIndex] || {};
  } catch (error) {
    console.error('Error getting logged sets:', error);
    return {};
  }
};

/**
 * Check if any sets are logged for a specific day and slot
 */
export const hasLoggedSets = async (
  dayIndex: number,
  slotIndex: number
): Promise<boolean> => {
  try {
    const loggedSets = await getLoggedSets(dayIndex, slotIndex);
    return Object.keys(loggedSets).length > 0;
  } catch (error) {
    console.error('Error checking logged sets:', error);
    return false;
  }
};

/**
 * Clear logged sets for a specific day and slot
 */
export const clearLoggedSetsForSlot = async (
  dayIndex: number,
  slotIndex: number
): Promise<void> => {
  try {
    await mutate<WorkoutLogs>(WORKOUT_LOGS_KEY, parseJsonMap, (logs) => {
      if (logs[dayIndex]?.[slotIndex]) {
        delete logs[dayIndex][slotIndex];
        // Clean up empty day/slot objects
        if (Object.keys(logs[dayIndex]).length === 0) {
          delete logs[dayIndex];
        }
      }
      return logs;
    });
  } catch (error) {
    console.error('Error clearing logged sets for slot:', error);
    throw error;
  }
};

/**
 * Save custom set count for a specific day and slot
 */
export const saveCustomSetCount = async (
  dayIndex: number,
  slotIndex: number,
  setCount: number
): Promise<void> => {
  try {
    await mutate<CustomSetCounts>(
      CUSTOM_SET_COUNTS_KEY,
      parseJsonMap,
      (counts) => {
        if (!counts[dayIndex]) {
          counts[dayIndex] = {};
        }
        counts[dayIndex][slotIndex] = setCount;
        return counts;
      }
    );
  } catch (error) {
    console.error('Error saving custom set count:', error);
    throw error;
  }
};

/**
 * Get custom set count for a specific day and slot
 * @returns Custom set count or null if not set
 */
export const getCustomSetCount = async (
  dayIndex: number,
  slotIndex: number
): Promise<number | null> => {
  try {
    const data = await AsyncStorage.getItem(CUSTOM_SET_COUNTS_KEY);
    const counts: CustomSetCounts = data ? JSON.parse(data) : {};
    return counts[dayIndex]?.[slotIndex] ?? null;
  } catch (error) {
    console.error('Error getting custom set count:', error);
    return null;
  }
};

/**
 * Clear a specific logged set
 */
export const clearLoggedSet = async (
  dayIndex: number,
  slotIndex: number,
  setIndex: number
): Promise<void> => {
  try {
    await mutate<WorkoutLogs>(WORKOUT_LOGS_KEY, parseJsonMap, (logs) => {
      if (logs[dayIndex]?.[slotIndex]?.[setIndex]) {
        delete logs[dayIndex][slotIndex][setIndex];

        // Clean up empty slot objects
        if (Object.keys(logs[dayIndex][slotIndex]).length === 0) {
          delete logs[dayIndex][slotIndex];
        }

        // Clean up empty day objects
        if (Object.keys(logs[dayIndex]).length === 0) {
          delete logs[dayIndex];
        }
      }
      return logs;
    });
  } catch (error) {
    console.error('Error clearing logged set:', error);
    throw error;
  }
};

/**
 * Save workout notes for a specific day
 */
export const saveWorkoutNotes = async (
  dayIndex: number,
  notes: string
): Promise<void> => {
  try {
    await mutate<WorkoutNotes>(WORKOUT_NOTES_KEY, parseJsonMap, (allNotes) => {
      if (notes.trim() === '') {
        // Remove empty notes
        delete allNotes[dayIndex];
      } else {
        allNotes[dayIndex] = notes;
      }
      return allNotes;
    });
  } catch (error) {
    console.error('Error saving workout notes:', error);
    throw error;
  }
};

/**
 * Get workout notes for a specific day
 */
export const getWorkoutNotes = async (dayIndex: number): Promise<string> => {
  try {
    const data = await AsyncStorage.getItem(WORKOUT_NOTES_KEY);
    const allNotes: WorkoutNotes = data ? JSON.parse(data) : {};
    return allNotes[dayIndex] || '';
  } catch (error) {
    console.error('Error getting workout notes:', error);
    return '';
  }
};

/**
 * All saved workout notes keyed by program day index.
 *
 * The stored shape is normalized to a `{ [dayIndex]: string }` map by the
 * storage migration runner (see `migrations.ts`), so this only needs to accept
 * the canonical string-map shape.
 */
export const getAllWorkoutNotes = async (): Promise<WorkoutNotes> => {
  try {
    const data = await AsyncStorage.getItem(WORKOUT_NOTES_KEY);
    if (!data) {
      return {};
    }
    const raw = JSON.parse(data) as unknown;
    if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
      return {};
    }

    const out: WorkoutNotes = {};
    for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
      const dayIndex = parseInt(key, 10);
      if (!Number.isNaN(dayIndex) && typeof value === 'string') {
        out[dayIndex] = value;
      }
    }
    return out;
  } catch (error) {
    console.error('Error getting all workout notes:', error);
    return {};
  }
};

/**
 * Get all workout logs for a specific day (all slots and sets)
 */
export const getWorkoutLogsForDay = async (
  dayIndex: number
): Promise<{ [slotIndex: number]: { [setIndex: number]: LoggedSet } }> => {
  try {
    const data = await AsyncStorage.getItem(WORKOUT_LOGS_KEY);
    const logs: WorkoutLogs = data ? JSON.parse(data) : {};
    return logs[dayIndex] ?? {};
  } catch (error) {
    console.error('Error getting workout logs for day:', error);
    return {};
  }
};
