import type { Program } from '@/src/types/program';
import { bootcamp_kb_db_pro } from './bootcamp_kb_db_pro';
import { bodybuilding_free } from './bodybuilding_free';
import { bodybuilding_pro } from './bodybuilding_pro';
import { full_body_2day } from './full_body_2day';
import { hiit_shred_6wk_pro } from './hiit_shred_6wk_pro';
import { olympic_advanced_8wk } from './olympic_advanced_8wk';
import { olympic_foundations } from './olympic_foundations';
import { pilates_intro_4wk_free } from './pilates_intro_4wk_free';
import { powerbuilding_4day_pro } from './powerbuilding_4day_pro';
import { powerlifting_3day } from './powerlifting_3day';
import { ppl_01 } from './ppl_01';
import { strength_5day } from './strength_5day';

export const programList: Program[] = [
  bodybuilding_free,
  bodybuilding_pro,
  pilates_intro_4wk_free,
  ppl_01,
  strength_5day,
  full_body_2day,
  hiit_shred_6wk_pro,
  bootcamp_kb_db_pro,
  powerlifting_3day,
  olympic_foundations,
  olympic_advanced_8wk,
  powerbuilding_4day_pro,
];
