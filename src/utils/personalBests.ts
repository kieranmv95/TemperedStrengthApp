import type {
  ExercisePersonalBestsLedger,
  PersonalBestEntry,
  PersonalBestHistoryEntry,
  RepMax,
} from '@/src/types/personalBests';
import type { WeightUnit } from '@/src/utils/storage';
import {
  formatWeightFromKg,
  formatWeightValueFromKg,
} from '@/src/utils/weightUnits';

export const REP_MAX_ORDER: RepMax[] = [1, 2, 3, 5, 10, 15, 20];

export function newPbEntryId(): string {
  const c = globalThis.crypto;
  if (c && typeof c.randomUUID === 'function') {
    return c.randomUUID();
  }
  return `pb_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

export function repCountToTier(reps: number): RepMax | null {
  if (!Number.isFinite(reps) || reps <= 0) {
    return null;
  }
  const tiers: RepMax[] = [20, 15, 10, 5, 3, 2, 1];
  return tiers.find((t) => reps >= t) ?? null;
}

/** Tiers with fewer reps than primary (e.g. primary 20 → 1…15). */
function tiersStrictlyBelow(primaryTier: RepMax): RepMax[] {
  return REP_MAX_ORDER.filter((r) => r < primaryTier);
}

function sortRepMaxAscending(tiers: RepMax[]): RepMax[] {
  return [...tiers].sort(
    (a, b) => REP_MAX_ORDER.indexOf(a) - REP_MAX_ORDER.indexOf(b)
  );
}

/** True when `candidate` beats `current` for this exercise's weight direction. */
export function isBetterWeight(
  candidate: number,
  current: number,
  lowerWeightIsBetter: boolean = false
): boolean {
  return lowerWeightIsBetter ? candidate < current : candidate > current;
}

/**
 * After the primary rep tier is already updated, append the same weight to lower
 * rep tiers where it beats the current best (used when editing a tier best).
 */
export function appendCascadeToLowerTiersOnly(
  ledger: ExercisePersonalBestsLedger,
  primaryTier: RepMax,
  weight: number,
  achievedAt: string,
  createId: () => string = newPbEntryId,
  lowerWeightIsBetter: boolean = false
): { updated: ExercisePersonalBestsLedger; appendedTiers: RepMax[] } {
  if (!Number.isFinite(weight) || weight <= 0) {
    return { updated: cloneLedger(ledger), appendedTiers: [] };
  }

  const updated = cloneLedger(ledger);
  const appendedTiers: RepMax[] = [];

  for (const t of tiersStrictlyBelow(primaryTier)) {
    const tierBest = currentMaxWeight(updated, t, lowerWeightIsBetter);
    if (
      tierBest === undefined ||
      isBetterWeight(weight, tierBest, lowerWeightIsBetter)
    ) {
      const row: PersonalBestHistoryEntry = {
        id: createId(),
        weight,
        achievedAt,
      };
      updated[t] = [...(updated[t] ?? []), row];
      appendedTiers.push(t);
    }
  }

  return { updated, appendedTiers };
}

/**
 * Most recent history row for this tier (latest achievedAt).
 */
export function getLatestEntryForTier(
  ledger: ExercisePersonalBestsLedger,
  tier: RepMax
): PersonalBestHistoryEntry | undefined {
  const rows = ledger[tier];
  if (!rows?.length) {
    return undefined;
  }
  let latest = rows[0];
  for (const r of rows) {
    if (
      new Date(r.achievedAt).getTime() > new Date(latest.achievedAt).getTime()
    ) {
      latest = r;
    }
  }
  return latest;
}

/**
 * Dry-run for workout PB modal: only true PRs open the prompt; `newRecords` matches
 * what {@link logPersonalBestIntoLedger} would write for a PR (primary + improved lowers).
 */
export function previewPersonalBestLog(
  ledger: ExercisePersonalBestsLedger,
  primaryTier: RepMax,
  weight: number,
  lowerWeightIsBetter: boolean = false
): { isPR: boolean; newRecords: RepMax[] } {
  if (!Number.isFinite(weight) || weight <= 0) {
    return { isPR: false, newRecords: [] };
  }
  const prevPrimary = currentMaxWeight(
    ledger,
    primaryTier,
    lowerWeightIsBetter
  );
  const isPR =
    prevPrimary === undefined ||
    isBetterWeight(weight, prevPrimary, lowerWeightIsBetter);
  if (!isPR) {
    return { isPR: false, newRecords: [] };
  }
  const tiers: RepMax[] = [primaryTier];
  for (const t of tiersStrictlyBelow(primaryTier)) {
    const m = currentMaxWeight(ledger, t, lowerWeightIsBetter);
    if (m === undefined || isBetterWeight(weight, m, lowerWeightIsBetter)) {
      tiers.push(t);
    }
  }
  return { isPR: true, newRecords: sortRepMaxAscending(tiers) };
}

/**
 * Append one log line to the primary tier. If it is a PR for that tier, cascade down
 * to strictly lower rep maxes where the weight also beats the current best.
 */
export function logPersonalBestIntoLedger(
  ledger: ExercisePersonalBestsLedger,
  primaryTier: RepMax,
  weight: number,
  achievedAt: string,
  createId: () => string = newPbEntryId,
  lowerWeightIsBetter: boolean = false
): {
  updated: ExercisePersonalBestsLedger;
  isPR: boolean;
  tiersWithNewRows: RepMax[];
} {
  if (!Number.isFinite(weight) || weight <= 0) {
    return { updated: cloneLedger(ledger), isPR: false, tiersWithNewRows: [] };
  }

  let updated = cloneLedger(ledger);
  const prevPrimary = currentMaxWeight(
    ledger,
    primaryTier,
    lowerWeightIsBetter
  );
  const isPR =
    prevPrimary === undefined ||
    isBetterWeight(weight, prevPrimary, lowerWeightIsBetter);

  const row: PersonalBestHistoryEntry = {
    id: createId(),
    weight,
    achievedAt,
  };
  updated[primaryTier] = [...(updated[primaryTier] ?? []), row];
  const tiersWithNewRows: RepMax[] = [primaryTier];

  if (isPR) {
    const { updated: afterCascade, appendedTiers } =
      appendCascadeToLowerTiersOnly(
        updated,
        primaryTier,
        weight,
        achievedAt,
        createId,
        lowerWeightIsBetter
      );
    updated = afterCascade;
    tiersWithNewRows.push(...appendedTiers);
  }

  return { updated, isPR, tiersWithNewRows };
}

/**
 * Best weight recorded for this tier (any history row).
 * Highest by default; when `lowerWeightIsBetter`, the lightest wins.
 */
export function currentMaxWeight(
  ledger: ExercisePersonalBestsLedger,
  tier: RepMax,
  lowerWeightIsBetter: boolean = false
): number | undefined {
  const rows = ledger[tier];
  if (!rows?.length) {
    return undefined;
  }
  const weights = rows.map((r) => r.weight);
  return lowerWeightIsBetter ? Math.min(...weights) : Math.max(...weights);
}

/**
 * Best row for UI: best weight for the exercise direction; if tied, latest achievedAt.
 */
export function getCurrentBestForTier(
  ledger: ExercisePersonalBestsLedger,
  tier: RepMax,
  lowerWeightIsBetter: boolean = false
): PersonalBestEntry | undefined {
  const rows = ledger[tier];
  if (!rows?.length) {
    return undefined;
  }
  let best = rows[0];
  for (const r of rows) {
    if (isBetterWeight(r.weight, best.weight, lowerWeightIsBetter)) {
      best = r;
    } else if (
      r.weight === best.weight &&
      new Date(r.achievedAt).getTime() > new Date(best.achievedAt).getTime()
    ) {
      best = r;
    }
  }
  return { weight: best.weight, achievedAt: best.achievedAt };
}

function cloneLedger(
  ledger: ExercisePersonalBestsLedger
): ExercisePersonalBestsLedger {
  const out: ExercisePersonalBestsLedger = {};
  for (const tier of REP_MAX_ORDER) {
    const rows = ledger[tier];
    if (rows?.length) {
      out[tier] = rows.map((r) => ({ ...r }));
    }
  }
  return out;
}

export function formatRepMaxLabel(tier: RepMax): string {
  return `${tier}RM`;
}

export function isRepMax(n: number): n is RepMax {
  return (REP_MAX_ORDER as readonly number[]).includes(n);
}

export function parseRepMaxParam(raw: string | undefined): RepMax | null {
  const n = parseInt(raw ?? '', 10);
  if (!Number.isFinite(n) || !isRepMax(n)) {
    return null;
  }
  return n;
}

export type PersonalBestSummaryLine = { tier: RepMax; label: string };

/** Ordered PB lines for UI chips (same order and copy as {@link summarizePersonalBests}). */
export function listPersonalBestSummaryLines(
  ledger: ExercisePersonalBestsLedger,
  unit: WeightUnit = 'kg',
  lowerWeightIsBetter: boolean = false
): PersonalBestSummaryLine[] {
  const lines: PersonalBestSummaryLine[] = [];
  for (const tier of REP_MAX_ORDER) {
    const best = getCurrentBestForTier(ledger, tier, lowerWeightIsBetter);
    if (best) {
      lines.push({
        tier,
        label: `${formatRepMaxLabel(tier)}: ${formatWeightFromKg(best.weight, unit)}`,
      });
    }
  }
  return lines;
}

export function summarizePersonalBests(
  ledger: ExercisePersonalBestsLedger,
  unit: WeightUnit = 'kg',
  lowerWeightIsBetter: boolean = false
): string {
  const lines = listPersonalBestSummaryLines(
    ledger,
    unit,
    lowerWeightIsBetter
  );
  return lines.length > 0
    ? lines.map((l) => l.label).join(' | ')
    : 'No PBs logged';
}

/**
 * Distance from a rep-max tier to a prescribed rep range.
 * Tiers inside the range score 0; outside score distance to the nearer edge.
 */
export function distanceToRepRange(
  tier: RepMax,
  repRange: [number, number]
): number {
  const [min, max] = repRange;
  const lo = Math.min(min, max);
  const hi = Math.max(min, max);
  if (tier >= lo && tier <= hi) {
    return 0;
  }
  if (tier < lo) {
    return lo - tier;
  }
  return tier - hi;
}

/**
 * Among tiers that have a current best, pick the one nearest the prescribed
 * rep range. Ties: closer to the range midpoint, then lower tier.
 */
export function findNearestRepMaxTier(
  ledger: ExercisePersonalBestsLedger,
  repRange: [number, number],
  lowerWeightIsBetter: boolean = false
): RepMax | null {
  const [min, max] = repRange;
  const midpoint = (min + max) / 2;

  let bestTier: RepMax | null = null;
  let bestDistance = Infinity;
  let bestMidpointDistance = Infinity;

  for (const tier of REP_MAX_ORDER) {
    if (getCurrentBestForTier(ledger, tier, lowerWeightIsBetter) === undefined) {
      continue;
    }
    const distance = distanceToRepRange(tier, repRange);
    const midpointDistance = Math.abs(tier - midpoint);
    if (
      distance < bestDistance ||
      (distance === bestDistance && midpointDistance < bestMidpointDistance) ||
      (distance === bestDistance &&
        midpointDistance === bestMidpointDistance &&
        (bestTier === null || tier < bestTier))
    ) {
      bestTier = tier;
      bestDistance = distance;
      bestMidpointDistance = midpointDistance;
    }
  }

  return bestTier;
}

/**
 * Exercise-card chip: nearest stored rep-max to the prescribed range.
 * e.g. "3RM - 100kg". Null when the ledger has no PBs.
 */
export function formatExercisePbChip(
  ledger: ExercisePersonalBestsLedger | null | undefined,
  repRange: [number, number] | null | undefined,
  unit: WeightUnit = 'kg',
  lowerWeightIsBetter: boolean = false
): string | null {
  if (!ledger || !repRange) {
    return null;
  }
  const tier = findNearestRepMaxTier(ledger, repRange, lowerWeightIsBetter);
  if (tier === null) {
    return null;
  }
  const best = getCurrentBestForTier(ledger, tier, lowerWeightIsBetter);
  if (!best) {
    return null;
  }
  const unitSuffix = unit === 'lb' ? 'lb' : 'kg';
  const weightText = `${formatWeightValueFromKg(best.weight, unit)}${unitSuffix}`;
  return `${formatRepMaxLabel(tier)} - ${weightText}`;
}
