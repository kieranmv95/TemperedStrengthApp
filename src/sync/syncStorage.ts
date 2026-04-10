import AsyncStorage from '@react-native-async-storage/async-storage';
import { getRuntimeSyncManager } from './runtime';

export async function syncSetItem(key: string, value: string): Promise<void> {
  await AsyncStorage.setItem(key, value);
  try {
    await getRuntimeSyncManager()?.mirrorSet(key, value);
  } catch (error) {
    console.error('Failed to mirror set to sync provider:', error);
  }
}

export async function syncRemoveItem(key: string): Promise<void> {
  await AsyncStorage.removeItem(key);
  try {
    await getRuntimeSyncManager()?.mirrorRemove(key);
  } catch (error) {
    console.error('Failed to mirror remove to sync provider:', error);
  }
}

