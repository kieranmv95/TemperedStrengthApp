export type Warmup = {
  type: 'warmup';
  title?: string;
  additionalDescription?: string | null;
  description: string[];
};

/**
 * One working set in a training-max-relative scheme (e.g. Wendler 5/3/1).
 * `percentOfTrainingMax` is a whole percentage (65 = 65% of the training max).
 */
export type ExerciseSetPrescription = {
  percentOfTrainingMax: number;
  reps: number;
  isAmrap?: boolean;
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
  /**
   * Training-max-relative loading (e.g. Wendler 5/3/1). When present, each entry
   * is one working set: its reps come from the scheme and its target weight is
   * pre-filled from the lifter's stored training max for this lift. Requires the
   * program to declare the lift in `requireRmId`.
   */
  setScheme?: ExerciseSetPrescription[];
  /**
   * Pounds added to the stored training max before `setScheme` percentages are
   * applied. Used for cycle-over-cycle training-max increases (Wendler bumps the
   * TM each cycle). Converted to the lifter's unit at display time.
   */
  trainingMaxIncrementLb?: number;
  /**
   * Exercise id whose stored training max drives `setScheme`. Defaults to this
   * exercise's own `id` (set only when the lift and its TM source differ).
   */
  trainingMaxExerciseId?: number;
};

export type WorkoutMovement = {
  type?: 'divider';
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
  videoId?: string | null;
  workouts: Workout[];
  isPro: boolean;
  daysSplit?: ('mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun')[];
  averageSessionDuration?: string;
  categories: ProgramCategory[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  goals: ProgramGoal[];
  /**
   * Exercise ids the lifter must enter a training max (1RM or estimate) for
   * before the program can start (e.g. the Wendler 5/3/1 primary lifts). Those
   * values drive any `setScheme` loading. Omit for programs that don't need it.
   */
  requireRmId?: number[];
};
