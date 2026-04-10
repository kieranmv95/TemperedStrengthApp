import { Platform } from 'react-native';
import type { SyncProvider, SyncProviderAvailability } from './SyncProvider';

type ICloudModule = {
  getString: (key: string) => string | null;
  set: (key: string, value: string) => void;
  remove: (key: string) => void;
  getAllKeys: () => string[];
};

export class ICloudKvsProvider implements SyncProvider {
  private readonly mod: ICloudModule | null;

  constructor() {
    if (Platform.OS !== 'ios') {
      this.mod = null;
      return;
    }

    try {
      // iOS-only native module; avoid static import so Android bundles don't explode.
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const m = require('expo-icloud-storage') as { default: ICloudModule };
      this.mod = m.default;
    } catch (error) {
      console.error('Failed to load expo-icloud-storage:', error);
      this.mod = null;
    }
  }

  async getAvailability(): Promise<SyncProviderAvailability> {
    if (Platform.OS !== 'ios') {
      return { available: false, reason: 'Not running on iOS' };
    }
    if (!this.mod) {
      return { available: false, reason: 'iCloud module unavailable' };
    }
    return { available: true };
  }

  async getAllKeys(): Promise<string[]> {
    if (!this.mod) return [];
    try {
      return this.mod.getAllKeys();
    } catch (error) {
      console.error('iCloud getAllKeys failed:', error);
      return [];
    }
  }

  async getString(key: string): Promise<string | null> {
    if (!this.mod) return null;
    try {
      return this.mod.getString(key);
    } catch (error) {
      console.error('iCloud getString failed:', error);
      return null;
    }
  }

  async setString(key: string, value: string): Promise<void> {
    if (!this.mod) return;
    try {
      this.mod.set(key, value);
    } catch (error) {
      console.error('iCloud set failed:', error);
      throw error;
    }
  }

  async remove(key: string): Promise<void> {
    if (!this.mod) return;
    try {
      this.mod.remove(key);
    } catch (error) {
      console.error('iCloud remove failed:', error);
      throw error;
    }
  }
}

