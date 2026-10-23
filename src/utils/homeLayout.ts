/**
 * Home screen section order and visibility.
 *
 * Any account can reorder. Only Pro can hide a section. Free accounts always
 * see every section; saved hidden flags stay stored for when they subscribe.
 */

export const HOME_SECTION_ORDER = [
  'program',
  'daily',
  'checkin',
  'wodShop',
  'streaks',
  'personalBests',
] as const;

export type HomeSectionId = (typeof HOME_SECTION_ORDER)[number];

export type HomeSectionPreference = {
  id: HomeSectionId;
  visible: boolean;
};

export const HOME_SECTION_LABELS: Record<HomeSectionId, string> = {
  program: 'Program',
  daily: 'Tempered Daily',
  checkin: 'Check-in',
  wodShop: 'Workouts and shop',
  streaks: 'Streaks',
  personalBests: 'Personal bests',
};

const HOME_SECTION_IDS = new Set<string>(HOME_SECTION_ORDER);

function isHomeSectionId(value: string): value is HomeSectionId {
  return HOME_SECTION_IDS.has(value);
}

export function defaultHomeLayout(): HomeSectionPreference[] {
  return HOME_SECTION_ORDER.map((id) => ({ id, visible: true }));
}

/** Known sections, in the stored order, with any new sections appended. */
export function normalizeHomeLayout(raw: unknown): HomeSectionPreference[] {
  const seen = new Set<HomeSectionId>();
  const ordered: HomeSectionPreference[] = [];

  if (Array.isArray(raw)) {
    for (const entry of raw) {
      if (typeof entry !== 'object' || entry === null) {
        continue;
      }
      const record = entry as Record<string, unknown>;
      const id = record.id;
      if (typeof id !== 'string' || !isHomeSectionId(id) || seen.has(id)) {
        continue;
      }
      seen.add(id);
      ordered.push({
        id,
        visible: record.visible !== false,
      });
    }
  }

  for (const id of HOME_SECTION_ORDER) {
    if (!seen.has(id)) {
      ordered.push({ id, visible: true });
    }
  }

  return ordered;
}

export function moveHomeSection(
  layout: HomeSectionPreference[],
  fromIndex: number,
  toIndex: number
): HomeSectionPreference[] {
  const next = normalizeHomeLayout(layout);
  if (
    fromIndex === toIndex ||
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= next.length ||
    toIndex >= next.length
  ) {
    return next;
  }
  const copy = [...next];
  const [moved] = copy.splice(fromIndex, 1);
  if (!moved) {
    return next;
  }
  copy.splice(toIndex, 0, moved);
  return copy;
}

export function setHomeSectionVisible(
  layout: HomeSectionPreference[],
  id: HomeSectionId,
  visible: boolean
): HomeSectionPreference[] {
  return normalizeHomeLayout(layout).map((section) =>
    section.id === id ? { ...section, visible } : section
  );
}

export function visibleHomeSectionIds(
  layout: HomeSectionPreference[],
  canHideSections: boolean
): HomeSectionId[] {
  const normalized = normalizeHomeLayout(layout);
  if (!canHideSections) {
    return normalized.map((section) => section.id);
  }
  return normalized
    .filter((section) => section.visible)
    .map((section) => section.id);
}

export function homeLayoutHasHidden(layout: HomeSectionPreference[]): boolean {
  return normalizeHomeLayout(layout).some((section) => !section.visible);
}
