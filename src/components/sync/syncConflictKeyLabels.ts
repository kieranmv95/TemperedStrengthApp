/** Friendly titles for AsyncStorage keys shown in iCloud conflict UI. */
const STORAGE_KEY_LABELS: Record<string, string> = {
  active_program: 'Active program',
  program_start_date: 'Program start date',
  program_workout_weekdays: 'Workout weekdays',
  program_session_shifts: 'Session shifts',
  exercise_swaps: 'Exercise swaps',
  workout_logs: 'Workout logs',
  custom_set_counts: 'Custom set counts',
  swap_count: 'Swap count',
  swap_count_month: 'Swap count month',
  workout_notes: 'Workout notes',
  favorite_workouts: 'Favorite workouts',
  favorite_articles: 'Favorite articles',
  favorite_partners: 'Saved partners',
  rest_timer: 'Rest timer',
  active_session: 'Active session',
  completed_sessions: 'Completed sessions',
  conditioning_workout_logs: 'Conditioning logs',
  standalone_workout_logs: 'Standalone workout logs',
  personal_bests: 'Personal bests',
  weight_unit: 'Weight units',
  auto_rest_timers_enabled: 'Auto rest timers',
  auto_pb_detection_in_programs_enabled: 'Auto PB detection',
  program_warmup_module_enabled: 'Warm-up module',
  program_cooldown_module_enabled: 'Cool-down module',
  program_show_start_session_button: 'Start session button',
  onboarded: 'Onboarding state',
  onboarding_profile: 'Onboarding profile',
  icloud_sync_enabled: 'iCloud sync setting',
};

export function labelForSyncStorageKey(key: string): string {
  const mapped = STORAGE_KEY_LABELS[key];
  if (mapped) return mapped;
  return key
    .split('_')
    .map((w) => (w.length > 0 ? w[0].toUpperCase() + w.slice(1) : w))
    .join(' ');
}
