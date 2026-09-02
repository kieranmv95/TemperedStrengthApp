import type { Program } from '@/src/types/program';
import type { ProgramDaySplitKey } from '@/src/utils/programStartWeekday';
import {
  normalizeToLocalMidnight,
  programSplitKeyToJsDay,
} from '@/src/utils/programStartWeekday';

/**
 * Which rest day this is within the current program week (0 = first rest day
 * in calendar order that week). Used to pick the explicit suggestion set.
 */
export function getRestDayOrdinalInWeek(
  dayDelta: number,
  startISO: string,
  pattern: ProgramDaySplitKey[] | null
): number {
  if (dayDelta < 0) {
    return 0;
  }

  if (!pattern || pattern.length === 0) {
    return dayDelta % 7;
  }

  const w = Math.floor(dayDelta / 7);
  const start = normalizeToLocalMidnight(new Date(startISO));
  const allowedJs = new Set(pattern.map((key) => programSplitKeyToJsDay(key)));

  const restDaysInBlock: number[] = [];
  for (let d = w * 7; d <= w * 7 + 6; d++) {
    const dt = new Date(start);
    dt.setDate(start.getDate() + d);
    dt.setHours(0, 0, 0, 0);
    if (!allowedJs.has(dt.getDay())) {
      restDaysInBlock.push(d);
    }
  }

  restDaysInBlock.sort((a, b) => a - b);
  const ordinal = restDaysInBlock.indexOf(dayDelta);
  return ordinal >= 0 ? ordinal : 0;
}

/** @internal exported for tests */
export function getRestDayOrdinalInWeekForProgram(
  dayDelta: number,
  startISO: string,
  pattern: ProgramDaySplitKey[] | null,
  program: Program
): number {
  if (!pattern || pattern.length === 0) {
    const w = Math.floor(dayDelta / 7);
    const weekWorkouts = program.workouts
      .filter((workout) => Math.floor(workout.dayIndex / 7) === w)
      .map((workout) => workout.dayIndex);
    const trainingDays = new Set(weekWorkouts);

    const restDaysInBlock: number[] = [];
    for (let d = w * 7; d <= w * 7 + 6; d++) {
      if (!trainingDays.has(d)) {
        restDaysInBlock.push(d);
      }
    }

    restDaysInBlock.sort((a, b) => a - b);
    const ordinal = restDaysInBlock.indexOf(dayDelta);
    return ordinal >= 0 ? ordinal : 0;
  }

  return getRestDayOrdinalInWeek(dayDelta, startISO, pattern);
}
