export type ExerciseSwap = {
  dayIndex: number;
  slotIndex: number;
  originalExerciseId: number;
  swappedExerciseId: number;
};

export type ExerciseSwaps = {
  [dayIndex: number]: {
    [slotIndex: number]: number; // swapped exercise ID
  };
};

export type LoggedSet = {
  weight: number | null;
  reps: number;
  state?: 'completed' | 'failed' | null;
};

export type WorkoutLogs = {
  [dayIndex: number]: {
    [slotIndex: number]: {
      [setIndex: number]: LoggedSet;
    };
  };
};

export type ConditioningBlockLog = {
  completed: boolean;
  completedAt?: number;
};

/**
 * Completion logs for conditioning-style workouts.
 * Keyed by program dayIndex, then by stable workout block id.
 */
export type ConditioningWorkoutLogs = {
  [dayIndex: number]: {
    [blockId: string]: ConditioningBlockLog;
  };
};

export type CustomSetCounts = {
  [dayIndex: number]: {
    [slotIndex: number]: number; // custom set count
  };
};

export type WorkoutNotes = {
  [dayIndex: number]: string; // notes for each workout day
};

export type RestTimerState = {
  dayIndex: number;
  slotIndex: number;
  exerciseId: number | null;
  restTimeSeconds: number;
  /**
   * Duration the timer was originally started with.
   * Used so "Restart" always resets to the original time even if the user adjusts
   * the timer mid-countdown.
   */
  originalRestTimeSeconds?: number;
  startedAt: number;
  status: 'running' | 'completed';
  completedAt?: number;
};

export type ActiveSession = {
  dayIndex: number;
  startedAt: number;
};

export type CompletedSession = {
  dayIndex: number;
  startedAt: number;
  completedAt: number;
  totalVolume: number;
  setsCompleted: number;
};

export type CompletedSessions = {
  [dayIndex: number]: CompletedSession;
};
