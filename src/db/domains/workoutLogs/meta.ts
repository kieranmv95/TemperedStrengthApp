import { getDatabase } from '@/src/db/database';
import { WORKOUT_LOGS_DOMAIN, WORKOUT_LOGS_META } from './types';

export async function getWorkoutLogsMeta(key: string): Promise<string | null> {
  const row = await getDatabase().getFirstAsync<{ value: string }>(
    'SELECT value FROM domain_meta WHERE domain = ? AND key = ?',
    WORKOUT_LOGS_DOMAIN,
    key
  );
  return row?.value ?? null;
}

export async function setWorkoutLogsMeta(
  key: string,
  value: string
): Promise<void> {
  await getDatabase().runAsync(
    `INSERT INTO domain_meta (domain, key, value) VALUES (?, ?, ?)
     ON CONFLICT(domain, key) DO UPDATE SET value = excluded.value`,
    WORKOUT_LOGS_DOMAIN,
    key,
    value
  );
}

export async function isWorkoutLogsLocalMigrated(): Promise<boolean> {
  return (await getWorkoutLogsMeta(WORKOUT_LOGS_META.localMigrated)) === 'true';
}

export async function markWorkoutLogsLocalMigrated(): Promise<void> {
  await setWorkoutLogsMeta(WORKOUT_LOGS_META.localMigrated, 'true');
}

export async function getWorkoutLogsLastRowSyncedAt(): Promise<string | null> {
  return getWorkoutLogsMeta(WORKOUT_LOGS_META.lastRowSyncedAt);
}

export async function setWorkoutLogsLastRowSyncedAt(
  iso: string
): Promise<void> {
  await setWorkoutLogsMeta(WORKOUT_LOGS_META.lastRowSyncedAt, iso);
}

export async function isWorkoutLogsCloudKvCutoverDone(
  userId: string
): Promise<boolean> {
  return (
    (await getWorkoutLogsMeta(
      `${WORKOUT_LOGS_META.cloudKvCutover}:${userId}`
    )) === 'true'
  );
}

export async function markWorkoutLogsCloudKvCutoverDone(
  userId: string
): Promise<void> {
  await setWorkoutLogsMeta(
    `${WORKOUT_LOGS_META.cloudKvCutover}:${userId}`,
    'true'
  );
}

export async function clearWorkoutLogsDomainMeta(): Promise<void> {
  await getDatabase().runAsync(
    'DELETE FROM domain_meta WHERE domain = ?',
    WORKOUT_LOGS_DOMAIN
  );
}
