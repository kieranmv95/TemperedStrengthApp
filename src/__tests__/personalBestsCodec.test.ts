import type {
  PersonalBestsStore,
  RepMax,
} from '@/src/types/personalBests';
import {
  collapseRowsToPersonalBestsStore,
  expandPersonalBestsBlobToRows,
  parsePersonalBestsStore,
} from '@/src/db/domains/personalBests/codec';

describe('personal bests codec', () => {
  const t = '2026-01-01T00:00:00.000Z';
  const updatedAt = '2026-06-01T12:00:00.000Z';

  const sampleStore: PersonalBestsStore = {
    42: {
      1: [{ id: 'a', weight: 100, achievedAt: t }],
      5: [
        { id: 'b', weight: 80, achievedAt: t },
        { id: 'c', weight: 85, achievedAt: t },
      ],
    },
    7: {
      10: [{ id: 'd', weight: 60, achievedAt: t }],
    },
  };

  it('expands a blob into one row per history entry', () => {
    const rows = expandPersonalBestsBlobToRows(sampleStore, updatedAt);
    expect(rows).toHaveLength(4);
    expect(rows.find((r) => r.id === 'c')).toMatchObject({
      exercise_id: 42,
      rep_max: 5 as RepMax,
      weight: 85,
      achieved_at: t,
      updated_at: updatedAt,
      deleted_at: null,
    });
  });

  it('round-trips expand → collapse', () => {
    const rows = expandPersonalBestsBlobToRows(sampleStore, updatedAt);
    const restored = collapseRowsToPersonalBestsStore(rows);
    expect(restored).toEqual(sampleStore);
  });

  it('skips deleted rows when collapsing', () => {
    const rows = expandPersonalBestsBlobToRows(sampleStore, updatedAt).map(
      (row) =>
        row.id === 'a' ? { ...row, deleted_at: updatedAt } : { ...row }
    );
    const restored = collapseRowsToPersonalBestsStore(rows);
    expect(restored[42]?.[1]).toBeUndefined();
    expect(restored[42]?.[5]?.length).toBe(2);
  });

  it('parses valid store JSON and rejects junk', () => {
    expect(parsePersonalBestsStore(JSON.stringify(sampleStore))).toEqual(
      sampleStore
    );
    expect(parsePersonalBestsStore(null)).toEqual({});
    expect(parsePersonalBestsStore('[]')).toEqual({});
    expect(parsePersonalBestsStore('not-json')).toEqual({});
  });
});
