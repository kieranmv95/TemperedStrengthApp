import {
  defaultHomeLayout,
  normalizeHomeLayout,
  type HomeSectionPreference,
} from '@/src/utils/homeLayout';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { syncSetItem } from '@/src/sync/syncStorage';
import { HOME_LAYOUT_KEY } from './keys';

export const getHomeLayout = async (): Promise<HomeSectionPreference[]> => {
  try {
    const raw = await AsyncStorage.getItem(HOME_LAYOUT_KEY);
    if (raw === null) {
      return defaultHomeLayout();
    }
    return normalizeHomeLayout(JSON.parse(raw) as unknown);
  } catch (error) {
    console.error('Error getting home layout:', error);
    return defaultHomeLayout();
  }
};

export const setHomeLayout = async (
  layout: HomeSectionPreference[]
): Promise<void> => {
  const normalized = normalizeHomeLayout(layout);
  try {
    await syncSetItem(HOME_LAYOUT_KEY, JSON.stringify(normalized));
  } catch (error) {
    console.error('Error saving home layout:', error);
    throw error;
  }
};
