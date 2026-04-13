// Storage utilities for AsyncStorage
import type { Program } from '@/src/types/program';
import type {
  StandaloneWorkoutLogEntry,
  StandaloneWorkoutLogsStore,
} from '@/src/types/standaloneWorkoutLogs';
import type {
  ActiveSession,
  CompletedSession,
  CompletedSessions,
  CustomSetCounts,
  ExerciseSwaps,
  LoggedSet,
  RestTimerState,
  WorkoutLogs,
  WorkoutNotes,
} from '@/src/types/storage';
import type {
  ExercisePersonalBestsLedger,
  PersonalBestsStore,
  RepMax,
} from '@/src/types/personalBests';
import {
  appendCascadeToLowerTiersOnly,
  currentMaxWeight,
  logPersonalBestIntoLedger,
  newPbEntryId,
} from '@/src/utils/personalBests';
import { increment } from '@/src/services/metricService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { syncRemoveItem, syncSetItem } from '@/src/sync/syncStorage';

export type ProgramWorkoutWeekdayKey = NonNullable<
  Program['daysSplit']
>[number];

export type {
  ActiveSession,
  CompletedSession,
  CompletedSessions,
  CustomSetCounts,
  ExerciseSwap,
  ExerciseSwaps,
  LoggedSet,
  RestTimerState,
  WorkoutLogs,
  WorkoutNotes,
} from '@/src/types/storage';
export type {
  StandaloneLogPayload,
  StandaloneWorkoutLogEntry,
  StandaloneWorkoutLogsStore,
} from '@/src/types/standaloneWorkoutLogs';
export type {
  ExercisePersonalBestsLedger,
  PersonalBestsStore,
  PersonalBestHistoryEntry,
  RepMax,
} from '@/src/types/personalBests';

const PROGRAM_STORAGE_KEY = 'active_program';
const PROGRAM_START_DATE_KEY = 'program_start_date';
const PROGRAM_WORKOUT_WEEKDAYS_KEY = 'program_workout_weekdays';
const EXERCISE_SWAPS_KEY = 'exercise_swaps';
const WORKOUT_LOGS_KEY = 'workout_logs';
const CUSTOM_SET_COUNTS_KEY = 'custom_set_counts';
const SWAP_COUNT_KEY = 'swap_count';
const SWAP_COUNT_MONTH_KEY = 'swap_count_month';
const WORKOUT_NOTES_KEY = 'workout_notes';
const FAVORITE_WORKOUTS_KEY = 'favorite_workouts';
const FAVORITE_ARTICLES_KEY = 'favorite_articles';
const REST_TIMER_KEY = 'rest_timer';
const ACTIVE_SESSION_KEY = 'active_session';
const COMPLETED_SESSIONS_KEY = 'completed_sessions';
const STANDALONE_WORKOUT_LOGS_KEY = 'standalone_workout_logs';
const PERSONAL_BESTS_KEY = 'personal_bests';
const CELEBRATION_EFFECTS_ENABLED_KEY = 'celebration_effects_enabled';

export const getCelebrationEffectsEnabled = async (): Promise<boolean> => {
  try {
    const raw = await AsyncStorage.getItem(CELEBRATION_EFFECTS_ENABLED_KEY);
    if (raw === null) return true; // default on
    return raw === 'true';
  } catch (error) {
    console.error('Error reading celebration effects setting:', error);
    return true;
  }
};

export const setCelebrationEffectsEnabled = async (
  enabled: boolean
): Promise<void> => {
  try {
    await syncSetItem(CELEBRATION_EFFECTS_ENABLED_KEY, enabled ? 'true' : 'false');
  } catch (error) {
    console.error('Error saving celebration effects setting:', error);
    throw error;
  }
};

