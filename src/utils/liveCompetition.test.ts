import type { LiveCompetitionEntry } from '@/src/types/live-competition';
import {
  formatLiveCompetitionScore,
  getLiveCompetitionCategories,
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

  it('sorts weight entries highest first', () => {
    const maleEntries = entries.filter((entry) => entry.category === 'Male');
    expect(sortLiveCompetitionEntries(maleEntries, 'weight')).toEqual([
      { name: 'B', score: 150, category: 'Male' },
      { name: 'A', score: 100, category: 'Male' },
    ]);
  });

  it('sorts time entries fastest first', () => {
    const timeEntries: LiveCompetitionEntry[] = [
      { name: 'A', score: 95, category: 'Male' },
      { name: 'B', score: 72, category: 'Male' },
      { name: 'C', score: 110, category: 'Male' },
    ];

    expect(sortLiveCompetitionEntries(timeEntries, 'time')).toEqual([
      { name: 'B', score: 72, category: 'Male' },
      { name: 'A', score: 95, category: 'Male' },
      { name: 'C', score: 110, category: 'Male' },
    ]);
  });

  it('formats scores for weight and time', () => {
    expect(formatLiveCompetitionScore(142, 'weight')).toBe('142 kg');
    expect(formatLiveCompetitionScore(95, 'time')).toBe('1:35');
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
