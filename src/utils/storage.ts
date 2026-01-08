// Storage utilities for AsyncStorage
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "user_progress";

export interface ExerciseProgress {
  weight: number;
  reps: number;
  date: string;
}

export interface UserProgress {
  [exerciseId: string]: ExerciseProgress;
}

/**
 * Get all user progress from storage
 * @returns User progress object
 */
export const getUserProgress = async (): Promise<UserProgress> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error("Error getting user progress:", error);
    return {};
  }
};

/**
 * Get progress for a specific exercise
 * @param exerciseId - Exercise ID
 * @returns Exercise progress or null
 */
export const getExerciseProgress = async (
  exerciseId: string
): Promise<ExerciseProgress | null> => {
  try {
    const progress = await getUserProgress();
    return progress[exerciseId] || null;
  } catch (error) {
    console.error("Error getting exercise progress:", error);
    return null;
  }
};

/**
 * Save a set for an exercise
 * @param exerciseId - Exercise ID
 * @param weight - Weight used
 * @param reps - Reps performed
 */
export const saveSet = async (
  exerciseId: string,
  weight: number,
  reps: number
): Promise<void> => {
  try {
    const progress = await getUserProgress();
    progress[exerciseId] = {
      weight,
      reps,
      date: new Date().toISOString(),
    };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error("Error saving set:", error);
    throw error;
  }
};

/**
 * Get the last logged weight for an exercise
 * @param exerciseId - Exercise ID
 * @returns Last weight or null
 */
export const getLastWeight = async (
  exerciseId: string
): Promise<number | null> => {
  try {
    const progress = await getExerciseProgress(exerciseId);
    return progress ? progress.weight : null;
  } catch (error) {
    console.error("Error getting last weight:", error);
    return null;
  }
};
