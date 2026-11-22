import { isRunningInExpoGo } from 'expo';
import {
  RESTING_HR_LOOKBACK_DAYS,
  type HealthAvailability,
  type RestingHeartRateSample,
} from './healthTypes';

type HealthKitModule = typeof import('@kingstinct/react-native-healthkit');

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const READ_TYPES = [
  'HKQuantityTypeIdentifierRestingHeartRate',
  'HKCharacteristicTypeIdentifierDateOfBirth',
] as const;

let moduleCache: HealthKitModule | null | undefined;

/**
 * HealthKit is a Nitro module that Expo Go does not include. Avoid importing
 * it at module scope so Expo Go and tests do not throw on load.
 */
function getHealthKitModule(): HealthKitModule | null {
  if (isRunningInExpoGo()) {
    return null;
  }
  if (moduleCache === undefined) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      moduleCache =
        require('@kingstinct/react-native-healthkit') as HealthKitModule;
    } catch (error) {
      console.error('Failed to load HealthKit:', error);
      moduleCache = null;
    }
  }
  return moduleCache;
}

/**
 * Reading a type before authorization was requested crashes HealthKit, so
 * background refreshes check first. HealthKit never reveals whether read
 * access was granted; a denied read simply returns no samples.
 */
async function hasRequestedAuthorization(
  HealthKit: HealthKitModule
): Promise<boolean> {
  const status = await HealthKit.getRequestStatusForAuthorization({
    toRead: READ_TYPES,
  });
  return status === HealthKit.AuthorizationRequestStatus.unnecessary;
}

export async function getHealthAvailability(): Promise<HealthAvailability> {
  const HealthKit = getHealthKitModule();
  if (!HealthKit) return 'unavailable';
  const available = await HealthKit.isHealthDataAvailableAsync();
  return available ? 'available' : 'unavailable';
}

export async function requestRestingHeartRateAccess(): Promise<boolean> {
  const HealthKit = getHealthKitModule();
  if (!HealthKit) return false;
  return HealthKit.requestAuthorization({ toRead: READ_TYPES });
}

export async function getLatestRestingHeartRate(): Promise<RestingHeartRateSample | null> {
  const HealthKit = getHealthKitModule();
  if (!HealthKit || !(await hasRequestedAuthorization(HealthKit))) {
    return null;
  }
  const samples = await HealthKit.queryQuantitySamples(
    'HKQuantityTypeIdentifierRestingHeartRate',
    {
      limit: 1,
      ascending: false,
      unit: 'count/min',
      filter: {
        date: {
          startDate: new Date(
            Date.now() - RESTING_HR_LOOKBACK_DAYS * MS_PER_DAY
          ),
        },
      },
    }
  );
  const sample = samples[0];
  if (!sample) return null;
  return {
    bpm: Math.round(sample.quantity),
    recordedAt: sample.endDate.toISOString(),
  };
}

export async function getDateOfBirth(): Promise<Date | null> {
  const HealthKit = getHealthKitModule();
  if (!HealthKit || !(await hasRequestedAuthorization(HealthKit))) {
    return null;
  }
  const dateOfBirth = await HealthKit.getDateOfBirthAsync();
  return dateOfBirth ?? null;
}
