import { lbToKg } from '@/src/utils/weightUnits';
import type { WeightUnit } from '@/src/utils/storage';

/** Maintenance dose (g per kg body mass). Aligns with ISSN ~0.03 g/kg guidance. */
export const CREATINE_MAINTENANCE_G_PER_KG = 0.03;

/**
 * Higher-end daily dose used by many lifters when aiming for size (grams per kg).
 * This intentionally biases toward the upper end while staying practical.
 */
export const CREATINE_SIZE_FOCUSED_G_PER_KG = 0.05;

/** Optional loading phase dose (g per kg body mass) for 5–7 days. */
export const CREATINE_LOADING_G_PER_KG = 0.2;

export const CREATINE_MAINTENANCE_MIN_G = 3;
export const CREATINE_MAINTENANCE_MAX_G = 5;

export const CREATINE_SIZE_FOCUSED_MIN_G = 5;
export const CREATINE_SIZE_FOCUSED_MAX_G = 10;

export const CREATINE_LOADING_GI_WARNING_THRESHOLD_G = 15;

export type CreatineDoseResult = {
  maintenanceGrams: number;
  sizeFocusedGrams: number;
  loadingGrams: number;
};

export function parseBodyweightToKg(
  raw: string,
  unit: WeightUnit
): number | null {
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

/**
 * Daily maintenance creatine dose for muscle gain (grams).
 * Clamped to 3–5 g/day, which covers the evidence-based range for most lifters.
 */
export function calculateCreatineMaintenanceDoseG(
  bodyweightKg: number
): number | null {
  if (!Number.isFinite(bodyweightKg) || bodyweightKg <= 0) {
    return null;
  }
  const raw = bodyweightKg * CREATINE_MAINTENANCE_G_PER_KG;
  const clamped = Math.min(
    CREATINE_MAINTENANCE_MAX_G,
    Math.max(CREATINE_MAINTENANCE_MIN_G, raw)
  );
  return Math.round(clamped * 10) / 10;
}

/**
 * Size-focused daily dose (grams).
 * Clamped to 5–10 g/day to keep it practical.
 */
export function calculateCreatineSizeFocusedDoseG(
  bodyweightKg: number
): number | null {
  if (!Number.isFinite(bodyweightKg) || bodyweightKg <= 0) {
    return null;
  }
  const raw = bodyweightKg * CREATINE_SIZE_FOCUSED_G_PER_KG;
  const clamped = Math.min(
    CREATINE_SIZE_FOCUSED_MAX_G,
    Math.max(CREATINE_SIZE_FOCUSED_MIN_G, raw)
  );
  return Math.round(clamped * 10) / 10;
}

/** Total daily amount during a typical loading phase (5–7 days). */
export function calculateCreatineLoadingDoseG(bodyweightKg: number): number | null {
  if (!Number.isFinite(bodyweightKg) || bodyweightKg <= 0) {
    return null;
  }
  return Math.round(bodyweightKg * CREATINE_LOADING_G_PER_KG * 10) / 10;
}

export function calculateCreatineDoses(
  bodyweightKg: number
): CreatineDoseResult | null {
  const maintenanceGrams = calculateCreatineMaintenanceDoseG(bodyweightKg);
  const sizeFocusedGrams = calculateCreatineSizeFocusedDoseG(bodyweightKg);
  const loadingGrams = calculateCreatineLoadingDoseG(bodyweightKg);
  if (
    maintenanceGrams === null ||
    sizeFocusedGrams === null ||
    loadingGrams === null
  ) {
    return null;
  }
  return { maintenanceGrams, sizeFocusedGrams, loadingGrams };
}

export function formatCreatineGrams(grams: number): string {
  const trimmed = grams.toFixed(1).replace(/\.0$/, '');
  return `${trimmed} g`;
}
