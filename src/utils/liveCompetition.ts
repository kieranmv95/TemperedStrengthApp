import type {
  LiveCompetitionEntry,
  LiveCompetitionOrderBy,
} from '@/src/types/live-competition';
import { formatDurationSeconds } from '@/src/utils/standaloneWorkoutLogFormat';

export function getLiveCompetitionCategories(
  entries: LiveCompetitionEntry[]
): string[] {
  const seen = new Set<string>();
  const categories: string[] = [];

  for (const entry of entries) {
    if (!seen.has(entry.category)) {
      seen.add(entry.category);
      categories.push(entry.category);
    }
  }

  return categories;
}

export function sortLiveCompetitionEntries(
  entries: LiveCompetitionEntry[],
  orderBy: LiveCompetitionOrderBy
): LiveCompetitionEntry[] {
  const sorted = [...entries];

  if (orderBy === 'weight') {
    sorted.sort((a, b) => b.score - a.score);
    return sorted;
  }

  sorted.sort((a, b) => a.score - b.score);
  return sorted;
}

export function formatLiveCompetitionScore(
  score: number,
  orderBy: LiveCompetitionOrderBy
): string {
  if (orderBy === 'time') {
    return formatDurationSeconds(score);
  }

  return `${score} kg`;
}

export function getLiveCompetitionScoreLabel(
  orderBy: LiveCompetitionOrderBy
): string {
  return orderBy === 'time' ? 'Time' : 'Weight';
}

export function resolveLiveCompetitionActiveCategory(
  categories: string[],
  activeCategory: string
): string {
  if (categories.length === 0) {
    return '';
  }

  if (categories.includes(activeCategory)) {
    return activeCategory;
  }

  return categories[0];
}
