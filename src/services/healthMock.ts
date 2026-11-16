import type {
  HealthAvailability,
  HealthMockScenario,
  HealthProvider,
  RestingHeartRateSample,
} from './healthTypes';

/** Long enough to see loading states, short enough not to annoy. */
const MOCK_DELAY_MS = 600;

const MOCK_RESTING_HR_BPM = 52;
const MOCK_DATE_OF_BIRTH = new Date(1993, 5, 15);
const MS_PER_DAY = 24 * 60 * 60 * 1000;

function wait(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
}

function mockError(): Error {
  return new Error('Mock Health error');
}

/**
 * Canned Health responses for the dev "Mock health data" setting, so the
 * connect flow can be seen in Expo Go and simulators without native modules.
 */
export function createMockHealthProvider(
  scenario: Exclude<HealthMockScenario, 'off'>
): HealthProvider {
  return {
    getHealthAvailability: async (): Promise<HealthAvailability> => {
      if (scenario === 'needsInstall') {
        return 'needsInstall';
      }
      return 'available';
    },

    requestRestingHeartRateAccess: async (): Promise<boolean> => {
      await wait();
      if (scenario === 'error') {
        throw mockError();
      }
      return scenario === 'connected' || scenario === 'noData';
    },

    getLatestRestingHeartRate:
      async (): Promise<RestingHeartRateSample | null> => {
        await wait();
        if (scenario === 'error') {
          throw mockError();
        }
        if (scenario !== 'connected') {
          return null;
        }
        return {
          bpm: MOCK_RESTING_HR_BPM,
          recordedAt: new Date(Date.now() - MS_PER_DAY).toISOString(),
        };
      },

    getDateOfBirth: async (): Promise<Date | null> => {
      if (scenario === 'error') {
        throw mockError();
      }
      return scenario === 'connected' ? MOCK_DATE_OF_BIRTH : null;
    },
  };
}
