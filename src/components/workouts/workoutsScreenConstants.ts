import type { SingleWorkout, WorkoutCategory, WorkoutEquipment } from '@/src/types/workouts';

export type CategoryFilter = 'All' | WorkoutCategory | 'Favorites' | 'Pro';

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
