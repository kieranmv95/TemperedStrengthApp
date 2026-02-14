import { programList } from '@/src/data/programs';
import type { Program } from '@/src/types/program';

export type { Exercise, Program, Warmup, Workout } from '@/src/types/program';

export const programs: Program[] = programList;

export const getProgramById = (id: string): Program | undefined => {
  return programs.find((p) => p.id === id);
};
