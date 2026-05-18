import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type SanityClient } from '@sanity/client';

const SANITY_PROJECT_ID = 'n1zlvrwu';
const SANITY_DATASET = 'production';
const SANITY_API_VERSION = '2024-01-01';

/** AsyncStorage key for cached sponsor ads; local-only (not iCloud-synced). */
export const SANITY_SPONSOR_ADS_CACHE_KEY = 'sanity_sponsor_ads_v1';
const CACHE_TTL_MS = __DEV__ ? 0 : 60 * 60 * 1000;

export type LoadHomeSponsorAdsOptions = {
  /** Bypass TTL and fetch from Sanity (still updates cache). */
  forceRefresh?: boolean;
};

const groq = `*[_type == "appConfig"][0]{
  "ads": activeSponsorAds[]->{
    _id,
    title,
    description,
    layout,
    affiliateUrl,
    ctaLabel,
    backgroundColor,
    titleColor,
    descriptionColor,
    ctaBackgroundColor,
    ctaTextColor,
    enabled,
    "logoUrl": logo.asset->url,
    "productUrl": productImage.asset->url
  }
}`;

const HEX_COLOR =
  /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

const LAYOUTS = ['textHeader', 'logoHeader', 'productLeft'] as const;

/** Default sponsor card colours (light card). */
export const SPONSOR_AD_COLOR_DEFAULTS = {
  bgColor: '#ffffff',
  titleColor: '#111111',
  descriptionColor: '#444444',
  ctaColor: '#111111',
  ctaTextColor: '#ffffff',
} as const;

export type SponsorAdLayout = (typeof LAYOUTS)[number];

export type HomeSponsorAd = {
  id: string;
  title: string;
  description: string;
  layout: SponsorAdLayout;
  affiliateUrl: string;
  ctaLabel: string;
  bgColor: string;
  titleColor: string;
  descriptionColor: string;
  ctaColor: string;
  ctaTextColor: string;
  logoUrl: string | null;
  productUrl: string | null;
};

type SanitySponsorAdDoc = {
  _id?: string | null;
  title?: string | null;
  description?: string | null;
  layout?: string | null;
  affiliateUrl?: string | null;
  ctaLabel?: string | null;
  backgroundColor?: string | null;
  titleColor?: string | null;
  descriptionColor?: string | null;
  ctaBackgroundColor?: string | null;
  ctaTextColor?: string | null;
  enabled?: boolean | null;
  logoUrl?: string | null;
  productUrl?: string | null;
};

type AppConfigSponsorQueryResult = {
  ads?: SanitySponsorAdDoc[] | null;
} | null;

