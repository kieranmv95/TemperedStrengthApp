import type { Exercise as ProgramExercise, Warmup } from '../types/program';

export const INTENSITY_LEVELS: {
  range: [number, number];
  label: string;
  feel: string;
}[] = [
  {
    range: [1, 2],
    label: 'Very Light',
    feel: 'Minimal effort. Recovery-level work. You should feel refreshed, not fatigued.',
  },
  {
    range: [3, 4],
    label: 'Light',
    feel: 'Easy effort. Good for technique practice and building volume without heavy strain.',
  },
  {
    range: [5, 6],
    label: 'Moderate',
    feel: 'Noticeable effort. Challenging but sustainable. You could hold a short conversation.',
  },
  {
    range: [7, 8],
    label: 'Hard',
    feel: 'Demanding effort. Requires real focus and grit. Expect to feel spent by the end.',
  },
  {
    range: [9, 10],
    label: 'Very Hard',
    feel: 'Near-maximal effort. Highly taxing on the body and nervous system. Full recovery is essential.',
  },
];

export function getIntensityLevel(intensity: number) {
  return (
    INTENSITY_LEVELS.find(
      (l) => intensity >= l.range[0] && intensity <= l.range[1]
    ) ?? INTENSITY_LEVELS[2]
  );
}

export function formatSessionDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
}

export type ExerciseSlot = {
  type: 'exercise';
  exerciseId: number | null;
  programExercise: ProgramExercise | null;
};

export type WarmupSlot = {
  type: 'warmup';
  warmup: Warmup;
};

export type WorkoutSlot = ExerciseSlot | WarmupSlot;
