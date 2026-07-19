import type { CategoryFilter } from '@/src/components/workouts/workoutsScreenConstants';
import { allStandaloneWorkouts } from '@/src/data/workouts';
import type {
  SingleWorkout,
  WorkoutEquipment,
  WorkoutFocusTag,
  WorkoutFormatTag,
} from '@/src/types/workouts';
import { isWorkoutFocusTag, isWorkoutFormatTag } from '@/src/types/workouts';

export type WorkoutTimeBucket = 'quick' | 'short' | 'medium' | 'long';

export type WorkoutTimeBucketOption = {
  id: WorkoutTimeBucket;
  label: string;
  matches: (estimatedTime: number) => boolean;
};

export const WORKOUT_TIME_BUCKET_OPTIONS: WorkoutTimeBucketOption[] = [
  {
    id: 'quick',
    label: 'Quick (<15m)',
    matches: (t) => t < 15,
  },
  {
    id: 'short',
    label: 'Short (15–30m)',
    matches: (t) => t >= 15 && t < 30,
  },
  {
    id: 'medium',
    label: 'Medium (30–45m)',
    matches: (t) => t >= 30 && t < 45,
  },
  {
    id: 'long',
    label: 'Long (45m+)',
    matches: (t) => t >= 45,
  },
];

export type WorkoutFilterCriteria = {
  searchQuery?: string;
  activeCategoryFilter?: CategoryFilter;
  selectedEquipment?: WorkoutEquipment[];
  noEquipmentOnly?: boolean;
  selectedFocus?: WorkoutFocusTag[];
  selectedFormat?: WorkoutFormatTag[];
  selectedTimeBuckets?: WorkoutTimeBucket[];
  favoriteIds?: string[];
};

export function workoutMatchesTimeBucket(
  estimatedTime: number,
  bucket: WorkoutTimeBucket
): boolean {
  const option = WORKOUT_TIME_BUCKET_OPTIONS.find((b) => b.id === bucket);
  return option ? option.matches(estimatedTime) : false;
}

export function workoutMatchesFilters(
  workout: SingleWorkout,
  criteria: WorkoutFilterCriteria
): boolean {
  const searchQuery = criteria.searchQuery ?? '';
  const activeCategoryFilter = criteria.activeCategoryFilter ?? 'All';
  const selectedEquipment = criteria.selectedEquipment ?? [];
  const noEquipmentOnly = criteria.noEquipmentOnly ?? false;
  const selectedFocus = criteria.selectedFocus ?? [];
  const selectedFormat = criteria.selectedFormat ?? [];
  const selectedTimeBuckets = criteria.selectedTimeBuckets ?? [];
  const favoriteIds = criteria.favoriteIds ?? [];

  if (searchQuery.trim()) {
    const query = searchQuery.trim().toLowerCase();
    const matchesTitle = workout.title.toLowerCase().includes(query);
    const matchesDescription = workout.description
      .toLowerCase()
      .includes(query);
    const matchesTags = workout.tags.some((tag) =>
      tag.toLowerCase().includes(query)
    );
    if (!matchesTitle && !matchesDescription && !matchesTags) {
      return false;
    }
  }

  if (noEquipmentOnly) {
    if (workout.equipment.length > 0) return false;
  } else if (selectedEquipment.length > 0) {
    const hasAll = selectedEquipment.every((eq) =>
      workout.equipment.includes(eq)
    );
    if (!hasAll) return false;
  }

  if (selectedFocus.length > 0) {
    const hasFocus = workout.tags.some(
      (tag) => isWorkoutFocusTag(tag) && selectedFocus.includes(tag)
    );
    if (!hasFocus) return false;
  }

  if (selectedFormat.length > 0) {
    const hasFormat = workout.tags.some(
      (tag) => isWorkoutFormatTag(tag) && selectedFormat.includes(tag)
    );
    if (!hasFormat) return false;
  }

  if (selectedTimeBuckets.length > 0) {
    const matchesTime = selectedTimeBuckets.some((bucket) =>
      workoutMatchesTimeBucket(workout.estimatedTime, bucket)
    );
    if (!matchesTime) return false;
  }

  if (activeCategoryFilter === 'All') return true;
  if (activeCategoryFilter === 'Favorites') {
    return favoriteIds.includes(workout.id);
  }
  if (activeCategoryFilter === 'Pro') return workout.isPremium;
  return workout.category === activeCategoryFilter;
}

export function countActiveWorkoutFilters(criteria: {
  searchQuery: string;
  activeCategoryFilter: CategoryFilter;
  selectedEquipment: WorkoutEquipment[];
  noEquipmentOnly: boolean;
  selectedFocus: WorkoutFocusTag[];
  selectedFormat: WorkoutFormatTag[];
  selectedTimeBuckets: WorkoutTimeBucket[];
}): number {
  let count = 0;
  if (criteria.searchQuery.trim().length > 0) count += 1;
  if (criteria.activeCategoryFilter !== 'All') count += 1;
  if (criteria.noEquipmentOnly) count += 1;
  count += criteria.selectedEquipment.length;
  count += criteria.selectedFocus.length;
  count += criteria.selectedFormat.length;
  count += criteria.selectedTimeBuckets.length;
  return count;
}

export function equipmentFilterLabel(eq: WorkoutEquipment): string {
  return eq
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function countWorkoutsMatching(
  criteria: WorkoutFilterCriteria,
  overrides?: Partial<WorkoutFilterCriteria>
): number {
  const merged = { ...criteria, ...overrides };
  return allStandaloneWorkouts.filter((workout) =>
    workoutMatchesFilters(workout, merged)
  ).length;
}

/**
 * Faceted count for an OR-group option (focus, format, duration).
 * Ignores the group's own selection so counts never grow as you select
 * more options within the group; only other groups' filters narrow it.
 */
export function countWithMultiSelectOption<T extends string>(
  base: WorkoutFilterCriteria,
  field: 'selectedFocus' | 'selectedFormat' | 'selectedTimeBuckets',
  value: T
): number {
  return countWorkoutsMatching(base, { [field]: [value] });
}

/** Faceted count: results if this equipment option were included. */
export function countWithEquipmentOption(
  base: WorkoutFilterCriteria,
  eq: WorkoutEquipment,
  current: WorkoutEquipment[]
): number {
  const next = current.includes(eq) ? current : [...current, eq];
  return countWorkoutsMatching(base, {
    noEquipmentOnly: false,
    selectedEquipment: next,
  });
}
