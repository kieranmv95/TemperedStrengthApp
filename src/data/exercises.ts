// Exercise data - loaded directly from bundled JSON
import type { Exercise } from '../types/exercise';
import exercisesRepsData from './exercises_reps.json';
import exercisesRepsAndWeightData from './exercises_reps_and_weight.json';
import exercisesTimeData from './exercises_time.json';

// Re-export Exercise type
export type { Exercise } from '../types/exercise';

// Sort exercises by name once at module load
const exercises: Exercise[] = (
  [
    ...(exercisesRepsData as Exercise[]),
    ...(exercisesRepsAndWeightData as Exercise[]),
    ...(exercisesTimeData as Exercise[]),
  ] as Exercise[]
)
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
