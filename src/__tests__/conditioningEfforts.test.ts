import { CONDITIONING_ACTIVITIES } from '@/src/data/conditioningActivities';
import {
  bestConditioningEffort,
  formatConditioningPace,
  formatDuration,
  isFasterConditioningEffort,
  listConditioningSummaryLines,
  parseDurationInput,
} from '@/src/utils/conditioningEfforts';
import type { ConditioningEffort } from '@/src/types/conditioningEfforts';

describe('parseDurationInput', () => {
  it('parses minutes and seconds', () => {
    expect(parseDurationInput('22:10')).toBe(1_330_000);
    expect(parseDurationInput('0:22')).toBe(22_000);
    expect(parseDurationInput('90:00')).toBe(5_400_000);
  });

  it('parses hours and fractional seconds', () => {
    expect(parseDurationInput('1:02:30')).toBe(3_750_000);
    expect(parseDurationInput('01:45:30')).toBe(6_330_000);
    expect(parseDurationInput('02:05:09')).toBe(7_509_000);
    expect(parseDurationInput('22:10.5')).toBe(1_330_500);
    expect(parseDurationInput('01:02:30.12')).toBe(3_750_120);
  });

  it('rejects empty, zero, and unclocked values', () => {
    expect(parseDurationInput('')).toBeNull();
    expect(parseDurationInput('0:00')).toBeNull();
    expect(parseDurationInput('22')).toBeNull();
    expect(parseDurationInput('1:60')).toBeNull();
    expect(parseDurationInput('abc')).toBeNull();
  });
});

describe('formatDuration', () => {
  it('prints a clock and keeps tenths when they are set', () => {
    expect(formatDuration(22_000)).toBe('0:22');
    expect(formatDuration(1_330_000)).toBe('22:10');
    expect(formatDuration(1_330_500)).toBe('22:10.5');
    expect(formatDuration(3_750_000)).toBe('01:02:30');
  });
});

describe('conditioning bests', () => {
  const run = CONDITIONING_ACTIVITIES[0];
  const entries: ConditioningEffort[] = [
    {
      id: 'slow',
      activityId: 'run',
      distanceM: 5000,
      durationMs: 1_500_000,
      achievedAt: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'fast',
      activityId: 'run',
      distanceM: 5000,
      durationMs: 1_330_000,
      achievedAt: '2026-02-01T00:00:00.000Z',
    },
    {
      id: 'other',
      activityId: 'run',
      distanceM: 1000,
      durationMs: 240_000,
      achievedAt: '2026-03-01T00:00:00.000Z',
    },
  ];

  it('keeps the fastest time for a distance', () => {
    expect(bestConditioningEffort(entries.slice(0, 2))?.id).toBe('fast');
    expect(isFasterConditioningEffort(1_200_000, 1_330_000)).toBe(true);
    expect(isFasterConditioningEffort(1_400_000, 1_330_000)).toBe(false);
  });

  it('summarises logged distances in catalog order', () => {
    expect(listConditioningSummaryLines(entries, run)).toEqual([
      { distanceM: 1000, label: '1 km: 4:00' },
      { distanceM: 5000, label: '5 km: 22:10' },
    ]);
  });

  it('derives pace from the distance', () => {
    expect(formatConditioningPace(1_330_000, 5000, run)).toBe('4:26/km');
  });
});

describe('long distances', () => {
  const labels = [
    'Half marathon',
    'Marathon',
    '50 km',
    '50 miles',
    '100 km',
    '100 miles',
  ];

  it('offers the same road distances on the run and the bike', () => {
    const run = CONDITIONING_ACTIVITIES.find(
      (activity) => activity.id === 'run'
    );
    const bike = CONDITIONING_ACTIVITIES.find(
      (activity) => activity.id === 'bike_erg'
    );
    for (const label of labels) {
      expect(run?.distances.some((distance) => distance.label === label)).toBe(
        true
      );
      expect(bike?.distances.some((distance) => distance.label === label)).toBe(
        true
      );
    }
  });
});

describe('triathlon races', () => {
  it('lists the standard formats', () => {
    const triathlon = CONDITIONING_ACTIVITIES.find(
      (activity) => activity.id === 'triathlon'
    );
    expect(triathlon?.distances.map((distance) => distance.label)).toEqual([
      'Super Sprint',
      'Sprint',
      'Olympic',
      '70.3',
      'Ironman',
    ]);
  });
});
