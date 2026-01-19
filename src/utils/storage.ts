// Storage utilities for AsyncStorage
import AsyncStorage from "@react-native-async-storage/async-storage";

const PROGRAM_STORAGE_KEY = "active_program";
const PROGRAM_START_DATE_KEY = "program_start_date";
const EXERCISE_SWAPS_KEY = "exercise_swaps";
const WORKOUT_LOGS_KEY = "workout_logs";
const CUSTOM_SET_COUNTS_KEY = "custom_set_counts";
const SWAP_COUNT_KEY = "swap_count";
const SWAP_COUNT_MONTH_KEY = "swap_count_month";
const WORKOUT_NOTES_KEY = "workout_notes";
const FAVORITE_WORKOUTS_KEY = "favorite_workouts";
const REST_TIMER_KEY = "rest_timer";

export interface ExerciseSwap {
  dayIndex: number;
  slotIndex: number;
  originalExerciseId: number;
  swappedExerciseId: number;
}

export interface ExerciseSwaps {
  [dayIndex: number]: {
    [slotIndex: number]: number; // swapped exercise ID
  };
}

export interface LoggedSet {
  weight: number;
  reps: number;
  state?: "completed" | "failed" | null;
}

export interface WorkoutLogs {
  [dayIndex: number]: {
    [slotIndex: number]: {
      [setIndex: number]: LoggedSet;
    };
  };
}

export interface CustomSetCounts {
  [dayIndex: number]: {
    [slotIndex: number]: number; // custom set count
  };
}

export interface WorkoutNotes {
  [dayIndex: number]: string; // notes for each workout day
}

