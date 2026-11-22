import {
  applyRemoteWorkoutLogSetRow,
  listDirtyWorkoutLogSetRows,
  markWorkoutLogSetRowsClean,
} from '@/src/db/domains/workoutLogs/repository';
import {
  getWorkoutLogsLastRowSyncedAt,
  setWorkoutLogsLastRowSyncedAt,
} from '@/src/db/domains/workoutLogs/meta';
import {
  normalizeRpe,
  type RemoteWorkoutLogSetRow,
} from '@/src/db/domains/workoutLogs/types';
import { getSupabaseClient } from '@/src/services/supabaseClient';
import {
  coerceSyncTimestamp,
  pushRows,
  readAllPages,
  requireSyncTimestamp,
} from '@/src/sync/syncWrite';
import {
  WORKOUT_LOG_SETS_TABLE,
  WORKOUT_LOG_UPSERT_BATCH_SIZE,
} from './constants';

const EPOCH = '1970-01-01T00:00:00.000Z';

export async function pushDirtyWorkoutLogs(userId: string): Promise<void> {
  const dirty = await listDirtyWorkoutLogSetRows();
  if (dirty.length === 0) {
    return;
  }

  if (__DEV__) {
    console.log('[sync] pushDirtyWorkoutLogs', {
      count: dirty.length,
      sampleIds: dirty.slice(0, 5).map((row) => row.id),
    });
  }

  const payloads: RemoteWorkoutLogSetRow[] = dirty.map((row) => ({
    id: row.id,
    user_id: userId,
    day_index: row.day_index,
    slot_index: row.slot_index,
    set_index: row.set_index,
    weight: row.weight,
    reps: row.reps,
    state:
      row.state === 'completed' || row.state === 'failed' ? row.state : null,
    rpe: normalizeRpe(row.rpe),
    updated_at: requireSyncTimestamp(row.updated_at),
    deleted_at: coerceSyncTimestamp(row.deleted_at),
  }));

  await pushRows({
    table: WORKOUT_LOG_SETS_TABLE,
    rows: payloads,
    onConflict: 'id',
    idOf: (row) => row.id,
    batchSize: WORKOUT_LOG_UPSERT_BATCH_SIZE,
    markClean: markWorkoutLogSetRowsClean,
  });
}

/** Hard-delete every set row for this user (end program / wipe). */
export async function deleteAllRemoteWorkoutLogSets(
  userId: string
): Promise<void> {
  const client = getSupabaseClient();
  const { error } = await client
    .from(WORKOUT_LOG_SETS_TABLE)
    .delete()
    .eq('user_id', userId);
  if (error) {
    throw error;
  }
}

export async function pullWorkoutLogChanges(
  userId: string,
  options: { full?: boolean } = {}
): Promise<void> {
  const lastSyncedAt = options.full
    ? EPOCH
    : ((await getWorkoutLogsLastRowSyncedAt()) ?? EPOCH);

  const rows = await readAllPages<RemoteWorkoutLogSetRow>((from, to) =>
    getSupabaseClient()
      .from(WORKOUT_LOG_SETS_TABLE)
      .select(
        'id,user_id,day_index,slot_index,set_index,weight,reps,state,rpe,updated_at,deleted_at'
      )
      .eq('user_id', userId)
      .gt('updated_at', lastSyncedAt)
      .order('updated_at', { ascending: true })
      .range(from, to)
  );
  let newest = lastSyncedAt;

  for (const row of rows) {
    try {
      await applyRemoteWorkoutLogSetRow(row);
    } catch (error) {
      console.error(
        'Skipping workout log row that could not be saved locally:',
        error
      );
    }
    if (row.updated_at > newest) {
      newest = row.updated_at;
    }
  }

  if (rows.length > 0 && newest > lastSyncedAt) {
    await setWorkoutLogsLastRowSyncedAt(newest);
  }
}
