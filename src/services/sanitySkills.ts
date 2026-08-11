import type { Skill, SkillCue, SkillVideo } from '@/src/types/skills';
import { environments } from '@/src/utils/environment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type SanityClient } from '@sanity/client';

const SANITY_PROJECT_ID = 'n1zlvrwu';
const SANITY_DATASET = environments.sanity;
const SANITY_API_VERSION = '2024-01-01';

/** AsyncStorage key for Skills & Cues catalog; local-only. */
export const SANITY_SKILLS_CACHE_KEY = 'sanity_skills_v1';
const CACHE_TTL_MS = __DEV__ ? 0 : 60 * 60 * 1000;

export type LoadSkillsOptions = {
  /** Bypass TTL and fetch from Sanity (still updates cache). */
  forceRefresh?: boolean;
};

const skillsGroq = `*[_type == "skill" && defined(slug.current)] | order(name asc) {
  "id": slug.current,
  name,
  description,
  "thumbnailUrl": thumbnail.asset->url,
  videos[]{
    "id": youtubeId,
    name,
    description
  },
  tips,
  cues[]{
    title,
    description,
    "imageUrl": image.asset->url
  },
  articleSlugs,
  recoveryFlowIds,
  "workoutsIds": workoutIds
}`;

type SanitySkillVideoDoc = {
  id?: string | null;
  name?: string | null;
  description?: string | null;
};

type SanitySkillCueDoc = {
  title?: string | null;
  description?: string | null;
  imageUrl?: string | null;
};

type SanitySkillDoc = {
  id?: string | null;
  name?: string | null;
  description?: string | null;
  thumbnailUrl?: string | null;
  videos?: SanitySkillVideoDoc[] | null;
  tips?: (string | null)[] | null;
  cues?: SanitySkillCueDoc[] | null;
  articleSlugs?: (string | null)[] | null;
  recoveryFlowIds?: (string | null)[] | null;
  workoutsIds?: (string | null)[] | null;
};

type CachedPayload = {
  storedAt: number;
  skills: Skill[];
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

function nonEmptyString(value: string | null | undefined): string | null {
  const trimmed = value?.trim() ?? '';
  return trimmed.length > 0 ? trimmed : null;
}

function mapStringList(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }
  const items: string[] = [];
  for (const entry of value) {
    if (typeof entry !== 'string') {
      continue;
    }
    const trimmed = entry.trim();
    if (trimmed.length > 0) {
      items.push(trimmed);
    }
  }
  return items.length > 0 ? items : undefined;
}

function mapVideos(value: unknown): SkillVideo[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }
  const videos: SkillVideo[] = [];
  for (const entry of value) {
    if (typeof entry !== 'object' || entry === null) {
      continue;
    }
    const doc = entry as SanitySkillVideoDoc;
    const id = nonEmptyString(doc.id);
    const name = nonEmptyString(doc.name);
    const description = nonEmptyString(doc.description);
    if (!id || !name || !description) {
      continue;
    }
    videos.push({ id, name, description });
  }
  return videos.length > 0 ? videos : undefined;
}

function mapCues(value: unknown): SkillCue[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }
  const cues: SkillCue[] = [];
  for (const entry of value) {
    if (typeof entry !== 'object' || entry === null) {
      continue;
    }
    const doc = entry as SanitySkillCueDoc;
    const imageUrl = nonEmptyString(doc.imageUrl);
    if (!imageUrl) {
      continue;
    }
    const title = nonEmptyString(doc.title) ?? undefined;
    const description = nonEmptyString(doc.description) ?? undefined;
    cues.push({
      title,
      description,
      imagePath: { uri: imageUrl },
    });
  }
  return cues.length > 0 ? cues : undefined;
}

function mapSkill(doc: SanitySkillDoc): Skill | null {
  const id = nonEmptyString(doc.id);
  const name = nonEmptyString(doc.name);
  const description = nonEmptyString(doc.description);
  const thumbnailUrl = nonEmptyString(doc.thumbnailUrl);
  if (!id || !name || !description || !thumbnailUrl) {
    return null;
  }

  return {
    id,
    name,
    description,
    thumbnailPath: { uri: thumbnailUrl },
    videoIds: mapVideos(doc.videos),
    tips: mapStringList(doc.tips),
    cues: mapCues(doc.cues),
    articleSlugs: mapStringList(doc.articleSlugs),
    recoveryFlowIds: mapStringList(doc.recoveryFlowIds),
    workoutsIds: mapStringList(doc.workoutsIds),
  };
}

function mapSkills(docs: SanitySkillDoc[] | null | undefined): Skill[] {
  if (!Array.isArray(docs)) {
    return [];
  }
  const skills: Skill[] = [];
  for (const doc of docs) {
    const mapped = mapSkill(doc);
    if (mapped) {
      skills.push(mapped);
    }
  }
  return skills;
}

