import { parseBodyweightToKg } from '@/src/utils/creatine';
import type { WeightUnit } from '@/src/utils/storage';

/** Base hydration (ml per kg body mass). */
export const WATER_BASE_ML_PER_KG = 35;

/** Extra ml per kg when taking creatine. */
export const WATER_CREATINE_ML_PER_KG = 3;

export type WaterActivityLevel = 0 | 1 | 2 | 3;

export type WaterActivityOption = {
  level: WaterActivityLevel;
  label: string;
  shortLabel: string;
  description: string;
  /** Added ml per kg on top of base. */
  mlPerKg: number;
};

export const WATER_ACTIVITY_OPTIONS: WaterActivityOption[] = [
  {
    level: 0,
    label: 'Low',
    shortLabel: 'Low',
    description: 'Mostly sedentary, little training',
    mlPerKg: 0,
  },
  {
    level: 1,
    label: 'Moderate',
    shortLabel: 'Mod',
    description: '3–4 sessions per week',
    mlPerKg: 5,
  },
  {
    level: 2,
    label: 'High',
    shortLabel: 'High',
    description: '5–6 sessions or hard training',
    mlPerKg: 10,
  },
  {
    level: 3,
    label: 'Very high',
    shortLabel: 'Max',
    description: 'Daily intense training or manual work',
    mlPerKg: 15,
  },
];

export type WaterIntakeResult = {
  totalMl: number;
  baseMl: number;
  activityMl: number;
  creatineMl: number;
  activityLevel: WaterActivityLevel;
  activityLabel: string;
};

export { parseBodyweightToKg };

export function getWaterActivityOption(
  level: WaterActivityLevel
): WaterActivityOption {
  return WATER_ACTIVITY_OPTIONS[level];
}

export function calculateWaterIntakeMl(
  bodyweightKg: number,
  activityLevel: WaterActivityLevel,
  takingCreatine: boolean
): WaterIntakeResult | null {
  if (!Number.isFinite(bodyweightKg) || bodyweightKg <= 0) {
    return null;
  }

  const activity = getWaterActivityOption(activityLevel);
  const baseMl = bodyweightKg * WATER_BASE_ML_PER_KG;
  const activityMl = bodyweightKg * activity.mlPerKg;
  const creatineMl = takingCreatine
    ? bodyweightKg * WATER_CREATINE_ML_PER_KG
    : 0;
  const totalMl = Math.round(baseMl + activityMl + creatineMl);

  return {
    totalMl,
    baseMl: Math.round(baseMl),
    activityMl: Math.round(activityMl),
    creatineMl: Math.round(creatineMl),
    activityLevel,
    activityLabel: activity.label,
  };
}

export function formatWaterMl(ml: number): string {
  if (ml >= 1000) {
    const litres = ml / 1000;
    const formatted =
      litres % 1 === 0 ? String(litres) : litres.toFixed(1).replace(/\.0$/, '');
    return `${formatted} L`;
  }
  return `${ml} ml`;
}

export function formatWaterBreakdownMl(ml: number): string {
  return `${ml.toLocaleString()} ml`;
}