export interface RestTimerState {
  dayIndex: number;
  slotIndex: number;
  exerciseId: number | null;
  restTimeSeconds: number;
  startedAt: number;
  status: "running" | "completed";
  completedAt?: number;
  notificationId?: string | null;
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
  exerciseId: number
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
): Promise<{ [slotIndex: number]: number }> => {
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
 * Clear/remove an exercise swap for a specific day and slot (resets to original exercise)
 * @param dayIndex - Day index in the program
 * @param slotIndex - Slot index (0-based)
 */
export const clearExerciseSwap = async (
  dayIndex: number,
  slotIndex: number
): Promise<void> => {
  try {
    const data = await AsyncStorage.getItem(EXERCISE_SWAPS_KEY);
    if (!data) return;

    const swaps: ExerciseSwaps = JSON.parse(data);
    if (swaps[dayIndex]?.[slotIndex] !== undefined) {
      delete swaps[dayIndex][slotIndex];

      // Clean up empty day objects
      if (Object.keys(swaps[dayIndex]).length === 0) {
        delete swaps[dayIndex];
      }

      await AsyncStorage.setItem(EXERCISE_SWAPS_KEY, JSON.stringify(swaps));
      // Note: Resetting to original exercise does NOT count against swap limit
    }
  } catch (error) {
    console.error("Error clearing exercise swap:", error);
    throw error;
  }
};

/**
 * Get current swap count (resets on 1st of each month)
 * @returns Object with count and month
 */
const getSwapCountData = async (): Promise<{
  count: number;
  month: number;
}> => {
  try {
    const countData = await AsyncStorage.getItem(SWAP_COUNT_KEY);
    const monthData = await AsyncStorage.getItem(SWAP_COUNT_MONTH_KEY);

    const currentMonth = new Date().getMonth(); // 0-11
    const storedMonth = monthData ? parseInt(monthData, 10) : null;

    // Reset if month changed (new month, reset on 1st)
    if (storedMonth === null || storedMonth !== currentMonth) {
      return { count: 0, month: currentMonth };
    }

    return {
      count: countData ? parseInt(countData, 10) : 0,
      month: currentMonth,
    };
  } catch (error) {
    console.error("Error getting swap count data:", error);
    return { count: 0, month: new Date().getMonth() };
  }
};

/**
 * Get remaining swap count for free users
 * @returns Number of swaps remaining (0-10)
 */
export const getRemainingSwapCount = async (): Promise<number> => {
  try {
    const { count } = await getSwapCountData();
    return Math.max(0, 10 - count);
  } catch (error) {
    console.error("Error getting remaining swap count:", error);
    return 10;
  }
};

/**
 * Increment swap count (only call when user actually swaps, not on reset)
 */
export const incrementSwapCount = async (): Promise<number> => {
  try {
    const { count, month } = await getSwapCountData();
    const currentMonth = new Date().getMonth();

    // If month changed, reset to 1, otherwise increment
    const newCount = month !== currentMonth ? 1 : count + 1;

    await AsyncStorage.setItem(SWAP_COUNT_KEY, newCount.toString());
    await AsyncStorage.setItem(SWAP_COUNT_MONTH_KEY, currentMonth.toString());

    return newCount;
  } catch (error) {
    console.error("Error incrementing swap count:", error);
    throw error;
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
  state?: "completed" | "failed" | null
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
 * Clear logged sets for a specific day and slot
 * @param dayIndex - Day index in the program
 * @param slotIndex - Slot index (0-based)
 */
export const clearLoggedSetsForSlot = async (
  dayIndex: number,
  slotIndex: number
): Promise<void> => {
  try {
    const data = await AsyncStorage.getItem(WORKOUT_LOGS_KEY);
    if (!data) return;

    const logs: WorkoutLogs = JSON.parse(data);
    if (logs[dayIndex]?.[slotIndex]) {
      delete logs[dayIndex][slotIndex];

      // Clean up empty day/slot objects
      if (Object.keys(logs[dayIndex]).length === 0) {
        delete logs[dayIndex];
      }

      await AsyncStorage.setItem(WORKOUT_LOGS_KEY, JSON.stringify(logs));
    }
  } catch (error) {
    console.error("Error clearing logged sets for slot:", error);
    throw error;
  }
};

/**
 * Save custom set count for a specific day and slot
 * @param dayIndex - Day index in the program
 * @param slotIndex - Slot index (0-based)
 * @param setCount - Custom set count
 */
export const saveCustomSetCount = async (
  dayIndex: number,
  slotIndex: number,
  setCount: number
): Promise<void> => {
  try {
    const data = await AsyncStorage.getItem(CUSTOM_SET_COUNTS_KEY);
    const counts: CustomSetCounts = data ? JSON.parse(data) : {};

    if (!counts[dayIndex]) {
      counts[dayIndex] = {};
    }
    counts[dayIndex][slotIndex] = setCount;

    await AsyncStorage.setItem(CUSTOM_SET_COUNTS_KEY, JSON.stringify(counts));
  } catch (error) {
    console.error("Error saving custom set count:", error);
    throw error;
  }
};

/**
 * Get custom set count for a specific day and slot
 * @param dayIndex - Day index in the program
 * @param slotIndex - Slot index (0-based)
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
    console.error("Error getting custom set count:", error);
    return null;
  }
};

/**
 * Clear a specific logged set
 * @param dayIndex - Day index in the program
 * @param slotIndex - Slot index (0-based)
 * @param setIndex - Set index (0-based)
 */
export const clearLoggedSet = async (
  dayIndex: number,
  slotIndex: number,
  setIndex: number
): Promise<void> => {
  try {
    const data = await AsyncStorage.getItem(WORKOUT_LOGS_KEY);
    const logs: WorkoutLogs = data ? JSON.parse(data) : {};

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

      await AsyncStorage.setItem(WORKOUT_LOGS_KEY, JSON.stringify(logs));
    }
  } catch (error) {
    console.error("Error clearing logged set:", error);
    throw error;
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
 * Save workout notes for a specific day
 * @param dayIndex - Day index in the program
 * @param notes - Notes text
 */
export const saveWorkoutNotes = async (
  dayIndex: number,
  notes: string
): Promise<void> => {
  try {
    const data = await AsyncStorage.getItem(WORKOUT_NOTES_KEY);
    const allNotes: WorkoutNotes = data ? JSON.parse(data) : {};

    if (notes.trim() === "") {
      // Remove empty notes
      delete allNotes[dayIndex];
    } else {
      allNotes[dayIndex] = notes;
    }

    await AsyncStorage.setItem(WORKOUT_NOTES_KEY, JSON.stringify(allNotes));
  } catch (error) {
    console.error("Error saving workout notes:", error);
    throw error;
  }
};

/**
 * Get workout notes for a specific day
 * @param dayIndex - Day index in the program
 * @returns Notes text or empty string
 */
export const getWorkoutNotes = async (dayIndex: number): Promise<string> => {
  try {
    const data = await AsyncStorage.getItem(WORKOUT_NOTES_KEY);
    const allNotes: WorkoutNotes = data ? JSON.parse(data) : {};
    return allNotes[dayIndex] || "";
  } catch (error) {
    console.error("Error getting workout notes:", error);
    return "";
  }
};

/**
 * Save the active rest timer state (or clear if null)
 * @param timer - Rest timer state or null to clear
 */
export const saveRestTimer = async (
  timer: RestTimerState | null
): Promise<void> => {
  try {
    if (!timer) {
      await AsyncStorage.removeItem(REST_TIMER_KEY);
      return;
    }

    await AsyncStorage.setItem(REST_TIMER_KEY, JSON.stringify(timer));
  } catch (error) {
    console.error("Error saving rest timer:", error);
    throw error;
  }
};

/**
 * Get the active rest timer state
 * @returns Rest timer state or null
 */
export const getRestTimer = async (): Promise<RestTimerState | null> => {
  try {
    const data = await AsyncStorage.getItem(REST_TIMER_KEY);
    return data ? (JSON.parse(data) as RestTimerState) : null;
  } catch (error) {
    console.error("Error getting rest timer:", error);
    return null;
  }
};

/**
 * Clear the active rest timer
 */
export const clearRestTimer = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(REST_TIMER_KEY);
  } catch (error) {
    console.error("Error clearing rest timer:", error);
    throw error;
  }
};

/**
 * Clear all program data (program ID, start date, swaps, workout logs, notes)
 */
export const clearProgramData = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(PROGRAM_STORAGE_KEY);
    await AsyncStorage.removeItem(PROGRAM_START_DATE_KEY);
    await AsyncStorage.removeItem(EXERCISE_SWAPS_KEY);
    await AsyncStorage.removeItem(WORKOUT_LOGS_KEY);
    await AsyncStorage.removeItem(CUSTOM_SET_COUNTS_KEY);
    await AsyncStorage.removeItem(WORKOUT_NOTES_KEY);
    await AsyncStorage.removeItem(REST_TIMER_KEY);
  } catch (error) {
    console.error("Error clearing program data:", error);
    throw error;
  }
};

