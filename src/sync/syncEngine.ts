import { captureAnalyticsEvent } from '@/src/services/posthogClient';
import { posthogEventsNames } from '@/src/services/posthogEvents';
import { getSupabaseClient } from '@/src/services/supabaseClient';
import { clearConditioningEffortsDomainMeta } from '@/src/db/domains/conditioningEfforts/meta';
import { clearAllConditioningEffortRows } from '@/src/db/domains/conditioningEfforts/repository';
import { clearPersonalBestsDomainMeta } from '@/src/db/domains/personalBests/meta';
import { clearAllPersonalBestRows } from '@/src/db/domains/personalBests/repository';
import { clearWorkoutLogsDomainMeta } from '@/src/db/domains/workoutLogs/meta';
import { clearAllWorkoutLogSetRows } from '@/src/db/domains/workoutLogs/repository';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  HAS_ACCOUNT_KEY,
  LAST_SYNCED_AT_KEY,
  SYNC_QUEUE_KEY,
  SYNC_TS_PREFIX,
} from './constants';
import {
  CONDITIONING_EFFORTS_TABLE,
  pullConditioningEffortChanges,
  pushDirtyConditioningEfforts,
} from './domains/conditioningEfforts';
import {
  ensurePersonalBestsCloudMigrated,
  PERSONAL_BEST_ENTRIES_TABLE,
  pullPersonalBestChanges,
  pushDirtyPersonalBests,
} from './domains/personalBests';
import {
  ensureWorkoutLogsCloudMigrated,
  pullWorkoutLogChanges,
  pushDirtyWorkoutLogs,
  WORKOUT_LOG_SETS_TABLE,
} from './domains/workoutLogs';
import {
  CHECKIN_BEHAVIOUR_ENTRIES_TABLE,
  CHECKIN_SETTINGS_TABLE,
  pullCheckinChanges,
  pushDirtyCheckin,
} from './domains/checkin';
import { shouldSync, SYNCED_KEYS } from './syncedKeys';
import {
  isQuarantined,
  quarantineKey,
  readAllPages,
  requireSyncTimestamp,
  upsertUntilAccepted,
} from './syncWrite';

const EPOCH = '1970-01-01T00:00:00.000Z';
export const MAX_SYNC_VALUE_BYTES = 500_000;
/** Early PostHog warning once a synced value exceeds 30% of the hard limit. */
export const KV_SIZE_WARNING_BYTES = Math.floor(MAX_SYNC_VALUE_BYTES * 0.3);
const UPSERT_BATCH_SIZE = 100;

type KvSizeLimitSource = 'local_write' | 'push_queue' | 'migrate';

/** Once per key per app session to avoid retry spam. */
const reportedKvSizeLimitKeys = new Set<string>();

function reportKvSizeWarningIfNeeded(
  key: string,
  value: string,
  source: KvSizeLimitSource
): void {
  const sizeBytes = utf8ByteLength(value);
  if (sizeBytes <= KV_SIZE_WARNING_BYTES) return;
  if (reportedKvSizeLimitKeys.has(key)) return;
  reportedKvSizeLimitKeys.add(key);
  captureAnalyticsEvent(posthogEventsNames.sync.kvSizeLimit, {
    key,
    size_bytes: sizeBytes,
    warning_bytes: KV_SIZE_WARNING_BYTES,
    max_bytes: MAX_SYNC_VALUE_BYTES,
    source,
  });
}

/** Test helper — clears the per-session KV size alert dedupe set. */
export function resetKvSizeLimitReportsForTests(): void {
  reportedKvSizeLimitKeys.clear();
}

export class SyncPayloadTooLargeError extends Error {
  readonly keys: string[];

  constructor(keys: string[]) {
    super(
      `Backup paused because ${keys.length === 1 ? `"${keys[0]}" is` : `${keys.length} items are`} larger than 500 KB. Your data is still safe on this device.`
    );
    this.name = 'SyncPayloadTooLargeError';
    this.keys = keys;
  }
}

