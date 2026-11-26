import { getDatabase } from '@/src/db/database';
import {
  CONDITIONING_EFFORTS_DOMAIN,
  CONDITIONING_EFFORTS_META,
} from './types';

export async function getConditioningEffortsMeta(
  key: string
): Promise<string | null> {
  const row = await getDatabase().getFirstAsync<{ value: string }>(
    'SELECT value FROM domain_meta WHERE domain = ? AND key = ?',
    CONDITIONING_EFFORTS_DOMAIN,
    key
  );
  return row?.value ?? null;
}

export async function setConditioningEffortsMeta(
  key: string,
  value: string
): Promise<void> {
  await getDatabase().runAsync(
    `INSERT INTO domain_meta (domain, key, value) VALUES (?, ?, ?)
     ON CONFLICT(domain, key) DO UPDATE SET value = excluded.value`,
    CONDITIONING_EFFORTS_DOMAIN,
    key,
    value
  );
}

export async function getConditioningEffortsLastRowSyncedAt(): Promise<
  string | null
> {
  return getConditioningEffortsMeta(CONDITIONING_EFFORTS_META.lastRowSyncedAt);
}

export async function setConditioningEffortsLastRowSyncedAt(
  iso: string
): Promise<void> {
  await setConditioningEffortsMeta(
    CONDITIONING_EFFORTS_META.lastRowSyncedAt,
    iso
  );
}

export async function clearConditioningEffortsDomainMeta(): Promise<void> {
  await getDatabase().runAsync(
    'DELETE FROM domain_meta WHERE domain = ?',
    CONDITIONING_EFFORTS_DOMAIN
  );
}
