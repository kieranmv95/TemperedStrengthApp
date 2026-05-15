import AsyncStorage from '@react-native-async-storage/async-storage';
import { SyncManager } from '@/src/sync/SyncManager';
import { encodeICloudEnvelope } from '@/src/sync/encoding';
import { SYNC_TS_PREFIX } from '@/src/sync/constants';
import {
  STREAK_STATE_KEY,
  mergeStreakState,
  parseStreakState,
} from '@/src/services/streakService';
import type {
  SyncProvider,
  SyncProviderAvailability,
} from '@/src/sync/providers/SyncProvider';

class InMemorySyncProvider implements SyncProvider {
  private store = new Map<string, string>();

  async getAvailability(): Promise<SyncProviderAvailability> {
    return { available: true };
  }

  async getAllKeys(): Promise<string[]> {
    return [...this.store.keys()];
  }

  async getString(key: string): Promise<string | null> {
    return this.store.get(key) ?? null;
  }

  async setString(key: string, value: string): Promise<void> {
    this.store.set(key, value);
  }

  async remove(key: string): Promise<void> {
    this.store.delete(key);
  }
}

describe('SyncManager auto-merge for streak state', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('does not prompt and writes the merged value to both sides on streak conflict', async () => {
    const provider = new InMemorySyncProvider();

    const localValue = JSON.stringify({
      v: 1,
      dates: ['2026-05-13', '2026-05-14'],
      best: 2,
    });
    const cloudValue = JSON.stringify({
      v: 1,
      dates: ['2026-05-12', '2026-05-13'],
      best: 5,
    });

    const tiedTs = 1_700_000_000_000;
    await AsyncStorage.setItem(STREAK_STATE_KEY, localValue);
    await AsyncStorage.setItem(
      `${SYNC_TS_PREFIX}${STREAK_STATE_KEY}`,
      String(tiedTs)
    );
    await provider.setString(
      STREAK_STATE_KEY,
      encodeICloudEnvelope({ v: cloudValue, ts: tiedTs, deleted: false })
    );

    const requestConflictDecision = jest.fn(async () => 'keep_local' as const);

    const manager = new SyncManager({
      provider,
      requestConflictDecision,
      mergers: { [STREAK_STATE_KEY]: mergeStreakState },
    });

    await manager.reconcileOnce();

    expect(requestConflictDecision).not.toHaveBeenCalled();

    const persistedLocal = await AsyncStorage.getItem(STREAK_STATE_KEY);
    expect(persistedLocal).not.toBeNull();
    const parsedLocal = parseStreakState(persistedLocal);
    expect(parsedLocal.dates).toEqual([
      '2026-05-12',
      '2026-05-13',
      '2026-05-14',
    ]);
    expect(parsedLocal.best).toBe(5);

    const cloudRaw = await provider.getString(STREAK_STATE_KEY);
    expect(cloudRaw).not.toBeNull();
    const cloudEnvelope = JSON.parse(cloudRaw as string) as {
      v: string;
      ts: number;
      deleted: boolean;
    };
    expect(cloudEnvelope.deleted).toBe(false);
    const parsedCloud = parseStreakState(cloudEnvelope.v);
    expect(parsedCloud.dates).toEqual(parsedLocal.dates);
    expect(parsedCloud.best).toBe(5);
    expect(cloudEnvelope.ts).toBeGreaterThan(tiedTs);
  });

  it('still prompts for keys without a registered merger', async () => {
    const provider = new InMemorySyncProvider();
    const tiedTs = 1_700_000_000_000;

    await AsyncStorage.setItem('some_other_key', 'local-value');
    await AsyncStorage.setItem(
      `${SYNC_TS_PREFIX}some_other_key`,
      String(tiedTs)
    );
    await provider.setString(
      'some_other_key',
      encodeICloudEnvelope({ v: 'cloud-value', ts: tiedTs, deleted: false })
    );

    const requestConflictDecision = jest.fn(async () => 'keep_local' as const);

    const manager = new SyncManager({
      provider,
      requestConflictDecision,
      mergers: { [STREAK_STATE_KEY]: mergeStreakState },
    });

    await manager.reconcileOnce();

    expect(requestConflictDecision).toHaveBeenCalledTimes(1);
  });
});
