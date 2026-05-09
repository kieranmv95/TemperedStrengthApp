import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type SanityClient } from '@sanity/client';

const SANITY_PROJECT_ID = 'n1zlvrwu';
const SANITY_DATASET = 'production';
const SANITY_API_VERSION = '2024-01-01';

/** AsyncStorage key for cached Sanity notification banner; local-only (not iCloud-synced). */
export const SANITY_APP_CONFIG_NOTIFICATION_CACHE_KEY =
  'sanity_app_config_notification_v1';
const CACHE_TTL_MS = 60 * 60 * 1000;

const groq = `*[_type == "appConfig"][0]{
  "notification": activeNotification->{
    title,
    body,
    internalCtaText,
    internalCtaUrl,
    borderColor,
    bgColor,
    titleColor,
    descriptionColor,
    ctaColor,
    ctaTextColor
  }
}`;

const HEX_COLOR =
  /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

/** Matches Sanity `notification` colour field initial values. */
export const NOTIFICATION_COLOR_DEFAULTS = {
  borderColor: '#2a3142',
  bgColor: '#1a1f2b',
  titleColor: '#ffffff',
  descriptionColor: '#cbd5e1',
  ctaColor: '#d4b96a',
  ctaTextColor: '#1a1f2b',
} as const;

type SanityNotificationDoc = {
  title?: string | null;
  body?: string | null;
  internalCtaText?: string | null;
  internalCtaUrl?: string | null;
  borderColor?: string | null;
  bgColor?: string | null;
  titleColor?: string | null;
  descriptionColor?: string | null;
  ctaColor?: string | null;
  ctaTextColor?: string | null;
} | null;

type AppConfigQueryResult = {
  notification?: SanityNotificationDoc;
} | null;

export type HomeRemoteNotificationBanner = {
  title: string;
  body: string;
  ctaText: string;
  ctaUrl: string;
  borderColor: string;
  bgColor: string;
  titleColor: string;
  descriptionColor: string;
  ctaColor: string;
  ctaTextColor: string;
};

function sanitizeHex(
  value: string | null | undefined,
  fallback: string
): string {
  const t = value?.trim() ?? '';
  return HEX_COLOR.test(t) ? t : fallback;
}

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
  const d = NOTIFICATION_COLOR_DEFAULTS;
  return {
    title,
    body,
    ctaText,
    ctaUrl,
    borderColor: sanitizeHex(raw.borderColor, d.borderColor),
    bgColor: sanitizeHex(raw.bgColor, d.bgColor),
    titleColor: sanitizeHex(raw.titleColor, d.titleColor),
    descriptionColor: sanitizeHex(raw.descriptionColor, d.descriptionColor),
    ctaColor: sanitizeHex(raw.ctaColor, d.ctaColor),
    ctaTextColor: sanitizeHex(raw.ctaTextColor, d.ctaTextColor),
  };
}

function normalizeBannerFromCache(
  raw: unknown
): HomeRemoteNotificationBanner | null {
  if (typeof raw !== 'object' || raw === null) {
    return null;
  }
  const o = raw as Record<string, unknown>;
  if (typeof o.title !== 'string' || typeof o.body !== 'string') {
    return null;
  }
  const title = o.title.trim();
  const body = o.body.trim();
  if (title.length === 0 && body.length === 0) {
    return null;
  }
  const ctaText = typeof o.ctaText === 'string' ? o.ctaText.trim() : '';
  const ctaUrl = typeof o.ctaUrl === 'string' ? o.ctaUrl.trim() : '';
  return mapNotification({
    title,
    body,
    internalCtaText: ctaText,
    internalCtaUrl: ctaUrl,
    borderColor: typeof o.borderColor === 'string' ? o.borderColor : null,
    bgColor: typeof o.bgColor === 'string' ? o.bgColor : null,
    titleColor: typeof o.titleColor === 'string' ? o.titleColor : null,
    descriptionColor:
      typeof o.descriptionColor === 'string' ? o.descriptionColor : null,
    ctaColor: typeof o.ctaColor === 'string' ? o.ctaColor : null,
    ctaTextColor: typeof o.ctaTextColor === 'string' ? o.ctaTextColor : null,
  });
}

async function readCache(): Promise<CachedPayload | null> {
  try {
    const raw = await AsyncStorage.getItem(
      SANITY_APP_CONFIG_NOTIFICATION_CACHE_KEY
    );
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as unknown;
    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      typeof (parsed as { storedAt?: unknown }).storedAt !== 'number'
    ) {
      return null;
    }
    const p = parsed as { storedAt: number; banner: unknown };
    const banner =
      p.banner === null ? null : normalizeBannerFromCache(p.banner);
    if (p.banner !== null && banner === null) {
      return null;
    }
    return { storedAt: p.storedAt, banner };
  } catch {
    return null;
  }
}

async function writeCache(
  banner: HomeRemoteNotificationBanner | null
): Promise<void> {
  const payload: CachedPayload = {
    storedAt: Date.now(),
    banner,
  };
  await AsyncStorage.setItem(
    SANITY_APP_CONFIG_NOTIFICATION_CACHE_KEY,
    JSON.stringify(payload)
  );
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
  await AsyncStorage.removeItem(SANITY_APP_CONFIG_NOTIFICATION_CACHE_KEY);
}
