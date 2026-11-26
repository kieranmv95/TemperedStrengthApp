import {
  applyRemoteConditioningEffortRow,
  listDirtyConditioningEffortRows,
  markConditioningEffortRowsClean,
} from '@/src/db/domains/conditioningEfforts/repository';
import {
  getConditioningEffortsLastRowSyncedAt,
  setConditioningEffortsLastRowSyncedAt,
} from '@/src/db/domains/conditioningEfforts/meta';
import type { RemoteConditioningEffortRow } from '@/src/db/domains/conditioningEfforts/types';
import { getSupabaseClient } from '@/src/services/supabaseClient';
import {
  coerceSyncTimestamp,
  pushRows,
  readAllPages,
  requireSyncTimestamp,
} from '@/src/sync/syncWrite';
import {
  CONDITIONING_EFFORT_UPSERT_BATCH_SIZE,
  CONDITIONING_EFFORTS_TABLE,
} from './constants';

const EPOCH = '1970-01-01T00:00:00.000Z';

export async function pushDirtyConditioningEfforts(
  userId: string
): Promise<void> {
  const dirty = await listDirtyConditioningEffortRows();
  if (dirty.length === 0) {
    return;
  }

  const payloads: RemoteConditioningEffortRow[] = dirty.map((row) => ({
    id: row.id,
    user_id: userId,
    activity_id: row.activity_id,
    distance_m: row.distance_m,
    duration_ms: row.duration_ms,
    achieved_at: requireSyncTimestamp(row.achieved_at),
    updated_at: requireSyncTimestamp(row.updated_at),
    deleted_at: coerceSyncTimestamp(row.deleted_at),
  }));

  await pushRows({
    table: CONDITIONING_EFFORTS_TABLE,
    rows: payloads,
    onConflict: 'id',
    idOf: (row) => row.id,
    batchSize: CONDITIONING_EFFORT_UPSERT_BATCH_SIZE,
    markClean: markConditioningEffortRowsClean,
  });
}

export async function pullConditioningEffortChanges(
  userId: string,
  options: { full?: boolean } = {}
): Promise<void> {
  const lastSyncedAt = options.full
    ? EPOCH
    : ((await getConditioningEffortsLastRowSyncedAt()) ?? EPOCH);

  const rows = await readAllPages<RemoteConditioningEffortRow>((from, to) =>
    getSupabaseClient()
      .from(CONDITIONING_EFFORTS_TABLE)
      .select(
        'id,user_id,activity_id,distance_m,duration_ms,achieved_at,updated_at,deleted_at'
      )
      .eq('user_id', userId)
      .gt('updated_at', lastSyncedAt)
      .order('updated_at', { ascending: true })
      .range(from, to)
  );
  let newest = lastSyncedAt;

  for (const row of rows) {
    try {
      await applyRemoteConditioningEffortRow(row);
    } catch (error) {
      console.error(
        'Skipping conditioning effort that could not be saved locally:',
        error
      );
    }
    if (row.updated_at > newest) {
      newest = row.updated_at;
    }
  }

  if (rows.length > 0 && newest > lastSyncedAt) {
    await setConditioningEffortsLastRowSyncedAt(newest);
  }
}
