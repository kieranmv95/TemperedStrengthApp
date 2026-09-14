import bundledCatalogue from '@/src/data/checkin/behaviour-catalogue.json';
import type {
  BehaviourCatalogue,
  CatalogueBehaviour,
  CatalogueCategory,
} from '@/src/types/checkin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getSupabaseClient } from '@/src/services/supabaseClient';

export const BEHAVIOUR_CATALOGUE_CACHE_KEY = 'checkin_behaviour_catalogue_cache_v1';

let memoryCatalogue: BehaviourCatalogue | null = null;

function isCatalogue(value: unknown): value is BehaviourCatalogue {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const c = value as Partial<BehaviourCatalogue>;
  return (
    typeof c.catalogueVersion === 'number' &&
    typeof c.weekStartsOn === 'number' &&
    Array.isArray(c.categories) &&
    Array.isArray(c.behaviours)
  );
}

export function getBundledCatalogue(): BehaviourCatalogue {
  return bundledCatalogue as BehaviourCatalogue;
}

export async function getCachedRemoteCatalogue(): Promise<BehaviourCatalogue | null> {
  try {
    const raw = await AsyncStorage.getItem(BEHAVIOUR_CATALOGUE_CACHE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as unknown;
    return isCatalogue(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export async function setCachedRemoteCatalogue(
  catalogue: BehaviourCatalogue
): Promise<void> {
  await AsyncStorage.setItem(
    BEHAVIOUR_CATALOGUE_CACHE_KEY,
    JSON.stringify(catalogue)
  );
}

/**
 * Effective catalogue: remote cache if newer version than bundled, else bundled.
 */
export function resolveCatalogue(
  bundled: BehaviourCatalogue,
  remote: BehaviourCatalogue | null
): BehaviourCatalogue {
  if (remote && remote.catalogueVersion > bundled.catalogueVersion) {
    return remote;
  }
  return bundled;
}

export async function getBehaviourCatalogue(): Promise<BehaviourCatalogue> {
  if (memoryCatalogue) {
    return memoryCatalogue;
  }
  const bundled = getBundledCatalogue();
  const cached = await getCachedRemoteCatalogue();
  memoryCatalogue = resolveCatalogue(bundled, cached);
  return memoryCatalogue;
}

export function invalidateCatalogueMemoryCache(): void {
  memoryCatalogue = null;
}

export async function getWeekStartsOn(): Promise<number> {
  const catalogue = await getBehaviourCatalogue();
  return catalogue.weekStartsOn;
}

export async function getBehaviourById(
  id: string
): Promise<CatalogueBehaviour | undefined> {
  const catalogue = await getBehaviourCatalogue();
  return catalogue.behaviours.find((b) => b.id === id);
}

export async function getSelectableBehaviours(options: {
  womensHealthVisible: boolean;
}): Promise<CatalogueBehaviour[]> {
  const catalogue = await getBehaviourCatalogue();
  return catalogue.behaviours.filter((b) => {
    if (b.deprecated) {
      return false;
    }
    if (b.sensitive && !options.womensHealthVisible) {
      return false;
    }
    return true;
  });
}

export async function getVisibleCategories(options: {
  womensHealthVisible: boolean;
}): Promise<CatalogueCategory[]> {
  const catalogue = await getBehaviourCatalogue();
  return catalogue.categories
    .filter((c) => !c.sensitive || options.womensHealthVisible)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

/**
 * Best-effort fetch of remote catalogue. Never throws; returns null on failure.
 */
export async function fetchRemoteBehaviourCatalogue(): Promise<BehaviourCatalogue | null> {
  try {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('behaviour_catalogue')
      .select('catalogue_version, payload, updated_at')
      .eq('id', 1)
      .maybeSingle();
    if (error || !data) {
      return null;
    }
    const payload = data.payload as unknown;
    if (!isCatalogue(payload)) {
      // payload may be the behaviours wrapper without version — or full catalogue
      if (
        typeof payload === 'object' &&
        payload !== null &&
        Array.isArray((payload as BehaviourCatalogue).behaviours)
      ) {
        const p = payload as BehaviourCatalogue;
        if (typeof p.catalogueVersion !== 'number') {
          p.catalogueVersion = data.catalogue_version as number;
        }
        if (isCatalogue(p)) {
          return p;
        }
      }
      return null;
    }
    if (payload.catalogueVersion !== data.catalogue_version) {
      return {
        ...payload,
        catalogueVersion: data.catalogue_version as number,
      };
    }
    return payload;
  } catch {
    return null;
  }
}

/**
 * Refresh remote catalogue into cache when newer. Updates memory cache.
 */
export async function refreshBehaviourCatalogueFromRemote(): Promise<BehaviourCatalogue> {
  const bundled = getBundledCatalogue();
  const remote = await fetchRemoteBehaviourCatalogue();
  if (remote && remote.catalogueVersion > bundled.catalogueVersion) {
    await setCachedRemoteCatalogue(remote);
    memoryCatalogue = remote;
    return remote;
  }
  const cached = await getCachedRemoteCatalogue();
  memoryCatalogue = resolveCatalogue(bundled, cached);
  return memoryCatalogue;
}
