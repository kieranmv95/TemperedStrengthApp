import type { WorkoutLogSchema } from '@/src/types/workouts';

/** Used when a template has no structured benchmark (AMRAP, time, etc.). */
export const DEFAULT_WORKOUT_LOG_SCHEMA: WorkoutLogSchema = {
  kind: 'notes_only',
  placeholder: 'How did the session go?',
};

/**
 * Per-workout logging. IDs match bundled JSON (`f_*`, `p_*`).
 * Workouts not listed fall back to {@link DEFAULT_WORKOUT_LOG_SCHEMA} (notes only).
 */
export const STANDALONE_LOG_SCHEMA_BY_ID: Record<string, WorkoutLogSchema> = {
  // Free — benchmarks & conditioning
  f_01: {
    kind: 'amrap',
    timeCapMinutes: 15,
    roundsLabel: 'Rounds',
    extraRepsLabel: 'Extra reps',
  },
  f_02: {
    kind: 'max_reps',
    label: 'Last completed round',
    higherIsBetter: true,
  },
  f_04: {
    kind: 'duration',
    label: 'Finish time',
    lowerIsBetter: true,
  },
  f_06: {
    kind: 'max_reps',
    label: 'Max pushups (best set)',
    higherIsBetter: true,
  },
  f_07: {
    kind: 'duration',
    label: '500m time',
    lowerIsBetter: true,
  },
  f_09: {
    kind: 'duration',
    label: 'Finish time',
    lowerIsBetter: true,
  },
  f_15: {
    kind: 'amrap',
    timeCapMinutes: 10,
    roundsLabel: 'Rounds',
    extraRepsLabel: 'Extra reps',
  },
  f_20: {
    kind: 'duration',
    label: '1000m time',
    lowerIsBetter: true,
  },
  f_24: {
    kind: 'max_reps',
    label: 'Calories per working minute',
    higherIsBetter: true,
  },

  // Pro — benchmarks & metcons
  p_01: {
    kind: 'duration',
    label: 'Total time (all rounds)',
    lowerIsBetter: true,
  },
  p_03: {
    kind: 'duration',
    label: 'Finish time',
    lowerIsBetter: true,
  },
  p_05: {
    kind: 'duration',
    label: '4000m time',
    lowerIsBetter: true,
  },
  p_07: {
    kind: 'duration',
    label: 'Finish time',
    lowerIsBetter: true,
  },
  p_08: {
    kind: 'duration',
    label: '1600m carry time',
    lowerIsBetter: true,
  },
  p_11: {
    kind: 'duration',
    label: 'Finish time',
    lowerIsBetter: true,
  },
  p_12: {
    kind: 'duration',
    label: 'Finish time',
    lowerIsBetter: true,
  },
  p_14: {
    kind: 'duration',
    label: 'Finish time',
    lowerIsBetter: true,
  },
  p_17: {
    kind: 'duration',
    label: '5000m time',
    lowerIsBetter: true,
  },
  p_18: {
    kind: 'duration',
    label: 'Finish time',
    lowerIsBetter: true,
  },
  p_20: {
    kind: 'duration',
    label: 'Finish time',
    lowerIsBetter: true,
  },
};