export type SyncOperation = {
  key: string;
  value?: string;
  op: 'upsert' | 'delete';
  updatedAt: string;
};

type RemoteRow = {
  key: string;
  value: unknown;
  updated_at: string;
  deleted_at: string | null;
};

let queueChain: Promise<void> = Promise.resolve();
let syncInFlight: Promise<void> | null = null;

function parseQueue(raw: string | null): SyncOperation[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is SyncOperation => {
      if (typeof item !== 'object' || item === null) return false;
      const record = item as Record<string, unknown>;
      return (
        typeof record.key === 'string' &&
        (record.op === 'upsert' || record.op === 'delete') &&
        typeof record.updatedAt === 'string' &&
        (record.value === undefined || typeof record.value === 'string')
      );
    });
  } catch {
    return [];
  }
}

function serializeRemoteValue(value: unknown): string {
  return typeof value === 'string' ? value : JSON.stringify(value);
}

async function hasAccount(): Promise<boolean> {
  return (await AsyncStorage.getItem(HAS_ACCOUNT_KEY)) === 'true';
}

export async function enqueueSyncOperation(
  operation: SyncOperation
): Promise<void> {
  const run = queueChain.then(async () => {
    const queue = parseQueue(await AsyncStorage.getItem(SYNC_QUEUE_KEY));
    const next = queue.filter((item) => item.key !== operation.key);
    next.push(operation);
    await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(next));
  });
  queueChain = run.catch(() => undefined);
  await run;
}

export async function recordLocalSet(
  key: string,
  value: string
): Promise<void> {
  if (!shouldSync(key)) return;
  reportKvSizeWarningIfNeeded(key, value, 'local_write');
  const updatedAt = new Date().toISOString();
  await AsyncStorage.setItem(`${SYNC_TS_PREFIX}${key}`, updatedAt);
  if (!(await hasAccount())) return;
  await enqueueSyncOperation({ key, value, op: 'upsert', updatedAt });
}

export async function recordLocalDelete(key: string): Promise<void> {
  if (!shouldSync(key)) return;
  const updatedAt = new Date().toISOString();
  await AsyncStorage.setItem(`${SYNC_TS_PREFIX}${key}`, updatedAt);
  if (!(await hasAccount())) return;
  await enqueueSyncOperation({ key, op: 'delete', updatedAt });
}

export function utf8ByteLength(value: string): number {
  let bytes = 0;
  for (const character of value) {
    const codePoint = character.codePointAt(0) ?? 0;
    if (codePoint <= 0x7f) bytes += 1;
    else if (codePoint <= 0x7ff) bytes += 2;
    else if (codePoint <= 0xffff) bytes += 3;
    else bytes += 4;
  }
  return bytes;
}

export function isSyncValueTooLarge(value: string): boolean {
  return utf8ByteLength(value) > MAX_SYNC_VALUE_BYTES;
}

