import type {
  LiveCompetitionEntry,
  LiveCompetitionMetricType,
} from '@/src/types/live-competition';

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

export function compareLiveCompetitionEntries(
  a: LiveCompetitionEntry,
  b: LiveCompetitionEntry,
  metricType: LiveCompetitionMetricType
): number {
  const ascending = metricType === 'max_time';
  return ascending ? a.score - b.score : b.score - a.score;
}

export function sortLiveCompetitionEntries(
  entries: LiveCompetitionEntry[],
  metricType: LiveCompetitionMetricType
): LiveCompetitionEntry[] {
  return [...entries].sort((a, b) =>
    compareLiveCompetitionEntries(a, b, metricType)
  );
}

function formatTimeScore(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);
  return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
}

export function formatLiveCompetitionScore(
  score: number,
  metricType: LiveCompetitionMetricType
): string {
  switch (metricType) {
    case 'max_time':
      return formatTimeScore(score);
    case 'max_reps':
      return `${score} reps`;
    case 'max_calories':
      return `${score} kcal`;
    case 'max_distance':
      return `${score} m`;
    case 'max_weight':
      return `${score} kg`;
  }
}

export function getLiveCompetitionScoreLabel(
  metricType: LiveCompetitionMetricType
): string {
  switch (metricType) {
    case 'max_time':
      return 'Time';
    case 'max_reps':
      return 'Reps';
    case 'max_calories':
      return 'Calories';
    case 'max_distance':
      return 'Distance';
    case 'max_weight':
      return 'Weight';
  }
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
