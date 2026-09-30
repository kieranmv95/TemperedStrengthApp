import { getDatabase } from '@/src/db/database';
import { CHECKIN_DOMAIN, CHECKIN_META } from './types';

export async function getCheckinMeta(key: string): Promise<string | null> {
  const row = await getDatabase().getFirstAsync<{ value: string }>(
    'SELECT value FROM domain_meta WHERE domain = ? AND key = ?',
    CHECKIN_DOMAIN,
    key
  );
  return row?.value ?? null;
}

export async function setCheckinMeta(key: string, value: string): Promise<void> {
  await getDatabase().runAsync(
    `INSERT INTO domain_meta (domain, key, value) VALUES (?, ?, ?)
     ON CONFLICT(domain, key) DO UPDATE SET value = excluded.value`,
    CHECKIN_DOMAIN,
    key,
    value
  );
}

export async function getCheckinLastRowSyncedAt(
  table: string
): Promise<string | null> {
  return getCheckinMeta(`${CHECKIN_META.lastRowSyncedAt}:${table}`);
}

export async function setCheckinLastRowSyncedAt(
  table: string,
  iso: string
): Promise<void> {
  await setCheckinMeta(`${CHECKIN_META.lastRowSyncedAt}:${table}`, iso);
}

export async function clearCheckinDomainMeta(): Promise<void> {
  await getDatabase().runAsync(
    'DELETE FROM domain_meta WHERE domain = ?',
    CHECKIN_DOMAIN
  );
}
