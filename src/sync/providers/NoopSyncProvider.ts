import type { SyncProvider, SyncProviderAvailability } from './SyncProvider';

export class NoopSyncProvider implements SyncProvider {
  async getAvailability(): Promise<SyncProviderAvailability> {
    return { available: false, reason: 'Sync disabled or unsupported platform' };
  }

  async getAllKeys(): Promise<string[]> {
    return [];
  }

  async getString(_key: string): Promise<string | null> {
    return null;
  }

  async setString(_key: string, _value: string): Promise<void> {}

  async remove(_key: string): Promise<void> {}
}

