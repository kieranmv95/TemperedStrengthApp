import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  applyDailyStreakCheckIn,
  buildSnapshot,
  currentStreakEndingAt,
  formatLocalYMD,
  longestConsecutiveRun,
  parseStreakState,
  prevLocalYMD,
  STREAK_STATE_KEY,
  uniqueSortedDates,
  weekDaysStartingMonday,
} from '@/src/services/streakService';

describe('formatLocalYMD / prevLocalYMD', () => {
  it('formats local calendar date without UTC drift', () => {
    const d = new Date(2026, 4, 14, 15, 30, 0);
    expect(formatLocalYMD(d)).toBe('2026-05-14');
  });

  it('steps back one local calendar day', () => {
    expect(prevLocalYMD('2026-05-14')).toBe('2026-05-13');
    expect(prevLocalYMD('2026-03-01')).toBe('2026-02-28');
  });
});

describe('uniqueSortedDates', () => {
  it('dedupes and sorts', () => {
    expect(uniqueSortedDates(['2026-05-02', '2026-05-01', '2026-05-01'])).toEqual([
      '2026-05-01',
      '2026-05-02',
    ]);
  });
});

describe('longestConsecutiveRun', () => {
  it('returns 0 for empty', () => {
    expect(longestConsecutiveRun([])).toBe(0);
  });

  it('counts a single day', () => {
    expect(longestConsecutiveRun(['2026-05-10'])).toBe(1);
  });

  it('finds longest segment in sorted unique dates', () => {
    const dates = uniqueSortedDates([
      '2026-05-01',
      '2026-05-02',
      '2026-05-10',
      '2026-05-11',
      '2026-05-12',
    ]);
    expect(longestConsecutiveRun(dates)).toBe(3);
  });
});

describe('currentStreakEndingAt', () => {
  it('returns 0 when end day missing', () => {
    const set = new Set(['2026-05-13']);
    expect(currentStreakEndingAt(set, '2026-05-14')).toBe(0);
  });

  it('counts consecutive days ending at end', () => {
    const set = new Set(['2026-05-12', '2026-05-13', '2026-05-14']);
    expect(currentStreakEndingAt(set, '2026-05-14')).toBe(3);
  });

  it('stops at first gap', () => {
    const set = new Set(['2026-05-10', '2026-05-12', '2026-05-13', '2026-05-14']);
    expect(currentStreakEndingAt(set, '2026-05-14')).toBe(3);
  });
});

describe('parseStreakState', () => {
  it('defaults on null', () => {
    expect(parseStreakState(null)).toEqual({ v: 1, dates: [], best: 0 });
  });

  it('parses valid payload', () => {
    const raw = JSON.stringify({
      v: 1,
      dates: ['2026-05-14', '2026-05-13'],
      best: 5,
    });
    expect(parseStreakState(raw)).toEqual({
      v: 1,
      dates: ['2026-05-13', '2026-05-14'],
      best: 5,
    });
  });
});

describe('buildSnapshot', () => {
  it('uses stored best when higher than recomputed from dates', () => {
    const snap = buildSnapshot(
      { v: 1, dates: ['2026-05-14'], best: 30 },
      '2026-05-14'
    );
    expect(snap.currentStreak).toBe(1);
    expect(snap.bestStreak).toBe(30);
    expect(snap.totalDays).toBe(1);
  });
});

describe('weekDaysStartingMonday', () => {
  it('returns seven days starting Monday for a Thursday ref', () => {
    const ref = new Date(2026, 4, 14, 12, 0, 0);
    const week = weekDaysStartingMonday(ref);
    expect(week).toHaveLength(7);
    expect(week[0]?.label).toBe('M');
    expect(week[0]?.ymd).toBe('2026-05-11');
    expect(week[3]?.ymd).toBe('2026-05-14');
    expect(week[6]?.label).toBe('S');
  });
});

describe('applyDailyStreakCheckIn', () => {
  beforeEach(async () => {
    await AsyncStorage.removeItem(STREAK_STATE_KEY);
  });

  it('is idempotent same calendar day', async () => {
    const now = new Date(2026, 4, 14, 9, 0, 0);
    const a = await applyDailyStreakCheckIn(now);
    const b = await applyDailyStreakCheckIn(now);
    expect(a.currentStreak).toBe(1);
    expect(b.currentStreak).toBe(1);
    expect(b.totalDays).toBe(1);
  });

  it('increments streak across consecutive days', async () => {
    const d1 = await applyDailyStreakCheckIn(new Date(2026, 4, 13, 9, 0, 0));
    expect(d1.currentStreak).toBe(1);
    const d2 = await applyDailyStreakCheckIn(new Date(2026, 4, 14, 9, 0, 0));
    expect(d2.currentStreak).toBe(2);
    expect(d2.bestStreak).toBe(2);
  });

  it('resets current streak after a missed day', async () => {
    await applyDailyStreakCheckIn(new Date(2026, 4, 10, 9, 0, 0));
    await applyDailyStreakCheckIn(new Date(2026, 4, 11, 9, 0, 0));
    const afterGap = await applyDailyStreakCheckIn(new Date(2026, 4, 13, 9, 0, 0));
    expect(afterGap.currentStreak).toBe(1);
    expect(afterGap.bestStreak).toBeGreaterThanOrEqual(2);
  });
});
