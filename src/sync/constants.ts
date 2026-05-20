import { SANITY_APP_CONFIG_NOTIFICATION_CACHE_KEY } from '@/src/services/sanityAppConfig';
import {
  SANITY_SPONSOR_ADS_CACHE_KEY,
  SANITY_SPONSOR_SHOP_CACHE_KEY,
} from '@/src/services/sanitySponsorAds';

export const SYNC_ENABLED_KEY = 'icloud_sync_enabled';
export const SYNC_TS_PREFIX = '__sync_ts__:';

const LOCAL_ONLY_SYNC_KEYS = new Set<string>([
  SANITY_APP_CONFIG_NOTIFICATION_CACHE_KEY,
  SANITY_SPONSOR_ADS_CACHE_KEY,
  SANITY_SPONSOR_SHOP_CACHE_KEY,
]);

export function isInternalKey(key: string): boolean {
  return key === SYNC_ENABLED_KEY || key.startsWith(SYNC_TS_PREFIX);
}

/** Keys that must never participate in iCloud merge or mirror (device-local cache). */
export function isExcludedFromSync(key: string): boolean {
  return isInternalKey(key) || LOCAL_ONLY_SYNC_KEYS.has(key);
}
