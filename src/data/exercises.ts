// Exercise data - now backed by Supabase with local cache
import type { Exercise } from "../lib/supabase";
import { exerciseService } from "../services/exerciseService";

// Re-export Exercise type
export type { Exercise } from "../lib/supabase";

// In-memory cache for fast synchronous access
let exercisesCache: Exercise[] = [];

/**
 * Initialize exercises cache from AsyncStorage (which is synced from Supabase)
 * Call this on app startup
 * On first load (empty cache), waits for Supabase sync to complete
 * On subsequent loads, uses cache immediately and syncs in background
 */
export const initializeExercises = async (): Promise<void> => {
  try {
    // Check if we have cached data
    const cached = await exerciseService.getAllExercises();

    if (cached.length > 0) {
      // We have cached data, use it immediately and sync in background
      exercisesCache = cached;
      exerciseService.syncWithSupabase().catch((error) => {
        console.error("Error syncing exercises in background:", error);
      });
    } else {
      // No cache - this is first load, wait for sync to complete
      console.log("No cached exercises found, fetching from Supabase...");
      await exerciseService.syncWithSupabase();
      // Reload after sync
      exercisesCache = await exerciseService.getAllExercises();
    }
  } catch (error) {
    console.error("Error initializing exercises:", error);
    exercisesCache = [];
  }
};

/**
 * Get all exercises from cache (synchronous)
 */
export const getAllExercises = (): Exercise[] => {
  return exercisesCache;
};

/**
 * Get exercise by ID from cache (synchronous)
 */
export const getExerciseById = (id: number): Exercise | undefined => {
  return exercisesCache.find((ex) => ex.id === id);
};

/**
 * Get exercises by pattern from cache (synchronous)
 */
export const getExercisesByPattern = (pattern: string): Exercise[] => {
  return exercisesCache.filter((ex) => ex.pattern === pattern);
};

/**
 * Refresh exercises from service (async)
 * Useful for manual refresh
 */
export const refreshExercises = async (): Promise<void> => {
  await initializeExercises();
};
