import type { Ionicons } from '@expo/vector-icons';

export type RestDayActivitySuggestion = {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
};

/** One explicit bundle of optional extras for a rest day slot in the week. */
export type RestDaySuggestionSet = {
  /** Shown above mobility — why these picks fit this rest day. */
  context: string;
  recoveryIds: string[];
  /** Standalone workouts safe to try without wrecking the next session. */
  workoutIds: string[];
  /** Skill lab workouts — framed as curiosity, not homework. */
  skillWorkoutIds: string[];
  activities: RestDayActivitySuggestion[];
};

export type ProgramRestDaySuggestions = {
  sets: RestDaySuggestionSet[];
};
