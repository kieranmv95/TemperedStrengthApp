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
  PERSONAL_BEST_ENTRIES_TABLE,
  PERSONAL_BEST_UPSERT_BATCH_SIZE,
} from './constants';

const EPOCH = '1970-01-01T00:00:00.000Z';

export async function pushDirtyPersonalBests(userId: string): Promise<void> {
  const dirty = await listDirtyPersonalBestRows();
  if (dirty.length === 0) {
    return;
  }

  const client = getSupabaseClient();
  const payloads: RemotePersonalBestRow[] = dirty.map((row) => ({
    id: row.id,
    user_id: userId,
    exercise_id: row.exercise_id,
    rep_max: row.rep_max,
    weight: row.weight,
    achieved_at: row.achieved_at,
    updated_at: row.updated_at,
    deleted_at: row.deleted_at,
  }));

  for (
    let index = 0;
    index < payloads.length;
    index += PERSONAL_BEST_UPSERT_BATCH_SIZE
  ) {
    const batch = payloads.slice(index, index + PERSONAL_BEST_UPSERT_BATCH_SIZE);
    const { error } = await client
      .from(PERSONAL_BEST_ENTRIES_TABLE)
      .upsert(batch, { onConflict: 'id' });
    if (error) {
      throw error;
    }
  }

  await markPersonalBestRowsClean(dirty.map((row) => row.id));
}

export async function pullPersonalBestChanges(
  userId: string,
  options: { full?: boolean } = {}
): Promise<void> {
  const lastSyncedAt = options.full
    ? EPOCH
    : ((await getPersonalBestsLastRowSyncedAt()) ?? EPOCH);

  const client = getSupabaseClient();
  const { data, error } = await client
    .from(PERSONAL_BEST_ENTRIES_TABLE)
    .select(
      'id,user_id,exercise_id,rep_max,weight,achieved_at,updated_at,deleted_at'
    )
    .eq('user_id', userId)
    .gt('updated_at', lastSyncedAt)
    .order('updated_at', { ascending: true });

  if (error) {
    throw error;
  }

  const rows = (data ?? []) as RemotePersonalBestRow[];
  let newest = lastSyncedAt;

  for (const row of rows) {
    await applyRemotePersonalBestRow(row);
    if (row.updated_at > newest) {
      newest = row.updated_at;
    }
  }

  if (rows.length > 0 && newest > lastSyncedAt) {
    await setPersonalBestsLastRowSyncedAt(newest);
  }
}
