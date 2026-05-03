/**
 * PostHog event names (snake_case) and helpers for shared property shapes.
 */
export const posthogEventsNames = {
  onboarding: {
    skip: 'onboarding_skip',
    sectionSkip: 'onboarding_section_skip',
  },
  program: {
    sessionStarted: 'program_session_started',
    sessionFinished: 'program_session_finished',
    workoutRedo: 'program_workout_redo',
    swapClick: 'program_swap_click',
    swapAccept: 'program_swap_accept',
    exported: 'program_exported',
  },
  workout: {
    view: 'workout_view',
    favourite: 'workout_favourite',
    logged: 'workout_logged',
    filtersApplied: 'filters_applied',
  },
  pb: {
    logged: 'pb_logged',
    modalAccepted: 'pb_modal_accepted',
    modalDismissed: 'pb_modal_dismissed',
  },
  timer: {
    started: 'program_timer_started',
    dismissed: 'program_timer_dismissed',
    incremented: 'program_timer_incremented',
    decremented: 'program_timer_decremented',
  },
  content: {
    articleView: 'article_view',
    articleFavourite: 'article_favourite',
    glossaryView: 'glossary_view',
  },
  app: {
    settingChanged: 'setting_changed',
    notesCopied: 'notes_copied',
  },
} as const;

/** Maps program training day index to week/day blocks for analytics (1-based). */
export function analyticsWeekDayFromDayIndex(dayIndex: number): {
  week: number;
  day: number;
} {
  return {
    week: Math.floor(dayIndex / 7) + 1,
    day: (dayIndex % 7) + 1,
  };
}
