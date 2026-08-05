// Lossless expand/collapse between legacy KV blob and relational rows.
import type {
  PersonalBestHistoryEntry,
  PersonalBestsStore,
  RepMax,
} from '@/src/types/personalBests';
import { REP_MAX_ORDER } from '@/src/utils/personalBests';
import type { LocalPersonalBestRow } from './types';

const VALID_REP_MAX = new Set<number>(REP_MAX_ORDER);

function isRepMax(value: number): value is RepMax {
  return VALID_REP_MAX.has(value);
}

/**
 * Flatten a PersonalBestsStore blob into local rows.
 * `updatedAt` is applied to every expanded row (cutover clock).
 */
export function expandPersonalBestsBlobToRows(
  store: PersonalBestsStore,
  updatedAt: string
): Omit<LocalPersonalBestRow, 'dirty'>[] {
  const rows: Omit<LocalPersonalBestRow, 'dirty'>[] = [];

  for (const [exerciseKey, ledger] of Object.entries(store)) {
    const exerciseId = Number(exerciseKey);
    if (!Number.isFinite(exerciseId) || !ledger || typeof ledger !== 'object') {
      continue;
    }
    for (const [tierKey, entries] of Object.entries(ledger)) {
      const repMax = Number(tierKey);
      if (!isRepMax(repMax) || !Array.isArray(entries)) {
        continue;
      }
      for (const entry of entries) {
        if (!entry || typeof entry !== 'object') {
          continue;
        }
        const { id, weight, achievedAt } = entry as PersonalBestHistoryEntry;
        if (
          typeof id !== 'string' ||
          id.length === 0 ||
          !Number.isFinite(weight) ||
          weight <= 0 ||
          typeof achievedAt !== 'string'
        ) {
          continue;
        }
        rows.push({
          id,
          exercise_id: exerciseId,
          rep_max: repMax,
          weight,
          achieved_at: achievedAt,
          updated_at: updatedAt,
          deleted_at: null,
        });
      }
    }
  }

  return rows;
}

/**
 * Rebuild the legacy map shape from active (non-deleted) rows for UI consumers.
 */
export function collapseRowsToPersonalBestsStore(
  rows: {
    exercise_id: number;
    rep_max: number;
    id: string;
    weight: number;
    achieved_at: string;
    deleted_at?: string | null;
  }[]
): PersonalBestsStore {
  const store: PersonalBestsStore = {};

  for (const row of rows) {
    if (row.deleted_at) {
      continue;
    }
    if (!isRepMax(row.rep_max)) {
      continue;
    }
    const ledger = store[row.exercise_id] ?? {};
    const tierRows = ledger[row.rep_max] ?? [];
    tierRows.push({
      id: row.id,
      weight: row.weight,
      achievedAt: row.achieved_at,
    });
    ledger[row.rep_max] = tierRows;
    store[row.exercise_id] = ledger;
  }

  return store;
}

export function parsePersonalBestsStore(raw: string | null): PersonalBestsStore {
  if (!raw) {
    return {};
  }
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      return {};
    }
    return parsed as PersonalBestsStore;
  } catch {
    return {};
  }
}
