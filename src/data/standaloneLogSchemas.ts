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

  // ---------------------------------------------------------------------------
  // CrossFit-style (WOD) — Free
  // ---------------------------------------------------------------------------
  f_30: {
    kind: 'amrap',
    timeCapMinutes: 20,
    roundsLabel: 'Rounds',
    extraRepsLabel: 'Extra reps',
  },
  f_31: { kind: 'duration', label: 'Finish time', lowerIsBetter: true },
  f_32: { kind: 'duration', label: 'Finish time', lowerIsBetter: true },
  f_33: { kind: 'duration', label: 'Finish time', lowerIsBetter: true },
  f_34: { kind: 'duration', label: 'Finish time', lowerIsBetter: true },
  f_35: { kind: 'duration', label: 'Finish time', lowerIsBetter: true },
  f_36: { kind: 'duration', label: 'Finish time', lowerIsBetter: true },
  f_37: { kind: 'duration', label: 'Finish time', lowerIsBetter: true },
  f_38: { kind: 'duration', label: 'Finish time', lowerIsBetter: true },
  f_39: { kind: 'duration', label: 'Finish time', lowerIsBetter: true },
  f_40: { kind: 'duration', label: 'Finish time', lowerIsBetter: true },
  f_41: { kind: 'duration', label: 'Finish time', lowerIsBetter: true },
  f_42: {
    kind: 'duration',
    label: 'Total time (all rounds)',
    lowerIsBetter: true,
  },
  f_43: {
    kind: 'max_reps',
    label: 'Last completed minute',
    higherIsBetter: true,
  },
  f_44: { kind: 'max_reps', label: 'Total reps', higherIsBetter: true },
  f_45: { kind: 'max_reps', label: 'Total rounds', higherIsBetter: true },
  f_46: { kind: 'duration', label: 'Finish time', lowerIsBetter: true },
  f_47: { kind: 'duration', label: 'Finish time', lowerIsBetter: true },
  f_48: { kind: 'max_reps', label: 'Total reps', higherIsBetter: true },
  f_49: { kind: 'duration', label: 'Finish time', lowerIsBetter: true },

  // ---------------------------------------------------------------------------
  // Hyrox-style — Free
  // ---------------------------------------------------------------------------
  f_50: { kind: 'duration', label: 'Total time', lowerIsBetter: true },
  f_51: {
    kind: 'notes_only',
    placeholder: 'Record sled loads, notes, and how it felt.',
  },
  f_52: { kind: 'max_reps', label: 'Total reps', higherIsBetter: true },
  f_53: { kind: 'max_reps', label: 'Total reps', higherIsBetter: true },
  f_54: { kind: 'duration', label: 'Total time', lowerIsBetter: true },
  f_55: { kind: 'duration', label: 'Total time', lowerIsBetter: true },
  f_56: { kind: 'duration', label: '2000m time', lowerIsBetter: true },
  f_57: { kind: 'duration', label: 'Total time', lowerIsBetter: true },
  f_58: { kind: 'duration', label: 'Total time', lowerIsBetter: true },
  f_59: { kind: 'duration', label: 'Total time', lowerIsBetter: true },
  f_60: { kind: 'duration', label: 'Total time', lowerIsBetter: true },
  f_61: {
    kind: 'notes_only',
    placeholder: 'Record sled load, rest, and completion notes.',
  },
  f_62: {
    kind: 'notes_only',
    placeholder: 'Record sled load, rest, and completion notes.',
  },
  f_63: { kind: 'duration', label: 'Total time', lowerIsBetter: true },
  f_64: {
    kind: 'amrap',
    timeCapMinutes: 12,
    roundsLabel: 'Rounds',
    extraRepsLabel: 'Extra reps',
  },
  f_65: { kind: 'duration', label: 'Finish time', lowerIsBetter: true },
  f_66: { kind: 'duration', label: 'Total time', lowerIsBetter: true },
  f_67: { kind: 'duration', label: 'Finish time', lowerIsBetter: true },
  f_68: { kind: 'duration', label: 'Finish time', lowerIsBetter: true },
  f_69: { kind: 'duration', label: 'Finish time', lowerIsBetter: true },

  // ---------------------------------------------------------------------------
  // CrossFit-style (WOD) — Pro
  // ---------------------------------------------------------------------------
  p_26: { kind: 'duration', label: 'Finish time', lowerIsBetter: true },
  p_27: { kind: 'duration', label: 'Finish time', lowerIsBetter: true },
  p_28: {
    kind: 'amrap',
    timeCapMinutes: 20,
    roundsLabel: 'Rounds',
    extraRepsLabel: 'Extra reps',
  },
  p_29: { kind: 'duration', label: 'Finish time', lowerIsBetter: true },
  p_30: { kind: 'duration', label: 'Finish time', lowerIsBetter: true },

  // ---------------------------------------------------------------------------
  // Hyrox-style — Pro
  // ---------------------------------------------------------------------------
  p_31: { kind: 'duration', label: 'Finish time', lowerIsBetter: true },
  p_32: {
    kind: 'notes_only',
    placeholder: 'Record sled loads and how the session felt.',
  },
  p_33: { kind: 'duration', label: 'Finish time', lowerIsBetter: true },
  p_34: { kind: 'duration', label: 'Finish time', lowerIsBetter: true },
  p_35: { kind: 'duration', label: 'Finish time', lowerIsBetter: true },
  p_36: { kind: 'duration', label: 'Finish time', lowerIsBetter: true },
};
