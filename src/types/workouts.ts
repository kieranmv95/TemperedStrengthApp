export type WorkoutCategory =
  | 'Strength'
  | 'WOD'
  | 'Hyrox'
  | 'Conditioning'
  | 'Mobility'
  | 'Pilates'
  | 'Rainhill';

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
  tags: string[];
  isPremium: boolean;
  logSchema: WorkoutLogSchema;
  /** True when designed to be done with a partner. */
  partner?: boolean;
  blocks:
    | {
        name: string;
        instructions?: string;
        movements: string[] | DetailedMovement[] | Divider[];
      }[]
    | {
        scale: string;
        blocks: {
          name: string;
          instructions?: string;
          movements: string[] | DetailedMovement[] | Divider[];
        }[];
      }[];
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
