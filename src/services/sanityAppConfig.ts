import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type SanityClient } from '@sanity/client';

const SANITY_PROJECT_ID = 'n1zlvrwu';
const SANITY_DATASET = 'production';
const SANITY_API_VERSION = '2024-01-01';

const APP_CONFIG_CACHE_KEY = 'sanity_app_config_notification_v1';
const CACHE_TTL_MS = 60 * 60 * 1000;

const groq = `*[_type == "appConfig"][0]{
  "notification": activeNotification->{
    title,
    body,
    internalCtaText,
    internalCtaUrl
  }
}`;

type SanityNotificationDoc = {
  title?: string | null;
  body?: string | null;
  internalCtaText?: string | null;
  internalCtaUrl?: string | null;
} | null;

type AppConfigQueryResult = {
  notification?: SanityNotificationDoc;
} | null;

export type HomeRemoteNotificationBanner = {
  title: string;
  body: string;
  ctaText: string;
  ctaUrl: string;
};

type CachedPayload = {
  storedAt: number;
  banner: HomeRemoteNotificationBanner | null;
};

let client: SanityClient | null = null;

function getClient(): SanityClient {
  if (!client) {
    client = createClient({
      projectId: SANITY_PROJECT_ID,
      dataset: SANITY_DATASET,
      apiVersion: SANITY_API_VERSION,
      useCdn: true,
    });
  }
  return client;
}

function mapNotification(
  raw: SanityNotificationDoc
): HomeRemoteNotificationBanner | null {
  if (!raw) {
    return null;
  }
  const title = raw.title?.trim() ?? '';
  const body = raw.body?.trim() ?? '';
  if (title.length === 0 && body.length === 0) {
    return null;
  }
  const ctaText = raw.internalCtaText?.trim() ?? '';
  const ctaUrl = raw.internalCtaUrl?.trim() ?? '';
  return {
    title,
    body,
    ctaText,
    ctaUrl,
  };
}

async function readCache(): Promise<CachedPayload | null> {
  try {
    const raw = await AsyncStorage.getItem(APP_CONFIG_CACHE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as unknown;
    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      typeof (parsed as CachedPayload).storedAt !== 'number'
    ) {
      return null;
    }
    const p = parsed as CachedPayload;
    if (
      p.banner !== null &&
      (typeof p.banner.title !== 'string' || typeof p.banner.body !== 'string')
    ) {
      return null;
    }
    return p;
  } catch {
    return null;
  }
}

async function writeCache(banner: HomeRemoteNotificationBanner | null): Promise<void> {
  const payload: CachedPayload = {
    storedAt: Date.now(),
    banner,
  };
  await AsyncStorage.setItem(APP_CONFIG_CACHE_KEY, JSON.stringify(payload));
}

async function fetchFromSanity(): Promise<HomeRemoteNotificationBanner | null> {
  const result = await getClient().fetch<AppConfigQueryResult>(groq);
  return mapNotification(result?.notification ?? null);
}

/**
 * Loads the active notification from Sanity, using a 1-hour in-memory/async
 * storage window before re-fetching. On network failure, returns the last
 * cached banner if one exists (any age).
 */
export async function loadHomeRemoteNotificationBanner(): Promise<HomeRemoteNotificationBanner | null> {
  const cached = await readCache();
  const now = Date.now();
  if (cached && now - cached.storedAt < CACHE_TTL_MS) {
    return cached.banner;
  }

  try {
    const banner = await fetchFromSanity();
    await writeCache(banner);
    return banner;
  } catch (error) {
    console.error('Sanity app config fetch failed:', error);
    if (cached) {
      return cached.banner;
    }
    return null;
  }
}

/** Removes persisted Sanity app config / notification payload. Next Home focus refetches. */
export async function invalidateSanityAppConfigCache(): Promise<void> {
  await AsyncStorage.removeItem(APP_CONFIG_CACHE_KEY);
}