type CachedPayload = {
  storedAt: number;
  ads: HomeSponsorAd[];
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

function sanitizeHex(
  value: string | null | undefined,
  fallback: string
): string {
  const t = value?.trim() ?? '';
  return HEX_COLOR.test(t) ? t : fallback;
}

function isLayout(value: string): value is SponsorAdLayout {
  return (LAYOUTS as readonly string[]).includes(value);
}

function nonEmptyUrl(value: string | null | undefined): string | null {
  const t = value?.trim() ?? '';
  return t.length > 0 ? t : null;
}

function passesLayoutValidation(
  layout: SponsorAdLayout,
  title: string,
  logoUrl: string | null,
  productUrl: string | null
): boolean {
  switch (layout) {
    case 'textHeader':
      return title.length > 0;
    case 'logoHeader':
      return logoUrl !== null || title.length > 0;
    case 'productLeft':
      return title.length > 0 && productUrl !== null;
    default:
      return false;
  }
}

function mapSponsorAd(raw: SanitySponsorAdDoc): HomeSponsorAd | null {
  const id = raw._id?.trim() ?? '';
  if (id.length === 0) {
    return null;
  }
  if (raw.enabled === false) {
    return null;
  }
  const layoutRaw = raw.layout?.trim() ?? '';
  if (!isLayout(layoutRaw)) {
    return null;
  }
  const affiliateUrl = raw.affiliateUrl?.trim() ?? '';
  if (affiliateUrl.length === 0) {
    return null;
  }
  const description = raw.description?.trim() ?? '';
  if (description.length === 0) {
    return null;
  }
  const title = raw.title?.trim() ?? '';
  const logoUrl = nonEmptyUrl(raw.logoUrl);
  const productUrl = nonEmptyUrl(raw.productUrl);
  if (!passesLayoutValidation(layoutRaw, title, logoUrl, productUrl)) {
    return null;
  }

  const d = SPONSOR_AD_COLOR_DEFAULTS;
  const ctaLabel = raw.ctaLabel?.trim() ?? '';
  return {
    id,
    title,
    description,
    layout: layoutRaw,
    affiliateUrl,
    ctaLabel: ctaLabel.length > 0 ? ctaLabel : 'Visit Website',
    bgColor: sanitizeHex(raw.backgroundColor, d.bgColor),
    titleColor: sanitizeHex(raw.titleColor, d.titleColor),
    descriptionColor: sanitizeHex(raw.descriptionColor, d.descriptionColor),
    ctaColor: sanitizeHex(raw.ctaBackgroundColor, d.ctaColor),
    ctaTextColor: sanitizeHex(raw.ctaTextColor, d.ctaTextColor),
    logoUrl,
    productUrl,
  };
}

function mapSponsorAds(raw: SanitySponsorAdDoc[] | null | undefined): HomeSponsorAd[] {
  if (!raw || !Array.isArray(raw)) {
    return [];
  }
  const ads: HomeSponsorAd[] = [];
  for (const item of raw) {
    const mapped = mapSponsorAd(item);
    if (mapped) {
      ads.push(mapped);
    }
  }
  return ads;
}

function normalizeAdFromCache(raw: unknown): HomeSponsorAd | null {
  if (typeof raw !== 'object' || raw === null) {
    return null;
  }
  const o = raw as Record<string, unknown>;
  if (typeof o.id !== 'string' || typeof o.layout !== 'string') {
    return null;
  }
  return mapSponsorAd({
    _id: o.id,
    title: typeof o.title === 'string' ? o.title : '',
    description: typeof o.description === 'string' ? o.description : '',
    layout: o.layout,
    affiliateUrl: typeof o.affiliateUrl === 'string' ? o.affiliateUrl : '',
    ctaLabel: typeof o.ctaLabel === 'string' ? o.ctaLabel : '',
    backgroundColor: typeof o.bgColor === 'string' ? o.bgColor : null,
    titleColor: typeof o.titleColor === 'string' ? o.titleColor : null,
    descriptionColor:
      typeof o.descriptionColor === 'string' ? o.descriptionColor : null,
    ctaBackgroundColor: typeof o.ctaColor === 'string' ? o.ctaColor : null,
    ctaTextColor: typeof o.ctaTextColor === 'string' ? o.ctaTextColor : null,
    enabled: true,
    logoUrl: typeof o.logoUrl === 'string' ? o.logoUrl : null,
    productUrl: typeof o.productUrl === 'string' ? o.productUrl : null,
  });
}

function normalizeAdsFromCache(raw: unknown): HomeSponsorAd[] | null {
  if (!Array.isArray(raw)) {
    return null;
  }
  const ads: HomeSponsorAd[] = [];
  for (const item of raw) {
    const mapped = normalizeAdFromCache(item);
    if (mapped) {
      ads.push(mapped);
    }
  }
  return ads;
}

async function readCache(): Promise<CachedPayload | null> {
  try {
    const raw = await AsyncStorage.getItem(SANITY_SPONSOR_ADS_CACHE_KEY);
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
    const p = parsed as { storedAt: number; ads: unknown };
    const ads = normalizeAdsFromCache(p.ads);
    if (ads === null) {
      return null;
    }
    return { storedAt: p.storedAt, ads };
  } catch {
    return null;
  }
}

async function writeCache(ads: HomeSponsorAd[]): Promise<void> {
  const payload: CachedPayload = {
    storedAt: Date.now(),
    ads,
  };
  await AsyncStorage.setItem(
    SANITY_SPONSOR_ADS_CACHE_KEY,
    JSON.stringify(payload)
  );
}

async function fetchFromSanity(): Promise<HomeSponsorAd[]> {
  const result = await getClient().fetch<AppConfigSponsorQueryResult>(groq);
  return mapSponsorAds(result?.ads ?? null);
}

/**
 * Loads home sponsor ads from Sanity, using a 1-hour cache window before
 * re-fetching. On network failure, returns the last cached list if one exists.
 */
export async function loadHomeSponsorAds(
  options?: LoadHomeSponsorAdsOptions
): Promise<HomeSponsorAd[]> {
  const forceRefresh = options?.forceRefresh === true;
  const cached = await readCache();
  const now = Date.now();
  if (
    !forceRefresh &&
    cached &&
    CACHE_TTL_MS > 0 &&
    now - cached.storedAt < CACHE_TTL_MS
  ) {
    return cached.ads;
  }

  try {
    const ads = await fetchFromSanity();
    await writeCache(ads);
    return ads;
  } catch (error) {
    console.error('Sanity sponsor ads fetch failed:', error);
    if (cached) {
      return cached.ads;
    }
    return [];
  }
}

/** Removes persisted sponsor ads cache. Next Home focus refetches. */
export async function invalidateSanitySponsorAdsCache(): Promise<void> {
  await AsyncStorage.removeItem(SANITY_SPONSOR_ADS_CACHE_KEY);
}
