import AsyncStorage from '@react-native-async-storage/async-storage';
import * as HealthKit from '@kingstinct/react-native-healthkit';
import * as HealthConnect from 'react-native-health-connect';
import {
  getDateOfBirth,
  getHealthAvailability,
  getLatestRestingHeartRate,
  requestRestingHeartRateAccess,
} from '../services/health';
import * as androidHealth from '../services/healthPlatform.android';
import { setDevHealthMockScenario } from '../utils/storage';

/** jest-expo reports Expo Go, which would skip loading the native modules. */
jest.mock('expo', () => ({
  ...jest.requireActual('expo'),
  isRunningInExpoGo: () => false,
}));

const MOCK_DELAY_MS = 600;

/** Mock scenarios add a short delay so loading states are visible. */
async function settle<T>(promise: Promise<T>): Promise<T> {
  await jest.advanceTimersByTimeAsync(MOCK_DELAY_MS);
  return promise;
}

describe('health facade with the dev mock', () => {
  beforeEach(async () => {
    jest.useFakeTimers();
    await AsyncStorage.clear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns canned data for the connected scenario', async () => {
    await setDevHealthMockScenario('connected');

    await expect(getHealthAvailability()).resolves.toBe('available');
    await expect(settle(requestRestingHeartRateAccess())).resolves.toBe(true);
    await expect(settle(getLatestRestingHeartRate())).resolves.toMatchObject({
      bpm: 52,
    });
    await expect(getDateOfBirth()).resolves.toEqual(new Date(1993, 5, 15));
    expect(HealthKit.queryQuantitySamples).not.toHaveBeenCalled();
  });

  it('grants access but has no data for the noData scenario', async () => {
    await setDevHealthMockScenario('noData');

    await expect(settle(requestRestingHeartRateAccess())).resolves.toBe(true);
    await expect(settle(getLatestRestingHeartRate())).resolves.toBeNull();
  });

  it('refuses access for the denied scenario', async () => {
    await setDevHealthMockScenario('denied');

    await expect(settle(requestRestingHeartRateAccess())).resolves.toBe(false);
  });

  it('reports needsInstall for the needsInstall scenario', async () => {
    await setDevHealthMockScenario('needsInstall');

    await expect(getHealthAvailability()).resolves.toBe('needsInstall');
  });

  it('throws from reads but swallows date of birth for the error scenario', async () => {
    await setDevHealthMockScenario('error');
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const rejection = expect(requestRestingHeartRateAccess()).rejects.toThrow(
      'Mock Health error'
    );
    await jest.advanceTimersByTimeAsync(MOCK_DELAY_MS);
    await rejection;
    await expect(getDateOfBirth()).resolves.toBeNull();

    errorSpy.mockRestore();
  });
});

describe('health facade on iOS (HealthKit)', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  it('reads the latest resting heart rate once authorization was requested', async () => {
    jest.mocked(HealthKit.queryQuantitySamples).mockResolvedValueOnce([
      {
        quantity: 51.6,
        endDate: new Date('2026-11-12T06:00:00.000Z'),
      },
    ] as unknown as Awaited<ReturnType<typeof HealthKit.queryQuantitySamples>>);

    await expect(getLatestRestingHeartRate()).resolves.toEqual({
      bpm: 52,
      recordedAt: '2026-11-12T06:00:00.000Z',
    });
  });

  it('never queries before authorization was requested', async () => {
    jest
      .mocked(HealthKit.getRequestStatusForAuthorization)
      .mockResolvedValueOnce(1);

    await expect(getLatestRestingHeartRate()).resolves.toBeNull();
    expect(HealthKit.queryQuantitySamples).not.toHaveBeenCalled();
  });

  it('returns null when there are no samples', async () => {
    await expect(getLatestRestingHeartRate()).resolves.toBeNull();
  });
});

describe('Android (Health Connect)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('maps SDK status to availability', async () => {
    jest.mocked(HealthConnect.getSdkStatus).mockResolvedValueOnce(3);
    await expect(androidHealth.getHealthAvailability()).resolves.toBe(
      'available'
    );
    jest.mocked(HealthConnect.getSdkStatus).mockResolvedValueOnce(2);
    await expect(androidHealth.getHealthAvailability()).resolves.toBe(
      'needsInstall'
    );
    jest.mocked(HealthConnect.getSdkStatus).mockResolvedValueOnce(1);
    await expect(androidHealth.getHealthAvailability()).resolves.toBe(
      'unavailable'
    );
  });

  it('reports access only when resting heart rate was granted', async () => {
    await expect(androidHealth.requestRestingHeartRateAccess()).resolves.toBe(
      false
    );

    jest
      .mocked(HealthConnect.getGrantedPermissions)
      .mockResolvedValueOnce([
        { accessType: 'read', recordType: 'RestingHeartRate' },
      ]);
    await expect(androidHealth.requestRestingHeartRateAccess()).resolves.toBe(
      true
    );
  });

  it('does not read records without permission', async () => {
    await expect(androidHealth.getLatestRestingHeartRate()).resolves.toBeNull();
    expect(HealthConnect.readRecords).not.toHaveBeenCalled();
  });

  it('reads the latest resting heart rate record', async () => {
    jest
      .mocked(HealthConnect.getGrantedPermissions)
      .mockResolvedValueOnce([
        { accessType: 'read', recordType: 'RestingHeartRate' },
      ]);
    jest.mocked(HealthConnect.readRecords).mockResolvedValueOnce({
      records: [{ beatsPerMinute: 48, time: '2026-11-12T06:00:00.000Z' }],
    } as unknown as Awaited<ReturnType<typeof HealthConnect.readRecords>>);

    await expect(androidHealth.getLatestRestingHeartRate()).resolves.toEqual({
      bpm: 48,
      recordedAt: '2026-11-12T06:00:00.000Z',
    });
  });

  it('never exposes a date of birth', async () => {
    await expect(androidHealth.getDateOfBirth()).resolves.toBeNull();
  });
});
