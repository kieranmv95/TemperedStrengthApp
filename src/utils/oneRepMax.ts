import type { WeightUnit } from '@/src/utils/storage';
import { kgToLb, lbToKg, roundLbToNearestWhole } from '@/src/utils/weightUnits';

/** Estimated reps achievable at a given percentage of 1RM (common strength chart). */
export const ONE_RM_PERCENTAGE_ROWS = [
  { percent: 100, reps: 1 },
  { percent: 95, reps: 2 },
  { percent: 90, reps: 4 },
  { percent: 85, reps: 6 },
  { percent: 80, reps: 8 },
  { percent: 75, reps: 10 },
  { percent: 70, reps: 12 },
  { percent: 65, reps: 15 },
  { percent: 60, reps: 20 },
] as const;

export type OneRepMaxPercentageRow = {
  percent: number;
  weight: number;
  reps: number;
};

export type OneRepMaxBreakdownRow = {
  percent: number;
  weight: number;
};

export type OneRepMaxBreakdownStep = 5 | 10;

/**
 * Brzycki formula. For 1 rep, returns the entered weight unchanged.
 */
export function calculateOneRepMaxKg(weightKg: number, reps: number): number | null {
  if (!Number.isFinite(weightKg) || weightKg <= 0) {
    return null;
  }
  if (!Number.isInteger(reps) || reps < 1) {
    return null;
  }
  if (reps === 1) {
    return weightKg;
  }
  if (reps >= 37) {
    return null;
  }
  return weightKg * (36 / (37 - reps));
}

export function buildOneRepMaxPercentageTable(
  oneRepMaxKg: number,
  unit: WeightUnit
): OneRepMaxPercentageRow[] {
  return ONE_RM_PERCENTAGE_ROWS.map((row) => ({
    percent: row.percent,
    reps: row.reps,
    weight: displayWeightFromKg(oneRepMaxKg * (row.percent / 100), unit),
  }));
}

function displayWeightFromKg(kg: number, unit: WeightUnit): number {
  if (unit === 'lb') {
    return roundLbToNearestWhole(kgToLb(kg));
  }
  return Math.round(kg * 10) / 10;
}

export function formatDisplayWeight(weight: number, unit: WeightUnit): string {
  const suffix = unit === 'lb' ? 'lb' : 'kg';
  const formatted =
    unit === 'lb' ? String(Math.round(weight)) : String(weight);
  return `${formatted} ${suffix}`;
}

export function parseLiftWeightToKg(raw: string, unit: WeightUnit): number | null {
  const trimmed = raw.trim();
  if (!trimmed) {
    return null;
  }
  const n = parseFloat(trimmed);
  if (!Number.isFinite(n) || n <= 0) {
    return null;
  }
  return unit === 'lb' ? lbToKg(n) : n;
}

export function oneRepMaxKgToDisplay(oneRepMaxKg: number, unit: WeightUnit): number {
  return displayWeightFromKg(oneRepMaxKg, unit);
}

/** Percentage ladder from 100% down to 0% in fixed steps (includes 0%). */
export function buildOneRepMaxBreakdownTable(
  oneRepMaxKg: number,
  unit: WeightUnit,
  stepPercent: OneRepMaxBreakdownStep
): OneRepMaxBreakdownRow[] {
  const rows: OneRepMaxBreakdownRow[] = [];
  for (let percent = 100; percent >= 0; percent -= stepPercent) {
    rows.push({
      percent,
      weight: displayWeightFromKg(oneRepMaxKg * (percent / 100), unit),
    });
  }
  return rows;
}
