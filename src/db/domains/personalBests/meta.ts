import { getDatabase } from '@/src/db/database';
import { PERSONAL_BESTS_DOMAIN, PERSONAL_BESTS_META } from './types';

export async function getPersonalBestsMeta(
  key: string
): Promise<string | null> {
  const row = await getDatabase().getFirstAsync<{ value: string }>(
    'SELECT value FROM domain_meta WHERE domain = ? AND key = ?',
    PERSONAL_BESTS_DOMAIN,
    key
  );
  return row?.value ?? null;
}

export async function setPersonalBestsMeta(
  key: string,
  value: string
): Promise<void> {
  await getDatabase().runAsync(
    `INSERT INTO domain_meta (domain, key, value) VALUES (?, ?, ?)
     ON CONFLICT(domain, key) DO UPDATE SET value = excluded.value`,
    PERSONAL_BESTS_DOMAIN,
    key,
    value
  );
}

export async function isPersonalBestsLocalMigrated(): Promise<boolean> {
  return (
    (await getPersonalBestsMeta(PERSONAL_BESTS_META.localMigrated)) === 'true'
  );
}

export async function markPersonalBestsLocalMigrated(): Promise<void> {
  await setPersonalBestsMeta(PERSONAL_BESTS_META.localMigrated, 'true');
}

export async function getPersonalBestsLastRowSyncedAt(): Promise<string | null> {
  return getPersonalBestsMeta(PERSONAL_BESTS_META.lastRowSyncedAt);
}

export async function setPersonalBestsLastRowSyncedAt(
  iso: string
): Promise<void> {
  await setPersonalBestsMeta(PERSONAL_BESTS_META.lastRowSyncedAt, iso);
}

export async function isPersonalBestsCloudKvCutoverDone(
  userId: string
): Promise<boolean> {
  return (
    (await getPersonalBestsMeta(
      `${PERSONAL_BESTS_META.cloudKvCutover}:${userId}`
    )) === 'true'
  );
}

export async function markPersonalBestsCloudKvCutoverDone(
  userId: string
): Promise<void> {
  await setPersonalBestsMeta(
    `${PERSONAL_BESTS_META.cloudKvCutover}:${userId}`,
    'true'
  );
}

export async function clearPersonalBestsDomainMeta(): Promise<void> {
  await getDatabase().runAsync(
    'DELETE FROM domain_meta WHERE domain = ?',
    PERSONAL_BESTS_DOMAIN
  );
}
