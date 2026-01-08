// Storage utilities for AsyncStorage
import AsyncStorage from "@react-native-async-storage/async-storage";

const PROGRAM_STORAGE_KEY = "active_program";
const PROGRAM_START_DATE_KEY = "program_start_date";
const EXERCISE_SWAPS_KEY = "exercise_swaps";
const WORKOUT_LOGS_KEY = "workout_logs";

export interface ExerciseSwap {
  dayIndex: number;
  slotIndex: number;
  originalExerciseId: string;
  swappedExerciseId: string;
}

export interface ExerciseSwaps {
  [dayIndex: number]: {
    [slotIndex: number]: string; // swapped exercise ID
  };
}

export interface LoggedSet {
  weight: number;
  reps: number;
  state?: 'completed' | 'failed' | null;
}

export interface WorkoutLogs {
  [dayIndex: number]: {
    [slotIndex: number]: {
      [setIndex: number]: LoggedSet;
    };
  };
}

/**
 * Get the active program ID
 * @returns Program ID or null
 */
export const getActiveProgramId = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(PROGRAM_STORAGE_KEY);
  } catch (error) {
    console.error("Error getting active program:", error);
    return null;
  }
};

/**
 * Set the active program ID
 * @param programId - Program ID
 */
export const setActiveProgramId = async (programId: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(PROGRAM_STORAGE_KEY, programId);
  } catch (error) {
    console.error("Error setting active program:", error);
    throw error;
  }
};

/**
 * Get the program start date
 * @returns Start date ISO string or null
 */
export const getProgramStartDate = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(PROGRAM_START_DATE_KEY);
  } catch (error) {
    console.error("Error getting program start date:", error);
    return null;
  }
};

/**
 * Set the program start date
 * @param startDate - Start date ISO string
 */
export const setProgramStartDate = async (startDate: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(PROGRAM_START_DATE_KEY, startDate);
  } catch (error) {
    console.error("Error setting program start date:", error);
    throw error;
  }
};

/**
 * Save an exercise swap for a specific day and slot
 * @param dayIndex - Day index in the program
 * @param slotIndex - Slot index (0-based)
 * @param exerciseId - Swapped exercise ID
 */
export const saveExerciseSwap = async (
  dayIndex: number,
  slotIndex: number,
  exerciseId: string
): Promise<void> => {
  try {
    const data = await AsyncStorage.getItem(EXERCISE_SWAPS_KEY);
    const swaps: ExerciseSwaps = data ? JSON.parse(data) : {};

    if (!swaps[dayIndex]) {
      swaps[dayIndex] = {};
    }
    swaps[dayIndex][slotIndex] = exerciseId;

    await AsyncStorage.setItem(EXERCISE_SWAPS_KEY, JSON.stringify(swaps));
  } catch (error) {
    console.error("Error saving exercise swap:", error);
    throw error;
  }
};

/**
 * Get exercise swaps for a specific day
 * @param dayIndex - Day index in the program
 * @returns Object mapping slot indices to exercise IDs
 */
export const getExerciseSwapsForDay = async (
  dayIndex: number
): Promise<{ [slotIndex: number]: string }> => {
  try {
    const data = await AsyncStorage.getItem(EXERCISE_SWAPS_KEY);
    const swaps: ExerciseSwaps = data ? JSON.parse(data) : {};
    return swaps[dayIndex] || {};
  } catch (error) {
    console.error("Error getting exercise swaps:", error);
    return {};
  }
};

/**
 * Save a logged set for a specific day, slot, and set index
 * @param dayIndex - Day index in the program
 * @param slotIndex - Slot index (0-based)
 * @param setIndex - Set index (0-based)
 * @param weight - Weight used
 * @param reps - Reps performed
 * @param state - Set state (completed, failed, null for unchecked, or undefined to preserve)
 */
export const saveLoggedSet = async (
  dayIndex: number,
  slotIndex: number,
  setIndex: number,
  weight: number,
  reps: number,
  state?: 'completed' | 'failed' | null
): Promise<void> => {
  try {
    const data = await AsyncStorage.getItem(WORKOUT_LOGS_KEY);
    const logs: WorkoutLogs = data ? JSON.parse(data) : {};

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

    await AsyncStorage.setItem(WORKOUT_LOGS_KEY, JSON.stringify(logs));
  } catch (error) {
    console.error("Error saving logged set:", error);
    throw error;
  }
};

/**
 * Get logged sets for a specific day and slot
 * @param dayIndex - Day index in the program
 * @param slotIndex - Slot index (0-based)
 * @returns Object mapping set indices to logged sets
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
    console.error("Error getting logged sets:", error);
    return {};
  }
};

/**
 * Check if any sets are logged for a specific day and slot
 * @param dayIndex - Day index in the program
 * @param slotIndex - Slot index (0-based)
 * @returns True if any sets are logged
 */
export const hasLoggedSets = async (
  dayIndex: number,
  slotIndex: number
): Promise<boolean> => {
  try {
    const loggedSets = await getLoggedSets(dayIndex, slotIndex);
    return Object.keys(loggedSets).length > 0;
  } catch (error) {
    console.error("Error checking logged sets:", error);
    return false;
  }
};

/**
 * Clear workout logs and swaps from a specific day index onwards
 * @param fromDayIndex - Day index to start clearing from (inclusive)
 */
export const clearFutureWorkoutData = async (
  fromDayIndex: number
): Promise<void> => {
  try {
    // Clear workout logs
    const logsData = await AsyncStorage.getItem(WORKOUT_LOGS_KEY);
    if (logsData) {
      const logs: WorkoutLogs = JSON.parse(logsData);
      const filteredLogs: WorkoutLogs = {};
      Object.keys(logs).forEach((dayKey) => {
        const dayIdx = parseInt(dayKey, 10);
        if (dayIdx < fromDayIndex) {
          filteredLogs[dayIdx] = logs[dayIdx];
        }
      });
      await AsyncStorage.setItem(
        WORKOUT_LOGS_KEY,
        JSON.stringify(filteredLogs)
      );
    }

    // Clear exercise swaps
    const swapsData = await AsyncStorage.getItem(EXERCISE_SWAPS_KEY);
    if (swapsData) {
      const swaps: ExerciseSwaps = JSON.parse(swapsData);
      const filteredSwaps: ExerciseSwaps = {};
      Object.keys(swaps).forEach((dayKey) => {
        const dayIdx = parseInt(dayKey, 10);
        if (dayIdx < fromDayIndex) {
          filteredSwaps[dayIdx] = swaps[dayIdx];
        }
      });
      await AsyncStorage.setItem(
        EXERCISE_SWAPS_KEY,
        JSON.stringify(filteredSwaps)
      );
    }
  } catch (error) {
    console.error("Error clearing future workout data:", error);
    throw error;
  }
};

/**
 * Clear all program data (program ID, start date, swaps, workout logs)
 */
export const clearProgramData = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(PROGRAM_STORAGE_KEY);
    await AsyncStorage.removeItem(PROGRAM_START_DATE_KEY);
    await AsyncStorage.removeItem(EXERCISE_SWAPS_KEY);
    await AsyncStorage.removeItem(WORKOUT_LOGS_KEY);
  } catch (error) {
    console.error("Error clearing program data:", error);
    throw error;
  }
};
