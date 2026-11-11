import type { SingleWorkout, TemperedDailyWeek } from '@/src/types/workouts';

import {
  temperedDailyWeek01,
  temperedDailyWeek01Program,
} from './workouts/temperedDaily_week01';
import {
  temperedDailyWeek02,
  temperedDailyWeek02Program,
} from './workouts/temperedDaily_week02';
import {
  temperedDailyWeek03,
  temperedDailyWeek03Program,
} from './workouts/temperedDaily_week03';
import {
  temperedDailyWeek04,
  temperedDailyWeek04Program,
} from './workouts/temperedDaily_week04';
import {
  temperedDailyWeek05,
  temperedDailyWeek05Program,
} from './workouts/temperedDaily_week05';
import {
  temperedDailyWeek06,
  temperedDailyWeek06Program,
} from './workouts/temperedDaily_week06';
import {
  temperedDailyWeek07,
  temperedDailyWeek07Program,
} from './workouts/temperedDaily_week07';
import {
  temperedDailyWeek08,
  temperedDailyWeek08Program,
} from './workouts/temperedDaily_week08';
import { withLogSchema } from './workouts';

/** Ordered oldest to newest. A new week is a new week file plus one entry here. */
export const temperedDailyProgram: TemperedDailyWeek[] = [
  temperedDailyWeek01Program,
  temperedDailyWeek02Program,
  temperedDailyWeek03Program,
  temperedDailyWeek04Program,
  temperedDailyWeek05Program,
  temperedDailyWeek06Program,
  temperedDailyWeek07Program,
  temperedDailyWeek08Program,
];

/** Kept out of `workout_data.ts` so these never appear in browse, search or filters. */
export const temperedDailyWorkouts: SingleWorkout[] = [
  ...temperedDailyWeek01,
  ...temperedDailyWeek02,
  ...temperedDailyWeek03,
  ...temperedDailyWeek04,
  ...temperedDailyWeek05,
  ...temperedDailyWeek06,
  ...temperedDailyWeek07,
  ...temperedDailyWeek08,
].map(withLogSchema);

export function getTemperedDailyWorkoutById(
  id: string
): SingleWorkout | undefined {
  return temperedDailyWorkouts.find((w) => w.id === id);
}