export async function pushQueue(userId: string): Promise<string[]> {
  const queue = parseQueue(await AsyncStorage.getItem(SYNC_QUEUE_KEY));
  if (queue.length === 0) return [];

  for (const operation of queue) {
    if (operation.value !== undefined) {
      reportKvSizeWarningIfNeeded(operation.key, operation.value, 'push_queue');
    }
  }
  const oversizedOperations = queue.filter(
    (operation) =>
      operation.value !== undefined && isSyncValueTooLarge(operation.value)
  );
  const pushedOperations = queue.filter(
    (operation) => !oversizedOperations.includes(operation)
  );
  const queuedAtByKey = new Map<string, string>();
  const rows = pushedOperations.flatMap((operation) => {
    if (isQuarantined(`kv:${operation.key}`)) return [];
    const updatedAt = requireSyncTimestamp(operation.updatedAt);
    queuedAtByKey.set(operation.key, operation.updatedAt);
    return [
      {
        user_id: userId,
        key: operation.key,
        // Values are stored as the exact AsyncStorage string inside jsonb. This
        // preserves both raw strings ("kg") and serialized objects losslessly.
        value: operation.value ?? '',
        updated_at: updatedAt,
        deleted_at: operation.op === 'delete' ? updatedAt : null,
      },
    ];
  });

  const client = getSupabaseClient();
  const acceptedAt = new Map<string, string>();
  let pushFailure: unknown = null;
  try {
    for (let index = 0; index < rows.length; index += UPSERT_BATCH_SIZE) {
      const batch = rows.slice(index, index + UPSERT_BATCH_SIZE);
      const result = await upsertUntilAccepted(
        batch,
        async (slice) => {
          const { error } = await client
            .from('user_kv_store')
            .upsert(slice, { onConflict: 'user_id,key' });
          return { error };
        },
        (row) => row.key
      );
      for (const key of result.acceptedIds) {
        const queuedAt = queuedAtByKey.get(key);
        if (queuedAt) acceptedAt.set(key, queuedAt);
      }
      for (const rejected of result.rejected) {
        quarantineKey(`kv:${rejected.id}`);
        console.error(`Backup skipped "${rejected.id}": ${rejected.message}`);
      }
    }
  } catch (error) {
    pushFailure = error;
  }

  const clearPushed = queueChain.then(async () => {
    const current = parseQueue(await AsyncStorage.getItem(SYNC_QUEUE_KEY));
    const remaining = current.filter(
      (item) => acceptedAt.get(item.key) !== item.updatedAt
    );
    await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(remaining));
  });
  queueChain = clearPushed.catch(() => undefined);
  await clearPushed;
  if (pushFailure) throw pushFailure;
  return oversizedOperations.map((operation) => operation.key);
}

export async function pullChanges(
  userId: string,
  options: { full?: boolean } = {}
): Promise<void> {
  const lastSyncedAt = options.full
    ? EPOCH
    : ((await AsyncStorage.getItem(LAST_SYNCED_AT_KEY)) ?? EPOCH);

  const rows = await readAllPages<RemoteRow>((from, to) =>
    getSupabaseClient()
      .from('user_kv_store')
      .select('key,value,updated_at,deleted_at')
      .eq('user_id', userId)
      .gt('updated_at', lastSyncedAt)
      .order('updated_at', { ascending: true })
      .range(from, to)
  );
  let newestTimestamp = lastSyncedAt;

  for (const row of rows) {
    if (!shouldSync(row.key)) continue;
    const localUpdatedAt = await AsyncStorage.getItem(
      `${SYNC_TS_PREFIX}${row.key}`
    );
    if (localUpdatedAt && localUpdatedAt >= row.updated_at) continue;

    try {
      if (row.deleted_at) {
        await AsyncStorage.removeItem(row.key);
      } else {
        await AsyncStorage.setItem(row.key, serializeRemoteValue(row.value));
      }
      await AsyncStorage.setItem(`${SYNC_TS_PREFIX}${row.key}`, row.updated_at);
    } catch (error) {
      console.error(`Skipping backup key "${row.key}":`, error);
    }
    if (row.updated_at > newestTimestamp) newestTimestamp = row.updated_at;
  }

  if (rows.length > 0) {
    const remoteNewest = rows[rows.length - 1]?.updated_at;
    if (remoteNewest && remoteNewest > newestTimestamp) {
      newestTimestamp = remoteNewest;
    }
    await AsyncStorage.setItem(LAST_SYNCED_AT_KEY, newestTimestamp);
  }
}

async function runSyncStep(
  label: string,
  step: () => Promise<void>,
  failures: unknown[]
): Promise<void> {
  try {
    await step();
  } catch (error) {
    console.error(label, error);
    failures.push(error);
  }
}