/**
 * Get favorite workout IDs
 * @returns Array of workout IDs
 */
export const getFavoriteWorkouts = async (): Promise<string[]> => {
  try {
    const data = await AsyncStorage.getItem(FAVORITE_WORKOUTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error getting favorite workouts:", error);
    return [];
  }
};

/**
 * Add a workout to favorites
 * @param workoutId - Workout ID to add
 */
export const addFavoriteWorkout = async (workoutId: string): Promise<void> => {
  try {
    const favorites = await getFavoriteWorkouts();
    if (!favorites.includes(workoutId)) {
      favorites.push(workoutId);
      await AsyncStorage.setItem(
        FAVORITE_WORKOUTS_KEY,
        JSON.stringify(favorites)
      );
    }
  } catch (error) {
    console.error("Error adding favorite workout:", error);
    throw error;
  }
};

/**
 * Remove a workout from favorites
 * @param workoutId - Workout ID to remove
 */
export const removeFavoriteWorkout = async (
  workoutId: string
): Promise<void> => {
  try {
    const favorites = await getFavoriteWorkouts();
    const filtered = favorites.filter((id) => id !== workoutId);
    await AsyncStorage.setItem(FAVORITE_WORKOUTS_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Error removing favorite workout:", error);
    throw error;
  }
};

/**
 * Toggle a workout's favorite status
 * @param workoutId - Workout ID to toggle
 * @returns New favorite status (true if now favorited)
 */
export const toggleFavoriteWorkout = async (
  workoutId: string
): Promise<boolean> => {
  try {
    const favorites = await getFavoriteWorkouts();
    const isFavorite = favorites.includes(workoutId);

    if (isFavorite) {
      await removeFavoriteWorkout(workoutId);
      return false;
    } else {
      await addFavoriteWorkout(workoutId);
      return true;
    }
  } catch (error) {
    console.error("Error toggling favorite workout:", error);
    throw error;
  }
};
