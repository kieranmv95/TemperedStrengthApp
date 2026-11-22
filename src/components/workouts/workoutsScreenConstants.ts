import type { WorkoutEquipment } from '@/src/types/workouts';

export type WorkoutSortBy = 'name' | 'duration';
export type WorkoutSortDirection = 'asc' | 'desc';

export const WORKOUT_SORT_BY_OPTIONS: {
  value: WorkoutSortBy;
  label: string;
}[] = [
  { value: 'name', label: 'Name' },
  { value: 'duration', label: 'Duration' },
];

export const WORKOUT_SORT_DIRECTION_OPTIONS: {
  value: WorkoutSortDirection;
  label: string;
}[] = [
  { value: 'asc', label: 'Ascending' },
  { value: 'desc', label: 'Descending' },
];

/** Kit most people have access to; always shown in the filter sheet. */
export const COMMON_EQUIPMENT: WorkoutEquipment[] = [
  'dumbbell',
  'kettlebell',
  'barbell',
  'pull-up bar',
  'medicine ball',
  'box',
  'rower',
  'bike',
  'ski erg',
];

/** Specialist kit, shown behind "More equipment". */
export const MORE_EQUIPMENT: WorkoutEquipment[] = [
  'sandbag',
  'sled',
  'bands',
  'skipping rope',
  'ghd',
  'static machines',
];

export const WORKOUT_EQUIPMENT_OPTIONS: WorkoutEquipment[] = [
  ...COMMON_EQUIPMENT,
  ...MORE_EQUIPMENT,
];

export function toggleValue<T>(values: T[], value: T): T[] {
  return values.includes(value)
    ? values.filter((v) => v !== value)
    : [...values, value];
}
