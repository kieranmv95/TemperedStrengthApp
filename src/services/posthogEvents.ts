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
    moveSessionOpened: 'program_move_session_opened',
    moveSessionCancelled: 'program_move_session_cancelled',
    moveSessionConfirmClicked: 'program_move_session_confirm_clicked',
    moveSessionSucceeded: 'program_move_session_succeeded',
    moveSessionFailed: 'program_move_session_failed',
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
    toolView: 'tool_view',
    toolCalculate: 'tool_calculate',
    togetherWeLiftSheetOpened: 'together_we_lift_sheet_opened',
    togetherWeLiftLinkPressed: 'together_we_lift_link_pressed',
  },
  home: {
    /** User tapped a navigation target from the Home tab body. */
    linkPressed: 'home_link_pressed',
    /** User tapped a sponsor / affiliate CTA. */
    sponsorCtaPressed: 'home_sponsor_cta_pressed',
  },
  app: {
    settingChanged: 'setting_changed',
    notesCopied: 'notes_copied',
    notesCopyModalOpened: 'notes_copy_modal_opened',
    notesCopyModalClosed: 'notes_copy_modal_closed',
    notesCopyClicked: 'notes_copy_clicked',
    notesCopyReplacePromptShown: 'notes_copy_replace_prompt_shown',
    notesCopyReplaceConfirmed: 'notes_copy_replace_confirmed',
    notesCopyReplaceCancelled: 'notes_copy_replace_cancelled',
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
