export type Warmup = {
  type: 'warmup';
  title?: string;
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

export type WorkoutMovement = {
  /**
   * Stable within the workout for UI keys.
   * Prefer simple ids like "a1", "m3", etc.
   */
  id: string;
  /**
   * Optional reference into the exercise catalog (enables showing catalog name/description).
   * For Pilates / custom movements, omit this and use `label` + `notes`.
   */
  exerciseId?: number | null;
  /**
   * Display name when not using a catalog exercise, or to override a catalog name.
   */
  label?: string;
  /**
   * Prescription like "12 reps", "30s", "10/side", "max quality".
   */
  prescription?: string;
  /**
   * Extra guidance shown under the movement.
   */
  notes?: string;
};

export type WorkoutBlockBase = {
  /**
   * Stable id used for completion logging.
   */
  id: string;
  title: string;
  instructions?: string;
  movements?: WorkoutMovement[];
};

export type WorkoutBlockRounds = WorkoutBlockBase & {
  type: 'rounds';
  rounds: number;
  restSecondsBetweenRounds?: number;
};

export type WorkoutBlockTabata = WorkoutBlockBase & {
  type: 'tabata';
  rounds: number;
  workSeconds: number;
  restSeconds: number;
};

export type WorkoutBlockEmom = WorkoutBlockBase & {
  type: 'emom';
  minutes: number;
};

export type WorkoutBlockAmrap = WorkoutBlockBase & {
  type: 'amrap';
  minutes: number;
};

export type WorkoutBlockForTime = WorkoutBlockBase & {
  type: 'for_time';
};

export type WorkoutBlockWarmup = WorkoutBlockBase & {
  type: 'warmup';
  description: string[];
};

export type WorkoutBlockCooldown = WorkoutBlockBase & {
  type: 'cooldown';
  description: string[];
};

export type WorkoutBlock =
  | WorkoutBlockWarmup
  | WorkoutBlockCooldown
  | WorkoutBlockRounds
  | WorkoutBlockTabata
  | WorkoutBlockEmom
  | WorkoutBlockAmrap
  | WorkoutBlockForTime;

export type WorkoutBase = {
  dayIndex: number;
  label: string;
  description: string;
  intensity: number; // 1 to 10 scale
};

export type WorkoutV1 = WorkoutBase & {
  format?: 'v1';
  exercises: (Exercise | Warmup)[];
};

export type WorkoutV2 = WorkoutBase & {
  format: 'v2';
  blocks: WorkoutBlock[];
};

export type Workout = WorkoutV1 | WorkoutV2;

type ProgramCategory =
  | 'strength'
  | 'hyrox'
  | 'conditioning'
  | 'powerlifting'
  | 'bodybuilding'
  | 'plyometrics'
  | 'olympic'
  | 'functional';

export type ProgramGoal =
  | 'cutting'
  | 'bulking'
  | 'maintenance'
  | 'stronger'
  | 'leaner'
  | 'endurance'
  | 'mobility'
  | 'athletic'
  | 'hypertrophy';

export type Program = {
  id: string;
  name: string;
  description: string;
  bodyChangesSummary?: string;
  workouts: Workout[];
  isPro: boolean;
  daysSplit?: ('mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun')[];
  averageSessionDuration?: string;
  categories: ProgramCategory[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  goals: ProgramGoal[];
};
