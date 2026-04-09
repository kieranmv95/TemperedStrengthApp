import AsyncStorage from '@react-native-async-storage/async-storage';

import type {
  ActiveSession,
  CompletedSessions,
  CustomSetCounts,
  ExerciseSwaps,
  RestTimerState,
  WorkoutLogs,
  WorkoutNotes,
} from '@/src/types/storage';
import type { StandaloneWorkoutLogsStore } from '@/src/types/standaloneWorkoutLogs';

import type { DomainPayloadMap, ProgramStatePayload } from './registry';
import { DOMAIN_SCHEMA_VERSION, type DomainEnvelope, type ICloudDomainName } from './domains';

const KEY_ACTIVE_PROGRAM = 'active_program';
const KEY_PROGRAM_START_DATE = 'program_start_date';
const KEY_PROGRAM_WORKOUT_WEEKDAYS = 'program_workout_weekdays';
const KEY_EXERCISE_SWAPS = 'exercise_swaps';
const KEY_WORKOUT_LOGS = 'workout_logs';
const KEY_CUSTOM_SET_COUNTS = 'custom_set_counts';
const KEY_SWAP_COUNT = 'swap_count';
const KEY_SWAP_COUNT_MONTH = 'swap_count_month';
const KEY_WORKOUT_NOTES = 'workout_notes';
const KEY_FAVORITE_WORKOUTS = 'favorite_workouts';
const KEY_REST_TIMER = 'rest_timer';
const KEY_ACTIVE_SESSION = 'active_session';
const KEY_COMPLETED_SESSIONS = 'completed_sessions';
const KEY_STANDALONE_WORKOUT_LOGS = 'standalone_workout_logs';
const KEY_TRACKED_METRICS = 'tracked_metrics';

const KEY_ICLOUD_DOMAIN_UPDATED_AT_PREFIX = 'icloud_domain_updated_at__';

