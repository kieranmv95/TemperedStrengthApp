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
  startedAt: number;
  status: 'running' | 'completed';
  completedAt?: number;
};
