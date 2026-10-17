import type {
  SingleWorkout,
  WorkoutCategory,
  WorkoutEquipment,
  WorkoutFocusTag,
} from '@/src/types/workouts';

export type CategoryFilter = 'All' | WorkoutCategory | 'Favorites' | 'Pro';

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

export function categoryFilterDisplayLabel(filter: CategoryFilter): string {
  if (filter === 'WOD') return 'CrossFit';
  return filter;
}

/**
 * Focus tags shown in filters. "Strength" is also a Discipline (a workout
 * category), so the focus tag is labelled differently to tell them apart.
 */
export function focusTagDisplayLabel(tag: WorkoutFocusTag): string {
  if (tag === 'Strength') return 'Strength focus';
  return tag;
}

export const CATEGORY_FILTERS: CategoryFilter[] = [
  'All',
  'Favorites',
  'Pro',
  'Strength',
  'WOD',
  'Hyrox',
  'Conditioning',
  'Rainhill',
  'Girl Games',
];

/** Discipline options shown in the filter sheet (excludes implicit "All"). */
export const DISCIPLINE_CATEGORY_FILTERS: Exclude<CategoryFilter, 'All'>[] = [
  'Favorites',
  'Pro',
  'Strength',
  'WOD',
  'Hyrox',
  'Conditioning',
  'Rainhill',
  'Girl Games',
];

export const WORKOUT_EQUIPMENT_OPTIONS: WorkoutEquipment[] = [
  'kettlebell',
  'dumbbell',
  'barbell',
  'skipping rope',
  'static machines',
  'rower',
  'bike',
  'ski erg',
  'bands',
  'box',
  'medicine ball',
  'pull-up bar',
  'sled',
  'ghd',
  'sandbag',
];

export function getEquipmentFiltersInUse(
  workouts: SingleWorkout[]
): WorkoutEquipment[] {
  const inUse = new Set<WorkoutEquipment>();
  for (const workout of workouts) {
    for (const eq of workout.equipment) {
      inUse.add(eq);
    }
  }
  return WORKOUT_EQUIPMENT_OPTIONS.filter((eq) => inUse.has(eq));
}
