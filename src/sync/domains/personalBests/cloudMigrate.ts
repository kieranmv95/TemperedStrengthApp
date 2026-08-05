// One-shot per user: import any leftover KV blob, push all local rows, delete remote KV key.
import { getDatabase } from '@/src/db/database';
import {
  expandPersonalBestsBlobToRows,
  parsePersonalBestsStore,
} from '@/src/db/domains/personalBests/codec';
import {
  isPersonalBestsCloudKvCutoverDone,
  markPersonalBestsCloudKvCutoverDone,
} from '@/src/db/domains/personalBests/meta';
import { upsertLocalPersonalBestRows } from '@/src/db/domains/personalBests/repository';
import { migratePersonalBestsFromKvLocal } from '@/src/db/domains/personalBests/storage';
import { getSupabaseClient } from '@/src/services/supabaseClient';
import { PERSONAL_BESTS_KV_KEY } from './constants';
import { pushDirtyPersonalBests, pullPersonalBestChanges } from './rowSync';

function serializeRemoteValue(value: unknown): string {
  return typeof value === 'string' ? value : JSON.stringify(value);
}

/**
 * Ensure this device has cut this user over from `user_kv_store.personal_bests`
 * to `personal_best_entries`. Idempotent.
 */
export async function ensurePersonalBestsCloudMigrated(
  userId: string
): Promise<void> {
  await migratePersonalBestsFromKvLocal();

  if (await isPersonalBestsCloudKvCutoverDone(userId)) {
    return;
  }

  const client = getSupabaseClient();

  // If another device already cut over, pull existing rows first.
  await pullPersonalBestChanges(userId, { full: true });

  // Import remaining remote KV blob if present (legacy cloud path).
  const { data: kvRow, error: kvError } = await client
    .from('user_kv_store')
    .select('key,value,deleted_at')
    .eq('user_id', userId)
    .eq('key', PERSONAL_BESTS_KV_KEY)
    .maybeSingle();

  if (kvError) {
    throw kvError;
  }

  if (kvRow && !kvRow.deleted_at && kvRow.value != null) {
    const store = parsePersonalBestsStore(serializeRemoteValue(kvRow.value));
    const updatedAt = new Date().toISOString();
    const blobRows = expandPersonalBestsBlobToRows(store, updatedAt);
    const missing: (ReturnType<
      typeof expandPersonalBestsBlobToRows
    >[number] & { dirty: 1 })[] = [];
    for (const row of blobRows) {
      const existing = await getDatabase().getFirstAsync<{ id: string }>(
        'SELECT id FROM personal_best_entries WHERE id = ?',
        row.id
      );
      if (!existing) {
        missing.push({ ...row, dirty: 1 });
      }
    }
    if (missing.length > 0) {
      await upsertLocalPersonalBestRows(missing);
    }
  }

  await pushDirtyPersonalBests(userId);

  // Hard-delete the KV row when allowed; otherwise soft-delete so legacy LWW
  // treats it as removed and does not keep a live blob.
  const deletedAt = new Date().toISOString();
  const { error: deleteError } = await client
    .from('user_kv_store')
    .delete()
    .eq('user_id', userId)
    .eq('key', PERSONAL_BESTS_KV_KEY);

  if (deleteError) {
    const { error: upsertError } = await client.from('user_kv_store').upsert(
      {
        user_id: userId,
        key: PERSONAL_BESTS_KV_KEY,
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

  await markPersonalBestsCloudKvCutoverDone(userId);
}
