import type { WeightUnit } from '@/src/utils/storage';

const KG_PER_LB = 0.45359237;

export function kgToLb(kg: number): number {
  return kg / KG_PER_LB;
}

export function lbToKg(lb: number): number {
  return lb * KG_PER_LB;
}

export function roundLbToNearestWhole(lb: number): number {
  return Math.round(lb);
}

function formatNumberTrimmed(n: number, maxDecimals: number): string {
  if (!Number.isFinite(n)) {
    return '';
  }
  const s = n.toFixed(maxDecimals);
  return s.replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1');
}

export function formatWeightFromKg(kg: number, unit: WeightUnit): string {
  if (!Number.isFinite(kg)) {
    return '';
  }
  if (unit === 'lb') {
    const roundedLb = roundLbToNearestWhole(kgToLb(kg));
    return `${formatNumberTrimmed(roundedLb, 0)} lb`;
  }
  return `${formatNumberTrimmed(kg, 2)} kg`;
}

export function formatWeightValueFromKg(kg: number, unit: WeightUnit): string {
  if (!Number.isFinite(kg)) {
    return '';
  }
  if (unit === 'lb') {
    const roundedLb = roundLbToNearestWhole(kgToLb(kg));
    return formatNumberTrimmed(roundedLb, 0);
  }
  return formatNumberTrimmed(kg, 2);
}

export function parseUserWeightInputToKg(
  raw: string,
  unit: WeightUnit
): number | null {
  const trimmed = raw.trim();
  if (!trimmed) {
    return null;
  }
  const n = parseFloat(trimmed);
  if (!Number.isFinite(n)) {
    return null;
  }
  return unit === 'lb' ? lbToKg(n) : n;
}

export function formatVolumeFromKg(volumeKg: number, unit: WeightUnit): string {
  if (!Number.isFinite(volumeKg)) {
    return '';
  }
  if (unit === 'lb') {
    const roundedLb = roundLbToNearestWhole(kgToLb(volumeKg));
    return `${roundedLb.toLocaleString()} lb`;
  }
  return `${volumeKg.toLocaleString()} kg`;
}

