import {
  calculateWaterIntakeMl,
  formatWaterMl,
  WATER_ACTIVITY_OPTIONS,
} from '@/src/utils/waterIntake';

describe('calculateWaterIntakeMl', () => {
  it('calculates base hydration for 80 kg, moderate activity, no creatine', () => {
    expect(calculateWaterIntakeMl(80, 1, false)).toEqual({
      totalMl: 3200,
      baseMl: 2800,
      activityMl: 400,
      creatineMl: 0,
      activityLevel: 1,
      activityLabel: 'Moderate',
    });
  });

  it('adds creatine adjustment when enabled', () => {
    const result = calculateWaterIntakeMl(80, 1, true);
    expect(result?.creatineMl).toBe(240);
    expect(result?.totalMl).toBe(3440);
  });

  it('scales with higher activity', () => {
    const low = calculateWaterIntakeMl(100, 0, false);
    const high = calculateWaterIntakeMl(100, 3, false);
    expect(high!.totalMl).toBeGreaterThan(low!.totalMl);
  });

  it('rejects invalid bodyweight', () => {
    expect(calculateWaterIntakeMl(0, 1, false)).toBeNull();
  });
});

describe('formatWaterMl', () => {
  it('formats litres for large amounts', () => {
    expect(formatWaterMl(3200)).toBe('3.2 L');
    expect(formatWaterMl(3000)).toBe('3 L');
  });

  it('formats ml for small amounts', () => {
    expect(formatWaterMl(500)).toBe('500 ml');
  });
});

describe('WATER_ACTIVITY_OPTIONS', () => {
  it('has four activity levels', () => {
    expect(WATER_ACTIVITY_OPTIONS).toHaveLength(4);
  });
});
