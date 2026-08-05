import {
  applyRemoteWorkoutLogSetRow,
  listDirtyWorkoutLogSetRows,
  markWorkoutLogSetRowsClean,
} from '@/src/db/domains/workoutLogs/repository';
import {
  getWorkoutLogsLastRowSyncedAt,
  setWorkoutLogsLastRowSyncedAt,
} from '@/src/db/domains/workoutLogs/meta';
import type { RemoteWorkoutLogSetRow } from '@/src/db/domains/workoutLogs/types';
import { getSupabaseClient } from '@/src/services/supabaseClient';
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

  const client = getSupabaseClient();
  const payloads: RemoteWorkoutLogSetRow[] = dirty.map((row) => ({
    id: row.id,
    user_id: userId,
    day_index: row.day_index,
    slot_index: row.slot_index,
    set_index: row.set_index,
    weight: row.weight,
    reps: row.reps,
    state: row.state,
    updated_at: row.updated_at,
    deleted_at: row.deleted_at,
  }));

  for (
    let index = 0;
    index < payloads.length;
    index += WORKOUT_LOG_UPSERT_BATCH_SIZE
  ) {
    const batch = payloads.slice(index, index + WORKOUT_LOG_UPSERT_BATCH_SIZE);
    const { error } = await client
      .from(WORKOUT_LOG_SETS_TABLE)
      .upsert(batch, { onConflict: 'id' });
    if (error) {
      console.error('[sync] pushDirtyWorkoutLogs upsert failed', error);
      throw error;
    }
  }

  await markWorkoutLogSetRowsClean(dirty.map((row) => row.id));
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

  const client = getSupabaseClient();
  const { data, error } = await client
    .from(WORKOUT_LOG_SETS_TABLE)
    .select(
      'id,user_id,day_index,slot_index,set_index,weight,reps,state,updated_at,deleted_at'
    )
    .eq('user_id', userId)
    .gt('updated_at', lastSyncedAt)
    .order('updated_at', { ascending: true });

  if (error) {
    throw error;
  }

  const rows = (data ?? []) as RemoteWorkoutLogSetRow[];
  let newest = lastSyncedAt;

  for (const row of rows) {
    await applyRemoteWorkoutLogSetRow(row);
    if (row.updated_at > newest) {
      newest = row.updated_at;
    }
  }

  if (rows.length > 0 && newest > lastSyncedAt) {
    await setWorkoutLogsLastRowSyncedAt(newest);
  }
}
