export type Warmup = {
  type: 'warmup';
  additionalDescription?: string | null;
  description: string[];
};

export type Exercise = {
  type: 'exercise';
  id: number;
  additionalHeader?: string | null;
  additionalDescription?: string | null;
  hideReps?: boolean;
  sets: number;
  repRange: [number, number];
  restTimeSeconds?: number;
  isAmrap?: boolean;
  canSwap?: boolean;
};

export type Workout = {
  dayIndex: number;
  label: string;
  description: string;
  intensity: number; // 1 to 10 scale
  exercises: (Exercise | Warmup)[];
};

export type Program = {
  id: string;
  name: string;
  description: string;
  workouts: Workout[];
  isPro: boolean;
  daysSplit?: ('mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun')[];
  averageSessionDuration?: string;
};
