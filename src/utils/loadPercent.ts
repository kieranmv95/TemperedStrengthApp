import type {
  ExercisePersonalBestsLedger,
  RepMax,
} from '@/src/types/personalBests';
import {
  calculateOneRepMaxKg,
  formatDisplayWeight,
  oneRepMaxKgToDisplay,
} from '@/src/utils/oneRepMax';
import { currentMaxWeight } from '@/src/utils/personalBests';
import type { WeightUnit } from '@/src/utils/storage';

/** Plain copy or a marked 1RM percentage run. */
export type LoadPercentSegment =
  | { type: 'text'; text: string }
  | {
      type: 'load';
      /** Leading `~` in the token, e.g. `{{~90}}`. */
      approx: boolean;
      low: number;
      /** Upper bound for ranges such as `{{72-78}}`; null for a single percent. */
      high: number | null;
    };

const LOAD_TOKEN_RE = /\{\{(~?)(\d+)(?:-(\d+))?\}\}/g;

/** Rep tiers used to estimate a 1RM when no true 1RM is logged. */
const ESTIMATE_TIERS: readonly RepMax[] = [2, 3, 5];

export function stringHasLoadPercentTokens(text: string): boolean {
  return /\{\{(~?)(\d+)(?:-(\d+))?\}\}/.test(text);
}

type LoadPercentMovement =
  | string
  | { name: string; value: string; note?: string }
  | { type: 'divider'; note?: string };

function isDividerMovement(
  movement: LoadPercentMovement
): movement is { type: 'divider'; note?: string } {
  return (
    typeof movement === 'object' &&
    movement !== null &&
    'type' in movement &&
    movement.type === 'divider'
  );
}

/** True when any instructions / highlight / movement string on the block has tokens. */
export function blockHasLoadPercentTokens(block: {
  instructions?: string;
  highlightInstructions?: string;
  movements?: ReadonlyArray<LoadPercentMovement>;
}): boolean {
  if (block.instructions && stringHasLoadPercentTokens(block.instructions)) {
    return true;
  }
  if (
    block.highlightInstructions &&
    stringHasLoadPercentTokens(block.highlightInstructions)
  ) {
    return true;
  }
  if (!block.movements) {
    return false;
  }
  for (const movement of block.movements) {
    if (typeof movement === 'string') {
      if (stringHasLoadPercentTokens(movement)) {
        return true;
      }
      continue;
    }
    if (isDividerMovement(movement)) {
      if (movement.note && stringHasLoadPercentTokens(movement.note)) {
        return true;
      }
      continue;
    }
    if (stringHasLoadPercentTokens(movement.name)) {
      return true;
    }
    if (stringHasLoadPercentTokens(movement.value)) {
      return true;
    }
    if (movement.note && stringHasLoadPercentTokens(movement.note)) {
      return true;
    }
  }
  return false;
}

/**
 * Split copy into plain text and load tokens. Tokens look like
 * `{{40}}`, `{{72-78}}`, `{{~90}}`, or `{{~95-100}}`.
 */
export function parseLoadPercentSegments(text: string): LoadPercentSegment[] {
  const segments: LoadPercentSegment[] = [];
  let lastIndex = 0;
  const re = new RegExp(LOAD_TOKEN_RE.source, 'g');
  let match: RegExpExecArray | null;

  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: 'text', text: text.slice(lastIndex, match.index) });
    }
    const approx = match[1] === '~';
    const low = Number(match[2]);
    const highRaw = match[3];
    const high = highRaw !== undefined ? Number(highRaw) : null;
    segments.push({ type: 'load', approx, low, high });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    segments.push({ type: 'text', text: text.slice(lastIndex) });
  }

  if (segments.length === 0) {
    return [{ type: 'text', text }];
  }

  return segments;
}

/**
 * Resolve a usable estimated 1RM in kg from a personal-best ledger.
 * Prefers a logged 1RM; otherwise Brzycki from a 2RM, 3RM, or 5RM.
 */
export function resolveEstimatedOneRmKg(
  ledger: ExercisePersonalBestsLedger
): number | null {
  const oneRm = currentMaxWeight(ledger, 1);
  if (oneRm !== undefined) {
    return oneRm;
  }

  for (const tier of ESTIMATE_TIERS) {
    const weight = currentMaxWeight(ledger, tier);
    if (weight === undefined) {
      continue;
    }
    const estimated = calculateOneRepMaxKg(weight, tier);
    if (estimated !== null) {
      return estimated;
    }
  }

  return null;
}

function formatPercentLabel(segment: Extract<LoadPercentSegment, { type: 'load' }>): string {
  const prefix = segment.approx ? '~' : '';
  if (segment.high === null) {
    return `${prefix}${segment.low}%`;
  }
  return `${prefix}${segment.low}–${segment.high}%`;
}

/**
 * Round a displayed load to a plate-friendly increment:
 * kg → nearest 0.5, lb → nearest whole (already how lb displays).
 */
export function roundLoadToPlateIncrement(
  weight: number,
  unit: WeightUnit
): number {
  if (!Number.isFinite(weight) || weight < 0) {
    return 0;
  }
  if (unit === 'lb') {
    return Math.round(weight);
  }
  return Math.round(weight * 2) / 2;
}

function weightAtPercent(
  oneRmKg: number,
  percent: number,
  unit: WeightUnit
): number {
  const raw = oneRepMaxKgToDisplay(oneRmKg * (percent / 100), unit);
  return roundLoadToPlateIncrement(raw, unit);
}

function formatWeightAtPercent(
  oneRmKg: number,
  percent: number,
  unit: WeightUnit
): string {
  const display = weightAtPercent(oneRmKg, percent, unit);
  return formatDisplayWeight(display, unit).replace(' ', '');
}

/** Resolved display-unit weights for a load segment, when a 1RM is known. */
export type ResolvedLoadWeights = {
  low: number;
  high: number | null;
};

/**
 * Numeric loads for opening the bar loader. Same rounding as the gold display
 * text. Returns null when there is no 1RM to resolve against.
 */
export function resolveLoadPercentWeights(
  segment: Extract<LoadPercentSegment, { type: 'load' }>,
  oneRmKg: number | null,
  unit: WeightUnit
): ResolvedLoadWeights | null {
  if (oneRmKg === null) {
    return null;
  }
  const low = weightAtPercent(oneRmKg, segment.low, unit);
  if (segment.high === null) {
    return { low, high: null };
  }
  return {
    low,
    high: weightAtPercent(oneRmKg, segment.high, unit),
  };
}

/**
 * Render a load segment for display. Without a 1RM: `40%` / `72–78%`.
 * With a 1RM: `40% (50kg)` / `72–78% (90kg–97.5kg)`.
 * Bracketed loads are rounded to plate-friendly increments (0.5 kg / whole lb).
 */
export function formatLoadPercentSegment(
  segment: Extract<LoadPercentSegment, { type: 'load' }>,
  oneRmKg: number | null,
  unit: WeightUnit
): string {
  const percentLabel = formatPercentLabel(segment);
  if (oneRmKg === null) {
    return percentLabel;
  }

  if (segment.high === null) {
    const weight = formatWeightAtPercent(oneRmKg, segment.low, unit);
    return `${percentLabel} (${weight})`;
  }

  const lowWeight = formatWeightAtPercent(oneRmKg, segment.low, unit);
  const highWeight = formatWeightAtPercent(oneRmKg, segment.high, unit);
  return `${percentLabel} (${lowWeight}–${highWeight})`;
}