/**
 * Get the active program ID
 * @returns Program ID or null
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
 * @param programId - Program ID
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
 * @returns Start date ISO string or null
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
 * @param startDate - Start date ISO string
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
    await syncSetItem(
      PROGRAM_WORKOUT_WEEKDAYS_KEY,
      JSON.stringify(weekdays)
    );
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

    await syncSetItem(EXERCISE_SWAPS_KEY, JSON.stringify(swaps));
  } catch (error) {
    console.error('Error saving exercise swap:', error);
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
    console.error('Error getting exercise swaps:', error);
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

      await syncSetItem(EXERCISE_SWAPS_KEY, JSON.stringify(swaps));
      // Note: Resetting to original exercise does NOT count against swap limit
    }
  } catch (error) {
    console.error('Error clearing exercise swap:', error);
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
    console.error('Error getting swap count data:', error);
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
    console.error('Error getting remaining swap count:', error);
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

    await syncSetItem(SWAP_COUNT_KEY, newCount.toString());
    await syncSetItem(SWAP_COUNT_MONTH_KEY, currentMonth.toString());

    return newCount;
  } catch (error) {
    console.error('Error incrementing swap count:', error);
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
  weight: number | null,
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

    await syncSetItem(WORKOUT_LOGS_KEY, JSON.stringify(logs));
  } catch (error) {
    console.error('Error saving logged set:', error);
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
    console.error('Error getting logged sets:', error);
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
    console.error('Error checking logged sets:', error);
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

      await syncSetItem(WORKOUT_LOGS_KEY, JSON.stringify(logs));
    }
  } catch (error) {
    console.error('Error clearing logged sets for slot:', error);
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

    await syncSetItem(CUSTOM_SET_COUNTS_KEY, JSON.stringify(counts));
  } catch (error) {
    console.error('Error saving custom set count:', error);
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
    console.error('Error getting custom set count:', error);
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

      await syncSetItem(WORKOUT_LOGS_KEY, JSON.stringify(logs));
    }
  } catch (error) {
    console.error('Error clearing logged set:', error);
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
      await syncSetItem(
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
      await syncSetItem(
        EXERCISE_SWAPS_KEY,
        JSON.stringify(filteredSwaps)
      );
    }
  } catch (error) {
    console.error('Error clearing future workout data:', error);
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

    if (notes.trim() === '') {
      // Remove empty notes
      delete allNotes[dayIndex];
    } else {
      allNotes[dayIndex] = notes;
    }

    await syncSetItem(WORKOUT_NOTES_KEY, JSON.stringify(allNotes));
  } catch (error) {
    console.error('Error saving workout notes:', error);
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
    return allNotes[dayIndex] || '';
  } catch (error) {
    console.error('Error getting workout notes:', error);
    return '';
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
      await syncRemoveItem(REST_TIMER_KEY);
      return;
    }

    await syncSetItem(REST_TIMER_KEY, JSON.stringify(timer));
  } catch (error) {
    console.error('Error saving rest timer:', error);
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
    console.error('Error getting rest timer:', error);
    return null;
  }
};

/**
 * Clear the active rest timer
 */
