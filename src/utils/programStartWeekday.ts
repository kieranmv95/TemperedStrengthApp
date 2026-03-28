import type { Program } from '@/src/types/program';

export type ProgramDaySplitKey = NonNullable<Program['daysSplit']>[number];

const SPLIT_TO_JS_DAY: Record<ProgramDaySplitKey, number> = {
  sun: 0,
  mon: 1,
  tue: 2,
  wed: 3,
  thu: 4,
  fri: 5,
  sat: 6,
};

const FULL_WEEKDAY_NAMES: Record<ProgramDaySplitKey, string> = {
  sun: 'Sunday',
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
};

export function getProgramAnchorWeekdayKey(
  program: Program
): ProgramDaySplitKey {
  return program.daysSplit?.[0] ?? 'mon';
}

export function programSplitKeyToJsDay(key: ProgramDaySplitKey): number {
  return SPLIT_TO_JS_DAY[key];
}

export function programAnchorFullWeekdayName(key: ProgramDaySplitKey): string {
  return FULL_WEEKDAY_NAMES[key];
}

export function normalizeToLocalMidnight(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function isProgramAnchorDate(
  date: Date,
  anchor: ProgramDaySplitKey
): boolean {
  const n = normalizeToLocalMidnight(date);
  return n.getDay() === programSplitKeyToJsDay(anchor);
}

/**
 * First calendar date on or after `date` (local midnight) that falls on the program anchor weekday.
 */
export function nearestProgramAnchorOnOrAfter(
  date: Date,
  anchor: ProgramDaySplitKey
): Date {
  const n = normalizeToLocalMidnight(date);
  const targetDow = programSplitKeyToJsDay(anchor);
  const delta = (targetDow - n.getDay() + 7) % 7;
  const out = new Date(n);
  out.setDate(n.getDate() + delta);
  return out;
}