function normalizeSkillFromCache(raw: unknown): Skill | null {
  if (typeof raw !== 'object' || raw === null) {
    return null;
  }
  const o = raw as Record<string, unknown>;
  const id = typeof o.id === 'string' ? nonEmptyString(o.id) : null;
  const name = typeof o.name === 'string' ? nonEmptyString(o.name) : null;
  const description =
    typeof o.description === 'string' ? nonEmptyString(o.description) : null;

  let thumbnailUrl: string | null = null;
  if (
    typeof o.thumbnailPath === 'object' &&
    o.thumbnailPath !== null &&
    typeof (o.thumbnailPath as { uri?: unknown }).uri === 'string'
  ) {
    thumbnailUrl = nonEmptyString((o.thumbnailPath as { uri: string }).uri);
  }

  if (!id || !name || !description || !thumbnailUrl) {
    return null;
  }

  const cuesRaw = Array.isArray(o.cues) ? o.cues : undefined;
  const cues: SkillCue[] | undefined = cuesRaw
    ? mapCues(
        cuesRaw.map((cue) => {
          if (typeof cue !== 'object' || cue === null) {
            return null;
          }
          const c = cue as Record<string, unknown>;
          const imagePath = c.imagePath;
          const imageUrl =
            typeof imagePath === 'object' &&
            imagePath !== null &&
            typeof (imagePath as { uri?: unknown }).uri === 'string'
              ? (imagePath as { uri: string }).uri
              : null;
          return {
            title: typeof c.title === 'string' ? c.title : null,
            description:
              typeof c.description === 'string' ? c.description : null,
            imageUrl,
          };
        })
      )
    : undefined;

  return {
    id,
    name,
    description,
    thumbnailPath: { uri: thumbnailUrl },
    videoIds: mapVideos(o.videoIds),
    tips: mapStringList(o.tips),
    cues,
    articleSlugs: mapStringList(o.articleSlugs),
    recoveryFlowIds: mapStringList(o.recoveryFlowIds),
    workoutsIds: mapStringList(o.workoutsIds),
  };
}

function normalizeSkillsFromCache(raw: unknown): Skill[] | null {
  if (!Array.isArray(raw)) {
    return null;
  }
  const skills: Skill[] = [];
  for (const item of raw) {
    const mapped = normalizeSkillFromCache(item);
    if (mapped) {
      skills.push(mapped);
    }
  }
  return skills;
}

async function readCache(): Promise<CachedPayload | null> {
  try {
    const raw = await AsyncStorage.getItem(SANITY_SKILLS_CACHE_KEY);
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
    const p = parsed as { storedAt: number; skills: unknown };
    const skills = normalizeSkillsFromCache(p.skills);
    if (skills === null) {
      return null;
    }
    return { storedAt: p.storedAt, skills };
  } catch {
    return null;
  }
}

async function writeCache(skills: Skill[]): Promise<void> {
  const payload: CachedPayload = {
    storedAt: Date.now(),
    skills,
  };
  await AsyncStorage.setItem(SANITY_SKILLS_CACHE_KEY, JSON.stringify(payload));
}

async function fetchSkillsFromSanity(): Promise<Skill[]> {
  const result = await getClient().fetch<SanitySkillDoc[]>(skillsGroq);
  return mapSkills(result);
}

/**
 * Loads skills from Sanity, using a 1-hour cache window before re-fetching.
 * On network failure, returns the last cached list if one exists.
 */
export async function loadSkills(
  options?: LoadSkillsOptions
): Promise<Skill[]> {
  const forceRefresh = options?.forceRefresh === true;
  const cached = await readCache();
  const now = Date.now();
  if (
    !forceRefresh &&
    cached &&
    CACHE_TTL_MS > 0 &&
    now - cached.storedAt < CACHE_TTL_MS
  ) {
    return cached.skills;
  }

  try {
    const skills = await fetchSkillsFromSanity();
    await writeCache(skills);
    return skills;
  } catch (error) {
    console.error('Sanity skills fetch failed:', error);
    if (cached) {
      return cached.skills;
    }
    return [];
  }
}

/** Load one skill by slug id (uses the same catalog cache). */
export async function loadSkillById(
  id: string,
  options?: LoadSkillsOptions
): Promise<Skill | undefined> {
  const skills = await loadSkills(options);
  return skills.find((skill) => skill.id === id);
}

/** Removes persisted skills cache. Next Skills screen focus refetches. */
export async function invalidateSanitySkillsCache(): Promise<void> {
  await AsyncStorage.removeItem(SANITY_SKILLS_CACHE_KEY);
}
