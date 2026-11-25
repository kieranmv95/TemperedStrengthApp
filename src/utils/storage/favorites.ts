// Favorite workouts.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FAVORITE_WORKOUTS_KEY } from './keys';
import { mutate, parseJsonArray } from './internal';

/**
 * Get favorite workout IDs
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
 */
export const addFavoriteWorkout = async (workoutId: string): Promise<void> => {
  try {
    await mutate<string[]>(
      FAVORITE_WORKOUTS_KEY,
      parseJsonArray,
      (favorites) => {
        if (!favorites.includes(workoutId)) {
          favorites.push(workoutId);
        }
        return favorites;
      }
    );
  } catch (error) {
    console.error('Error adding favorite workout:', error);
    throw error;
  }
};

/**
 * Remove a workout from favorites
 */
export const removeFavoriteWorkout = async (
  workoutId: string
): Promise<void> => {
  try {
    await mutate<string[]>(FAVORITE_WORKOUTS_KEY, parseJsonArray, (favorites) =>
      favorites.filter((id) => id !== workoutId)
    );
  } catch (error) {
    console.error('Error removing favorite workout:', error);
    throw error;
  }
};

/**
 * Toggle a workout's favorite status
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
