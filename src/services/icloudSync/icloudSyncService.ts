import AsyncStorage from '@react-native-async-storage/async-storage';

import type { DomainEnvelope, ICloudDomainName } from './domains';
import { isoNow } from './domains';
import { clearDirty, listDirty, markDirty } from './dirty';
import { readRemoteJsonAsync, writeRemoteJsonAsync } from './icloudFiles';
import { readLocalDomainEnvelope, writeLocalDomainPayload, markDomainUpdatedAt } from './localStore';
import { DOMAIN_REMOTE_PATHS, mergeDomain, type DomainPayloadMap } from './registry';

const KEY_SYNC_ENABLED = 'icloud_sync_enabled';
const KEY_DEVICE_ID = 'icloud_device_id';
const KEY_LAST_SYNC_AT = 'icloud_last_sync_at';
const KEY_LAST_SYNC_ERROR = 'icloud_last_sync_error';

const ALL_DOMAINS: ICloudDomainName[] = [
  'meta',
  'program_state',
  'program_quota',
  'program_favorites',
  'program_swaps',
  'program_customSetCounts',
  'program_notes',
  'program_restTimer',
  'program_activeSession',
  'program_completedSessions',
  'program_workoutLogs',
  'standalone_logs',
  'metrics_tracked',
];

type SyncStatus = {
  enabled: boolean;
  isSyncing: boolean;
  lastSyncAt: string | null;
  lastError: string | null;
};

let isSyncing = false;
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

function isJestEnv(): boolean {
  // Jest sets JEST_WORKER_ID; in app runtime this is undefined.
  return typeof process !== 'undefined' && Boolean(process.env.JEST_WORKER_ID);
}

function generateDeviceId(): string {
  // Not cryptographically strong, but stable once persisted.
  return `dev_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export async function getICloudDeviceId(): Promise<string> {
  const existing = await AsyncStorage.getItem(KEY_DEVICE_ID);
  if (existing) return existing;
  const next = generateDeviceId();
  await AsyncStorage.setItem(KEY_DEVICE_ID, next);
  return next;
}

export async function isICloudSyncEnabled(): Promise<boolean> {
  const raw = await AsyncStorage.getItem(KEY_SYNC_ENABLED);
  return raw === '1';
}

export async function setICloudSyncEnabled(enabled: boolean): Promise<void> {
  if (enabled) {
    await AsyncStorage.setItem(KEY_SYNC_ENABLED, '1');
  } else {
    await AsyncStorage.removeItem(KEY_SYNC_ENABLED);
  }
}

export async function getICloudSyncStatus(): Promise<SyncStatus> {
  const [enabled, lastSyncAt, lastError] = await Promise.all([
    isICloudSyncEnabled(),
    AsyncStorage.getItem(KEY_LAST_SYNC_AT),
    AsyncStorage.getItem(KEY_LAST_SYNC_ERROR),
  ]);

  return {
    enabled,
    isSyncing,
    lastSyncAt: lastSyncAt ?? null,
    lastError: lastError ?? null,
  };
}

export async function notifyLocalDomainChange(domain: ICloudDomainName): Promise<void> {
  const now = isoNow();
  await markDomainUpdatedAt(domain, now);
  await markDirty(domain);
  scheduleSync();
}

export function scheduleSync(ms = 1500): void {
  if (isJestEnv()) return;
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    debounceTimer = null;
    void syncIfEnabled({ reason: 'debounced' });
  }, ms);
}

export async function syncIfEnabled(args: { reason: 'manual' | 'debounced' | 'foreground' }): Promise<void> {
  const enabled = await isICloudSyncEnabled();
  if (!enabled) return;
  await syncNow({ reason: args.reason });
}

export async function syncNow(_args: { reason: 'manual' | 'debounced' | 'foreground' }): Promise<void> {
  if (isSyncing) return;
  isSyncing = true;
  try {
    await AsyncStorage.removeItem(KEY_LAST_SYNC_ERROR);

    const deviceId = await getICloudDeviceId();

    const dirty = await listDirty(ALL_DOMAINS.filter((d) => d !== 'meta'));
    const domainsToSync = dirty.length > 0 ? ['meta', ...dirty] : ALL_DOMAINS;

    for (const domain of domainsToSync) {
      if (domain === 'meta') continue;

      const localEnv = await readLocalDomainEnvelope({
        domain,
        deviceId,
      });

      const remoteRead = await readRemoteJsonAsync<DomainEnvelope<DomainPayloadMap[typeof domain]>>({
        relativePath: DOMAIN_REMOTE_PATHS[domain],
      });

      if (!remoteRead.ok) {
        throw remoteRead.error;
      }
      const remoteEnv = remoteRead.value;

      const { merged } = mergeDomain({
        domain,
        local: localEnv as DomainEnvelope<DomainPayloadMap[typeof domain]>,
        remote: remoteEnv as DomainEnvelope<DomainPayloadMap[typeof domain]> | null,
        deviceId,
      });

      // Apply merged payload locally first (ensures app state reflects merged truth).
      await writeLocalDomainPayload({
        domain,
        payload: merged.payload,
        updatedAtIso: merged.updatedAt,
      });

      // Push merged envelope to iCloud.
      const remoteWrite = await writeRemoteJsonAsync({
        relativePath: DOMAIN_REMOTE_PATHS[domain],
        json: merged,
      });
      if (!remoteWrite.ok) {
        throw remoteWrite.error;
      }

      await clearDirty(domain);
    }

    // Update meta lastSyncAt in iCloud (best-effort; should not block local writes).
    const lastSyncAt = isoNow();
    await AsyncStorage.setItem(KEY_LAST_SYNC_AT, lastSyncAt);

    await writeRemoteJsonAsync({
      relativePath: DOMAIN_REMOTE_PATHS.meta,
      json: {
        schemaVersion: 1,
        updatedAt: lastSyncAt,
        deviceId: await getICloudDeviceId(),
        payload: { lastSyncAt },
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await AsyncStorage.setItem(KEY_LAST_SYNC_ERROR, message);
  } finally {
    isSyncing = false;
  }
}

