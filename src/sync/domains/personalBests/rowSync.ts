import {
  applyRemotePersonalBestRow,
  listDirtyPersonalBestRows,
  markPersonalBestRowsClean,
} from '@/src/db/domains/personalBests/repository';
import {
  getPersonalBestsLastRowSyncedAt,
  setPersonalBestsLastRowSyncedAt,
} from '@/src/db/domains/personalBests/meta';
import type { RemotePersonalBestRow } from '@/src/db/domains/personalBests/types';
import { getSupabaseClient } from '@/src/services/supabaseClient';
import {
  pushRows,
  readAllPages,
  requireSyncTimestamp,
  coerceSyncTimestamp,
} from '@/src/sync/syncWrite';
import {
  PERSONAL_BEST_ENTRIES_TABLE,
  PERSONAL_BEST_UPSERT_BATCH_SIZE,
} from './constants';

const EPOCH = '1970-01-01T00:00:00.000Z';

export async function pushDirtyPersonalBests(userId: string): Promise<void> {
  const dirty = await listDirtyPersonalBestRows();
  if (dirty.length === 0) {
    return;
  }

  const payloads: RemotePersonalBestRow[] = dirty.map((row) => ({
    id: row.id,
    user_id: userId,
    exercise_id: row.exercise_id,
    rep_max: row.rep_max,
    weight: row.weight,
    achieved_at: requireSyncTimestamp(row.achieved_at),
    updated_at: requireSyncTimestamp(row.updated_at),
    deleted_at: coerceSyncTimestamp(row.deleted_at),
  }));

  await pushRows({
    table: PERSONAL_BEST_ENTRIES_TABLE,
    rows: payloads,
    onConflict: 'id',
    idOf: (row) => row.id,
    batchSize: PERSONAL_BEST_UPSERT_BATCH_SIZE,
    markClean: markPersonalBestRowsClean,
  });
}

export async function pullPersonalBestChanges(
  userId: string,
  options: { full?: boolean } = {}
): Promise<void> {
  const lastSyncedAt = options.full
    ? EPOCH
    : ((await getPersonalBestsLastRowSyncedAt()) ?? EPOCH);

  const rows = await readAllPages<RemotePersonalBestRow>((from, to) =>
    getSupabaseClient()
      .from(PERSONAL_BEST_ENTRIES_TABLE)
      .select(
        'id,user_id,exercise_id,rep_max,weight,achieved_at,updated_at,deleted_at'
      )
      .eq('user_id', userId)
      .gt('updated_at', lastSyncedAt)
      .order('updated_at', { ascending: true })
      .range(from, to)
  );
  let newest = lastSyncedAt;

  for (const row of rows) {
    try {
      await applyRemotePersonalBestRow(row);
    } catch (error) {
      console.error(
        'Skipping personal best row that could not be saved locally:',
        error
      );
    }
    if (row.updated_at > newest) {
      newest = row.updated_at;
    }
  }

  if (rows.length > 0 && newest > lastSyncedAt) {
    await setPersonalBestsLastRowSyncedAt(newest);
  }
}
