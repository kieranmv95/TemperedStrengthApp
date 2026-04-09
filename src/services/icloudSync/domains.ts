export type ICloudDomainName =
  | 'meta'
  | 'program_state'
  | 'program_quota'
  | 'program_favorites'
  | 'program_swaps'
  | 'program_customSetCounts'
  | 'program_notes'
  | 'program_restTimer'
  | 'program_activeSession'
  | 'program_completedSessions'
  | 'program_workoutLogs'
  | 'standalone_logs'
  | 'metrics_tracked';

export type DomainEnvelope<T> = {
  schemaVersion: 1;
  updatedAt: string; // ISO
  deviceId: string;
  payload: T;
};

export const DOMAIN_SCHEMA_VERSION = 1 as const;

export function createEnvelope<T>(args: {
  payload: T;
  updatedAt: string;
  deviceId: string;
}): DomainEnvelope<T> {
  return {
    schemaVersion: DOMAIN_SCHEMA_VERSION,
    updatedAt: args.updatedAt,
    deviceId: args.deviceId,
    payload: args.payload,
  };
}

export function isoNow(): string {
  return new Date().toISOString();
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseIsoMs(value: string | undefined): number {
  if (!value) return 0;
  const t = new Date(value).getTime();
  return Number.isFinite(t) ? t : 0;
}

/**
 * Deep-merge plain objects. For leaf conflicts, chooses the winner by comparing
 * `winnerUpdatedAtIso` timestamps (domain-level updatedAt).
 *
 * - Arrays are treated as leaf values (winner takes all).
 * - Non-plain objects are treated as leaf values.
 */
export function deepMergeWithWinnerByUpdatedAt(args: {
  local: unknown;
  remote: unknown;
  localUpdatedAtIso?: string;
  remoteUpdatedAtIso?: string;
}): unknown {
  const localIsObj = isPlainObject(args.local);
  const remoteIsObj = isPlainObject(args.remote);

  if (localIsObj && remoteIsObj) {
    const out: Record<string, unknown> = { ...args.local };
    for (const [key, remoteValue] of Object.entries(args.remote)) {
      if (!(key in out)) {
        out[key] = remoteValue;
        continue;
      }

      out[key] = deepMergeWithWinnerByUpdatedAt({
        local: out[key],
        remote: remoteValue,
        localUpdatedAtIso: args.localUpdatedAtIso,
        remoteUpdatedAtIso: args.remoteUpdatedAtIso,
      });
    }
    return out;
  }

  // Leaf conflict: pick the payload from whichever envelope is newer.
  const localMs = parseIsoMs(args.localUpdatedAtIso);
  const remoteMs = parseIsoMs(args.remoteUpdatedAtIso);
  return remoteMs > localMs ? args.remote : args.local;
}

export function mergeFavorites(args: {
  local: string[];
  remote: string[];
}): string[] {
  const set = new Set<string>();
  for (const id of args.local) set.add(id);
  for (const id of args.remote) set.add(id);
  return [...set].sort();
}

export function mergeDomainEnvelopes<T>(args: {
  local: DomainEnvelope<T> | null;
  remote: DomainEnvelope<T> | null;
  deviceId: string;
  mergePayload: (payloads: { local: T; remote: T }) => T;
  fallbackEmpty: () => T;
}): DomainEnvelope<T> {
  const localPayload = args.local?.payload ?? args.fallbackEmpty();
  const remotePayload = args.remote?.payload ?? args.fallbackEmpty();

  const localUpdatedAt = args.local?.updatedAt ?? '1970-01-01T00:00:00.000Z';
  const remoteUpdatedAt = args.remote?.updatedAt ?? '1970-01-01T00:00:00.000Z';

  const mergedPayload = args.mergePayload({
    local: localPayload,
    remote: remotePayload,
  });

  const updatedAt =
    parseIsoMs(localUpdatedAt) >= parseIsoMs(remoteUpdatedAt)
      ? localUpdatedAt
      : remoteUpdatedAt;

  return createEnvelope({
    payload: mergedPayload,
    updatedAt,
    deviceId: args.deviceId,
  });
}

