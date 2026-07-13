// Helpers for turning a stored training max into per-set target weights for
// training-max-relative schemes (e.g. Wendler 5/3/1).
import type { WeightUnit } from '@/src/utils/storage';
import { kgToLb, lbToKg } from '@/src/utils/weightUnits';

// Gym-plate friendly rounding: nearest 5 lb, or nearest 2.5 kg.
const LB_STEP = 5;
const KG_STEP = 2.5;

/**
 * Training max after cycle-over-cycle increases, in kilograms.
 * `incrementLb` is the cumulative pounds added for the current cycle.
 */
export function effectiveTrainingMaxKg(
  trainingMaxKg: number,
  incrementLb: number
): number {
  return trainingMaxKg + lbToKg(incrementLb);
}

/**
 * Target weight (kg) for one set at `percentOfTrainingMax` of the given training
 * max, rounded to a gym-friendly increment in the lifter's unit.
 */
export function trainingMaxSetWeightKg(
  trainingMaxKg: number,
  percentOfTrainingMax: number,
  unit: WeightUnit
): number {
  const rawKg = trainingMaxKg * (percentOfTrainingMax / 100);
  if (unit === 'lb') {
    const roundedLb = Math.round(kgToLb(rawKg) / LB_STEP) * LB_STEP;
    return lbToKg(roundedLb);
  }
  const roundedKg = Math.round(rawKg / KG_STEP) * KG_STEP;
  return roundedKg;
}
