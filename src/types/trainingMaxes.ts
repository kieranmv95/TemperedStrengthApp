/**
 * Per-lift training maxes for programs that require them (e.g. Wendler 5/3/1).
 * Keyed by exercise id, stored as the canonical weight in kilograms.
 */
export type TrainingMaxesStore = Record<number, number>;
