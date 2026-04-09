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

import {
  deepMergeWithWinnerByUpdatedAt,
  mergeDomainEnvelopes,
  mergeFavorites,
  type DomainEnvelope,
  type ICloudDomainName,
} from './domains';

export type ProgramStatePayload = {
  activeProgramId: string | null;
  programStartDate: string | null;
  programWorkoutWeekdays: string[] | null;
};

export type ProgramQuotaPayload = {
  swapCount: number;
  swapCountMonth: number; // 0-11
};

export type FavoritesPayload = {
  favorites: string[];
};

export type MetricsTrackedPayload = {
  tracked: Record<string, number>;
};

export type DomainPayloadMap = {
  meta: { lastSyncAt: string | null };
  program_state: ProgramStatePayload;
  program_quota: ProgramQuotaPayload;
  program_favorites: FavoritesPayload;
  program_swaps: ExerciseSwaps;
  program_customSetCounts: CustomSetCounts;
  program_notes: WorkoutNotes;
  program_restTimer: RestTimerState | null;
  program_activeSession: ActiveSession | null;
  program_completedSessions: CompletedSessions;
  program_workoutLogs: WorkoutLogs;
  standalone_logs: StandaloneWorkoutLogsStore;
  metrics_tracked: MetricsTrackedPayload;
};

export type MergeResult<T> = {
  merged: DomainEnvelope<T>;
  didChange: boolean;
};

function stableStringify(value: unknown): string {
  // Fast, deterministic enough for our JSON-like objects (plain objects/arrays/primitives).
  // We intentionally don't support cycles.
  if (value === null) return 'null';
  if (typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) {
    return `[${value.map((v) => stableStringify(v)).join(',')}]`;
  }
  const obj = value as Record<string, unknown>;
  const keys = Object.keys(obj).sort();
  return `{${keys
    .map((k) => `${JSON.stringify(k)}:${stableStringify(obj[k])}`)
    .join(',')}}`;
}

function envelopesEqual<T>(a: DomainEnvelope<T>, b: DomainEnvelope<T>): boolean {
  return stableStringify(a.payload) === stableStringify(b.payload);
}

function didChangeFromEither<T>(args: {
  merged: DomainEnvelope<T>;
  local: DomainEnvelope<T> | null;
  remote: DomainEnvelope<T> | null;
}): boolean {
  if (args.local) return !envelopesEqual(args.merged, args.local);
  if (args.remote) return !envelopesEqual(args.merged, args.remote);
  return false;
}

export const DOMAIN_REMOTE_PATHS: Record<ICloudDomainName, string> = {
  meta: 'meta.json',
  program_state: 'program/state.json',
  program_quota: 'program/quota.json',
  program_favorites: 'program/favorites.json',
  program_swaps: 'program/swaps.json',
  program_customSetCounts: 'program/customSetCounts.json',
  program_notes: 'program/notes.json',
  program_restTimer: 'program/restTimer.json',
  program_activeSession: 'program/activeSession.json',
  program_completedSessions: 'program/completedSessions.json',
  program_workoutLogs: 'program/workoutLogs.json',
  standalone_logs: 'standalone/logs.json',
  metrics_tracked: 'metrics/tracked.json',
};

export function mergeDomain<K extends ICloudDomainName>(args: {
  domain: K;
  local: DomainEnvelope<DomainPayloadMap[K]> | null;
  remote: DomainEnvelope<DomainPayloadMap[K]> | null;
  deviceId: string;
}): MergeResult<DomainPayloadMap[K]> {
  const { domain, local, remote, deviceId } = args;

  switch (domain) {
    case 'program_favorites': {
      const merged = mergeDomainEnvelopes({
        local,
        remote,
        deviceId,
        fallbackEmpty: () => ({ favorites: [] }),
        mergePayload: ({ local, remote }) => ({
          favorites: mergeFavorites({
            local: local.favorites ?? [],
            remote: remote.favorites ?? [],
          }),
        }),
      });
      return { merged, didChange: didChangeFromEither({ merged, local, remote }) };
    }

    case 'metrics_tracked': {
      const merged = mergeDomainEnvelopes({
        local,
        remote,
        deviceId,
        fallbackEmpty: () => ({ tracked: {} }),
        mergePayload: ({ local, remote }) => {
          const out: Record<string, number> = { ...(local.tracked ?? {}) };
          for (const [k, v] of Object.entries(remote.tracked ?? {})) {
            const lv = out[k];
            out[k] =
              typeof lv === 'number' && Number.isFinite(lv)
                ? Math.max(lv, v)
                : v;
          }
          return { tracked: out };
        },
      });
      return { merged, didChange: didChangeFromEither({ merged, local, remote }) };
    }

    case 'meta':
    case 'program_state':
    case 'program_quota':
    case 'program_swaps':
    case 'program_customSetCounts':
    case 'program_notes':
    case 'program_restTimer':
    case 'program_activeSession':
    case 'program_completedSessions':
    case 'program_workoutLogs':
    case 'standalone_logs': {
      const localUpdatedAtIso = local?.updatedAt;
      const remoteUpdatedAtIso = remote?.updatedAt;
      const merged = mergeDomainEnvelopes({
        local,
        remote,
        deviceId,
        fallbackEmpty: () => {
          switch (domain) {
            case 'meta':
              return { lastSyncAt: null } as DomainPayloadMap[K];
            case 'program_state':
              return {
                activeProgramId: null,
                programStartDate: null,
                programWorkoutWeekdays: null,
              } as DomainPayloadMap[K];
            case 'program_quota':
              return { swapCount: 0, swapCountMonth: 0 } as DomainPayloadMap[K];
            case 'program_restTimer':
            case 'program_activeSession':
              return null as DomainPayloadMap[K];
            case 'program_swaps':
            case 'program_customSetCounts':
            case 'program_notes':
            case 'program_completedSessions':
            case 'program_workoutLogs':
            case 'standalone_logs':
              return {} as DomainPayloadMap[K];
          }
        },
        mergePayload: ({ local, remote }) => {
          return deepMergeWithWinnerByUpdatedAt({
            local,
            remote,
            localUpdatedAtIso,
            remoteUpdatedAtIso,
          }) as DomainPayloadMap[K];
        },
      });

      return { merged, didChange: didChangeFromEither({ merged, local, remote }) };
    }
  }
}

