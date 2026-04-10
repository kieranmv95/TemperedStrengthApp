import AsyncStorage from '@react-native-async-storage/async-storage';
import { encodeICloudEnvelope, parseICloudPayload } from './encoding';
import { decideWinner } from './decision';
import { isInternalKey, SYNC_TS_PREFIX } from './constants';
import type { SyncDecision, SyncConflict } from './types';
import type { SyncProvider } from './providers/SyncProvider';

type SyncManagerOptions = {
  provider: SyncProvider;
  requestConflictDecision: (conflicts: SyncConflict[]) => Promise<SyncDecision>;
};

function tsKey(key: string): string {
  return `${SYNC_TS_PREFIX}${key}`;
}

async function readLocalTs(key: string): Promise<number> {
  try {
    const raw = await AsyncStorage.getItem(tsKey(key));
    if (!raw) return 0;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : 0;
  } catch {
    return 0;
  }
}

async function writeLocalTs(key: string, ts: number): Promise<void> {
  await AsyncStorage.setItem(tsKey(key), String(ts));
}

export class SyncManager {
  private readonly provider: SyncProvider;
  private readonly requestConflictDecision: SyncManagerOptions['requestConflictDecision'];

  private syncing = false;

  constructor(options: SyncManagerOptions) {
    this.provider = options.provider;
    this.requestConflictDecision = options.requestConflictDecision;
  }

  async mirrorSet(key: string, value: string): Promise<void> {
    if (isInternalKey(key)) return;
    const availability = await this.provider.getAvailability();
    if (!availability.available) return;

    const ts = Date.now();
    await writeLocalTs(key, ts);
    await this.provider.setString(
      key,
      encodeICloudEnvelope({ v: value, ts, deleted: false })
    );
  }

  async mirrorRemove(key: string): Promise<void> {
    if (isInternalKey(key)) return;
    const availability = await this.provider.getAvailability();
    if (!availability.available) return;

    const ts = Date.now();
    await writeLocalTs(key, ts);
    await this.provider.setString(
      key,
      encodeICloudEnvelope({ v: null, ts, deleted: true })
    );
  }

  async reconcileOnce(): Promise<void> {
    if (this.syncing) return;
    this.syncing = true;
    try {
      const availability = await this.provider.getAvailability();
      if (!availability.available) return;

      const [localKeys, cloudKeys] = await Promise.all([
        AsyncStorage.getAllKeys(),
        this.provider.getAllKeys(),
      ]);

      const union = new Set<string>();
      for (const k of localKeys) union.add(k);
      for (const k of cloudKeys) union.add(k);

      const keys = [...union].filter((k) => !isInternalKey(k));
      if (keys.length === 0) return;

      const comparisons = await Promise.all(
        keys.map(async (key) => {
          const [localValue, localTs, cloudRaw] = await Promise.all([
            AsyncStorage.getItem(key),
            readLocalTs(key),
            this.provider.getString(key),
          ]);

          const parsed = parseICloudPayload(cloudRaw);
          const icloud =
            parsed.kind === 'envelope'
              ? {
                  value: parsed.envelope.v,
                  ts: parsed.envelope.ts,
                  deleted: parsed.envelope.deleted ?? false,
                }
              : parsed.kind === 'legacy_string'
                ? { value: parsed.value, ts: 0, deleted: false }
                : { value: null, ts: 0, deleted: false };

          return {
            key,
            local: { value: localValue, ts: localTs },
            icloud,
          };
        })
      );

      const conflicts: SyncConflict[] = [];
      const actions = comparisons.map((cmp) => {
        const winner = decideWinner(cmp);
        if (winner.kind === 'conflict') {
          conflicts.push(winner.conflict);
        }
        return { cmp, winner };
      });

      let conflictDecision: SyncDecision | null = null;
      if (conflicts.length > 0) {
        conflictDecision = await this.requestConflictDecision(conflicts);
      }

      for (const { cmp, winner } of actions) {
        const key = cmp.key;
        const effectiveWinner =
          winner.kind === 'conflict'
            ? conflictDecision === 'keep_icloud'
              ? { kind: 'icloud' as const }
              : { kind: 'local' as const }
            : winner;

        if (effectiveWinner.kind === 'icloud') {
          const shouldUpgradeICloudTs =
            cmp.icloud.ts <= 0 && (cmp.icloud.deleted || cmp.icloud.value !== null);
          const nextTs = shouldUpgradeICloudTs ? Date.now() : cmp.icloud.ts;

          if (cmp.icloud.deleted) {
            await AsyncStorage.removeItem(key);
            await writeLocalTs(key, nextTs);
            if (shouldUpgradeICloudTs) {
              await this.provider.setString(
                key,
                encodeICloudEnvelope({ v: null, ts: nextTs, deleted: true })
              );
            }
          } else if (cmp.icloud.value !== null) {
            await AsyncStorage.setItem(key, cmp.icloud.value);
            await writeLocalTs(key, nextTs);
            if (shouldUpgradeICloudTs) {
              await this.provider.setString(
                key,
                encodeICloudEnvelope({ v: cmp.icloud.value, ts: nextTs, deleted: false })
              );
            }
          }
          continue;
        }

        if (effectiveWinner.kind === 'local') {
          // If local has no timestamp but has data, treat this as "first sync" and
          // assign a new timestamp to avoid perpetual conflicts.
          const localHasData = cmp.local.value !== null;
          const nextTs =
            cmp.local.ts > 0 ? cmp.local.ts : localHasData ? Date.now() : 0;

          if (!localHasData) {
            // Local missing and chosen as winner means both missing; no-op.
            continue;
          }

          await writeLocalTs(key, nextTs);
          await this.provider.setString(
            key,
            encodeICloudEnvelope({ v: cmp.local.value, ts: nextTs, deleted: false })
          );
        }
      }
    } finally {
      this.syncing = false;
    }
  }
}

