export type WorkoutCategory =
  | 'Strength'
  | 'WOD'
  | 'Hyrox'
  | 'Conditioning'
  | 'Mobility'
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
  | 'ghd';

/** Every tag used in bundled standalone workouts (`workout_data.ts`). */
export const WORKOUT_TAGS = [
  'AMRAP',
  'Abs',
  'Advanced',
  'Aerobic',
  'Arms',
  'Assault Bike',
  'Athletic',
  'Back',
  'Balance',
  'Barbell',
  'Beginner',
  'Bench Press',
  'Benchmark',
  'Biceps',
  'Bike',
  'Bodyweight',
  'Boxing',
  'Boxing HIIT',
  'Breathwork',
  'Burpees',
  'Calisthenics',
  'Cardio',
  'Carry',
  'Chest',
  'Chipper',
  'Circuit',
  'Classical',
  'Clean',
  'Clean and Jerk',
  'Conditioning',
  'Control',
  'Core',
  'CrossFit',
  'Deadlift',
  'Deep Stabilisers',
  'Delts',
  'Dumbbell',
  'Dumbbells',
  'EMOM',
  'Eccentric',
  'Elite',
  'Endurance',
  'Engine',
  'Explosive',
  'Finishers',
  'Flexibility',
  'For Score',
  'For Time',
  'Full Body',
  'Glutes',
  'Grip',
  'Gym',
  'Gymnastics',
  'HIIT',
  'HIIT Shred',
  'HSPU',
  'Hamstrings',
  'Heavy',
  'Hero WOD',
  'Hip Stability',
  'Hybrid',
  'Hypertrophy',
  'Hyrox',
  'Intermediate',
  'Intervals',
  'Jump Rope',
  'Jumps',
  'KB',
  'Kettlebell',
  'Lats',
  'Legs',
  'Long',
  'Lunges',
  'Lungs',
  'Mobility',
  'Morning',
  'No Equipment',
  'Overhead',
  'Overhead Squat',
  'Pacing',
  'Partner',
  'Pause',
  'Pilates',
  'Posture',
  'Postures',
  'Power',
  'Powerhouse',
  'Prehab',
  'Pull-ups',
  'Pump',
  'Quads',
  'Quick',
  'Rainhill',
  'Recovery',
  'Reformer-Style',
  'Resistance Band',
  'Ring Dips',
  'Rings',
  'Rope',
  'Rotation',
  'Row',
  'Run',
  'Running',
  'Sandbag',
  'Shoulders',
  'Simulation',
  'Ski',
  'SkiErg',
  'Skill',
  'Sled',
  'Snatch',
  'Speed',
  'Spine',
  'Sprint',
  'Squat',
  'Stability',
  'Stations',
  'Strength',
  'Tabata',
  'Teaser',
  'Technique',
  'Test',
  'Thoracic',
  'Thrusters',
  'Timecap',
  'Track',
  'Transitions',
  'Triceps',
  'Upper Body',
  'Volume',
  'Wall Ball',
  'Wall Balls',
  'Zone 2',
] as const;

export type WorkoutTag = (typeof WORKOUT_TAGS)[number];

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
  blocks: StandaloneWorkoutSource['blocks'];
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
  instructions?: string;
  movements: WorkoutMovement[];
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
  blocks:
    | WorkoutBlockBase[]
    | {
        scale: string;
        blocks: WorkoutBlockBase[];
      }[];
};
