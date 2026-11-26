import { isRunningInExpoGo } from 'expo';
import {
  RESTING_HR_LOOKBACK_DAYS,
  type HealthAvailability,
  type RestingHeartRateSample,
} from './healthTypes';

type HealthConnectModule = typeof import('react-native-health-connect');

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const RESTING_HR_PERMISSION = {
  accessType: 'read',
  recordType: 'RestingHeartRate',
} as const;

let moduleCache: HealthConnectModule | null | undefined;
let initialized = false;

/**
 * Health Connect is not in Expo Go. Avoid importing it at module scope so
 * Expo Go does not throw on load.
 */
function getHealthConnectModule(): HealthConnectModule | null {
  if (isRunningInExpoGo()) {
    return null;
  }
  if (moduleCache === undefined) {
    try {
      moduleCache =
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require('react-native-health-connect') as HealthConnectModule;
    } catch (error) {
      console.error('Failed to load Health Connect:', error);
      moduleCache = null;
    }
  }
  return moduleCache;
}

/** Every Health Connect call except `getSdkStatus` needs the client first. */
async function ensureInitialized(
  HealthConnect: HealthConnectModule
): Promise<boolean> {
  if (!initialized) {
    initialized = await HealthConnect.initialize();
  }
  return initialized;
}

/** Reading without the permission throws, so background refreshes check. */
async function hasRestingHeartRatePermission(
  HealthConnect: HealthConnectModule
): Promise<boolean> {
  const granted = await HealthConnect.getGrantedPermissions();
  return granted.some(
    (permission) =>
      'recordType' in permission &&
      permission.recordType === RESTING_HR_PERMISSION.recordType &&
      permission.accessType === RESTING_HR_PERMISSION.accessType
  );
}

export async function getHealthAvailability(): Promise<HealthAvailability> {
  const HealthConnect = getHealthConnectModule();
  if (!HealthConnect) return 'unavailable';
  const status = await HealthConnect.getSdkStatus();
  if (status === HealthConnect.SdkAvailabilityStatus.SDK_AVAILABLE) {
    return 'available';
  }
  if (
    status ===
    HealthConnect.SdkAvailabilityStatus.SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED
  ) {
    return 'needsInstall';
  }
  return 'unavailable';
}

export async function requestRestingHeartRateAccess(): Promise<boolean> {
  const HealthConnect = getHealthConnectModule();
  if (!HealthConnect || !(await ensureInitialized(HealthConnect))) {
    return false;
  }
  await HealthConnect.requestPermission([RESTING_HR_PERMISSION]);
  return hasRestingHeartRatePermission(HealthConnect);
}

export async function getLatestRestingHeartRate(): Promise<RestingHeartRateSample | null> {
  const HealthConnect = getHealthConnectModule();
  if (
    !HealthConnect ||
    !(await ensureInitialized(HealthConnect)) ||
    !(await hasRestingHeartRatePermission(HealthConnect))
  ) {
    return null;
  }
  const { records } = await HealthConnect.readRecords('RestingHeartRate', {
    timeRangeFilter: {
      operator: 'after',
      startTime: new Date(
        Date.now() - RESTING_HR_LOOKBACK_DAYS * MS_PER_DAY
      ).toISOString(),
    },
    ascendingOrder: false,
    pageSize: 1,
  });
  const record = records[0];
  if (!record) return null;
  return {
    bpm: Math.round(record.beatsPerMinute),
    recordedAt: record.time,
  };
}

/** Health Connect does not expose date of birth. */
export async function getDateOfBirth(): Promise<Date | null> {
  return null;
}
