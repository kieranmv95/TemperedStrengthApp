/**
 * `needsInstall` is Android only: Health Connect is missing or out of date.
 */
export type HealthAvailability = 'available' | 'needsInstall' | 'unavailable';

export type RestingHeartRateSample = {
  bpm: number;
  /** ISO timestamp of the reading. */
  recordedAt: string;
};

/** Contract every platform implementation and the dev mock satisfy. */
export type HealthProvider = {
  getHealthAvailability: () => Promise<HealthAvailability>;
  /** Resolves true when the user granted (or may have granted) read access. */
  requestRestingHeartRateAccess: () => Promise<boolean>;
  /** Most recent resting HR from the last 30 days. */
  getLatestRestingHeartRate: () => Promise<RestingHeartRateSample | null>;
  getDateOfBirth: () => Promise<Date | null>;
};

export type HealthMockScenario =
  'off' | 'connected' | 'noData' | 'denied' | 'needsInstall' | 'error';

export const HEALTH_MOCK_SCENARIOS: HealthMockScenario[] = [
  'off',
  'connected',
  'noData',
  'denied',
  'needsInstall',
  'error',
];

/** Only resting HR from this window counts as current. */
export const RESTING_HR_LOOKBACK_DAYS = 30;
