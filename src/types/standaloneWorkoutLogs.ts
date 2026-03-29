/** Logged result — `kind` matches `WorkoutLogSchema.kind` (except `none`). */
export type StandaloneLogPayload =
  | { kind: 'duration'; durationSeconds: number }
  | { kind: 'amrap'; rounds: number; extraReps: number }
  | { kind: 'max_reps'; reps: number }
  | { kind: 'distance'; value: number }
  | { kind: 'notes_only'; text: string };

export type StandaloneWorkoutLogEntry = {
  id: string;
  workoutId: string;
  loggedAt: string;
  updatedAt: string;
  payload: StandaloneLogPayload;
  notes?: string;
};

/** workoutId -> entries, newest first */
export type StandaloneWorkoutLogsStore = {
  [workoutId: string]: StandaloneWorkoutLogEntry[];
};
