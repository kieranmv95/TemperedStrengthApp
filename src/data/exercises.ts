// Exercise data - loaded directly from bundled JSON
import type { Exercise } from "../types/exercise";
import exercisesData from "./exercises.json";

// Re-export Exercise type
export type { Exercise } from "../types/exercise";

// Sort exercises by name once at module load
const exercises: Exercise[] = (exercisesData as Exercise[])
  .slice()
  .sort((a, b) => a.name.localeCompare(b.name));

/**
 * Get all exercises (synchronous)
 */
export const getAllExercises = (): Exercise[] => {
  return exercises;
};

/**
 * Get exercise by ID (synchronous)
 */
export const getExerciseById = (id: number): Exercise | undefined => {
  return exercises.find((ex) => ex.id === id);
};

/**
 * Get exercises by pattern (synchronous)
 */
export const getExercisesByPattern = (pattern: string): Exercise[] => {
  return exercises.filter((ex) => ex.pattern === pattern);
};
