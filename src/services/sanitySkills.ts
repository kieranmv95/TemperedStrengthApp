import type {
  Skill,
  SkillCue,
  SkillSummary,
  SkillVideo,
} from '@/src/types/skills';
import { environments } from '@/src/utils/environment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type SanityClient } from '@sanity/client';

const SANITY_PROJECT_ID = 'n1zlvrwu';
const SANITY_DATASET = environments.sanity;
const SANITY_API_VERSION = '2024-01-01';

/** AsyncStorage key for Skills & Cues list (counts, no tip/cue bodies). */
export const SANITY_SKILLS_CACHE_KEY = 'sanity_skills_v2';
/** AsyncStorage key for per-skill detail payloads. */
export const SANITY_SKILL_DETAILS_CACHE_KEY = 'sanity_skill_details_v1';
const CACHE_TTL_MS = __DEV__ ? 0 : 60 * 60 * 1000;

export type LoadSkillsOptions = {
  /** Bypass TTL and fetch from Sanity (still updates cache). */
  forceRefresh?: boolean;
};

const skillSummaryProjection = `
  "id": slug.current,
  name,
  description,
  "thumbnailUrl": thumbnail.asset->url,
  "videoCount": count(videos[defined(youtubeId) && defined(name) && defined(description)]),
  "tipCount": count(tips),
  "cueCount": count(cues[defined(image.asset)]),
  "articleCount": count(articleSlugs),
  "recoveryFlowCount": count(recoveryFlowIds),
  "workoutCount": count(workoutIds)
`;

const skillsListGroq = `*[_type == "skill" && defined(slug.current)] | order(name asc) {
  ${skillSummaryProjection}
}`;

