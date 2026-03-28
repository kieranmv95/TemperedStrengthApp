import type { Program, Workout } from '@/src/types/program';
import type { ProgramDaySplitKey } from '@/src/utils/programStartWeekday';
import {
  normalizeToLocalMidnight,
  programSplitKeyToJsDay,
} from '@/src/utils/programStartWeekday';

const JS_DAY_TO_SPLIT_KEY: ProgramDaySplitKey[] = [
  'sun',
  'mon',
  'tue',
  'wed',
  'thu',
  'fri',
  'sat',
];

export function jsDayToSplitKey(jsDay: number): ProgramDaySplitKey {
  return JS_DAY_TO_SPLIT_KEY[jsDay];
}

export function sortPatternByCalendarOrder(
  keys: ProgramDaySplitKey[]
): ProgramDaySplitKey[] {
  return [...keys].sort(
    (a, b) => programSplitKeyToJsDay(a) - programSplitKeyToJsDay(b)
  );
}

/** Mon → Tue → … → Sun (ISO-style week order). */
const MONDAY_FIRST_ORDER: Record<ProgramDaySplitKey, number> = {
  mon: 0,
  tue: 1,
  wed: 2,
  thu: 3,
  fri: 4,
  sat: 5,
  sun: 6,
};

/**
 * Weekday for **program start** / session 1 of each rolling week: the earliest
 * selected day in Mon→Sun order (e.g. Tue, Sat, Sun → Tuesday).
 */
export function firstSessionWeekdayForPattern(
  keys: ProgramDaySplitKey[]
): ProgramDaySplitKey {
  if (keys.length === 0) {
    return 'mon';
  }
  return [...keys].sort(
    (a, b) => MONDAY_FIRST_ORDER[a] - MONDAY_FIRST_ORDER[b]
  )[0];
}

export function sessionsPerWeekFromProgram(program: Program): number {
  if (program.daysSplit?.length) {
    return program.daysSplit.length;
  }
  const week0 = program.workouts.filter(
    (w) => w.dayIndex >= 0 && w.dayIndex < 7
  );
  return week0.length;
}

/**
 * First local calendar date on or after `date` whose weekday is in `allowedWeekdays`.
 */
export function nearestDateOnOrAfterAllowingWeekdays(
  date: Date,
  allowedWeekdays: ProgramDaySplitKey[]
): Date {
  const n = normalizeToLocalMidnight(date);
  if (allowedWeekdays.length === 0) {
    return n;
  }
  const allowed = new Set(
    allowedWeekdays.map((k) => programSplitKeyToJsDay(k))
  );
  for (let i = 0; i < 7; i++) {
    const d = new Date(n);
    d.setDate(n.getDate() + i);
    d.setHours(0, 0, 0, 0);
    if (allowed.has(d.getDay())) {
      return d;
    }
  }
  return n;
}

function maxProgramWeekIndex(program: Program): number {
  const maxDay = Math.max(...program.workouts.map((w) => w.dayIndex), 0);
  return Math.floor(maxDay / 7);
}

function workoutsForProgramWeek(program: Program, w: number): Workout[] {
  return program.workouts
    .filter((x) => Math.floor(x.dayIndex / 7) === w)
    .sort((a, b) => a.dayIndex - b.dayIndex);
}

/**
 * When `pattern` is null/empty, matches legacy: workout whose `dayIndex` equals `dayDelta`.
 * Otherwise maps rolling 7-day blocks from `startISO` and chronological session order.
 */
export function getWorkoutForDaySinceStart(
  program: Program,
  startISO: string,
  pattern: ProgramDaySplitKey[] | null,
  dayDelta: number
): Workout | null {
  if (dayDelta < 0) {
    return null;
  }

  if (!pattern || pattern.length === 0) {
    return program.workouts.find((w) => w.dayIndex === dayDelta) ?? null;
  }

  const start = normalizeToLocalMidnight(new Date(startISO));
  const w = Math.floor(dayDelta / 7);
  const allowedJs = new Set(pattern.map((k) => programSplitKeyToJsDay(k)));

  const inBlock: number[] = [];
  for (let d = w * 7; d <= w * 7 + 6; d++) {
    const dt = new Date(start);
    dt.setDate(start.getDate() + d);
    dt.setHours(0, 0, 0, 0);
    if (allowedJs.has(dt.getDay())) {
      inBlock.push(d);
    }
  }
  inBlock.sort((a, b) => a - b);

  const sessionIdx = inBlock.indexOf(dayDelta);
  if (sessionIdx === -1) {
    return null;
  }

  const weekWorkouts = workoutsForProgramWeek(program, w);
  return weekWorkouts[sessionIdx] ?? null;
}

/**
 * All `dayDelta` values from program start through the last program week that have a session.
 */
export function listTrainingDayDeltasForProgram(
  program: Program,
  startISO: string,
  pattern: ProgramDaySplitKey[] | null
): number[] {
  if (!pattern || pattern.length === 0) {
    return [...new Set(program.workouts.map((w) => w.dayIndex))].sort(
      (a, b) => a - b
    );
  }

  const maxW = maxProgramWeekIndex(program);
  const maxDelta = 7 * (maxW + 1) - 1;
  const out: number[] = [];
  for (let d = 0; d <= maxDelta; d++) {
    if (getWorkoutForDaySinceStart(program, startISO, pattern, d) !== null) {
      out.push(d);
    }
  }
  return out;
}

export function isValidStartWeekdayForPattern(
  date: Date,
  pattern: ProgramDaySplitKey[]
): boolean {
  if (pattern.length === 0) {
    return false;
  }
  const n = normalizeToLocalMidnight(date);
  const key = jsDayToSplitKey(n.getDay());
  return pattern.includes(key);
}

export function clampStartDateToPatternAndToday(
  chosen: Date,
  startISOForPastCheck: Date,
  pattern: ProgramDaySplitKey[]
): Date {
  const normalized = normalizeToLocalMidnight(chosen);
  const todayStart = normalizeToLocalMidnight(startISOForPastCheck);

  let out = normalized;
  if (!isValidStartWeekdayForPattern(out, pattern)) {
    out = nearestDateOnOrAfterAllowingWeekdays(out, pattern);
  }
  if (out.getTime() < todayStart.getTime()) {
    out = nearestDateOnOrAfterAllowingWeekdays(todayStart, pattern);
  }
  return out;
}