export async function syncNow(userId: string): Promise<void> {
  if (syncInFlight) return syncInFlight;
  syncInFlight = (async () => {
    const { error: sessionError } = await getSupabaseClient().auth.getSession();
    if (sessionError) {
      console.error(
        'Account session refresh failed before backup:',
        sessionError
      );
    }

    // Each step is isolated. A bad check-in row must not block workout logs,
    // and a failed push must not skip the pull.
    const failures: unknown[] = [];

    await runSyncStep(
      'Personal bests cloud migration failed:',
      () => ensurePersonalBestsCloudMigrated(userId),
      failures
    );
    await runSyncStep(
      'Workout logs cloud migration failed:',
      () => ensureWorkoutLogsCloudMigrated(userId),
      failures
    );
    await runSyncStep(
      'Personal bests push failed:',
      () => pushDirtyPersonalBests(userId),
      failures
    );
    await runSyncStep(
      'Conditioning efforts push failed:',
      () => pushDirtyConditioningEfforts(userId),
      failures
    );
    await runSyncStep(
      'Workout logs push failed:',
      () => pushDirtyWorkoutLogs(userId),
      failures
    );
    await runSyncStep(
      'Check-in push failed:',
      () => pushDirtyCheckin(userId),
      failures
    );

    let oversizedKeys: string[] = [];
    try {
      oversizedKeys = await pushQueue(userId);
    } catch (error) {
      console.error('Backup queue push failed:', error);
      failures.push(error);
    }

    await runSyncStep(
      'Backup pull failed:',
      () => pullChanges(userId),
      failures
    );
    await runSyncStep(
      'Personal bests pull failed:',
      () => pullPersonalBestChanges(userId),
      failures
    );
    await runSyncStep(
      'Conditioning efforts pull failed:',
      () => pullConditioningEffortChanges(userId),
      failures
    );
    await runSyncStep(
      'Workout logs pull failed:',
      () => pullWorkoutLogChanges(userId),
      failures
    );
    await runSyncStep(
      'Check-in pull failed:',
      () => pullCheckinChanges(userId),
      failures
    );

    if (failures.length > 0) {
      throw failures[0];
    }
    if (oversizedKeys.length > 0) {
      throw new SyncPayloadTooLargeError(oversizedKeys);
    }
  })();
  try {
    await syncInFlight;
  } finally {
    syncInFlight = null;
  }
}

async function tableHasRow(
  query: PromiseLike<{ data: unknown[] | null; error: unknown }>
): Promise<boolean> {
  const { data, error } = await query;
  if (error) throw error;
  return (data?.length ?? 0) > 0;
}

export async function remoteDataExists(userId: string): Promise<boolean> {
  const client = getSupabaseClient();
  const probes = [
    () =>
      tableHasRow(
        client.from('user_kv_store').select('id').eq('user_id', userId).limit(1)
      ),
    () =>
      tableHasRow(
        client
          .from(PERSONAL_BEST_ENTRIES_TABLE)
          .select('id')
          .eq('user_id', userId)
          .limit(1)
      ),
    () =>
      tableHasRow(
        client
          .from(CONDITIONING_EFFORTS_TABLE)
          .select('id')
          .eq('user_id', userId)
          .limit(1)
      ),
    () =>
      tableHasRow(
        client
          .from(WORKOUT_LOG_SETS_TABLE)
          .select('id')
          .eq('user_id', userId)
          .limit(1)
      ),
    () =>
      tableHasRow(
        client
          .from(CHECKIN_SETTINGS_TABLE)
          .select('user_id')
          .eq('user_id', userId)
          .limit(1)
      ),
    () =>
      tableHasRow(
        client
          .from(CHECKIN_BEHAVIOUR_ENTRIES_TABLE)
          .select('id')
          .eq('user_id', userId)
          .limit(1)
      ),
  ];

  const failures: unknown[] = [];
  for (const probe of probes) {
    try {
      if (await probe()) return true;
    } catch (error) {
      console.error('Backup lookup failed for one table:', error);
      failures.push(error);
    }
  }
  if (failures.length === probes.length) {
    throw failures[0];
  }
  return false;
}

