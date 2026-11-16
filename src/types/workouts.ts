import type { ImageSourcePropType } from 'react-native';
import type { GymTimerConfig } from './gymTimer';
import type { HeartRateZoneId } from './heartRate';

/** How the session trains you. A workout can have several; the first is its primary. */
export const WORKOUT_DISCIPLINES = [
  'Metcon',
  'Strength',
  'Olympic Lifting',
  'Gymnastics',
  'Conditioning',
  'Hyrox',
  'Skills',
] as const;

/** Body area the session loads most. */
export const WORKOUT_BODY_FOCUSES = [
  'Full Body',
  'Upper Body',
  'Lower Body',
  'Core',
] as const;

/** Workout structure. Set-based strength and skill sessions have none. */
export const WORKOUT_FORMATS = [
  'AMRAP',
  'EMOM',
  'For Time',
  'Intervals',
  'Tabata',
  'Chipper',
  'Ladder',
] as const;

export const WORKOUT_LEVELS = ['Beginner', 'Intermediate', 'Advanced'] as const;

/** Curated sets that cut across disciplines. */
export const WORKOUT_COLLECTIONS = [
  'CrossFit Benchmarks',
  'Benchmarks',
] as const;

export type WorkoutDiscipline = (typeof WORKOUT_DISCIPLINES)[number];
export type WorkoutBodyFocus = (typeof WORKOUT_BODY_FOCUSES)[number];
export type WorkoutFormat = (typeof WORKOUT_FORMATS)[number];
export type WorkoutLevel = (typeof WORKOUT_LEVELS)[number];
export type WorkoutCollection = (typeof WORKOUT_COLLECTIONS)[number];

/** `only` needs a partner; `option` has a partner version alongside solo. */
export type WorkoutPartner = 'only' | 'option';

/** Event series a workout belongs to, independent of its training category. */
export type WorkoutSpecial =
  'Death By Beth' | 'Rainhill' | 'Girl Games' | 'Arena';

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
  /** Event series, shown as a badge and used by the Events tiles. */
  special?: WorkoutSpecial;
  estimatedTime: number;
  /** At least one. The first is the primary, shown on cards. */
  disciplines: WorkoutDiscipline[];
  bodyFocus: WorkoutBodyFocus[];
  format?: WorkoutFormat;
  levels: WorkoutLevel[];
  collections?: WorkoutCollection[];
  /** Equipment required for this workout; empty when bodyweight / no gear. */
  equipment: WorkoutEquipment[];
  isPremium: boolean;
  logSchema: WorkoutLogSchema;
  /**
   * When premium, these roles may still access the workout without Pro
   * (e.g. `coach` for skill sessions).
   */
  allowedRoles?: string[];
  partner?: WorkoutPartner;
  /** Present when the workout is a collaboration; surfaced on the detail screen and Collab discipline. */
  collab?: WorkoutCollab;
  /**
   * Gym clock for WODs / metcons. Omit on strength and untimed sessions.
   * Launcher stamps `source` at start time.
   */
  timerConfig?: GymTimerConfig;
  blocks: StandaloneWorkoutSource['blocks'];
};

/** Optional partner/collaborator credit shown on a workout and used by the Collab discipline. */
export type WorkoutCollab = {
  name: string;
  description: string;
  link: string;
  linkCopy?: string;
  image?: ImageSourcePropType;
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
  /** Heart rate zone the block targets; shows the zone widget. */
  hrZone?: HeartRateZoneId;
  instructions?: string;
  highlightInstructions?: string;
  movements?: WorkoutMovement[];
  /** Block the user can skip, e.g. Additional Work. */
  optional?: boolean;
};

/** Bundled workout row in `workout_data.ts` before `logSchema` is merged in `workouts.ts`. */
export type StandaloneWorkoutSource = {
  id: string;
  title: string;
  description: string;
  special?: WorkoutSpecial;
  estimatedTime: number;
  disciplines: WorkoutDiscipline[];
  bodyFocus: WorkoutBodyFocus[];
  format?: WorkoutFormat;
  levels: WorkoutLevel[];
  collections?: WorkoutCollection[];
  equipment: WorkoutEquipment[];
  isPremium: boolean;
  allowedRoles?: string[];
  partner?: WorkoutPartner;
  collab?: WorkoutCollab;
  /** Wins over `STANDALONE_LOG_SCHEMA_BY_ID` when set. */
  logSchema?: WorkoutLogSchema;
  /** Gym clock for WODs / metcons. Omit on strength and untimed sessions. */
  timerConfig?: GymTimerConfig;
  blocks:
    | WorkoutBlockBase[]
    | {
        scale: string;
        mobilityFlow?: string;
        highlightInstructions?: string;
        blocks: WorkoutBlockBase[];
      }[];
};

/** A Tempered Daily week is themed by a discipline or a body area. */
export type WorkoutWeekFocus = WorkoutDiscipline | WorkoutBodyFocus;

/** One released week of Tempered Daily. Only the current week is ever shown. */
export type TemperedDailyWeek = {
  id: string;
  /** ISO date of the Monday this week drops (00:01 device local time). */
  weekStart: string;
  blockName: string;
  theme: string;
  phase: string;
  description: string;
  primaryFocus: WorkoutWeekFocus;
  otherFocuses: WorkoutWeekFocus[];
  /** Shown as "Next week's focus" on the week view. */
  nextWeekFocus?: string;
  /** Exactly 7 entries, Monday → Sunday. `null` = rest day. */
  days: (string | null)[];
};
