import { getDatabase } from '@/src/db/database';
import { createUuid, isUuid } from '@/src/utils/uuid';

/**
 * Cloud check-in ids are uuids. Older devices minted `checkin_<time>_…` when
 * `crypto.randomUUID` was missing, and Postgres rejects the whole upsert.
 * Rewrite those ids locally before the next push. Supplements are rewritten
 * first so dose logs keep pointing at the same row.
 */
export async function repairCheckinIdsForSync(): Promise<void> {
  const db = getDatabase();
  await db.withTransactionAsync(async () => {
    const supplementIds = await rewriteIds('checkin_supplements');
    const logs = await db.getAllAsync<{ supplement_id: string }>(
      'SELECT supplement_id FROM checkin_supplement_logs'
    );
    const seen = new Set<string>();
    for (const log of logs) {
      if (isUuid(log.supplement_id) || seen.has(log.supplement_id)) continue;
      seen.add(log.supplement_id);
      const nextId = supplementIds.get(log.supplement_id) ?? createUuid();
      await db.runAsync(
        `UPDATE checkin_supplement_logs
         SET supplement_id = ?, dirty = 1
         WHERE supplement_id = ?`,
        nextId,
        log.supplement_id
      );
    }
    await rewriteIds('checkin_supplement_logs');
    await rewriteIds('checkin_tracked_behaviours');
    await rewriteIds('checkin_behaviour_entries');
  });
}

async function rewriteIds(table: string): Promise<Map<string, string>> {
  const db = getDatabase();
  const rows = await db.getAllAsync<{ id: string }>(`SELECT id FROM ${table}`);
  const rewritten = new Map<string, string>();
  for (const row of rows) {
    if (isUuid(row.id)) continue;
    const nextId = createUuid();
    rewritten.set(row.id, nextId);
    await db.runAsync(
      `UPDATE ${table} SET id = ?, dirty = 1 WHERE id = ?`,
      nextId,
      row.id
    );
  }
  return rewritten;
}
