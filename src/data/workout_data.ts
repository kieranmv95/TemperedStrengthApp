import type { StandaloneWorkoutSource } from '@/src/types/workouts';

import { arena } from './workouts/arena';
import { conditioning } from './workouts/conditioning';
import { girlGames } from './workouts/girlGames';
import { hyrox } from './workouts/hyrox';
import { oly } from './workouts/oly';
import { rainhill } from './workouts/rainhill';
import { skills } from './workouts/skills';
import { strength } from './workouts/strength';
import { wods } from './workouts/wods';

export const workouts: StandaloneWorkoutSource[] = [
  ...arena,
  ...oly,
  ...rainhill,
  ...girlGames,
  ...strength,
  ...wods,
  ...hyrox,
  ...conditioning,
  ...skills,
];
