import type { WeightUnit } from '@/src/utils/storage';

export type BarType = 'male' | 'female';

export type Plate = {
  weight: number;
  /** Count on each side of the bar. */
  count: number;
  color: string;
  size: { height: number; thickness: number };
};

export type BarbellLoadResult = {
  plates: Plate[];
  barWeight: number;
  /** Total load that can be made with the owned plates (bar + both sides). */
  achievedWeight: number;
  targetWeight: number;
};

const availablePlatesByUnit: Record<WeightUnit, number[]> = {
  kg: [25, 20, 15, 10, 5, 2.5, 2, 1.5, 1.25, 1, 0.5, 0.25],
  lb: [55, 45, 35, 25, 10, 5, 2.5, 1.25],
};

const plateColorsByUnit: Record<WeightUnit, Record<number, string>> = {
  kg: {
    25: '#CE1126',
    20: '#0033A0',
    15: '#FFD700',
    10: '#009B77',
    5: '#FFFFFF',
    2.5: '#CE1126',
    2: '#0033A0',
    1.5: '#FFD700',
    1.25: '#444444',
    1: '#009B77',
    0.5: '#FFFFFF',
    0.25: '#C0C0C0',
  },
  lb: {
    55: '#404040',
    45: '#CE1126',
    35: '#0033A0',
    25: '#FFD700',
    10: '#009B77',
    5: '#FFFFFF',
    2.5: '#CE1126',
    1.25: '#444444',
  },
};

const plateSizesByUnit: Record<
  WeightUnit,
  Record<number, { height: number; thickness: number }>
> = {
  kg: {
    25: { height: 1, thickness: 1.0 },
    20: { height: 1, thickness: 0.939 },
    15: { height: 1, thickness: 0.833 },
    10: { height: 1, thickness: 0.682 },
    5: { height: 0.446, thickness: 0.394 },
    2.5: { height: 0.333, thickness: 0.333 },
    2: { height: 0.267, thickness: 0.288 },
    1.5: { height: 0.244, thickness: 0.197 },
    1.25: { height: 0.233, thickness: 0.197 },
    1: { height: 0.222, thickness: 0.197 },
    0.5: { height: 0.178, thickness: 0.197 },
    0.25: { height: 0.16, thickness: 0.197 },
  },
  lb: {
    55: { height: 1, thickness: 1.075 },
    45: { height: 1, thickness: 1.0 },
    35: { height: 0.9, thickness: 0.85 },
    25: { height: 0.8, thickness: 0.7 },
    10: { height: 0.6, thickness: 0.5 },
    5: { height: 0.45, thickness: 0.4 },
    2.5: { height: 0.35, thickness: 0.3 },
    1.25: { height: 0.3, thickness: 0.25 },
  },
};

const barbellWeightsByUnit: Record<WeightUnit, Record<BarType, number>> = {
  kg: { male: 20, female: 15 },
  lb: { male: 45, female: 35 },
};

export function getAvailablePlates(unit: WeightUnit): number[] {
  return availablePlatesByUnit[unit];
}

export function getBarbellWeight(barType: BarType, unit: WeightUnit): number {
  return barbellWeightsByUnit[unit][barType];
}

/**
 * Greedy per-side plate load for a target total weight.
 * Counts are per side. Unallocatable remainder is dropped from achieved.
 */
export function calculatePlates(
  weight: number,
  barType: BarType,
  ownedPlates: number[] = [],
  unit: WeightUnit = 'kg'
): BarbellLoadResult {
  const barWeight = getBarbellWeight(barType, unit);
  const availablePlates = getAvailablePlates(unit);
  const plateColors = plateColorsByUnit[unit];
  const plateSizes = plateSizesByUnit[unit];

  let remainingWeight = (weight - barWeight) / 2;
  if (remainingWeight < 0) {
    remainingWeight = 0;
  }

  const result: Plate[] = [];
  const selectedPlates =
    ownedPlates.length > 0 ? ownedPlates : availablePlates;
  const platesToUse = availablePlates.filter((plate) =>
    selectedPlates.includes(plate)
  );

  for (const plateWeight of platesToUse) {
    if (remainingWeight >= plateWeight) {
      const count = Math.floor(remainingWeight / plateWeight);
      if (count > 0) {
        result.push({
          weight: plateWeight,
          count,
          color: plateColors[plateWeight],
          size: plateSizes[plateWeight],
        });
        remainingWeight -= count * plateWeight;
      }
    }
  }

  const platesWeight = result.reduce(
    (total, plate) => total + plate.weight * plate.count * 2,
    0
  );

  return {
    plates: result,
    barWeight,
    achievedWeight: barWeight + platesWeight,
    targetWeight: weight,
  };
}