export async function migrateLocalDataToSupabase(
  userId: string
): Promise<void> {
  const keys = (await AsyncStorage.getAllKeys()).filter(shouldSync);
  const entries = await AsyncStorage.multiGet(keys);
  const migratedAt = new Date().toISOString();
  const oversizedKeys = entries.flatMap(([key, value]) => {
    if (value === null) return [];
    reportKvSizeWarningIfNeeded(key, value, 'migrate');
    return isSyncValueTooLarge(value) ? [key] : [];
  });
  const oversizedKeySet = new Set(oversizedKeys);
  const rows = entries.flatMap(([key, value]) => {
    if (value === null || oversizedKeySet.has(key)) return [];
    return [
      {
        user_id: userId,
        key,
        value,
        updated_at: migratedAt,
        deleted_at: null,
      },
    ];
  });

  const client = getSupabaseClient();
  const acceptedKeys = new Set<string>();
  for (let index = 0; index < rows.length; index += UPSERT_BATCH_SIZE) {
    const batch = rows.slice(index, index + UPSERT_BATCH_SIZE);
    const result = await upsertUntilAccepted(
      batch,
      async (slice) => {
        const { error } = await client
          .from('user_kv_store')
          .upsert(slice, { onConflict: 'user_id,key' });
        return { error };
      },
      (row) => row.key
    );
    for (const key of result.acceptedIds) acceptedKeys.add(key);
    for (const rejected of result.rejected) {
      quarantineKey(`kv:${rejected.id}`);
      console.error(
        `Backup skipped "${rejected.id}" during account setup: ${rejected.message}`
      );
    }
  }

  const timestampEntries = entries
    .filter(([key, value]) => value !== null && acceptedKeys.has(key))
    .map(
      ([key]) => [`${SYNC_TS_PREFIX}${key}`, migratedAt] as [string, string]
    );
  if (timestampEntries.length > 0) {
    await AsyncStorage.multiSet(timestampEntries);
  }
  const queued = parseQueue(await AsyncStorage.getItem(SYNC_QUEUE_KEY));
  await AsyncStorage.setItem(
    SYNC_QUEUE_KEY,
    JSON.stringify(queued.filter((item) => !acceptedKeys.has(item.key)))
  );
  await AsyncStorage.setItem(LAST_SYNCED_AT_KEY, migratedAt);

  // Structured domains (not KV blobs).
  await ensurePersonalBestsCloudMigrated(userId);
  await ensureWorkoutLogsCloudMigrated(userId);

  if (oversizedKeys.length > 0) {
    throw new SyncPayloadTooLargeError(oversizedKeys);
  }
}

export async function enqueueCurrentLocalData(): Promise<void> {
  const entries = await AsyncStorage.multiGet([...SYNCED_KEYS]);
  for (const [key, value] of entries) {
    if (value === null) continue;
    const updatedAt =
      (await AsyncStorage.getItem(`${SYNC_TS_PREFIX}${key}`)) ??
      new Date().toISOString();
    await enqueueSyncOperation({ key, value, op: 'upsert', updatedAt });
  }
}

export async function clearSyncedLocalData(): Promise<void> {
  const keys = [...SYNCED_KEYS];
  const timestampKeys = keys.map((key) => `${SYNC_TS_PREFIX}${key}`);
  await AsyncStorage.multiRemove([
    ...keys,
    ...timestampKeys,
    SYNC_QUEUE_KEY,
    LAST_SYNCED_AT_KEY,
    // Legacy structured-domain blobs if still present mid-upgrade.
    'personal_bests',
    `${SYNC_TS_PREFIX}personal_bests`,
    'workout_logs',
    `${SYNC_TS_PREFIX}workout_logs`,
  ]);
  await clearAllPersonalBestRows();
  await clearPersonalBestsDomainMeta();
  await clearAllConditioningEffortRows();
  await clearConditioningEffortsDomainMeta();
  await clearAllWorkoutLogSetRows();
  await clearWorkoutLogsDomainMeta();
}
