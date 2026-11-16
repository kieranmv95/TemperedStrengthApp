// Heart rate zone inputs. Settings sync; resting HR stays on the device.
import type { RestingHeartRateSample } from '@/src/services/healthTypes';
import type {
  HeartRateZoneSettings,
  RestingHeartRate,
} from '@/src/types/heartRate';
import { isValidRestingHr } from '@/src/utils/heartRateZones';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { syncSetItem } from '@/src/sync/syncStorage';
import {
  HEALTH_CONNECTED_KEY,
  HEART_RATE_ZONE_SETTINGS_KEY,
  RESTING_HEART_RATE_KEY,
} from './keys';

export const DEFAULT_HEART_RATE_ZONE_SETTINGS: HeartRateZoneSettings = {
  birthYear: null,
  method: 'basic',
};

function parseHeartRateZoneSettings(raw: string | null): HeartRateZoneSettings {
  if (!raw) return DEFAULT_HEART_RATE_ZONE_SETTINGS;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      Array.isArray(parsed)
    ) {
      return DEFAULT_HEART_RATE_ZONE_SETTINGS;
    }
    const record = parsed as Record<string, unknown>;
    const birthYear =
      typeof record.birthYear === 'number' && Number.isInteger(record.birthYear)
        ? record.birthYear
        : null;
    const method = record.method === 'karvonen' ? 'karvonen' : 'basic';
    return { birthYear, method };
  } catch {
    return DEFAULT_HEART_RATE_ZONE_SETTINGS;
  }
}

function parseRestingHeartRate(raw: string | null): RestingHeartRate | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      Array.isArray(parsed)
    ) {
      return null;
    }
    const record = parsed as Record<string, unknown>;
    if (
      typeof record.bpm !== 'number' ||
      !isValidRestingHr(record.bpm) ||
      (record.source !== 'health' && record.source !== 'manual') ||
      typeof record.recordedAt !== 'string'
    ) {
      return null;
    }
    return {
      bpm: record.bpm,
      source: record.source,
      recordedAt: record.recordedAt,
    };
  } catch {
    return null;
  }
}

export const getHeartRateZoneSettings =
  async (): Promise<HeartRateZoneSettings> => {
    try {
      const raw = await AsyncStorage.getItem(HEART_RATE_ZONE_SETTINGS_KEY);
      return parseHeartRateZoneSettings(raw);
    } catch (error) {
      console.error('Error getting heart rate zone settings:', error);
      return DEFAULT_HEART_RATE_ZONE_SETTINGS;
    }
  };

export const setHeartRateZoneSettings = async (
  settings: HeartRateZoneSettings
): Promise<void> => {
  try {
    await syncSetItem(HEART_RATE_ZONE_SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error setting heart rate zone settings:', error);
    throw error;
  }
};

/** Device-only — never sync. */
export const getRestingHeartRate =
  async (): Promise<RestingHeartRate | null> => {
    try {
      const raw = await AsyncStorage.getItem(RESTING_HEART_RATE_KEY);
      return parseRestingHeartRate(raw);
    } catch (error) {
      console.error('Error getting resting heart rate:', error);
      return null;
    }
  };

const writeRestingHeartRate = async (
  value: RestingHeartRate
): Promise<void> => {
  await AsyncStorage.setItem(RESTING_HEART_RATE_KEY, JSON.stringify(value));
};

/** Manual entries pin the value: Health refreshes no longer overwrite it. */
export const setManualRestingHeartRate = async (
  bpm: number,
  now: Date = new Date()
): Promise<RestingHeartRate> => {
  if (!isValidRestingHr(bpm)) {
    throw new Error(`Resting heart rate out of range: ${bpm}`);
  }
  const value: RestingHeartRate = {
    bpm,
    source: 'manual',
    recordedAt: now.toISOString(),
  };
  try {
    await writeRestingHeartRate(value);
    return value;
  } catch (error) {
    console.error('Error setting manual resting heart rate:', error);
    throw error;
  }
};

/** Removes the stored resting HR from either source. */
export const clearRestingHeartRate = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(RESTING_HEART_RATE_KEY);
  } catch (error) {
    console.error('Error clearing resting heart rate:', error);
    throw error;
  }
};

/**
 * Stores a Health reading unless the user pinned a manual value.
 * Returns whatever is stored afterwards.
 */
export const applyHealthRestingHeartRate = async (
  sample: RestingHeartRateSample
): Promise<RestingHeartRate | null> => {
  const current = await getRestingHeartRate();
  if (current?.source === 'manual') {
    return current;
  }
  return replaceWithHealthRestingHeartRate(sample);
};

/** Replaces any stored value (including manual) with a Health reading. */
export const replaceWithHealthRestingHeartRate = async (
  sample: RestingHeartRateSample
): Promise<RestingHeartRate | null> => {
  if (!isValidRestingHr(sample.bpm)) {
    return getRestingHeartRate();
  }
  const value: RestingHeartRate = {
    bpm: sample.bpm,
    source: 'health',
    recordedAt: sample.recordedAt,
  };
  try {
    await writeRestingHeartRate(value);
    return value;
  } catch (error) {
    console.error('Error setting Health resting heart rate:', error);
    throw error;
  }
};

/**
 * Device-only. HealthKit never reports whether read access was granted, so
 * the app tracks that the user chose to connect.
 */
export const getHealthConnected = async (): Promise<boolean> => {
  try {
    const raw = await AsyncStorage.getItem(HEALTH_CONNECTED_KEY);
    return raw === 'true';
  } catch (error) {
    console.error('Error getting Health connected:', error);
    return false;
  }
};

export const setHealthConnected = async (connected: boolean): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      HEALTH_CONNECTED_KEY,
      connected ? 'true' : 'false'
    );
  } catch (error) {
    console.error('Error setting Health connected:', error);
    throw error;
  }
};

/** Removes a cached Health value. Manual values are left alone. */
export const clearHealthRestingHeartRate = async (): Promise<void> => {
  try {
    const current = await getRestingHeartRate();
    if (current?.source === 'health') {
      await AsyncStorage.removeItem(RESTING_HEART_RATE_KEY);
    }
  } catch (error) {
    console.error('Error clearing Health resting heart rate:', error);
  }
};
