export type WorkoutCategory =
  | 'Strength'
  | 'WOD'
  | 'Hyrox'
  | 'Conditioning'
  | 'Mobility';

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
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: number;
  tags: string[];
  isPremium: boolean;
  logSchema: WorkoutLogSchema;

  blocks: {
    name: string;
    instructions?: string;
    movements: string[] | DetailedMovement[];
  }[];
};

export type DetailedMovement = {
  name: string;
  value: string;
  note?: string;
};
