import type { SingleWorkout, WorkoutCategory, WorkoutEquipment } from '@/src/types/workouts';

export type CategoryFilter = 'All' | WorkoutCategory | 'Favorites' | 'Pro';

export type WorkoutSortBy = 'name' | 'duration';
export type WorkoutSortDirection = 'asc' | 'desc';

export const WORKOUT_SORT_BY_OPTIONS: { value: WorkoutSortBy; label: string }[] =
  [
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

export const CATEGORY_FILTERS: CategoryFilter[] = [
  'All',
  'Favorites',
  'Pro',
  'Strength',
  'WOD',
  'Hyrox',
  'Conditioning',
  'Mobility',
  'Pilates',
  'Rainhill',
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
