import { getDevHealthMockScenario } from '@/src/utils/storage';
import { Linking, Platform } from 'react-native';
import { createMockHealthProvider } from './healthMock';
import * as healthPlatform from './healthPlatform';
import type {
  HealthAvailability,
  HealthProvider,
  RestingHeartRateSample,
} from './healthTypes';

const HEALTH_CONNECT_PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=com.google.android.apps.healthdata';

const platformProvider: HealthProvider = {
  getHealthAvailability: healthPlatform.getHealthAvailability,
  requestRestingHeartRateAccess: healthPlatform.requestRestingHeartRateAccess,
  getLatestRestingHeartRate: healthPlatform.getLatestRestingHeartRate,
  getDateOfBirth: healthPlatform.getDateOfBirth,
};

/** The dev mock wins over the platform so native code is never touched. */
async function getProvider(): Promise<HealthProvider> {
  const scenario = await getDevHealthMockScenario();
  if (scenario === 'off') {
    return platformProvider;
  }
  return createMockHealthProvider(scenario);
}

export async function getHealthAvailability(): Promise<HealthAvailability> {
  try {
    const provider = await getProvider();
    return await provider.getHealthAvailability();
  } catch (error) {
    console.error('Error getting Health availability:', error);
    return 'unavailable';
  }
}

/** Throws on failure so the caller can show an error state. */
export async function requestRestingHeartRateAccess(): Promise<boolean> {
  const provider = await getProvider();
  return provider.requestRestingHeartRateAccess();
}

/** Throws on failure so the caller can keep the stored value. */
export async function getLatestRestingHeartRate(): Promise<RestingHeartRateSample | null> {
  const provider = await getProvider();
  return provider.getLatestRestingHeartRate();
}

export async function getDateOfBirth(): Promise<Date | null> {
  try {
    const provider = await getProvider();
    return await provider.getDateOfBirth();
  } catch (error) {
    console.error('Error getting date of birth from Health:', error);
    return null;
  }
}

export async function openHealthConnectInstallPage(): Promise<void> {
  try {
    await Linking.openURL(HEALTH_CONNECT_PLAY_STORE_URL);
  } catch (error) {
    console.error('Failed to open Health Connect install page:', error);
  }
}

/** "Apple Health" on iOS, "Health Connect" everywhere else. */
export function healthServiceName(): string {
  return Platform.OS === 'ios' ? 'Apple Health' : 'Health Connect';
}
