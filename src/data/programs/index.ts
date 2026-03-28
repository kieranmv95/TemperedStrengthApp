import type { Program } from '@/src/types/program';
import { bodybuilding_free } from './bodybuilding_free';
import { bodybuilding_pro } from './bodybuilding_pro';
import { full_body_2day } from './full_body_2day';
import { olympic_advanced_8wk } from './olympic_advanced_8wk';
import { olympic_foundations } from './olympic_foundations';
import { powerbuilding_4day_pro } from './powerbuilding_4day_pro';
import { powerlifting_3day } from './powerlifting_3day';
import { ppl_01 } from './ppl_01';
import { strength_5day } from './strength_5day';

export const programList: Program[] = [
  bodybuilding_free,
  bodybuilding_pro,
  ppl_01,
  strength_5day,
  full_body_2day,
  powerlifting_3day,
  olympic_foundations,
  olympic_advanced_8wk,
  powerbuilding_4day_pro,
];
