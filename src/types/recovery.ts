// Recovery flows (mobility / stretching) are intentionally a separate domain
// from workouts. The types below mirror the workout shapes today, but live here
// so recoveries can diverge without touching the workout model.

export type RecoveryEquipment =
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
  | 'sandbag'
  | 'foam roller'
  | 'percussive device';

export const RECOVERY_TAGS = [
  'Abs',
  'Core',
  'Posture',
  'Prehab',
  'Recovery',
  'Shoulders',
  'Skill',
  'Activation',
  'Lower Back',
  'Hips',
  'Upper Back',
  'Wrists',
  'Handstand',
  'Rotator Cuff',
  'Full Body',
  'Post-Workout',
  'Mobility',
  'Lower Body',
  'Spine',
  'Legs',
  'Morning',
  'Forearms',
  'Hamstrings',
  'Flexibility',
  'Deep Stretch',
  'Pre-Workout',
  'Glutes',
  'Scapula',
  'Percussive',
  'Upper Body',
  'Running',
  'Warm-Up',
  'Post-Run',
  'Climbing',
  'Knees',
] as const;

export type RecoveryTag = (typeof RECOVERY_TAGS)[number];

export function isRecoveryTag(tag: string): tag is RecoveryTag {
  return (RECOVERY_TAGS as readonly string[]).includes(tag);
}

export type RecoveryIntensity = 'Light' | 'Medium' | 'Firm';

export type RecoveryPercussivePass = {
  seconds: number;
  intensity: RecoveryIntensity;
};

/**
 * How long or how much for one block. Blocks are done sequentially in order.
 *
 * - `reps` — counted reps (or steps when `unit` is set)
 * - `reps_bilateral` — reps per side (left then right)
 * - `duration` — hold or stretch for a fixed time
 * - `duration_bilateral` — timed hold per side (left then right)
 * - `percussive` — timed passes at set intensity (e.g. Light then Medium)
 * - `percussive_bilateral` — same pass sequence on each side
 *
 * Optional `rounds` + `roundsLabel` cover cases like "each direction" or
 * "each position" on top of the base dose.
 */
export type RecoveryDose =
  | {
      kind: 'reps';
      count: number;
      unit?: 'reps' | 'steps';
      rounds?: number;
      roundsLabel?: string;
    }
  | {
      kind: 'reps_bilateral';
      countPerSide: number;
      unit?: 'reps' | 'steps';
    }
  | {
      kind: 'duration';
      seconds: number;
      rounds?: number;
      roundsLabel?: string;
    }
  | {
      kind: 'duration_bilateral';
      secondsPerSide: number;
      rounds?: number;
      roundsLabel?: string;
    }
  | {
      kind: 'percussive';
      passes: RecoveryPercussivePass[];
    }
  | {
      kind: 'percussive_bilateral';
      passes: RecoveryPercussivePass[];
    };

export type RecoveryBlock = {
  name: string;
  videoId?: string | null;
  instructions?: string;
  dose: RecoveryDose;
};

/** Bundled recovery row in `recovery_data.ts`. */
export type RecoverySource = {
  id: string;
  title: string;
  description: string;
  difficulty:
    | 'Beginner'
    | 'Intermediate'
    | 'Advanced'
    | 'Multiple Difficulties';
  estimatedTime: number;
  tags: RecoveryTag[];
  equipment: RecoveryEquipment[];
  isPremium: boolean;
  partner?: boolean;
  blocks: RecoveryBlock[];
};

export type Recovery = RecoverySource;
