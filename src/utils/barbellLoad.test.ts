import {
  calculatePlates,
  getAvailablePlates,
  getBarbellWeight,
  resolveBarbellSheetRequest,
} from '@/src/utils/barbellLoad';

describe('getBarbellWeight', () => {
  it('returns Olympic bar weights', () => {
    expect(getBarbellWeight('male', 'kg')).toBe(20);
    expect(getBarbellWeight('female', 'kg')).toBe(15);
    expect(getBarbellWeight('male', 'lb')).toBe(45);
    expect(getBarbellWeight('female', 'lb')).toBe(35);
  });
});

describe('getAvailablePlates', () => {
  it('returns the kg and lb catalogs', () => {
    expect(getAvailablePlates('kg')).toEqual([
      25, 20, 15, 10, 5, 2.5, 2, 1.5, 1.25, 1, 0.5, 0.25,
    ]);
    expect(getAvailablePlates('lb')).toEqual([
      55, 45, 35, 25, 10, 5, 2.5, 1.25,
    ]);
  });
});

describe('calculatePlates', () => {
  it('loads an exact target on a male bar', () => {
    const result = calculatePlates(100, 'male', [], 'kg');
    expect(result.barWeight).toBe(20);
    expect(result.targetWeight).toBe(100);
    expect(result.achievedWeight).toBe(100);
    // (100 - 20) / 2 = 40 → 25 + 15
    expect(result.plates).toEqual([
      expect.objectContaining({ weight: 25, count: 1 }),
      expect.objectContaining({ weight: 15, count: 1 }),
    ]);
  });

  it('loads an exact target on a female bar', () => {
    const result = calculatePlates(100, 'female', [], 'kg');
    expect(result.barWeight).toBe(15);
    expect(result.achievedWeight).toBe(100);
    // (100 - 15) / 2 = 42.5 → 25 + 15 + 2.5
    expect(result.plates).toEqual([
      expect.objectContaining({ weight: 25, count: 1 }),
      expect.objectContaining({ weight: 15, count: 1 }),
      expect.objectContaining({ weight: 2.5, count: 1 }),
    ]);
  });

  it('returns only the bar when the target is under the bar weight', () => {
    const result = calculatePlates(10, 'male', [], 'kg');
    expect(result.plates).toEqual([]);
    expect(result.achievedWeight).toBe(20);
    expect(result.targetWeight).toBe(10);
  });

  it('drops an unallocatable remainder', () => {
    // Own only 25 kg plates: (102.5 - 20) / 2 = 41.25 → one 25, remainder 16.25
    const result = calculatePlates(102.5, 'male', [25], 'kg');
    expect(result.plates).toEqual([
      expect.objectContaining({ weight: 25, count: 1 }),
    ]);
    expect(result.achievedWeight).toBe(70);
  });

  it('filters to owned plates only', () => {
    const result = calculatePlates(100, 'male', [20, 10], 'kg');
    // (100 - 20) / 2 = 40 → two 20s
    expect(result.plates).toEqual([
      expect.objectContaining({ weight: 20, count: 2 }),
    ]);
    expect(result.achievedWeight).toBe(100);
  });

  it('loads a male bar in pounds', () => {
    const result = calculatePlates(135, 'male', [], 'lb');
    expect(result.barWeight).toBe(45);
    expect(result.achievedWeight).toBe(135);
    // (135 - 45) / 2 = 45 → one 45
    expect(result.plates).toEqual([
      expect.objectContaining({ weight: 45, count: 1 }),
    ]);
  });

  it('loads a female bar in pounds', () => {
    const result = calculatePlates(95, 'female', [], 'lb');
    expect(result.barWeight).toBe(35);
    expect(result.achievedWeight).toBe(95);
    // (95 - 35) / 2 = 30 → one 25 + one 5
    expect(result.plates).toEqual([
      expect.objectContaining({ weight: 25, count: 1 }),
      expect.objectContaining({ weight: 5, count: 1 }),
    ]);
  });

  it('uses the full catalog when ownedPlates is empty', () => {
    const withEmpty = calculatePlates(60, 'male', [], 'kg');
    const withAll = calculatePlates(60, 'male', getAvailablePlates('kg'), 'kg');
    expect(withEmpty.plates).toEqual(withAll.plates);
    expect(withEmpty.achievedWeight).toBe(60);
  });
});

describe('resolveBarbellSheetRequest', () => {
  it('opens a men’s/women’s pair on the load that matches the saved bar', () => {
    expect(
      resolveBarbellSheetRequest(
        { weight: 70, womensWeight: 50, label: '70kg/50kg' },
        'male'
      )
    ).toEqual({
      weight: 70,
      rangeLowWeight: 50,
      rangeHighWeight: 70,
      label: '70kg/50kg',
    });
    expect(
      resolveBarbellSheetRequest({ weight: 70, womensWeight: 50 }, 'female')
        ?.weight
    ).toBe(50);
  });

  it('keeps a percent range starting at the low end', () => {
    expect(
      resolveBarbellSheetRequest({ weight: 80, rangeHighWeight: 100 }, 'female')
    ).toEqual({
      weight: 80,
      rangeLowWeight: 80,
      rangeHighWeight: 100,
      label: null,
    });
  });

  it('ignores an empty or identical women’s load', () => {
    expect(resolveBarbellSheetRequest({ weight: 60 }, 'female')).toEqual({
      weight: 60,
      rangeLowWeight: null,
      rangeHighWeight: null,
      label: null,
    });
    expect(
      resolveBarbellSheetRequest({ weight: 60, womensWeight: 60 }, 'female')
    ).toEqual({
      weight: 60,
      rangeLowWeight: null,
      rangeHighWeight: null,
      label: null,
    });
  });

  it('rejects a non-positive target', () => {
    expect(resolveBarbellSheetRequest({ weight: 0 }, 'male')).toBeNull();
  });
});
