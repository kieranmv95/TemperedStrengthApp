import {
  DEFAULT_WORKOUT_LOG_SCHEMA,
  STANDALONE_LOG_SCHEMA_BY_ID,
} from '@/src/data/standaloneLogSchemas';
import type { SingleWorkout, StandaloneWorkoutSource } from '@/src/types/workouts';

import { workouts as workoutsData } from './workout_data';

export type {
  DetailedMovement,
  SingleWorkout,
  StandaloneWorkoutSource,
  WorkoutCategory,
  WorkoutLogSchema,
  WorkoutTag,
} from '@/src/types/workouts';

export { WORKOUT_TAGS, isWorkoutTag } from '@/src/types/workouts';

type WorkoutJson = StandaloneWorkoutSource;

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

export const standaloneWorkouts: SingleWorkout[] = (
  workoutsData as WorkoutJson[]
).map(withLogSchema);

export const allStandaloneWorkouts: SingleWorkout[] = [...standaloneWorkouts];

export function getStandaloneWorkoutById(
  id: string
): SingleWorkout | undefined {
  return allStandaloneWorkouts.find((w) => w.id === id);
}
