// One-shot per user: KV workout_logs blob → workout_log_sets rows, then delete KV.
import { getDatabase } from '@/src/db/database';
import {
  expandWorkoutLogsBlobToRows,
  parseWorkoutLogsStore,
} from '@/src/db/domains/workoutLogs/codec';
import {
  isWorkoutLogsCloudKvCutoverDone,
  markWorkoutLogsCloudKvCutoverDone,
} from '@/src/db/domains/workoutLogs/meta';
import { upsertLocalWorkoutLogSetRows } from '@/src/db/domains/workoutLogs/repository';
import { migrateWorkoutLogsFromKvLocal } from '@/src/db/domains/workoutLogs/storage';
import { getSupabaseClient } from '@/src/services/supabaseClient';
import { WORKOUT_LOGS_KV_KEY } from './constants';
import { pushDirtyWorkoutLogs, pullWorkoutLogChanges } from './rowSync';

function serializeRemoteValue(value: unknown): string {
  return typeof value === 'string' ? value : JSON.stringify(value);
}

export async function ensureWorkoutLogsCloudMigrated(
  userId: string
): Promise<void> {
  await migrateWorkoutLogsFromKvLocal();

  if (await isWorkoutLogsCloudKvCutoverDone(userId)) {
    return;
  }

  const client = getSupabaseClient();
  await pullWorkoutLogChanges(userId, { full: true });

  const { data: kvRow, error: kvError } = await client
    .from('user_kv_store')
    .select('key,value,deleted_at')
    .eq('user_id', userId)
    .eq('key', WORKOUT_LOGS_KV_KEY)
    .maybeSingle();

  if (kvError) {
    throw kvError;
  }

  if (kvRow && !kvRow.deleted_at && kvRow.value != null) {
    const store = parseWorkoutLogsStore(serializeRemoteValue(kvRow.value));
    const updatedAt = new Date().toISOString();
    const blobRows = expandWorkoutLogsBlobToRows(store, updatedAt);
    const missing: (ReturnType<
      typeof expandWorkoutLogsBlobToRows
    >[number] & { dirty: 1 })[] = [];
    for (const row of blobRows) {
      const existing = await getDatabase().getFirstAsync<{ id: string }>(
        'SELECT id FROM workout_log_sets WHERE id = ?',
        row.id
      );
      if (!existing) {
        missing.push({ ...row, dirty: 1 });
      }
    }
    if (missing.length > 0) {
      await upsertLocalWorkoutLogSetRows(missing);
    }
  }

  await pushDirtyWorkoutLogs(userId);

  const deletedAt = new Date().toISOString();
  const { error: deleteError } = await client
    .from('user_kv_store')
    .delete()
    .eq('user_id', userId)
    .eq('key', WORKOUT_LOGS_KV_KEY);

  if (deleteError) {
    const { error: upsertError } = await client.from('user_kv_store').upsert(
      {
        user_id: userId,
        key: WORKOUT_LOGS_KV_KEY,
        value: '',
        updated_at: deletedAt,
        deleted_at: deletedAt,
      },
      { onConflict: 'user_id,key' }
    );
    if (upsertError) {
      throw deleteError;
    }
  }

  await markWorkoutLogsCloudKvCutoverDone(userId);
}
