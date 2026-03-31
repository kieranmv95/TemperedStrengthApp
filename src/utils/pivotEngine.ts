// Pivot Engine - Logic for finding exercise alternatives
import { getAllExercises, type Exercise } from '../data/exercises';
import { getMuscleGroup } from './muscleGroup';

export type ExerciseAlternative = {
  exercise: Exercise;
  matchScore: 100 | 50;
};

/**
 * Finds alternative exercises that share the same movement pattern.
 *
 * - 100%: same pattern AND same (normalized) muscle group
 * - 50%: same (normalized) muscle group only (fallback; pattern may differ)
 *
 * Within each tier, prefer different equipment first.
 * @param currentExerciseId - ID of the current exercise
 * @param count - Number of alternatives to return (default: 3)
 * @returns Array of alternative exercises
 */
export const findAlternatives = (
  currentExerciseId: number,
  count: number = 3
): ExerciseAlternative[] => {
  const exercises = getAllExercises();
  const currentExercise = exercises.find((ex) => ex.id === currentExerciseId);

  if (!currentExercise) {
    return [];
  }

  const currentGroup = getMuscleGroup(currentExercise.muscle);

  const samePattern = exercises.filter(
    (ex) => ex.pattern === currentExercise.pattern && ex.id !== currentExerciseId
  );

  const perfect = samePattern.filter(
    (ex) => getMuscleGroup(ex.muscle) === currentGroup
  );

  const perfectOrdered = orderWithinTier(perfect, currentExercise.equipment);

  const picked: ExerciseAlternative[] = [];
  const pickedIds = new Set<number>();

  for (const ex of perfectOrdered) {
    if (picked.length >= count) break;
    picked.push({ exercise: ex, matchScore: 100 });
    pickedIds.add(ex.id);
  }

  if (picked.length >= count) return picked;

  const fallback = exercises.filter(
    (ex) =>
      ex.id !== currentExerciseId &&
      !pickedIds.has(ex.id) &&
      getMuscleGroup(ex.muscle) === currentGroup &&
      ex.pattern !== currentExercise.pattern
  );
  const fallbackOrdered = orderWithinTier(fallback, currentExercise.equipment);

  for (const ex of fallbackOrdered) {
    if (picked.length >= count) break;
    picked.push({ exercise: ex, matchScore: 50 });
    pickedIds.add(ex.id);
  }

  return picked;
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

const orderWithinTier = (
  candidates: Exercise[],
  currentEquipment: string
): Exercise[] => {
  const differentEquipment = candidates.filter(
    (ex) => ex.equipment !== currentEquipment
  );
  const sameEquipment = candidates.filter((ex) => ex.equipment === currentEquipment);

  return [...shuffleArray(differentEquipment), ...shuffleArray(sameEquipment)];
};
