import { allStandaloneWorkouts } from '@/src/data/workouts';
import type {
  SingleWorkout,
  WorkoutBodyFocus,
  WorkoutCollection,
  WorkoutDiscipline,
  WorkoutEquipment,
  WorkoutFormat,
  WorkoutLevel,
} from '@/src/types/workouts';
import { isWorkoutLocked } from '@/src/utils/workoutAccess';

export type WorkoutTimeBucket = 'quick' | 'short' | 'medium' | 'long';

export type WorkoutTimeBucketOption = {
  id: WorkoutTimeBucket;
  label: string;
  matches: (estimatedTime: number) => boolean;
};

export const WORKOUT_TIME_BUCKET_OPTIONS: WorkoutTimeBucketOption[] = [
  {
    id: 'quick',
    label: 'Under 15 min',
    matches: (t) => t < 15,
  },
  {
    id: 'short',
    label: '15–30 min',
    matches: (t) => t >= 15 && t < 30,
  },
  {
    id: 'medium',
    label: '30–45 min',
    matches: (t) => t >= 30 && t < 45,
  },
  {
    id: 'long',
    label: '45+ min',
    matches: (t) => t >= 45,
  },
];

/**
 * Everything the user can filter by. Options in one group are OR'd; groups
 * are AND'd together.
 */
export type WorkoutFilters = {
  searchQuery: string;
  favouritesOnly: boolean;
  hideLocked: boolean;
  disciplines: WorkoutDiscipline[];
  timeBuckets: WorkoutTimeBucket[];
  /** Kit the user has. Matches workouts that need nothing outside it. */
  equipment: WorkoutEquipment[];
  bodyweightOnly: boolean;
  formats: WorkoutFormat[];
  bodyFocus: WorkoutBodyFocus[];
  levels: WorkoutLevel[];
  partnerOnly: boolean;
  collections: WorkoutCollection[];
};

/** Who is filtering: needed for favourites and the locked filter. */
export type WorkoutFilterContext = {
  favoriteIds: string[];
  isPro: boolean;
  roles: string[];
};

export const EMPTY_WORKOUT_FILTERS: WorkoutFilters = {
  searchQuery: '',
  favouritesOnly: false,
  hideLocked: false,
  disciplines: [],
  timeBuckets: [],
  equipment: [],
  bodyweightOnly: false,
  formats: [],
  bodyFocus: [],
  levels: [],
  partnerOnly: false,
  collections: [],
};

/** Multi-select groups, each matched with OR. */
export type WorkoutFilterGroup =
  | 'disciplines'
  | 'timeBuckets'
  | 'formats'
  | 'bodyFocus'
  | 'levels'
  | 'collections';

export function workoutMatchesTimeBucket(
  estimatedTime: number,
  bucket: WorkoutTimeBucket
): boolean {
  const option = WORKOUT_TIME_BUCKET_OPTIONS.find((b) => b.id === bucket);
  return option ? option.matches(estimatedTime) : false;
}

function matchesSearch(workout: SingleWorkout, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  const haystack = [
    workout.title,
    workout.description,
    ...workout.disciplines,
    workout.format ?? '',
    ...(workout.collections ?? []),
    workout.special ?? '',
  ];
  return haystack.some((text) => text.toLowerCase().includes(needle));
}

function matchesAny<T>(selected: T[], values: readonly T[]): boolean {
  return selected.length === 0 || selected.some((v) => values.includes(v));
}

export function workoutMatchesFilters(
  workout: SingleWorkout,
  filters: WorkoutFilters,
  context: WorkoutFilterContext
): boolean {
  if (!matchesSearch(workout, filters.searchQuery)) return false;

  if (filters.favouritesOnly && !context.favoriteIds.includes(workout.id)) {
    return false;
  }
  if (
    filters.hideLocked &&
    isWorkoutLocked(workout, { isPro: context.isPro, roles: context.roles })
  ) {
    return false;
  }

  if (!matchesAny(filters.disciplines, workout.disciplines)) return false;
  if (
    filters.timeBuckets.length > 0 &&
    !filters.timeBuckets.some((bucket) =>
      workoutMatchesTimeBucket(workout.estimatedTime, bucket)
    )
  ) {
    return false;
  }

  if (filters.bodyweightOnly) {
    if (workout.equipment.length > 0) return false;
  } else if (filters.equipment.length > 0) {
    const canDo = workout.equipment.every((eq) =>
      filters.equipment.includes(eq)
    );
    if (!canDo) return false;
  }

  if (!matchesAny(filters.formats, workout.format ? [workout.format] : [])) {
    return false;
  }
  if (!matchesAny(filters.bodyFocus, workout.bodyFocus)) return false;
  if (!matchesAny(filters.levels, workout.levels)) return false;
  if (!matchesAny(filters.collections, workout.collections ?? [])) {
    return false;
  }
  if (filters.partnerOnly && !workout.partner) return false;

  return true;
}

export function countActiveWorkoutFilters(filters: WorkoutFilters): number {
  let count = 0;
  if (filters.searchQuery.trim().length > 0) count += 1;
  if (filters.favouritesOnly) count += 1;
  if (filters.hideLocked) count += 1;
  if (filters.bodyweightOnly) count += 1;
  if (filters.partnerOnly) count += 1;
  count += filters.disciplines.length;
  count += filters.timeBuckets.length;
  count += filters.equipment.length;
  count += filters.formats.length;
  count += filters.bodyFocus.length;
  count += filters.levels.length;
  count += filters.collections.length;
  return count;
}

export function equipmentFilterLabel(eq: WorkoutEquipment): string {
  return eq
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function countWorkoutsMatching(
  filters: WorkoutFilters,
  context: WorkoutFilterContext,
  overrides?: Partial<WorkoutFilters>
): number {
  const merged = { ...filters, ...overrides };
  return allStandaloneWorkouts.filter((workout) =>
    workoutMatchesFilters(workout, merged, context)
  ).length;
}

/**
 * Faceted count for one option in an OR group. Ignores the group's own
 * selection, so counts never grow as more options in the group are picked.
 */
export function countWithGroupOption<G extends WorkoutFilterGroup>(
  filters: WorkoutFilters,
  context: WorkoutFilterContext,
  group: G,
  value: WorkoutFilters[G][number]
): number {
  return countWorkoutsMatching(filters, context, { [group]: [value] });
}

/** Faceted count: results if the user also had this piece of kit. */
export function countWithEquipmentOption(
  filters: WorkoutFilters,
  context: WorkoutFilterContext,
  eq: WorkoutEquipment
): number {
  const next = filters.equipment.includes(eq)
    ? filters.equipment
    : [...filters.equipment, eq];
  return countWorkoutsMatching(filters, context, {
    bodyweightOnly: false,
    equipment: next,
  });
}
