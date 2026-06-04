// Barrel for the storage layer.
//
// The implementation lives in per-domain modules under `storage/`. This file is
// kept as `storage.ts` (which module resolution prefers over the `storage/`
// directory) so every existing `@/src/utils/storage` import keeps working.
export * from './storage/settings';
export * from './storage/programState';
export * from './storage/workoutLogs';
export * from './storage/sessions';
export * from './storage/conditioning';
export * from './storage/favorites';
export * from './storage/standaloneLogs';
export * from './storage/personalBests';
export {
  runStorageMigrations,
  LATEST_SCHEMA_VERSION,
} from './storage/migrations';

export type {
  ActiveSession,
  CompletedSession,
  CompletedSessions,
  ConditioningWorkoutLogs,
  CustomSetCounts,
  ExerciseSwap,
  ExerciseSwaps,
  LoggedSet,
  RestTimerState,
  WorkoutLogs,
  WorkoutNotes,
} from '@/src/types/storage';
export type {
  StandaloneLogPayload,
  StandaloneWorkoutLogEntry,
  StandaloneWorkoutLogsStore,
} from '@/src/types/standaloneWorkoutLogs';
export type {
  ExercisePersonalBestsLedger,
  PersonalBestsStore,
  PersonalBestHistoryEntry,
  RepMax,
} from '@/src/types/personalBests';
