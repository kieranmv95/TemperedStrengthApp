import { DISCIPLINE_ICONS } from '@/src/data/disciplines';
import type { SingleWorkout, WorkoutLevel } from '@/src/types/workouts';
import type { Ionicons } from '@expo/vector-icons';

const MAX_CARD_TAGS = 3;

export function primaryDisciplineIcon(
  workout: SingleWorkout
): keyof typeof Ionicons.glyphMap {
  return DISCIPLINE_ICONS[
    workout.disciplines[0]
  ] as keyof typeof Ionicons.glyphMap;
}

/** "Beginner", or a range such as "Beginner–Advanced" for scaled workouts. */
export function levelsLabel(levels: WorkoutLevel[]): string {
  if (levels.length <= 1) return levels[0] ?? '';
  return `${levels[0]}–${levels[levels.length - 1]}`;
}

/** Secondary disciplines, then the format. The primary sits in the header. */
export function workoutTagLabels(workout: SingleWorkout): string[] {
  const labels: string[] = workout.disciplines.slice(1);
  if (workout.format) labels.push(workout.format);
  return labels.slice(0, MAX_CARD_TAGS);
}

/** Everything the card shows, plus body focus, collections and partner. */
export function workoutDetailTagLabels(workout: SingleWorkout): string[] {
  const labels: string[] = workout.disciplines.slice(1);
  if (workout.format) labels.push(workout.format);
  labels.push(...workout.bodyFocus, ...(workout.collections ?? []));
  if (workout.partner === 'only') labels.push('Partner');
  if (workout.partner === 'option') labels.push('Solo or partner');
  return labels;
}
