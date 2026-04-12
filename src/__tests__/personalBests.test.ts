import {
  appendCascadeToLowerTiersOnly,
  formatExercisePbSubtitle,
  getLatestEntryForTier,
  logPersonalBestIntoLedger,
  newPbEntryId,
  previewPersonalBestLog,
  repCountToTier,
  summarizePersonalBests,
} from '@/src/utils/personalBests';

describe('repCountToTier', () => {
  it('maps rep counts to the highest tier at or below reps', () => {
    expect(repCountToTier(1)).toBe(1);
    expect(repCountToTier(4)).toBe(3);
    expect(repCountToTier(8)).toBe(5);
    expect(repCountToTier(12)).toBe(10);
    expect(repCountToTier(20)).toBe(20);
    expect(repCountToTier(25)).toBe(20);
  });

  it('returns null for invalid reps', () => {
    expect(repCountToTier(0)).toBeNull();
    expect(repCountToTier(-1)).toBeNull();
  });
});

describe('logPersonalBestIntoLedger', () => {
  const t = '2026-01-01T00:00:00.000Z';

  it('appends to primary tier even when not a PR (no cascade)', () => {
    const current = {
      5: [{ id: 'a', weight: 100, achievedAt: t }],
    };
    const { updated, isPR, tiersWithNewRows } = logPersonalBestIntoLedger(
      current,
      5,
      95,
      t,
      () => 'new-id'
    );
    expect(isPR).toBe(false);
    expect(tiersWithNewRows).toEqual([5]);
    expect(updated[5]?.length).toBe(2);
    expect(updated[5]?.[1]?.weight).toBe(95);
  });

  it('PR updates primary and lower tiers when weight beats each', () => {
    const current = {};
    const { updated, isPR, tiersWithNewRows } = logPersonalBestIntoLedger(
      current,
      5,
      100,
      t,
      newPbEntryId
    );
    expect(isPR).toBe(true);
    expect(tiersWithNewRows.sort((a, b) => a - b)).toEqual([1, 2, 3, 5]);
    expect(updated[5]?.length).toBe(1);
    expect(updated[5]?.[0]?.weight).toBe(100);
    expect(updated[1]?.[0]?.weight).toBe(100);
    expect(updated[10]).toBeUndefined();
  });

  it('does not update higher rep tiers', () => {
    const current = {};
    const { updated } = logPersonalBestIntoLedger(
      current,
      5,
      100,
      t,
      newPbEntryId
    );
    expect(updated[10]).toBeUndefined();
    expect(updated[20]).toBeUndefined();
  });

  it('cascades from 20RM to all lower tiers on first PR log', () => {
    const current = {};
    const { updated, tiersWithNewRows } = logPersonalBestIntoLedger(
      current,
      20,
      60,
      t,
      newPbEntryId
    );
    expect(tiersWithNewRows.sort((a, b) => a - b)).toEqual([
      1, 2, 3, 5, 10, 15, 20,
    ]);
    expect(updated[20]?.[0]?.weight).toBe(60);
    expect(updated[1]?.[0]?.weight).toBe(60);
  });

  it('appendCascadeToLowerTiersOnly fills strictly lower tiers', () => {
    const ledger = {};
    const { updated, appendedTiers } = appendCascadeToLowerTiersOnly(
      ledger,
      20,
      70,
      t,
      newPbEntryId
    );
    expect(appendedTiers.sort((a, b) => a - b)).toEqual([1, 2, 3, 5, 10, 15]);
    expect(updated[20]).toBeUndefined();
    expect(updated[15]?.[0]?.weight).toBe(70);
  });

  it('skips lower tiers already above the new weight on PR', () => {
    const current = {
      1: [{ id: 'a', weight: 120, achievedAt: t }],
      5: [{ id: 'b', weight: 90, achievedAt: t }],
    };
    const { updated, tiersWithNewRows } = logPersonalBestIntoLedger(
      current,
      5,
      100,
      t,
      newPbEntryId
    );
    expect(updated[1]?.length).toBe(1);
    expect(updated[1]?.[0]?.weight).toBe(120);
    expect(tiersWithNewRows).toContain(5);
    expect(tiersWithNewRows).not.toContain(1);
  });
});

describe('previewPersonalBestLog', () => {
  const t = '2026-01-01T00:00:00.000Z';

  it('is not PR when primary tier is not improved', () => {
    const ledger = {
      5: [{ id: 'a', weight: 100, achievedAt: t }],
    };
    expect(previewPersonalBestLog(ledger, 5, 95)).toEqual({
      isPR: false,
      newRecords: [],
    });
  });

  it('matches cascade tiers for a PR', () => {
    expect(previewPersonalBestLog({}, 5, 100)).toEqual({
      isPR: true,
      newRecords: [1, 2, 3, 5],
    });
  });
});

describe('getLatestEntryForTier', () => {
  it('returns the row with the latest achievedAt', () => {
    const t1 = '2026-01-01T00:00:00.000Z';
    const t2 = '2026-02-01T00:00:00.000Z';
    const ledger = {
      5: [
        { id: 'a', weight: 100, achievedAt: t1 },
        { id: 'b', weight: 90, achievedAt: t2 },
      ],
    };
    expect(getLatestEntryForTier(ledger, 5)?.id).toBe('b');
  });
});

describe('formatExercisePbSubtitle', () => {
  const t1 = '2026-01-01T00:00:00.000Z';
  const t2 = '2026-02-01T00:00:00.000Z';

  it('returns null when there is no history', () => {
    expect(formatExercisePbSubtitle(null)).toBeNull();
    expect(formatExercisePbSubtitle({})).toBeNull();
  });

  it('returns null when only non-1RM tiers have data', () => {
    expect(
      formatExercisePbSubtitle({
        5: [{ id: 'a', weight: 80, achievedAt: t1 }],
      })
    ).toBeNull();
  });

  it('shows best only when latest matches peak weight (1RM only)', () => {
    expect(
      formatExercisePbSubtitle({
        1: [{ id: 'a', weight: 80, achievedAt: t1 }],
      })
    ).toBe('Best Single: 80kg');
  });

  it('shows best and latest when the most recent 1RM log is below peak', () => {
    expect(
      formatExercisePbSubtitle({
        1: [
          { id: 'a', weight: 70, achievedAt: t1 },
          { id: 'b', weight: 50, achievedAt: t2 },
        ],
      })
    ).toBe('Best Single: 70kg Latest Single: 50kg');
  });
});

describe('summarizePersonalBests', () => {
  it('returns placeholder when empty', () => {
    expect(summarizePersonalBests({})).toBe('No PBs logged');
  });

  it('lists tiers in order from current best', () => {
    const t1 = '2026-01-01T00:00:00.000Z';
    const t2 = '2026-01-02T00:00:00.000Z';
    const s = summarizePersonalBests({
      1: [{ id: 'a', weight: 100, achievedAt: t1 }],
      5: [
        { id: 'b', weight: 80, achievedAt: t1 },
        { id: 'c', weight: 85, achievedAt: t2 },
      ],
    });
    expect(s).toContain('1RM: 100 kg');
    expect(s).toContain('5RM: 85 kg');
  });
});
