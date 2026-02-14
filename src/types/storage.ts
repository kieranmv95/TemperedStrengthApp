export interface ExerciseSwap {
  dayIndex: number;
  slotIndex: number;
  originalExerciseId: number;
  swappedExerciseId: number;
}

export interface ExerciseSwaps {
  [dayIndex: number]: {
    [slotIndex: number]: number; // swapped exercise ID
  };
}

export interface LoggedSet {
  weight: number | null;
  reps: number;
  state?: "completed" | "failed" | null;
}

export interface WorkoutLogs {
  [dayIndex: number]: {
    [slotIndex: number]: {
      [setIndex: number]: LoggedSet;
    };
  };
}

export interface CustomSetCounts {
  [dayIndex: number]: {
    [slotIndex: number]: number; // custom set count
  };
}

export interface WorkoutNotes {
  [dayIndex: number]: string; // notes for each workout day
}

export interface RestTimerState {
  dayIndex: number;
  slotIndex: number;
  exerciseId: number | null;
  restTimeSeconds: number;
  startedAt: number;
  status: "running" | "completed";
  completedAt?: number;
}
