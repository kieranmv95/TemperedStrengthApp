// Favorite workouts and articles.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { syncSetItem } from '@/src/sync/syncStorage';
import { FAVORITE_ARTICLES_KEY, FAVORITE_WORKOUTS_KEY } from './keys';
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

/**
 * Get favorite article IDs
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
 * Replace the full list of favorite article IDs.
 *
 * Prefer this over {@link addFavoriteArticle}/{@link removeFavoriteArticle}
 * when the caller already knows the authoritative next list (e.g. when the
 * UI owns the state). It avoids the read-modify-write race that happens
 * when two toggles run concurrently.
 */
export const setFavoriteArticles = async (
  articleIds: string[]
): Promise<void> => {
  try {
    await syncSetItem(FAVORITE_ARTICLES_KEY, JSON.stringify(articleIds));
  } catch (error) {
    console.error('Error setting favorite articles:', error);
    throw error;
  }
};

/**
 * Add an article to favorites
 */
export const addFavoriteArticle = async (articleId: string): Promise<void> => {
  try {
    await mutate<string[]>(
      FAVORITE_ARTICLES_KEY,
      parseJsonArray,
      (favorites) => {
        if (!favorites.includes(articleId)) {
          favorites.push(articleId);
        }
        return favorites;
      }
    );
  } catch (error) {
    console.error('Error adding favorite article:', error);
    throw error;
  }
};

/**
 * Remove an article from favorites
 */
export const removeFavoriteArticle = async (
  articleId: string
): Promise<void> => {
  try {
    await mutate<string[]>(FAVORITE_ARTICLES_KEY, parseJsonArray, (favorites) =>
      favorites.filter((id) => id !== articleId)
    );
  } catch (error) {
    console.error('Error removing favorite article:', error);
    throw error;
  }
};

/**
 * Toggle an article's favorite status
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
