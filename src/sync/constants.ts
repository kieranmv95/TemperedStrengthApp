export const SYNC_ENABLED_KEY = 'icloud_sync_enabled';
export const SYNC_TS_PREFIX = '__sync_ts__:';

export function isInternalKey(key: string): boolean {
  return key === SYNC_ENABLED_KEY || key.startsWith(SYNC_TS_PREFIX);
}

