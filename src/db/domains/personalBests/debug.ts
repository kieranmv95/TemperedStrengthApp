// Dev-only helpers to inspect the local SQLite personal bests table.
import { getDatabase } from '@/src/db/database';
import type { LocalPersonalBestRow } from './types';
import type { RepMax } from '@/src/types/personalBests';

/**
 * Returns every personal_best_entries row (including soft-deleted).
 * For Metro console debugging only.
 */
export async function listAllPersonalBestRowsForDebug(): Promise<
  LocalPersonalBestRow[]
> {
  const rows = await getDatabase().getAllAsync<{
    id: string;
    exercise_id: number;
    rep_max: number;
    weight: number;
    achieved_at: string;
    updated_at: string;
    deleted_at: string | null;
    dirty: number;
  }>(
    `SELECT id, exercise_id, rep_max, weight, achieved_at, updated_at, deleted_at, dirty
     FROM personal_best_entries
     ORDER BY updated_at DESC`
  );

  return rows.map((row) => ({
    id: row.id,
    exercise_id: row.exercise_id,
    rep_max: row.rep_max as RepMax,
    weight: row.weight,
    achieved_at: row.achieved_at,
    updated_at: row.updated_at,
    deleted_at: row.deleted_at,
    dirty: row.dirty ? 1 : 0,
  }));
}

/**
 * Logs row count + full table dump to Metro. No-op outside __DEV__.
 */
export async function logPersonalBestsSqliteDebug(
  label = 'personal_best_entries'
): Promise<{ total: number; active: number; dirty: number }> {
  if (!__DEV__) {
    return { total: 0, active: 0, dirty: 0 };
  }

  const rows = await listAllPersonalBestRowsForDebug();
  const active = rows.filter((row) => row.deleted_at == null).length;
  const dirty = rows.filter((row) => row.dirty === 1).length;

  console.log(`[sqlite] ${label}`, {
    total: rows.length,
    active,
    dirty,
    rows,
  });

  return { total: rows.length, active, dirty };
}
