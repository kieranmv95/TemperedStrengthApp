import {
  buildOneRepMaxPercentageTable,
  calculateOneRepMaxKg,
} from '@/src/utils/oneRepMax';

describe('calculateOneRepMaxKg', () => {
  it('returns lift weight for a single rep', () => {
    expect(calculateOneRepMaxKg(100, 1)).toBe(100);
  });

  it('applies Brzycki for multiple reps', () => {
    expect(calculateOneRepMaxKg(100, 5)).toBeCloseTo(112.5, 1);
  });

  it('rejects invalid reps', () => {
    expect(calculateOneRepMaxKg(100, 0)).toBeNull();
    expect(calculateOneRepMaxKg(100, 37)).toBeNull();
  });
});

describe('buildOneRepMaxPercentageTable', () => {
  it('maps chart percentages to weights and reps', () => {
    const rows = buildOneRepMaxPercentageTable(100, 'kg');
    expect(rows[0]).toEqual({ percent: 100, weight: 100, reps: 1 });
    expect(rows[1]).toEqual({ percent: 95, weight: 95, reps: 2 });
    expect(rows[2]).toEqual({ percent: 90, weight: 90, reps: 4 });
  });
});
