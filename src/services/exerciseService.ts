import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase, type Exercise } from "../lib/supabase";

const CACHE_KEY = "exercise_library";

export const exerciseService = {
  async getAllExercises(): Promise<Exercise[]> {
    // Return cached data from AsyncStorage
    const cached = await AsyncStorage.getItem(CACHE_KEY);
    const exercises: Exercise[] = cached ? JSON.parse(cached) : [];
    return exercises;
  },

  async syncWithSupabase(): Promise<void> {
    try {
      const { data, error } = await supabase
        .from("exercises")
        .select("*")
        .order("name", { ascending: true });

      if (error) {
        console.error("Error fetching exercises from Supabase:", error);
        return;
      }

      if (data) {
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data));
      }
    } catch (error) {
      console.error("Error syncing exercises:", error);
      throw error;
    }
  },

  async getExerciseById(id: number): Promise<Exercise | undefined> {
    const exercises = await this.getAllExercises();
    return exercises.find((ex) => ex.id === id);
  },

  async getExercisesByPattern(pattern: string): Promise<Exercise[]> {
    const exercises = await this.getAllExercises();
    return exercises.filter((ex) => ex.pattern === pattern);
  },

  // Initialize exercises on app load - call this on startup
  async initialize(): Promise<void> {
    // Try to sync first, but if it fails, use cached data
    try {
      await this.syncWithSupabase();
    } catch (error) {
      console.error("Error initializing exercises:", error);
      // Continue with cached data if sync fails
    }
  },
};