const skillDetailGroq = `*[_type == "skill" && slug.current == $id][0] {
  ${skillSummaryProjection},
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

type SanitySkillSummaryDoc = {
  id?: string | null;
  name?: string | null;
  description?: string | null;
  thumbnailUrl?: string | null;
  videoCount?: number | null;
  tipCount?: number | null;
  cueCount?: number | null;
  articleCount?: number | null;
  recoveryFlowCount?: number | null;
  workoutCount?: number | null;
};

type SanitySkillDetailDoc = SanitySkillSummaryDoc & {
  videos?: SanitySkillVideoDoc[] | null;
  tips?: (string | null)[] | null;
  cues?: SanitySkillCueDoc[] | null;
  articleSlugs?: (string | null)[] | null;
  recoveryFlowIds?: (string | null)[] | null;
  workoutsIds?: (string | null)[] | null;
};

type CachedListPayload = {
  storedAt: number;
  skills: SkillSummary[];
};

type CachedDetailsPayload = {
  byId: Record<string, { storedAt: number; skill: Skill }>;
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

function asCount(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0
    ? Math.floor(value)
    : 0;
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

function mapSkillSummary(doc: SanitySkillSummaryDoc): SkillSummary | null {
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
    videoCount: asCount(doc.videoCount),
    tipCount: asCount(doc.tipCount),
    cueCount: asCount(doc.cueCount),
    articleCount: asCount(doc.articleCount),
    recoveryFlowCount: asCount(doc.recoveryFlowCount),
    workoutCount: asCount(doc.workoutCount),
  };
}

function mapSkillDetail(doc: SanitySkillDetailDoc): Skill | null {
  const summary = mapSkillSummary(doc);
  if (!summary) {
    return null;
  }

  const tips = mapStringList(doc.tips);
  const cues = mapCues(doc.cues);
  const videoIds = mapVideos(doc.videos);
  const articleSlugs = mapStringList(doc.articleSlugs);
  const recoveryFlowIds = mapStringList(doc.recoveryFlowIds);
  const workoutsIds = mapStringList(doc.workoutsIds);

  return {
    ...summary,
    // Prefer live array lengths when present so UI stays consistent with content.
    videoCount: videoIds?.length ?? summary.videoCount,
    tipCount: tips?.length ?? summary.tipCount,
    cueCount: cues?.length ?? summary.cueCount,
    articleCount: articleSlugs?.length ?? summary.articleCount,
    recoveryFlowCount: recoveryFlowIds?.length ?? summary.recoveryFlowCount,
    workoutCount: workoutsIds?.length ?? summary.workoutCount,
    videoIds,
    tips,
    cues,
    articleSlugs,
    recoveryFlowIds,
    workoutsIds,
  };
}

function mapSkillSummaries(
  docs: SanitySkillSummaryDoc[] | null | undefined
): SkillSummary[] {
  if (!Array.isArray(docs)) {
    return [];
  }
  const skills: SkillSummary[] = [];
  for (const doc of docs) {
    const mapped = mapSkillSummary(doc);
    if (mapped) {
      skills.push(mapped);
    }
  }
  return skills;
}

function normalizeSkillSummaryFromCache(raw: unknown): SkillSummary | null {
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

  return {
    id,
    name,
    description,
    thumbnailPath: { uri: thumbnailUrl },
    videoCount: asCount(o.videoCount),
    tipCount: asCount(o.tipCount),
    cueCount: asCount(o.cueCount),
    articleCount: asCount(o.articleCount),
    recoveryFlowCount: asCount(o.recoveryFlowCount),
    workoutCount: asCount(o.workoutCount),
  };
}

function normalizeSkillSummariesFromCache(raw: unknown): SkillSummary[] | null {
  if (!Array.isArray(raw)) {
    return null;
  }
  const skills: SkillSummary[] = [];
  for (const item of raw) {
    const mapped = normalizeSkillSummaryFromCache(item);
    if (mapped) {
      skills.push(mapped);
    }
  }
  return skills;
}

function normalizeSkillDetailFromCache(raw: unknown): Skill | null {
  const summary = normalizeSkillSummaryFromCache(raw);
  if (!summary || typeof raw !== 'object' || raw === null) {
    return null;
  }
  const o = raw as Record<string, unknown>;

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

  const tips = mapStringList(o.tips);
  const videoIds = mapVideos(o.videoIds);
  const articleSlugs = mapStringList(o.articleSlugs);
  const recoveryFlowIds = mapStringList(o.recoveryFlowIds);
  const workoutsIds = mapStringList(o.workoutsIds);

  return {
    ...summary,
    videoCount: videoIds?.length ?? summary.videoCount,
    tipCount: tips?.length ?? summary.tipCount,
    cueCount: cues?.length ?? summary.cueCount,
    articleCount: articleSlugs?.length ?? summary.articleCount,
    recoveryFlowCount: recoveryFlowIds?.length ?? summary.recoveryFlowCount,
    workoutCount: workoutsIds?.length ?? summary.workoutCount,
    videoIds,
    tips,
    cues,
    articleSlugs,
    recoveryFlowIds,
    workoutsIds,
  };
}

async function readListCache(): Promise<CachedListPayload | null> {
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
    const skills = normalizeSkillSummariesFromCache(p.skills);
    if (skills === null) {
      return null;
    }
    return { storedAt: p.storedAt, skills };
  } catch {
    return null;
  }
}

async function writeListCache(skills: SkillSummary[]): Promise<void> {
  const payload: CachedListPayload = {
    storedAt: Date.now(),
    skills,
  };
  await AsyncStorage.setItem(SANITY_SKILLS_CACHE_KEY, JSON.stringify(payload));
}

async function readDetailsCache(): Promise<CachedDetailsPayload | null> {
  try {
    const raw = await AsyncStorage.getItem(SANITY_SKILL_DETAILS_CACHE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as unknown;
    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      typeof (parsed as { byId?: unknown }).byId !== 'object' ||
      (parsed as { byId: unknown }).byId === null
    ) {
      return null;
    }
    const p = parsed as { byId: Record<string, unknown> };
    const byId: CachedDetailsPayload['byId'] = {};
    for (const [id, value] of Object.entries(p.byId)) {
      if (typeof value !== 'object' || value === null) {
        continue;
      }
      const entry = value as { storedAt?: unknown; skill?: unknown };
      if (typeof entry.storedAt !== 'number') {
        continue;
      }
      const mapped = normalizeSkillDetailFromCache(entry.skill);
      if (mapped) {
        byId[id] = { storedAt: entry.storedAt, skill: mapped };
      }
    }
    return { byId };
  } catch {
    return null;
  }
}

async function writeDetailToCache(skill: Skill): Promise<void> {
  const existing = await readDetailsCache();
  const byId = {
    ...(existing?.byId ?? {}),
    [skill.id]: { storedAt: Date.now(), skill },
  };
  const payload: CachedDetailsPayload = { byId };
  await AsyncStorage.setItem(
    SANITY_SKILL_DETAILS_CACHE_KEY,
    JSON.stringify(payload)
  );
}

async function fetchSkillSummariesFromSanity(): Promise<SkillSummary[]> {
  const result = await getClient().fetch<SanitySkillSummaryDoc[]>(
    skillsListGroq
  );
  return mapSkillSummaries(result);
}

async function fetchSkillDetailFromSanity(id: string): Promise<Skill | null> {
  const result = await getClient().fetch<SanitySkillDetailDoc | null>(
    skillDetailGroq,
    { id }
  );
  if (!result) {
    return null;
  }
  return mapSkillDetail(result);
}

function isFresh(storedAt: number): boolean {
  return CACHE_TTL_MS > 0 && Date.now() - storedAt < CACHE_TTL_MS;
}

/**
 * Loads the skills catalog (summary + counts only). Tips/cues bodies are omitted.
 * Uses a 1-hour cache window before re-fetching.
 */
export async function loadSkills(
  options?: LoadSkillsOptions
): Promise<SkillSummary[]> {
  const forceRefresh = options?.forceRefresh === true;
  const cached = await readListCache();
  if (!forceRefresh && cached && isFresh(cached.storedAt)) {
    return cached.skills;
  }

  try {
    const skills = await fetchSkillSummariesFromSanity();
    await writeListCache(skills);
    return skills;
  } catch (error) {
    console.error('Sanity skills list fetch failed:', error);
    if (cached) {
      return cached.skills;
    }
    return [];
  }
}

/**
 * Loads one skill with full tips, cues, and videos.
 * Uses a separate detail cache so the list query stays light.
 */
export async function loadSkillById(
  id: string,
  options?: LoadSkillsOptions
): Promise<Skill | undefined> {
  const forceRefresh = options?.forceRefresh === true;
  const cached = await readDetailsCache();
  const cachedEntry = cached?.byId[id];
  if (
    !forceRefresh &&
    cachedEntry &&
    isFresh(cachedEntry.storedAt)
  ) {
    return cachedEntry.skill;
  }

  try {
    const skill = await fetchSkillDetailFromSanity(id);
    if (skill) {
      await writeDetailToCache(skill);
      return skill;
    }
    return cachedEntry?.skill;
  } catch (error) {
    console.error('Sanity skill detail fetch failed:', error);
    return cachedEntry?.skill;
  }
}

/** Removes persisted skills list + detail caches. */
export async function invalidateSanitySkillsCache(): Promise<void> {
  await Promise.all([
    AsyncStorage.removeItem(SANITY_SKILLS_CACHE_KEY),
    AsyncStorage.removeItem(SANITY_SKILL_DETAILS_CACHE_KEY),
    // Drop the previous full-catalog cache key if present.
    AsyncStorage.removeItem('sanity_skills_v1'),
  ]);
}