function domainUpdatedAtKey(domain: ICloudDomainName): string {
  return `${KEY_ICLOUD_DOMAIN_UPDATED_AT_PREFIX}${domain}`;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function safeJsonParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function readUpdatedAtIso(domain: ICloudDomainName): Promise<string> {
  const raw = await AsyncStorage.getItem(domainUpdatedAtKey(domain));
  return raw ?? '1970-01-01T00:00:00.000Z';
}

export async function markDomainUpdatedAt(domain: ICloudDomainName, iso: string): Promise<void> {
  await AsyncStorage.setItem(domainUpdatedAtKey(domain), iso);
}

export async function readLocalDomainEnvelope<K extends ICloudDomainName>(args: {
  domain: K;
  deviceId: string;
}): Promise<DomainEnvelope<DomainPayloadMap[K]>> {
  const updatedAt = await readUpdatedAtIso(args.domain);

  switch (args.domain) {
    case 'meta': {
      // Meta is managed by sync service, stored only in iCloud (not in AsyncStorage).
      return {
        schemaVersion: DOMAIN_SCHEMA_VERSION,
        updatedAt,
        deviceId: args.deviceId,
        payload: { lastSyncAt: null } as DomainPayloadMap[K],
      };
    }

    case 'program_state': {
      const [activeProgramId, programStartDate, programWorkoutWeekdaysRaw] =
        await AsyncStorage.multiGet([
          KEY_ACTIVE_PROGRAM,
          KEY_PROGRAM_START_DATE,
          KEY_PROGRAM_WORKOUT_WEEKDAYS,
        ]);

      const payload: ProgramStatePayload = {
        activeProgramId: activeProgramId?.[1] ?? null,
        programStartDate: programStartDate?.[1] ?? null,
        programWorkoutWeekdays: safeJsonParse<string[] | null>(
          programWorkoutWeekdaysRaw?.[1] ?? null,
          null
        ),
      };

      return {
        schemaVersion: DOMAIN_SCHEMA_VERSION,
        updatedAt,
        deviceId: args.deviceId,
        payload: payload as DomainPayloadMap[K],
      };
    }

    case 'program_quota': {
      const [swapCount, swapCountMonth] = await AsyncStorage.multiGet([
        KEY_SWAP_COUNT,
        KEY_SWAP_COUNT_MONTH,
      ]);
      const payload = {
        swapCount: swapCount?.[1] ? Number.parseInt(swapCount[1], 10) : 0,
        swapCountMonth: swapCountMonth?.[1]
          ? Number.parseInt(swapCountMonth[1], 10)
          : 0,
      };
      return {
        schemaVersion: DOMAIN_SCHEMA_VERSION,
        updatedAt,
        deviceId: args.deviceId,
        payload: payload as DomainPayloadMap[K],
      };
    }

    case 'program_favorites': {
      const raw = await AsyncStorage.getItem(KEY_FAVORITE_WORKOUTS);
      const favorites = safeJsonParse<string[]>(raw, []);
      return {
        schemaVersion: DOMAIN_SCHEMA_VERSION,
        updatedAt,
        deviceId: args.deviceId,
        payload: { favorites } as DomainPayloadMap[K],
      };
    }

    case 'program_swaps': {
      const raw = await AsyncStorage.getItem(KEY_EXERCISE_SWAPS);
      const swaps = safeJsonParse<ExerciseSwaps>(raw, {});
      return {
        schemaVersion: DOMAIN_SCHEMA_VERSION,
        updatedAt,
        deviceId: args.deviceId,
        payload: swaps as DomainPayloadMap[K],
      };
    }

    case 'program_customSetCounts': {
      const raw = await AsyncStorage.getItem(KEY_CUSTOM_SET_COUNTS);
      const counts = safeJsonParse<CustomSetCounts>(raw, {});
      return {
        schemaVersion: DOMAIN_SCHEMA_VERSION,
        updatedAt,
        deviceId: args.deviceId,
        payload: counts as DomainPayloadMap[K],
      };
    }

    case 'program_notes': {
      const raw = await AsyncStorage.getItem(KEY_WORKOUT_NOTES);
      const notes = safeJsonParse<WorkoutNotes>(raw, {});
      return {
        schemaVersion: DOMAIN_SCHEMA_VERSION,
        updatedAt,
        deviceId: args.deviceId,
        payload: notes as DomainPayloadMap[K],
      };
    }

    case 'program_restTimer': {
      const raw = await AsyncStorage.getItem(KEY_REST_TIMER);
      const timer = safeJsonParse<RestTimerState | null>(raw, null);
      return {
        schemaVersion: DOMAIN_SCHEMA_VERSION,
        updatedAt,
        deviceId: args.deviceId,
        payload: timer as DomainPayloadMap[K],
      };
    }

    case 'program_activeSession': {
      const raw = await AsyncStorage.getItem(KEY_ACTIVE_SESSION);
      const session = safeJsonParse<ActiveSession | null>(raw, null);
      return {
        schemaVersion: DOMAIN_SCHEMA_VERSION,
        updatedAt,
        deviceId: args.deviceId,
        payload: session as DomainPayloadMap[K],
      };
    }

    case 'program_completedSessions': {
      const raw = await AsyncStorage.getItem(KEY_COMPLETED_SESSIONS);
      const sessions = safeJsonParse<CompletedSessions>(raw, {});
      return {
        schemaVersion: DOMAIN_SCHEMA_VERSION,
        updatedAt,
        deviceId: args.deviceId,
        payload: sessions as DomainPayloadMap[K],
      };
    }

    case 'program_workoutLogs': {
      const raw = await AsyncStorage.getItem(KEY_WORKOUT_LOGS);
      const logs = safeJsonParse<WorkoutLogs>(raw, {});
      return {
        schemaVersion: DOMAIN_SCHEMA_VERSION,
        updatedAt,
        deviceId: args.deviceId,
        payload: logs as DomainPayloadMap[K],
      };
    }

    case 'standalone_logs': {
      const raw = await AsyncStorage.getItem(KEY_STANDALONE_WORKOUT_LOGS);
      const store = safeJsonParse<StandaloneWorkoutLogsStore>(raw, {});
      return {
        schemaVersion: DOMAIN_SCHEMA_VERSION,
        updatedAt,
        deviceId: args.deviceId,
        payload: store as DomainPayloadMap[K],
      };
    }

    case 'metrics_tracked': {
      const raw = await AsyncStorage.getItem(KEY_TRACKED_METRICS);
      const parsed = safeJsonParse<unknown>(raw, {});
      const tracked = isPlainObject(parsed) ? (parsed as Record<string, number>) : {};
      return {
        schemaVersion: DOMAIN_SCHEMA_VERSION,
        updatedAt,
        deviceId: args.deviceId,
        payload: { tracked } as DomainPayloadMap[K],
      };
    }
  }
}

export async function writeLocalDomainPayload<K extends ICloudDomainName>(args: {
  domain: K;
  payload: DomainPayloadMap[K];
  updatedAtIso: string;
}): Promise<void> {
  await markDomainUpdatedAt(args.domain, args.updatedAtIso);

  switch (args.domain) {
    case 'meta':
      return;
    case 'program_state': {
      const p = args.payload as DomainPayloadMap['program_state'];
      const ops: [string, string][] = [];
      if (p.activeProgramId === null) {
        await AsyncStorage.removeItem(KEY_ACTIVE_PROGRAM);
      } else {
        ops.push([KEY_ACTIVE_PROGRAM, p.activeProgramId]);
      }
      if (p.programStartDate === null) {
        await AsyncStorage.removeItem(KEY_PROGRAM_START_DATE);
      } else {
        ops.push([KEY_PROGRAM_START_DATE, p.programStartDate]);
      }
      if (p.programWorkoutWeekdays === null) {
        await AsyncStorage.removeItem(KEY_PROGRAM_WORKOUT_WEEKDAYS);
      } else {
        ops.push([KEY_PROGRAM_WORKOUT_WEEKDAYS, JSON.stringify(p.programWorkoutWeekdays)]);
      }
      if (ops.length > 0) await AsyncStorage.multiSet(ops);
      return;
    }
    case 'program_quota': {
      const p = args.payload as DomainPayloadMap['program_quota'];
      await AsyncStorage.multiSet([
        [KEY_SWAP_COUNT, p.swapCount.toString()],
        [KEY_SWAP_COUNT_MONTH, p.swapCountMonth.toString()],
      ]);
      return;
    }
    case 'program_favorites': {
      const p = args.payload as DomainPayloadMap['program_favorites'];
      await AsyncStorage.setItem(KEY_FAVORITE_WORKOUTS, JSON.stringify(p.favorites ?? []));
      return;
    }
    case 'program_swaps':
      await AsyncStorage.setItem(KEY_EXERCISE_SWAPS, JSON.stringify(args.payload as ExerciseSwaps));
      return;
    case 'program_customSetCounts':
      await AsyncStorage.setItem(
        KEY_CUSTOM_SET_COUNTS,
        JSON.stringify(args.payload as CustomSetCounts)
      );
      return;
    case 'program_notes':
      await AsyncStorage.setItem(KEY_WORKOUT_NOTES, JSON.stringify(args.payload as WorkoutNotes));
      return;
    case 'program_restTimer': {
      const p = args.payload as RestTimerState | null;
      if (!p) {
        await AsyncStorage.removeItem(KEY_REST_TIMER);
      } else {
        await AsyncStorage.setItem(KEY_REST_TIMER, JSON.stringify(p));
      }
      return;
    }
    case 'program_activeSession': {
      const p = args.payload as ActiveSession | null;
      if (!p) {
        await AsyncStorage.removeItem(KEY_ACTIVE_SESSION);
      } else {
        await AsyncStorage.setItem(KEY_ACTIVE_SESSION, JSON.stringify(p));
      }
      return;
    }
    case 'program_completedSessions':
      await AsyncStorage.setItem(
        KEY_COMPLETED_SESSIONS,
        JSON.stringify(args.payload as CompletedSessions)
      );
      return;
    case 'program_workoutLogs':
      await AsyncStorage.setItem(KEY_WORKOUT_LOGS, JSON.stringify(args.payload as WorkoutLogs));
      return;
    case 'standalone_logs':
      await AsyncStorage.setItem(
        KEY_STANDALONE_WORKOUT_LOGS,
        JSON.stringify(args.payload as StandaloneWorkoutLogsStore)
      );
      return;
    case 'metrics_tracked': {
      const p = args.payload as DomainPayloadMap['metrics_tracked'];
      await AsyncStorage.setItem(KEY_TRACKED_METRICS, JSON.stringify(p.tracked ?? {}));
      return;
    }
  }
}

