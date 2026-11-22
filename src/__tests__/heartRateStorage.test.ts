import AsyncStorage from '@react-native-async-storage/async-storage';
import { shouldSync } from '../sync/syncedKeys';
import {
  applyHealthRestingHeartRate,
  clearHealthRestingHeartRate,
  getDevHealthMockScenario,
  getHeartRateZoneSettings,
  getRestingHeartRate,
  replaceWithHealthRestingHeartRate,
  setDevHealthMockScenario,
  setHeartRateZoneSettings,
  setManualRestingHeartRate,
} from '../utils/storage';
import {
  DEV_HEALTH_MOCK_SCENARIO_KEY,
  HEART_RATE_ZONE_SETTINGS_KEY,
  RESTING_HEART_RATE_KEY,
} from '../utils/storage/keys';

const NOW = new Date('2026-11-13T07:00:00.000Z');
const HEALTH_SAMPLE = { bpm: 52, recordedAt: '2026-11-12T06:30:00.000Z' };

describe('heart rate storage', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('syncs zone settings but keeps resting HR and the dev mock on the device', () => {
    expect(shouldSync(HEART_RATE_ZONE_SETTINGS_KEY)).toBe(true);
    expect(shouldSync(RESTING_HEART_RATE_KEY)).toBe(false);
    expect(shouldSync(DEV_HEALTH_MOCK_SCENARIO_KEY)).toBe(false);
  });

  it('defaults zone settings and round-trips them', async () => {
    await expect(getHeartRateZoneSettings()).resolves.toEqual({
      birthYear: null,
      method: 'basic',
    });

    await setHeartRateZoneSettings({ birthYear: 1993, method: 'karvonen' });

    await expect(getHeartRateZoneSettings()).resolves.toEqual({
      birthYear: 1993,
      method: 'karvonen',
    });
  });

  it('falls back to defaults for malformed settings', async () => {
    await AsyncStorage.setItem(HEART_RATE_ZONE_SETTINGS_KEY, '{"method":7}');

    await expect(getHeartRateZoneSettings()).resolves.toEqual({
      birthYear: null,
      method: 'basic',
    });
  });

  it('rejects manual resting HR outside 30–120 bpm', async () => {
    await expect(setManualRestingHeartRate(25, NOW)).rejects.toThrow();
    await expect(getRestingHeartRate()).resolves.toBeNull();
  });

  it('does not let a Health refresh overwrite a manual value', async () => {
    await setManualRestingHeartRate(49, NOW);

    await expect(applyHealthRestingHeartRate(HEALTH_SAMPLE)).resolves.toEqual({
      bpm: 49,
      source: 'manual',
      recordedAt: NOW.toISOString(),
    });
  });

  it('lets a Health refresh overwrite a previous Health value', async () => {
    await applyHealthRestingHeartRate({
      bpm: 58,
      recordedAt: NOW.toISOString(),
    });
    await applyHealthRestingHeartRate(HEALTH_SAMPLE);

    await expect(getRestingHeartRate()).resolves.toEqual({
      ...HEALTH_SAMPLE,
      source: 'health',
    });
  });

  it('replaces a manual value when the user chooses the Health value', async () => {
    await setManualRestingHeartRate(49, NOW);
    await replaceWithHealthRestingHeartRate(HEALTH_SAMPLE);

    await expect(getRestingHeartRate()).resolves.toEqual({
      ...HEALTH_SAMPLE,
      source: 'health',
    });
  });

  it('clears cached Health values but keeps manual values', async () => {
    await applyHealthRestingHeartRate(HEALTH_SAMPLE);
    await clearHealthRestingHeartRate();
    await expect(getRestingHeartRate()).resolves.toBeNull();

    await setManualRestingHeartRate(49, NOW);
    await clearHealthRestingHeartRate();
    await expect(getRestingHeartRate()).resolves.toMatchObject({ bpm: 49 });
  });

  it('round-trips the dev health mock scenario', async () => {
    await expect(getDevHealthMockScenario()).resolves.toBe('off');
    await setDevHealthMockScenario('noData');
    await expect(getDevHealthMockScenario()).resolves.toBe('noData');
  });
});
