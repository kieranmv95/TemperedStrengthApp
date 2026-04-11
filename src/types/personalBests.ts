export type RepMax = 1 | 2 | 3 | 5 | 10 | 15 | 20;

/** Single logged PB event (append-only history). */
export type PersonalBestHistoryEntry = {
  id: string;
  weight: number;
  achievedAt: string;
};

/**
 * Per exercise: each rep tier has a list of historical entries (newest events appended).
 */
export type ExercisePersonalBestsLedger = Partial<
  Record<RepMax, PersonalBestHistoryEntry[]>
>;

export type PersonalBestsStore = Record<number, ExercisePersonalBestsLedger>;

/** Derived “current best” for display (max weight; tie-break latest date). */
export type PersonalBestEntry = {
  weight: number;
  achievedAt: string;
};
