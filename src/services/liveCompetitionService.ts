import { TEMPERED_STRENGTH_API_ORIGIN } from '@/src/services/temperedStrengthApi';
import type {
  LiveCompetition,
  LiveCompetitionEntry,
  LiveCompetitionMetricType,
} from '@/src/types/live-competition';
import { type CompetitionEnvironment } from '../utils/environment';

export const LIVE_COMPETITION_CACHE_TTL_MS = 60 * 1000;

export type LoadLiveCompetitionOptions = {
  /** Bypass cache and fetch from the API. */
  forceRefresh?: boolean;
};

type LiveCompetitionApiResponse = {
  title: unknown;
  description: unknown;
  additionalInfo: unknown;
  linkText: unknown;
  metricType: unknown;
  theme: unknown;
  entries: unknown;
};

type LiveCompetitionCache = {
  environment: CompetitionEnvironment;
  competition: LiveCompetition | null;
  fetchedAt: number;
};

let liveCompetitionCache: LiveCompetitionCache | null = null;

const LIVE_COMPETITION_METRIC_TYPES = [
  'max_weight',
  'max_reps',
  'max_time',
  'max_calories',
  'max_distance',
] as const satisfies readonly LiveCompetitionMetricType[];

function isLiveCompetitionMetricType(
  value: unknown
): value is LiveCompetitionMetricType {
  return (
    typeof value === 'string' &&
    LIVE_COMPETITION_METRIC_TYPES.includes(
      value as LiveCompetitionMetricType
    )
  );
}

function parseEntry(raw: unknown): LiveCompetitionEntry | null {
  if (!raw || typeof raw !== 'object') {
    return null;
  }

  const entry = raw as Record<string, unknown>;
  const name = typeof entry.name === 'string' ? entry.name : null;
  const category = typeof entry.category === 'string' ? entry.category : null;
  const score =
    typeof entry.score === 'number'
      ? entry.score
      : typeof entry.score === 'string'
        ? Number(entry.score)
        : NaN;

  if (!name || !category || Number.isNaN(score)) {
    return null;
  }

  return { name, score, category };
}

export function parseLiveCompetitionResponse(
  raw: unknown
): LiveCompetition | null {
  if (!raw || typeof raw !== 'object') {
    return null;
  }

  const data = raw as LiveCompetitionApiResponse;

  if (
    typeof data.title !== 'string' ||
    typeof data.description !== 'string' ||
    typeof data.linkText !== 'string' ||
    !isLiveCompetitionMetricType(data.metricType) ||
    !data.theme ||
    typeof data.theme !== 'object' ||
    !Array.isArray(data.entries)
  ) {
    return null;
  }

  const theme = data.theme as Record<string, unknown>;
  const themeFields = [
    'borderColor',
    'bgColor',
    'copyColor',
    'linkColor',
    'linkTextColor',
  ] as const;

  for (const field of themeFields) {
    if (typeof theme[field] !== 'string') {
      return null;
    }
  }

  const entries = data.entries
    .map(parseEntry)
    .filter((entry): entry is LiveCompetitionEntry => entry !== null);

  return {
    title: data.title,
    description: data.description,
    additionalInfo:
      typeof data.additionalInfo === 'string' ? data.additionalInfo : '',
    linkText: data.linkText,
    metricType: data.metricType,
    theme: {
      borderColor: theme.borderColor as string,
      bgColor: theme.bgColor as string,
      copyColor: theme.copyColor as string,
      linkColor: theme.linkColor as string,
      linkTextColor: theme.linkTextColor as string,
    },
    entries,
  };
}

function isCacheFresh(
  cache: LiveCompetitionCache,
  environment: CompetitionEnvironment
): boolean {
  return (
    cache.environment === environment &&
    Date.now() - cache.fetchedAt < LIVE_COMPETITION_CACHE_TTL_MS
  );
}

/** Fresh cached value, or `undefined` when missing/expired/wrong environment. */
export function peekLiveCompetitionCache(
  environment: CompetitionEnvironment
): LiveCompetition | null | undefined {
  if (
    !liveCompetitionCache ||
    !isCacheFresh(liveCompetitionCache, environment)
  ) {
    return undefined;
  }

  return liveCompetitionCache.competition;
}

/** Cached value even when stale, or `undefined` when nothing is cached. */
export function peekStaleLiveCompetitionCache(
  environment: CompetitionEnvironment
): LiveCompetition | null | undefined {
  if (
    !liveCompetitionCache ||
    liveCompetitionCache.environment !== environment
  ) {
    return undefined;
  }

  return liveCompetitionCache.competition;
}

export function clearLiveCompetitionCache(): void {
  liveCompetitionCache = null;
}

async function fetchLiveCompetitionFromApi(
  environment: CompetitionEnvironment
): Promise<LiveCompetition | null> {
  const url = `${TEMPERED_STRENGTH_API_ORIGIN}/api/live-competition?environment=${environment}&_=${Date.now()}`;

  try {
    const response = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
      },
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      if (__DEV__) {
        console.warn(
          `Live competition fetch failed (${response.status}): ${url}`
        );
      }
      return null;
    }

    const data: unknown = await response.json();
    const competition = parseLiveCompetitionResponse(data);

    if (!competition) {
      console.error('Live competition API returned an invalid payload.');
      return null;
    }

    return competition;
  } catch (error) {
    if (__DEV__) {
      console.warn('Live competition fetch error:', error);
    }
    return null;
  }
}

export async function loadLiveCompetition(
  environment: CompetitionEnvironment,
  options?: LoadLiveCompetitionOptions
): Promise<LiveCompetition | null> {
  const forceRefresh = options?.forceRefresh ?? false;

  if (
    !forceRefresh &&
    liveCompetitionCache &&
    isCacheFresh(liveCompetitionCache, environment)
  ) {
    return liveCompetitionCache.competition;
  }

  const competition = await fetchLiveCompetitionFromApi(environment);

  liveCompetitionCache = {
    environment,
    competition,
    fetchedAt: Date.now(),
  };

  return competition;
}
