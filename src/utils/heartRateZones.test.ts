import {
  ageFromBirthYear,
  ageFromDateOfBirth,
  birthYearFromAge,
  calculateZoneRanges,
  estimateMaxHeartRate,
  findZoneRange,
  formatZonePercent,
  formatZoneRange,
  getZoneInfo,
  isValidRestingHr,
  isValidZoneAge,
  resolveZoneMethod,
  zoneRangesFromSettings,
  zoneSetupState,
} from '@/src/utils/heartRateZones';
import type { RestingHeartRate } from '@/src/types/heartRate';

const NOW = new Date('2026-11-13T12:00:00Z');

const MANUAL_RHR: RestingHeartRate = {
  bpm: 60,
  source: 'manual',
  recordedAt: '2026-11-13T07:00:00Z',
};

describe('estimateMaxHeartRate', () => {
  it('uses 220 minus age', () => {
    expect(estimateMaxHeartRate(30)).toBe(190);
  });
});

describe('calculateZoneRanges', () => {
  it('uses a percentage of max HR for the basic method', () => {
    expect(
      calculateZoneRanges({ age: 30, restingHr: null, method: 'basic' })
    ).toEqual([
      { zone: 1, minBpm: 95, maxBpm: 114 },
      { zone: 2, minBpm: 115, maxBpm: 133 },
      { zone: 3, minBpm: 134, maxBpm: 152 },
      { zone: 4, minBpm: 153, maxBpm: 171 },
      { zone: 5, minBpm: 172, maxBpm: null },
    ]);
  });

  it('uses a percentage of HR reserve for the Karvonen method', () => {
    expect(
      calculateZoneRanges({ age: 30, restingHr: 60, method: 'karvonen' })
    ).toEqual([
      { zone: 1, minBpm: 125, maxBpm: 138 },
      { zone: 2, minBpm: 139, maxBpm: 151 },
      { zone: 3, minBpm: 152, maxBpm: 164 },
      { zone: 4, minBpm: 165, maxBpm: 177 },
      { zone: 5, minBpm: 178, maxBpm: null },
    ]);
  });

  it('falls back to basic when Karvonen has no resting HR', () => {
    expect(
      calculateZoneRanges({ age: 30, restingHr: null, method: 'karvonen' })
    ).toEqual(
      calculateZoneRanges({ age: 30, restingHr: null, method: 'basic' })
    );
  });

  it('ignores the resting HR for the basic method', () => {
    expect(
      calculateZoneRanges({ age: 30, restingHr: 60, method: 'basic' })
    ).toEqual(
      calculateZoneRanges({ age: 30, restingHr: null, method: 'basic' })
    );
  });

  it('falls back to basic when the resting HR is out of range', () => {
    expect(
      calculateZoneRanges({ age: 30, restingHr: 200, method: 'karvonen' })
    ).toEqual(
      calculateZoneRanges({ age: 30, restingHr: null, method: 'basic' })
    );
  });

  it('returns null for an invalid age', () => {
    expect(
      calculateZoneRanges({ age: 5, restingHr: null, method: 'basic' })
    ).toBeNull();
  });

  it('produces contiguous ranges with an open top zone', () => {
    const ranges = calculateZoneRanges({
      age: 45,
      restingHr: 52,
      method: 'karvonen',
    });
    expect(ranges).not.toBeNull();
    const list = ranges ?? [];
    for (let i = 1; i < list.length; i += 1) {
      expect(list[i].minBpm).toBe((list[i - 1].maxBpm ?? 0) + 1);
    }
    expect(list[list.length - 1].maxBpm).toBeNull();
  });
});

describe('validation', () => {
  it('accepts ages from 13 to 100', () => {
    expect(isValidZoneAge(12)).toBe(false);
    expect(isValidZoneAge(13)).toBe(true);
    expect(isValidZoneAge(100)).toBe(true);
    expect(isValidZoneAge(101)).toBe(false);
    expect(isValidZoneAge(30.5)).toBe(false);
  });

  it('accepts resting HR from 30 to 120 bpm', () => {
    expect(isValidRestingHr(29)).toBe(false);
    expect(isValidRestingHr(30)).toBe(true);
    expect(isValidRestingHr(120)).toBe(true);
    expect(isValidRestingHr(121)).toBe(false);
  });
});

describe('resolveZoneMethod', () => {
  it('only resolves to Karvonen when a resting HR exists', () => {
    expect(resolveZoneMethod('karvonen', 55)).toBe('karvonen');
    expect(resolveZoneMethod('karvonen', null)).toBe('basic');
    expect(resolveZoneMethod('basic', 55)).toBe('basic');
  });
});

describe('birth year helpers', () => {
  it('round-trips age and birth year', () => {
    expect(birthYearFromAge(33, NOW)).toBe(1993);
    expect(ageFromBirthYear(1993, NOW)).toBe(33);
  });

  it('counts whole years from a date of birth', () => {
    expect(ageFromDateOfBirth(new Date(1993, 5, 15), NOW)).toBe(33);
    expect(ageFromDateOfBirth(new Date(1993, 11, 25), NOW)).toBe(32);
    expect(ageFromDateOfBirth(new Date(2020, 0, 1), NOW)).toBeNull();
  });
});

describe('zoneSetupState', () => {
  it('is notSetUp without an age', () => {
    expect(
      zoneSetupState({ birthYear: null, method: 'basic' }, null, NOW)
    ).toBe('notSetUp');
  });

  it('is ageOnly with an age and no resting HR', () => {
    expect(
      zoneSetupState({ birthYear: 1993, method: 'basic' }, null, NOW)
    ).toBe('ageOnly');
  });

  it('is ageAndRhr with both', () => {
    expect(
      zoneSetupState({ birthYear: 1993, method: 'basic' }, MANUAL_RHR, NOW)
    ).toBe('ageAndRhr');
  });
});

describe('zoneRangesFromSettings', () => {
  it('returns null until an age is set', () => {
    expect(
      zoneRangesFromSettings({ birthYear: null, method: 'basic' }, null, NOW)
    ).toBeNull();
  });

  it('uses the stored method and resting HR', () => {
    expect(
      zoneRangesFromSettings(
        { birthYear: 1996, method: 'karvonen' },
        MANUAL_RHR,
        NOW
      )
    ).toEqual(
      calculateZoneRanges({ age: 30, restingHr: 60, method: 'karvonen' })
    );
  });
});

describe('formatting', () => {
  it('formats closed and open ranges', () => {
    expect(formatZoneRange({ zone: 2, minBpm: 130, maxBpm: 140 })).toBe(
      '130–140 bpm'
    );
    expect(formatZoneRange({ zone: 5, minBpm: 171, maxBpm: null })).toBe(
      '171+ bpm'
    );
  });

  it('formats zone percentages', () => {
    expect(formatZonePercent(getZoneInfo(2))).toBe('60–70%');
    expect(formatZonePercent(getZoneInfo(5))).toBe('90%+');
  });

  it('finds a zone range', () => {
    const ranges = calculateZoneRanges({
      age: 30,
      restingHr: null,
      method: 'basic',
    });
    expect(findZoneRange(ranges, 2)).toEqual({
      zone: 2,
      minBpm: 115,
      maxBpm: 133,
    });
    expect(findZoneRange(null, 2)).toBeNull();
  });
});
