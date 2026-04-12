import type {
  ExercisePersonalBestsLedger,
  PersonalBestEntry,
  PersonalBestHistoryEntry,
  RepMax,
} from '@/src/types/personalBests';

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

/**
 * After the primary rep tier is already updated, append the same weight to lower
 * rep tiers where it beats the current max (used when editing a tier max upward).
 */
export function appendCascadeToLowerTiersOnly(
  ledger: ExercisePersonalBestsLedger,
  primaryTier: RepMax,
  weight: number,
  achievedAt: string,
  createId: () => string = newPbEntryId
): { updated: ExercisePersonalBestsLedger; appendedTiers: RepMax[] } {
  if (!Number.isFinite(weight) || weight <= 0) {
    return { updated: cloneLedger(ledger), appendedTiers: [] };
  }

  const updated = cloneLedger(ledger);
  const appendedTiers: RepMax[] = [];

  for (const t of tiersStrictlyBelow(primaryTier)) {
    const tierMax = currentMaxWeight(updated, t);
    if (tierMax === undefined || weight > tierMax) {
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
  weight: number
): { isPR: boolean; newRecords: RepMax[] } {
  if (!Number.isFinite(weight) || weight <= 0) {
    return { isPR: false, newRecords: [] };
  }
  const prevPrimary = currentMaxWeight(ledger, primaryTier);
  const isPR = prevPrimary === undefined || weight > prevPrimary;
  if (!isPR) {
    return { isPR: false, newRecords: [] };
  }
  const tiers: RepMax[] = [primaryTier];
  for (const t of tiersStrictlyBelow(primaryTier)) {
    const m = currentMaxWeight(ledger, t);
    if (m === undefined || weight > m) {
      tiers.push(t);
    }
  }
  return { isPR: true, newRecords: sortRepMaxAscending(tiers) };
}

/**
 * Append one log line to the primary tier. If it is a PR for that tier, cascade down
 * to strictly lower rep maxes where the weight also beats the current max.
 */
export function logPersonalBestIntoLedger(
  ledger: ExercisePersonalBestsLedger,
  primaryTier: RepMax,
  weight: number,
  achievedAt: string,
  createId: () => string = newPbEntryId
): {
  updated: ExercisePersonalBestsLedger;
  isPR: boolean;
  tiersWithNewRows: RepMax[];
} {
  if (!Number.isFinite(weight) || weight <= 0) {
    return { updated: cloneLedger(ledger), isPR: false, tiersWithNewRows: [] };
  }

  let updated = cloneLedger(ledger);
  const prevPrimary = currentMaxWeight(ledger, primaryTier);
  const isPR = prevPrimary === undefined || weight > prevPrimary;

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
        createId
      );
    updated = afterCascade;
    tiersWithNewRows.push(...appendedTiers);
  }

  return { updated, isPR, tiersWithNewRows };
}

/** Max weight recorded for this tier (any history row). */
export function currentMaxWeight(
  ledger: ExercisePersonalBestsLedger,
  tier: RepMax
): number | undefined {
  const rows = ledger[tier];
  if (!rows?.length) {
    return undefined;
  }
  return Math.max(...rows.map((r) => r.weight));
}

/**
 * Best row for UI: highest weight; if tied, latest achievedAt.
 */
export function getCurrentBestForTier(
  ledger: ExercisePersonalBestsLedger,
  tier: RepMax
): PersonalBestEntry | undefined {
  const rows = ledger[tier];
  if (!rows?.length) {
    return undefined;
  }
  let best = rows[0];
  for (const r of rows) {
    if (r.weight > best.weight) {
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

export function summarizePersonalBests(
  ledger: ExercisePersonalBestsLedger
): string {
  const parts: string[] = [];
  for (const tier of REP_MAX_ORDER) {
    const best = getCurrentBestForTier(ledger, tier);
    if (best) {
      parts.push(`${formatRepMaxLabel(tier)}: ${best.weight} kg`);
    }
  }
  return parts.length > 0 ? parts.join(' | ') : 'No PBs logged';
}

/** 1RM tier only — used for exercise card Best / Latest line. */
const EXERCISE_CARD_PB_TIER: RepMax = 1;

/**
 * One-line copy for workout cards: 1RM best vs most recent 1RM log.
 * Ignores other rep-max tiers. When the latest 1RM entry matches peak weight, only Best is shown.
 */
export function formatExercisePbSubtitle(
  ledger: ExercisePersonalBestsLedger | null | undefined
): string | null {
  if (!ledger) {
    return null;
  }
  const best = getCurrentBestForTier(ledger, EXERCISE_CARD_PB_TIER);
  const latest = getLatestEntryForTier(ledger, EXERCISE_CARD_PB_TIER);
  if (!best || !latest) {
    return null;
  }
  if (latest.weight !== best.weight) {
    return `Best Single: ${String(best.weight)}kg Latest Single: ${String(latest.weight)}kg`;
  }
  return `Best Single: ${String(best.weight)}kg`;
}
