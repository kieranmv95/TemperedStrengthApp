import AsyncStorage from '@react-native-async-storage/async-storage';
import { recordLocalDelete, recordLocalSet } from './syncEngine';

export async function syncSetItem(key: string, value: string): Promise<void> {
  await AsyncStorage.setItem(key, value);
  try {
    await recordLocalSet(key, value);
  } catch (error) {
    console.error('Failed to enqueue sync set:', error);
  }
}

export async function syncRemoveItem(key: string): Promise<void> {
  await AsyncStorage.removeItem(key);
  try {
    await recordLocalDelete(key);
  } catch (error) {
    console.error('Failed to enqueue sync delete:', error);
  }
}
