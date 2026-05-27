import {
  buildOneRepMaxBreakdownTable,
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

describe('buildOneRepMaxBreakdownTable', () => {
  it('lists 10% steps from 100 down to 0', () => {
    const rows = buildOneRepMaxBreakdownTable(200, 'kg', 10);
    expect(rows.map((r) => r.percent)).toEqual([
      100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0,
    ]);
    expect(rows[0].weight).toBe(200);
    expect(rows[5].weight).toBe(100);
    expect(rows[10].weight).toBe(0);
  });

  it('lists 5% steps from 100 down to 0', () => {
    const rows = buildOneRepMaxBreakdownTable(100, 'kg', 5);
    expect(rows).toHaveLength(21);
    expect(rows[0].percent).toBe(100);
    expect(rows[rows.length - 1].percent).toBe(0);
    expect(rows[1].percent).toBe(95);
  });
});