export const clearRestTimer = async (): Promise<void> => {
  try {
    await syncRemoveItem(REST_TIMER_KEY);
  } catch (error) {
    console.error('Error clearing rest timer:', error);
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
    await syncRemoveItem(EXERCISE_SWAPS_KEY);
    await syncRemoveItem(WORKOUT_LOGS_KEY);
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

/**
 * Get favorite workout IDs
 * @returns Array of workout IDs
 */
export const getFavoriteWorkouts = async (): Promise<string[]> => {
  try {
    const data = await AsyncStorage.getItem(FAVORITE_WORKOUTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting favorite workouts:', error);
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
      await syncSetItem(
        FAVORITE_WORKOUTS_KEY,
        JSON.stringify(favorites)
      );
    }
  } catch (error) {
    console.error('Error adding favorite workout:', error);
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
    await syncSetItem(FAVORITE_WORKOUTS_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error removing favorite workout:', error);
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
    console.error('Error toggling favorite workout:', error);
    throw error;
  }
};

/**
 * Get favorite article IDs
 * @returns Array of article IDs
 */
export const getFavoriteArticles = async (): Promise<string[]> => {
  try {
    const data = await AsyncStorage.getItem(FAVORITE_ARTICLES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting favorite articles:', error);
    return [];
  }
};

/**
 * Add an article to favorites
 * @param articleId - Article ID to add
 */
export const addFavoriteArticle = async (articleId: string): Promise<void> => {
  try {
    const favorites = await getFavoriteArticles();
    if (!favorites.includes(articleId)) {
      favorites.push(articleId);
      await syncSetItem(
        FAVORITE_ARTICLES_KEY,
        JSON.stringify(favorites)
      );
    }
  } catch (error) {
    console.error('Error adding favorite article:', error);
    throw error;
  }
};

/**
 * Remove an article from favorites
 * @param articleId - Article ID to remove
 */
export const removeFavoriteArticle = async (
  articleId: string
): Promise<void> => {
  try {
    const favorites = await getFavoriteArticles();
    const filtered = favorites.filter((id) => id !== articleId);
    await syncSetItem(FAVORITE_ARTICLES_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error removing favorite article:', error);
    throw error;
  }
};

/**
 * Toggle an article's favorite status
 * @param articleId - Article ID to toggle
 * @returns New favorite status (true if now favorited)
 */
export const toggleFavoriteArticle = async (
  articleId: string
): Promise<boolean> => {
  try {
    const favorites = await getFavoriteArticles();
    const isFavorite = favorites.includes(articleId);

    if (isFavorite) {
      await removeFavoriteArticle(articleId);
      return false;
    } else {
      await addFavoriteArticle(articleId);
      return true;
    }
  } catch (error) {
    console.error('Error toggling favorite article:', error);
    throw error;
  }
};

/**
 * Save the active session state (or clear if null)
 */
export const saveActiveSession = async (
  session: ActiveSession | null
): Promise<void> => {
  try {
    if (!session) {
      await syncRemoveItem(ACTIVE_SESSION_KEY);
      return;
    }
    await syncSetItem(ACTIVE_SESSION_KEY, JSON.stringify(session));
  } catch (error) {
    console.error('Error saving active session:', error);
    throw error;
  }
};

/**
 * Get the active session state
 */
export const getActiveSession = async (): Promise<ActiveSession | null> => {
  try {
    const data = await AsyncStorage.getItem(ACTIVE_SESSION_KEY);
    return data ? (JSON.parse(data) as ActiveSession) : null;
  } catch (error) {
    console.error('Error getting active session:', error);
    return null;
  }
};

/**
 * Clear the active session
 */
export const clearActiveSession = async (): Promise<void> => {
  try {
    await syncRemoveItem(ACTIVE_SESSION_KEY);
  } catch (error) {
    console.error('Error clearing active session:', error);
    throw error;
  }
};

/**
 * Save a completed session keyed by dayIndex
 */
export const saveCompletedSession = async (
  session: CompletedSession
): Promise<void> => {
  try {
    const data = await AsyncStorage.getItem(COMPLETED_SESSIONS_KEY);
    const sessions: CompletedSessions = data ? JSON.parse(data) : {};
    sessions[session.dayIndex] = session;
    await syncSetItem(
      COMPLETED_SESSIONS_KEY,
      JSON.stringify(sessions)
    );
  } catch (error) {
    console.error('Error saving completed session:', error);
    throw error;
  }
};

/**
 * Get a completed session for a specific day
 */
export const getCompletedSession = async (
  dayIndex: number
): Promise<CompletedSession | null> => {
  try {
    const data = await AsyncStorage.getItem(COMPLETED_SESSIONS_KEY);
    const sessions: CompletedSessions = data ? JSON.parse(data) : {};
    return sessions[dayIndex] ?? null;
  } catch (error) {
    console.error('Error getting completed session:', error);
    return null;
  }
};

/**
 * Clear a completed session for a specific day (used by redo workout flow)
 */
export const clearCompletedSession = async (
  dayIndex: number
): Promise<void> => {
  try {
    const data = await AsyncStorage.getItem(COMPLETED_SESSIONS_KEY);
    if (!data) return;

    const sessions: CompletedSessions = JSON.parse(data);
    if (sessions[dayIndex] !== undefined) {
      delete sessions[dayIndex];
      await syncSetItem(
        COMPLETED_SESSIONS_KEY,
        JSON.stringify(sessions)
      );
    }
  } catch (error) {
    console.error('Error clearing completed session:', error);
    throw error;
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

function sortStandaloneLogEntriesNewestFirst(
  entries: StandaloneWorkoutLogEntry[]
): StandaloneWorkoutLogEntry[] {
  return [...entries].sort(
    (a, b) => new Date(b.loggedAt).getTime() - new Date(a.loggedAt).getTime()
  );
}

export const readStandaloneWorkoutLogsStore =
  async (): Promise<StandaloneWorkoutLogsStore> => {
    try {
      const raw = await AsyncStorage.getItem(STANDALONE_WORKOUT_LOGS_KEY);
      if (!raw) {
        return {};
      }
      const parsed = JSON.parse(raw) as unknown;
      if (
        typeof parsed !== 'object' ||
        parsed === null ||
        Array.isArray(parsed)
      ) {
        return {};
      }
      return parsed as StandaloneWorkoutLogsStore;
    } catch (error) {
      console.error('Error reading standalone workout logs:', error);
      return {};
    }
  };

const writeStandaloneWorkoutLogsStore = async (
  store: StandaloneWorkoutLogsStore
): Promise<void> => {
  await syncSetItem(
    STANDALONE_WORKOUT_LOGS_KEY,
    JSON.stringify(store)
  );
};

export const getStandaloneWorkoutLogsForWorkout = async (
  workoutId: string
): Promise<StandaloneWorkoutLogEntry[]> => {
  const store = await readStandaloneWorkoutLogsStore();
  return sortStandaloneLogEntriesNewestFirst(store[workoutId] ?? []);
};

export const upsertStandaloneWorkoutLogEntry = async (
  entry: StandaloneWorkoutLogEntry
): Promise<void> => {
  const store = await readStandaloneWorkoutLogsStore();
  const prev = [...(store[entry.workoutId] ?? [])];
  const idx = prev.findIndex((e) => e.id === entry.id);
  if (idx >= 0) {
    prev[idx] = entry;
  } else {
    prev.push(entry);
  }
  store[entry.workoutId] = sortStandaloneLogEntriesNewestFirst(prev);
  await writeStandaloneWorkoutLogsStore(store);
};

export const deleteStandaloneWorkoutLogEntry = async (
  workoutId: string,
  logId: string
): Promise<void> => {
  const store = await readStandaloneWorkoutLogsStore();
  const list = store[workoutId];
  if (!list) {
    return;
  }
  const next = list.filter((e) => e.id !== logId);
  if (next.length === 0) {
    delete store[workoutId];
  } else {
    store[workoutId] = sortStandaloneLogEntriesNewestFirst(next);
  }
  await writeStandaloneWorkoutLogsStore(store);
};

async function readPersonalBestsStore(): Promise<PersonalBestsStore> {
  try {
    const raw = await AsyncStorage.getItem(PERSONAL_BESTS_KEY);
    if (!raw) {
      return {};
    }
    const parsed = JSON.parse(raw) as unknown;
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      return {};
    }
    return parsed as PersonalBestsStore;
  } catch (error) {
    console.error('Error reading personal bests:', error);
    return {};
  }
}

async function writePersonalBestsStore(
  store: PersonalBestsStore
): Promise<void> {
  await syncSetItem(PERSONAL_BESTS_KEY, JSON.stringify(store));
}

export const getPersonalBestsStore =
  async (): Promise<PersonalBestsStore> => {
    return readPersonalBestsStore();
  };

export const getPersonalBestsForExercise = async (
  exerciseId: number
): Promise<ExercisePersonalBestsLedger> => {
  const store = await readPersonalBestsStore();
  return store[exerciseId] ?? {};
};

export type SavePersonalBestResult = {
  isPR: boolean;
  tiersWithNewRows: RepMax[];
};

/**
 * Appends a lift to the chosen rep tier. Downward cascade runs only when it is a PR
 * for that tier. Increments `pbs_logged` when `isPR` is true.
 */
export const savePersonalBest = async (
  exerciseId: number,
  primaryTier: RepMax,
  weight: number,
  achievedAtIso?: string
): Promise<SavePersonalBestResult> => {
  const achievedAt = achievedAtIso ?? new Date().toISOString();
  const store = await readPersonalBestsStore();
  const current = store[exerciseId] ?? {};
  const { updated, isPR, tiersWithNewRows } = logPersonalBestIntoLedger(
    current,
    primaryTier,
    weight,
    achievedAt,
    newPbEntryId
  );

  if (tiersWithNewRows.length === 0) {
    return { isPR: false, tiersWithNewRows: [] };
  }

  const nextStore: PersonalBestsStore = { ...store, [exerciseId]: updated };
  await writePersonalBestsStore(nextStore);
  if (isPR) {
    await increment('pbs_logged');
  }
  return { isPR, tiersWithNewRows };
};

/**
 * Same as {@link savePersonalBest} (alias for tier history “add” flows).
 */
export const appendSingleTierPersonalBest = savePersonalBest;

export const updatePersonalBestEntry = async (
  exerciseId: number,
  tier: RepMax,
  entryId: string,
  patch: { weight?: number; achievedAt?: string }
): Promise<boolean> => {
  const store = await readPersonalBestsStore();
  const ledger = store[exerciseId];
  const rows = ledger?.[tier];
  if (!rows?.length) {
    return false;
  }
  const idx = rows.findIndex((r) => r.id === entryId);
  if (idx < 0) {
    return false;
  }
  if (
    patch.weight !== undefined &&
    (!Number.isFinite(patch.weight) || patch.weight <= 0)
  ) {
    throw new Error('Invalid weight');
  }

  const oldTierMax = currentMaxWeight(ledger, tier);
  const nextRows = [...rows];
  nextRows[idx] = { ...nextRows[idx], ...patch };
  let nextLedger: ExercisePersonalBestsLedger = {
    ...ledger,
    [tier]: nextRows,
  };

  const newTierMax = currentMaxWeight(nextLedger, tier);
  if (
    patch.weight !== undefined &&
    newTierMax !== undefined &&
    (oldTierMax === undefined || newTierMax > oldTierMax)
  ) {
    const merged = nextRows[idx];
    const { updated, appendedTiers } = appendCascadeToLowerTiersOnly(
      nextLedger,
      tier,
      newTierMax,
      merged.achievedAt,
      newPbEntryId
    );
    if (appendedTiers.length > 0) {
      nextLedger = updated;
    }
  }

  await writePersonalBestsStore({
    ...store,
    [exerciseId]: nextLedger,
  });
  return true;
};

export const deletePersonalBestEntry = async (
  exerciseId: number,
  tier: RepMax,
  entryId: string
): Promise<boolean> => {
  const store = await readPersonalBestsStore();
  const ledger = store[exerciseId];
  const rows = ledger?.[tier];
  if (!rows?.length) {
    return false;
  }
  const nextRows = rows.filter((r) => r.id !== entryId);
  if (nextRows.length === rows.length) {
    return false;
  }
  const nextLedger: ExercisePersonalBestsLedger = { ...ledger };
  if (nextRows.length === 0) {
    delete nextLedger[tier];
  } else {
    nextLedger[tier] = nextRows;
  }
  if (Object.keys(nextLedger).length === 0) {
    const nextStore = { ...store };
    delete nextStore[exerciseId];
    await writePersonalBestsStore(nextStore);
  } else {
    await writePersonalBestsStore({
      ...store,
      [exerciseId]: nextLedger,
    });
  }
  return true;
};
