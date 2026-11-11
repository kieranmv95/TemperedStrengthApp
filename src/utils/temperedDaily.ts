import type { TemperedDailyWeek } from '@/src/types/workouts';

const DAYS_IN_WEEK = 7;
const RELEASE_HOUR = 0;
const RELEASE_MINUTE = 1;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** `YYYY-MM-DD` as midnight on that calendar day in device local time. */
export function parseLocalDate(isoDate: string): Date {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/** Monday 00:01 device local time on `weekStart`. */
export function getWeekReleaseTime(week: TemperedDailyWeek): Date {
  const start = parseLocalDate(week.weekStart);
  return new Date(
    start.getFullYear(),
    start.getMonth(),
    start.getDate(),
    RELEASE_HOUR,
    RELEASE_MINUTE
  );
}

/** Calendar date of a day in the week. Monday = 0. */
export function getTemperedDayDate(
  week: TemperedDailyWeek,
  dayIndex: number
): Date {
  const start = parseLocalDate(week.weekStart);
  return new Date(
    start.getFullYear(),
    start.getMonth(),
    start.getDate() + dayIndex
  );
}

/**
 * The latest week whose release time has passed. Null when no week has been
 * released yet. Weeks must be ordered oldest to newest.
 */
export function getVisibleTemperedWeek(
  weeks: TemperedDailyWeek[],
  now: Date
): TemperedDailyWeek | null {
  let visible: TemperedDailyWeek | null = null;
  for (const week of weeks) {
    if (getWeekReleaseTime(week).getTime() <= now.getTime()) {
      visible = week;
    }
  }
  return visible;
}

/**
 * Index of today inside the week (Monday = 0), or null when today is outside
 * it. That happens between Monday 00:00 and 00:01, and once content runs out.
 */
export function getTemperedDayIndex(
  week: TemperedDailyWeek,
  now: Date
): number | null {
  if (now.getTime() < getWeekReleaseTime(week).getTime()) {
    return null;
  }
  const start = parseLocalDate(week.weekStart);
  const startUtc = Date.UTC(
    start.getFullYear(),
    start.getMonth(),
    start.getDate()
  );
  const todayUtc = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const dayIndex = Math.round((todayUtc - startUtc) / MS_PER_DAY);
  if (dayIndex < 0 || dayIndex >= DAYS_IN_WEEK) {
    return null;
  }
  return dayIndex;
}

export type TemperedDailyToday = {
  /** Null before the first week is released. */
  week: TemperedDailyWeek | null;
  /** Monday = 0. Null when today is outside the visible week. */
  dayIndex: number | null;
  /** Null on a rest day or when there is no workout for today. */
  workoutId: string | null;
};

export function getTemperedDailyToday(
  weeks: TemperedDailyWeek[],
  now: Date
): TemperedDailyToday {
  const week = getVisibleTemperedWeek(weeks, now);
  if (!week) {
    return { week: null, dayIndex: null, workoutId: null };
  }
  const dayIndex = getTemperedDayIndex(week, now);
  const workoutId = dayIndex === null ? null : week.days[dayIndex];
  return { week, dayIndex, workoutId };
}

/** True when the workout is scheduled in the week currently on screen. */
export function isTemperedDailyWorkoutVisible(
  weeks: TemperedDailyWeek[],
  workoutId: string,
  now: Date
): boolean {
  const week = getVisibleTemperedWeek(weeks, now);
  if (!week) {
    return false;
  }
  return week.days.includes(workoutId);
}
