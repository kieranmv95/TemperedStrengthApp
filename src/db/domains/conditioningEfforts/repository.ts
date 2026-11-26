import { getDatabase } from '@/src/db/database';
import type {
  LocalConditioningEffortRow,
  RemoteConditioningEffortRow,
} from './types';

type SqliteEffortRow = {
  id: string;
  activity_id: string;
  distance_m: number;
  duration_ms: number;
  achieved_at: string;
  updated_at: string;
  deleted_at: string | null;
  dirty: number;
};

function mapRow(row: SqliteEffortRow): LocalConditioningEffortRow {
  return {
    id: row.id,
    activity_id: row.activity_id,
    distance_m: row.distance_m,
    duration_ms: row.duration_ms,
    achieved_at: row.achieved_at,
    updated_at: row.updated_at,
    deleted_at: row.deleted_at,
    dirty: row.dirty ? 1 : 0,
  };
}

export async function listActiveConditioningEffortRows(): Promise<
  LocalConditioningEffortRow[]
> {
  const rows = await getDatabase().getAllAsync<SqliteEffortRow>(
    `SELECT id, activity_id, distance_m, duration_ms, achieved_at, updated_at, deleted_at, dirty
     FROM conditioning_efforts
     WHERE deleted_at IS NULL
     ORDER BY activity_id ASC, distance_m ASC, achieved_at ASC`
  );
  return rows.map(mapRow);
}

export async function listDirtyConditioningEffortRows(): Promise<
  LocalConditioningEffortRow[]
> {
  const rows = await getDatabase().getAllAsync<SqliteEffortRow>(
    `SELECT id, activity_id, distance_m, duration_ms, achieved_at, updated_at, deleted_at, dirty
     FROM conditioning_efforts
     WHERE dirty = 1`
  );
  return rows.map(mapRow);
}

export async function upsertLocalConditioningEffortRow(
  row: Omit<LocalConditioningEffortRow, 'dirty'> & { dirty?: 0 | 1 }
): Promise<void> {
  const dirty = row.dirty ?? 1;
  await getDatabase().runAsync(
    `INSERT INTO conditioning_efforts (
       id, activity_id, distance_m, duration_ms, achieved_at, updated_at, deleted_at, dirty
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       activity_id = excluded.activity_id,
       distance_m = excluded.distance_m,
       duration_ms = excluded.duration_ms,
       achieved_at = excluded.achieved_at,
       updated_at = excluded.updated_at,
       deleted_at = excluded.deleted_at,
       dirty = excluded.dirty`,
    row.id,
    row.activity_id,
    row.distance_m,
    row.duration_ms,
    row.achieved_at,
    row.updated_at,
    row.deleted_at,
    dirty
  );
}

/**
 * Soft-delete an effort. Marks dirty so the tombstone syncs.
 */
export async function softDeleteLocalConditioningEffort(
  id: string,
  deletedAt: string
): Promise<boolean> {
  const result = await getDatabase().runAsync(
    `UPDATE conditioning_efforts
     SET deleted_at = ?, updated_at = ?, dirty = 1
     WHERE id = ? AND deleted_at IS NULL`,
    deletedAt,
    deletedAt,
    id
  );
  return result.changes > 0;
}

export async function markConditioningEffortRowsClean(
  ids: string[]
): Promise<void> {
  if (ids.length === 0) {
    return;
  }
  const db = getDatabase();
  await db.withTransactionAsync(async () => {
    for (const id of ids) {
      await db.runAsync(
        'UPDATE conditioning_efforts SET dirty = 0 WHERE id = ?',
        id
      );
    }
  });
}

/**
 * Apply a remote row with last-write-wins on updated_at.
 * Skips when local is newer, or equally new and still dirty.
 */
export async function applyRemoteConditioningEffortRow(
  remote: RemoteConditioningEffortRow
): Promise<void> {
  const durationMs = Number(remote.duration_ms);
  const distanceM = Number(remote.distance_m);
  if (
    !Number.isFinite(durationMs) ||
    durationMs <= 0 ||
    !Number.isInteger(durationMs) ||
    !Number.isFinite(distanceM) ||
    distanceM <= 0 ||
    !Number.isInteger(distanceM) ||
    remote.activity_id.trim().length === 0
  ) {
    throw new Error(
      'Conditioning effort row is missing a valid time or distance.'
    );
  }

  const db = getDatabase();
  const local = await db.getFirstAsync<SqliteEffortRow>(
    'SELECT id, updated_at, dirty FROM conditioning_efforts WHERE id = ?',
    remote.id
  );

  if (
    local &&
    (local.updated_at > remote.updated_at ||
      (local.updated_at === remote.updated_at && local.dirty === 1))
  ) {
    return;
  }

  await upsertLocalConditioningEffortRow({
    id: remote.id,
    activity_id: remote.activity_id,
    distance_m: distanceM,
    duration_ms: durationMs,
    achieved_at: remote.achieved_at,
    updated_at: remote.updated_at,
    deleted_at: remote.deleted_at,
    dirty: 0,
  });
}

export async function clearAllConditioningEffortRows(): Promise<void> {
  await getDatabase().runAsync('DELETE FROM conditioning_efforts');
}
