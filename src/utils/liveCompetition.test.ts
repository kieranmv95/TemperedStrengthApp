import type { LiveCompetitionEntry } from '@/src/types/live-competition';
import {
  compareLiveCompetitionEntries,
  formatLiveCompetitionScore,
  getLiveCompetitionCategories,
  getLiveCompetitionScoreLabel,
  resolveLiveCompetitionActiveCategory,
  sortLiveCompetitionEntries,
} from '@/src/utils/liveCompetition';

describe('liveCompetition utils', () => {
  const entries: LiveCompetitionEntry[] = [
    { name: 'A', score: 100, category: 'Male' },
    { name: 'B', score: 150, category: 'Male' },
    { name: 'C', score: 90, category: 'Female' },
    { name: 'D', score: 120, category: 'Female' },
  ];

  it('extracts categories in first-seen order', () => {
    expect(getLiveCompetitionCategories(entries)).toEqual(['Male', 'Female']);
  });

  it('sorts max_weight entries highest first', () => {
    const maleEntries = entries.filter((entry) => entry.category === 'Male');
    expect(sortLiveCompetitionEntries(maleEntries, 'max_weight')).toEqual([
      { name: 'B', score: 150, category: 'Male' },
      { name: 'A', score: 100, category: 'Male' },
    ]);
  });

  it('sorts max_time entries fastest first', () => {
    const timeEntries: LiveCompetitionEntry[] = [
      { name: 'A', score: 95, category: 'Male' },
      { name: 'B', score: 72, category: 'Male' },
      { name: 'C', score: 110, category: 'Male' },
    ];

    expect(sortLiveCompetitionEntries(timeEntries, 'max_time')).toEqual([
      { name: 'B', score: 72, category: 'Male' },
      { name: 'A', score: 95, category: 'Male' },
      { name: 'C', score: 110, category: 'Male' },
    ]);
  });

  it('sorts max_reps, max_calories, and max_distance highest first', () => {
    const repsEntries: LiveCompetitionEntry[] = [
      { name: 'A', score: 10, category: 'Male' },
      { name: 'B', score: 25, category: 'Male' },
    ];

    expect(compareLiveCompetitionEntries(repsEntries[0], repsEntries[1], 'max_reps')).toBeGreaterThan(0);
    expect(
      compareLiveCompetitionEntries(repsEntries[0], repsEntries[1], 'max_calories')
    ).toBeGreaterThan(0);
    expect(
      compareLiveCompetitionEntries(repsEntries[0], repsEntries[1], 'max_distance')
    ).toBeGreaterThan(0);
  });

  it('formats scores for each metric type', () => {
    expect(formatLiveCompetitionScore(142, 'max_weight')).toBe('142 kg');
    expect(formatLiveCompetitionScore(25, 'max_reps')).toBe('25 reps');
    expect(formatLiveCompetitionScore(100, 'max_reps_no_label')).toBe('100');
    expect(formatLiveCompetitionScore(95, 'max_time')).toBe('1:35');
    expect(formatLiveCompetitionScore(450, 'max_calories')).toBe('450 kcal');
    expect(formatLiveCompetitionScore(5000, 'max_distance')).toBe('5000 m');
  });

  it('returns score labels for each metric type', () => {
    expect(getLiveCompetitionScoreLabel('max_weight')).toBe('Weight');
    expect(getLiveCompetitionScoreLabel('max_reps')).toBe('Reps');
    expect(getLiveCompetitionScoreLabel('max_reps_no_label')).toBe('');
    expect(getLiveCompetitionScoreLabel('max_time')).toBe('Time');
    expect(getLiveCompetitionScoreLabel('max_calories')).toBe('Calories');
    expect(getLiveCompetitionScoreLabel('max_distance')).toBe('Distance');
  });
});

describe('resolveLiveCompetitionActiveCategory', () => {
  it('keeps the current category when it still exists', () => {
    expect(
      resolveLiveCompetitionActiveCategory(['Male', 'Female'], 'Female')
    ).toBe('Female');
  });

  it('falls back to the first category when the current one disappears', () => {
    expect(resolveLiveCompetitionActiveCategory(['Female'], 'Male')).toBe(
      'Female'
    );
  });

  it('returns an empty string when there are no categories', () => {
    expect(resolveLiveCompetitionActiveCategory([], 'Male')).toBe('');
  });
});
