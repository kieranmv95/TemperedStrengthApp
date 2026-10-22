import type { TemperedDailyWeek } from '@/src/types/workouts';
import {
  getTemperedDayIndex,
  getVisibleTemperedWeek,
  isTemperedDailyWorkoutVisible,
} from '@/src/utils/temperedDaily';

function makeWeek(
  id: string,
  weekStart: string,
  days: (string | null)[]
): TemperedDailyWeek {
  return {
    id,
    weekStart,
    blockName: 'Block',
    theme: 'Strength',
    phase: 'Phase',
    description: 'Description',
    primaryFocus: 'Strength',
    otherFocuses: [],
    days,
  };
}

const weekA = makeWeek('a', '2026-10-19', [
  'a1',
  'a2',
  'a3',
  'a4',
  'a5',
  'a6',
  null,
]);
const weekB = makeWeek('b', '2026-10-26', [
  'b1',
  'b2',
  'b3',
  'b4',
  'b5',
  'b6',
  'b7',
]);
const weeks = [weekA, weekB];

describe('getVisibleTemperedWeek', () => {
  it('returns null before the first release', () => {
    expect(getVisibleTemperedWeek(weeks, new Date(2026, 9, 19, 0, 0))).toBe(
      null
    );
  });

  it('releases a week at Monday 00:01 local time', () => {
    expect(getVisibleTemperedWeek(weeks, new Date(2026, 9, 19, 0, 1))).toBe(
      weekA
    );
  });

  it('keeps the previous week at Monday 00:00', () => {
    expect(getVisibleTemperedWeek(weeks, new Date(2026, 9, 26, 0, 0))).toBe(
      weekA
    );
  });

  it('switches to the new week at Monday 00:01', () => {
    expect(getVisibleTemperedWeek(weeks, new Date(2026, 9, 26, 0, 1))).toBe(
      weekB
    );
  });

  it('keeps the latest week once content runs out', () => {
    expect(getVisibleTemperedWeek(weeks, new Date(2026, 11, 1, 9, 0))).toBe(
      weekB
    );
  });
});

describe('getTemperedDayIndex', () => {
  it('is 0 on Monday after release', () => {
    expect(getTemperedDayIndex(weekA, new Date(2026, 9, 19, 0, 1))).toBe(0);
  });

  it('is 6 on Sunday', () => {
    expect(getTemperedDayIndex(weekA, new Date(2026, 9, 25, 23, 59))).toBe(6);
  });

  it('is null between Monday 00:00 and 00:01 of the next week', () => {
    expect(getTemperedDayIndex(weekA, new Date(2026, 9, 26, 0, 0))).toBe(null);
  });

  it('is null before release', () => {
    expect(getTemperedDayIndex(weekA, new Date(2026, 9, 19, 0, 0))).toBe(null);
  });

  it('is null once content runs out', () => {
    expect(getTemperedDayIndex(weekB, new Date(2026, 10, 3, 12, 0))).toBe(null);
  });
});

describe('isTemperedDailyWorkoutVisible', () => {
  it('allows workouts in the visible week', () => {
    expect(
      isTemperedDailyWorkoutVisible(weeks, 'a2', new Date(2026, 9, 20, 9, 0))
    ).toBe(true);
  });

  it('blocks workouts from a future week', () => {
    expect(
      isTemperedDailyWorkoutVisible(weeks, 'b1', new Date(2026, 9, 20, 9, 0))
    ).toBe(false);
  });

  it('blocks workouts from a past week', () => {
    expect(
      isTemperedDailyWorkoutVisible(weeks, 'a1', new Date(2026, 9, 27, 9, 0))
    ).toBe(false);
  });

  it('blocks everything before the first release', () => {
    expect(
      isTemperedDailyWorkoutVisible(weeks, 'a1', new Date(2026, 9, 18, 9, 0))
    ).toBe(false);
  });
});
