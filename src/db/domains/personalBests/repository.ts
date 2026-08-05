import { getDatabase } from '@/src/db/database';
import type {
  PersonalBestsStore,
  RepMax,
} from '@/src/types/personalBests';
import type { LocalPersonalBestRow, RemotePersonalBestRow } from './types';
import { collapseRowsToPersonalBestsStore } from './codec';

type SqlitePbRow = {
  id: string;
  exercise_id: number;
  rep_max: number;
  weight: number;
  achieved_at: string;
  updated_at: string;
  deleted_at: string | null;
  dirty: number;
};

function mapRow(row: SqlitePbRow): LocalPersonalBestRow {
  return {
    id: row.id,
    exercise_id: row.exercise_id,
    rep_max: row.rep_max as RepMax,
    weight: row.weight,
    achieved_at: row.achieved_at,
    updated_at: row.updated_at,
    deleted_at: row.deleted_at,
    dirty: row.dirty ? 1 : 0,
  };
}

export async function listActivePersonalBestRows(): Promise<
  LocalPersonalBestRow[]
> {
  const rows = await getDatabase().getAllAsync<SqlitePbRow>(
    `SELECT id, exercise_id, rep_max, weight, achieved_at, updated_at, deleted_at, dirty
     FROM personal_best_entries
     WHERE deleted_at IS NULL
     ORDER BY exercise_id ASC, rep_max ASC, achieved_at ASC`
  );
  return rows.map(mapRow);
}

export async function getPersonalBestsStoreFromDb(): Promise<PersonalBestsStore> {
  const rows = await listActivePersonalBestRows();
  return collapseRowsToPersonalBestsStore(rows);
}

export async function listDirtyPersonalBestRows(): Promise<
  LocalPersonalBestRow[]
> {
  const rows = await getDatabase().getAllAsync<SqlitePbRow>(
    `SELECT id, exercise_id, rep_max, weight, achieved_at, updated_at, deleted_at, dirty
     FROM personal_best_entries
     WHERE dirty = 1`
  );
  return rows.map(mapRow);
}

export async function upsertLocalPersonalBestRow(
  row: Omit<LocalPersonalBestRow, 'dirty'> & { dirty?: 0 | 1 }
): Promise<void> {
  const dirty = row.dirty ?? 1;
  await getDatabase().runAsync(
    `INSERT INTO personal_best_entries (
       id, exercise_id, rep_max, weight, achieved_at, updated_at, deleted_at, dirty
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       exercise_id = excluded.exercise_id,
       rep_max = excluded.rep_max,
       weight = excluded.weight,
       achieved_at = excluded.achieved_at,
       updated_at = excluded.updated_at,
       deleted_at = excluded.deleted_at,
       dirty = excluded.dirty`,
    row.id,
    row.exercise_id,
    row.rep_max,
    row.weight,
    row.achieved_at,
    row.updated_at,
    row.deleted_at,
    dirty
  );
}

export async function upsertLocalPersonalBestRows(
  rows: (Omit<LocalPersonalBestRow, 'dirty'> & { dirty?: 0 | 1 })[]
): Promise<void> {
  const db = getDatabase();
  await db.withTransactionAsync(async () => {
    for (const row of rows) {
      await upsertLocalPersonalBestRow(row);
    }
  });
}

/**
 * Soft-delete an entry. Marks dirty so the tombstone syncs.
 */
export async function softDeleteLocalPersonalBest(
  id: string,
  deletedAt: string
): Promise<boolean> {
  const result = await getDatabase().runAsync(
    `UPDATE personal_best_entries
     SET deleted_at = ?, updated_at = ?, dirty = 1
     WHERE id = ? AND deleted_at IS NULL`,
    deletedAt,
    deletedAt,
    id
  );
  return result.changes > 0;
}

export async function markPersonalBestRowsClean(
  ids: string[]
): Promise<void> {
  if (ids.length === 0) {
    return;
  }
  const db = getDatabase();
  await db.withTransactionAsync(async () => {
    for (const id of ids) {
      await db.runAsync(
        'UPDATE personal_best_entries SET dirty = 0 WHERE id = ?',
        id
      );
    }
  });
}

/**
 * Apply a remote row with LWW on updated_at.
 * Skips when local is newer or equally new and dirty (we already own the write).
 */
export async function applyRemotePersonalBestRow(
  remote: RemotePersonalBestRow
): Promise<void> {
  const db = getDatabase();
  const local = await db.getFirstAsync<SqlitePbRow>(
    'SELECT id, updated_at, dirty FROM personal_best_entries WHERE id = ?',
    remote.id
  );

  if (
    local &&
    (local.updated_at > remote.updated_at ||
      (local.updated_at === remote.updated_at && local.dirty === 1))
  ) {
    return;
  }

  await upsertLocalPersonalBestRow({
    id: remote.id,
    exercise_id: remote.exercise_id,
    rep_max: remote.rep_max as RepMax,
    weight: remote.weight,
    achieved_at: remote.achieved_at,
    updated_at: remote.updated_at,
    deleted_at: remote.deleted_at,
    dirty: 0,
  });
}

export async function clearAllPersonalBestRows(): Promise<void> {
  await getDatabase().runAsync('DELETE FROM personal_best_entries');
}

export async function countLocalPersonalBestRows(): Promise<number> {
  const row = await getDatabase().getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM personal_best_entries'
  );
  return row?.count ?? 0;
}
