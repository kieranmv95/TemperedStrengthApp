// AsyncStorage key constants shared across the storage domain modules.

export const PROGRAM_STORAGE_KEY = 'active_program';
export const PROGRAM_START_DATE_KEY = 'program_start_date';
export const PROGRAM_WORKOUT_WEEKDAYS_KEY = 'program_workout_weekdays';
export const PROGRAM_SESSION_SHIFTS_KEY = 'program_session_shifts';
export const EXERCISE_SWAPS_KEY = 'exercise_swaps';
export const WORKOUT_LOGS_KEY = 'workout_logs';
export const CUSTOM_SET_COUNTS_KEY = 'custom_set_counts';
export const SWAP_COUNT_KEY = 'swap_count';
export const SWAP_COUNT_MONTH_KEY = 'swap_count_month';
export const SWAP_COUNT_STATE_KEY = 'swap_count_state';
export const WORKOUT_NOTES_KEY = 'workout_notes';
export const FAVORITE_WORKOUTS_KEY = 'favorite_workouts';
export const FAVORITE_ARTICLES_KEY = 'favorite_articles';
export const REST_TIMER_KEY = 'rest_timer';
export const ACTIVE_SESSION_KEY = 'active_session';
export const COMPLETED_SESSIONS_KEY = 'completed_sessions';
export const CONDITIONING_WORKOUT_LOGS_KEY = 'conditioning_workout_logs';
export const STANDALONE_WORKOUT_LOGS_KEY = 'standalone_workout_logs';
export const PERSONAL_BESTS_KEY = 'personal_bests';
export const WEIGHT_UNIT_KEY = 'weight_unit';
export const AUTO_REST_TIMERS_ENABLED_KEY = 'auto_rest_timers_enabled';
export const AUTO_PB_DETECTION_IN_PROGRAMS_ENABLED_KEY =
  'auto_pb_detection_in_programs_enabled';
export const PROGRAM_WARMUP_MODULE_ENABLED_KEY =
  'program_warmup_module_enabled';
export const PROGRAM_COOLDOWN_MODULE_ENABLED_KEY =
  'program_cooldown_module_enabled';
export const PROGRAM_SHOW_START_SESSION_BUTTON_KEY =
  'program_show_start_session_button';
export const ONBOARDED_KEY = 'onboarded';
export const ONBOARDING_PROFILE_KEY = 'onboarding_profile';

/**
 * Per-device schema version used by the migration runner. This must never sync
 * (each device migrates its own local store), so it is excluded from iCloud
 * mirroring in `src/sync/constants.ts`.
 */
export const SCHEMA_VERSION_KEY = 'storage_schema_version';
