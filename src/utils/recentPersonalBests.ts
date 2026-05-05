import type { PersonalBestsStore, RepMax } from '@/src/types/personalBests';
import { REP_MAX_ORDER } from '@/src/utils/personalBests';

export type RecentPersonalBestRow = {
  exerciseId: number;
  exerciseName: string;
  tier: RepMax;
  weightKg: number;
  achievedAt: string;
};

export function listRecentPersonalBestRows(
  store: PersonalBestsStore,
  exerciseNameById: ReadonlyMap<number, string>,
  limit: number
): RecentPersonalBestRow[] {
  const rows: RecentPersonalBestRow[] = [];

  for (const [rawId, ledger] of Object.entries(store)) {
    const exerciseId = Number(rawId);
    if (!Number.isFinite(exerciseId)) {
      continue;
    }
    const exerciseName =
      exerciseNameById.get(exerciseId) ?? 'Unknown exercise';

    for (const tier of REP_MAX_ORDER) {
      const entries = ledger[tier];
      if (!entries?.length) {
        continue;
      }
      for (const e of entries) {
        rows.push({
          exerciseId,
          exerciseName,
          tier,
          weightKg: e.weight,
          achievedAt: e.achievedAt,
        });
      }
    }
  }

  rows.sort((a, b) => {
    const tb = Date.parse(b.achievedAt);
    const ta = Date.parse(a.achievedAt);
    if (Number.isFinite(tb) && Number.isFinite(ta) && tb !== ta) {
      return tb - ta;
    }
    return b.weightKg - a.weightKg;
  });

  return rows.slice(0, limit);
}
