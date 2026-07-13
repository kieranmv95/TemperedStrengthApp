export type WorkoutCategory =
  | 'Strength'
  | 'Skill'
  | 'WOD'
  | 'Hyrox'
  | 'Conditioning'
  | 'Pilates'
  | 'Rainhill';

export type WorkoutEquipment =
  | 'kettlebell'
  | 'dumbbell'
  | 'barbell'
  | 'skipping rope'
  | 'static machines'
  | 'rower'
  | 'bike'
  | 'ski erg'
  | 'bands'
  | 'box'
  | 'medicine ball'
  | 'pull-up bar'
  | 'sled'
  | 'ghd'
  | 'sandbag';

/** Training stimulus / body area — workouts typically have 1–2. */
export const WORKOUT_FOCUS_TAGS = [
  'Full Body',
  'Upper Body',
  'Lower Body',
  'Core',
  'Cardio',
  'Strength',
  'Gymnastics',
  'Olympic Lifting',
] as const;

/** Workout structure / scoring — workouts typically have 1. */
export const WORKOUT_FORMAT_TAGS = [
  'AMRAP',
  'EMOM',
  'For Time',
  'Intervals',
  'Tabata',
  'Chipper',
  'Ladder',
  'Benchmark',
] as const;

export const BRAND_TAGS = ['Arena'] as const;

/** Modifier kept for Partner discipline filtering. */
export const WORKOUT_MODIFIER_TAGS = ['Partner'] as const;

export const WORKOUT_TAGS = [
  ...WORKOUT_FOCUS_TAGS,
  ...WORKOUT_FORMAT_TAGS,
  ...WORKOUT_MODIFIER_TAGS,
  ...BRAND_TAGS,
] as const;

export type WorkoutFocusTag = (typeof WORKOUT_FOCUS_TAGS)[number];
export type WorkoutFormatTag = (typeof WORKOUT_FORMAT_TAGS)[number];
export type WorkoutTag = (typeof WORKOUT_TAGS)[number];

export function isWorkoutFocusTag(tag: string): tag is WorkoutFocusTag {
  return (WORKOUT_FOCUS_TAGS as readonly string[]).includes(tag);
}

export function isWorkoutFormatTag(tag: string): tag is WorkoutFormatTag {
  return (WORKOUT_FORMAT_TAGS as readonly string[]).includes(tag);
}

export function isWorkoutTag(tag: string): tag is WorkoutTag {
  return (WORKOUT_TAGS as readonly string[]).includes(tag);
}

/**
 * What the standalone workouts tab can record for a template.
 * Templates without a structured benchmark use `notes_only` by default.
 */
export type WorkoutLogSchema =
  | { kind: 'none' }
  | {
      kind: 'duration';
      label?: string;
      /** For benchmarks like Murph — lower time is better. */
      lowerIsBetter: boolean;
    }
  | {
      kind: 'amrap';
      timeCapMinutes: number;
      roundsLabel?: string;
      extraRepsLabel?: string;
    }
  | {
      kind: 'max_reps';
      label: string;
      higherIsBetter?: boolean;
    }
  | {
      kind: 'distance';
      label?: string;
      unit: 'm' | 'km';
      higherIsBetter: boolean;
    }
  | {
      kind: 'notes_only';
      placeholder?: string;
    };

export type SingleWorkout = {
  id: string;
  title: string;
  description: string;
  category: WorkoutCategory;
  difficulty:
    | 'Beginner'
    | 'Intermediate'
    | 'Advanced'
    | 'Multiple Difficulties';
  estimatedTime: number;
  tags: WorkoutTag[];
  /** Equipment required for this workout; empty when bodyweight / no gear. */
  equipment: WorkoutEquipment[];
  isPremium: boolean;
  logSchema: WorkoutLogSchema;
  /** True when designed to be done with a partner. */
  partner?: boolean;
  /** Present when the workout is a collaboration; surfaced on the detail screen and Collab discipline. */
  collab?: WorkoutCollab;
  blocks: StandaloneWorkoutSource['blocks'];
};

/** Optional partner/collaborator credit shown on a workout and used by the Collab discipline. */
export type WorkoutCollab = {
  name: string;
  description: string;
  link: string;
  linkCopy?: string;
  imageUrl?: string;
  /** Optional white-label colours for the collab card; each falls back to the app theme. */
  inColabWithColor?: string;
  bgColor?: string;
  nameColor?: string;
  descriptionColor?: string;
  linkAndBorderColor?: string;
};

export type DetailedMovement = {
  name: string;
  value: string;
  note?: string;
};

export type Divider = {
  type: 'divider';
  note?: string;
};

export type WorkoutMovement = string | DetailedMovement | Divider;

export type WorkoutBlockBase = {
  name: string;
  mobilityFlow?: string;
  mobilityFlowCopy?: string;
  instructions?: string;
  highlightInstructions?: string;
  movements?: WorkoutMovement[];
};

/** Bundled workout row in `workout_data.ts` before `logSchema` is merged in `workouts.ts`. */
export type StandaloneWorkoutSource = {
  id: string;
  title: string;
  description: string;
  category: WorkoutCategory;
  difficulty:
    | 'Beginner'
    | 'Intermediate'
    | 'Advanced'
    | 'Multiple Difficulties';
  estimatedTime: number;
  tags: WorkoutTag[];
  equipment: WorkoutEquipment[];
  isPremium: boolean;
  partner?: boolean;
  collab?: WorkoutCollab;
  blocks:
    | WorkoutBlockBase[]
    | {
        scale: string;
        mobilityFlow?: string;
        highlightInstructions?: string;
        blocks: WorkoutBlockBase[];
      }[];
};
