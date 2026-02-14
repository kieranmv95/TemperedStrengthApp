// Pivot Engine - Logic for finding exercise alternatives
import { getAllExercises, type Exercise } from '../data/exercises';

/**
 * Finds alternative exercises that share the same movement pattern
 * but have different equipment options
 * @param currentExerciseId - ID of the current exercise
 * @param count - Number of alternatives to return (default: 3)
 * @returns Array of alternative exercises
 */
export const findAlternatives = (
  currentExerciseId: number,
  count: number = 3
): Exercise[] => {
  const exercises = getAllExercises();
  const currentExercise = exercises.find((ex) => ex.id === currentExerciseId);

  if (!currentExercise) {
    return [];
  }

  // Find exercises with the same pattern but different equipment
  const alternatives = exercises.filter(
    (ex) =>
      ex.pattern === currentExercise.pattern &&
      ex.id !== currentExerciseId &&
      ex.equipment !== currentExercise.equipment
  );

  // If we don't have enough with different equipment, include same equipment but different exercises
  if (alternatives.length < count) {
    const samePatternAll = exercises.filter(
      (ex) =>
        ex.pattern === currentExercise.pattern && ex.id !== currentExerciseId
    );

    // Combine and remove duplicates
    const allAlternatives = [...alternatives];
    samePatternAll.forEach((ex) => {
      if (!allAlternatives.find((a) => a.id === ex.id)) {
        allAlternatives.push(ex);
      }
    });

    return allAlternatives.slice(0, count);
  }

  // Shuffle and return requested count
  return shuffleArray([...alternatives]).slice(0, count);
};

/**
 * Shuffles an array (Fisher-Yates algorithm)
 */
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};
