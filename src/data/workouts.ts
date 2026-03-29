import type { SingleWorkout } from '@/src/types/workouts';
import {
  DEFAULT_WORKOUT_LOG_SCHEMA,
  STANDALONE_LOG_SCHEMA_BY_ID,
} from '@/src/data/standaloneLogSchemas';

import freeWorkoutsData from './freeWorkouts.json';
import proWorkoutsData from './proWorkouts.json';

export type {
  DetailedMovement,
  SingleWorkout,
  WorkoutCategory,
  WorkoutLogSchema,
} from '@/src/types/workouts';

type WorkoutJson = Omit<SingleWorkout, 'logSchema'>;

function withLogSchema(workout: WorkoutJson): SingleWorkout {
  let schema =
    STANDALONE_LOG_SCHEMA_BY_ID[workout.id] ?? DEFAULT_WORKOUT_LOG_SCHEMA;
  if (schema.kind === 'none') {
    schema = DEFAULT_WORKOUT_LOG_SCHEMA;
  }
  return {
    ...workout,
    logSchema: schema,
  };
}

export const freeStandaloneWorkouts: SingleWorkout[] = (
  freeWorkoutsData as WorkoutJson[]
).map(withLogSchema);

export const proStandaloneWorkouts: SingleWorkout[] = (
  proWorkoutsData as WorkoutJson[]
).map(withLogSchema);

export const allStandaloneWorkouts: SingleWorkout[] = [
  ...freeStandaloneWorkouts,
  ...proStandaloneWorkouts,
];

export function getStandaloneWorkoutById(
  id: string
): SingleWorkout | undefined {
  return allStandaloneWorkouts.find((w) => w.id === id);
}
