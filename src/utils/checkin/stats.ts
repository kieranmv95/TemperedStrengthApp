import { prevLocalYMD } from '@/src/services/streakService';
import type { BehaviourEntry } from '@/src/types/checkin';
import { listLocalDatesInclusive } from '@/src/utils/checkin/schedule';

/**
 * A day is complete when every currently tracked, non-deprecated behaviour
 * has an entry for that date. Supplements are excluded.
 */
export function isDayComplete(input: {
  date: string;
  trackedBehaviourIds: readonly string[];
  entries: readonly BehaviourEntry[];
}): boolean {
  if (input.trackedBehaviourIds.length === 0) {
    return false;
  }
  const logged = new Set(
    input.entries
      .filter((e) => e.date === input.date)
      .map((e) => e.behaviourId)
  );
  return input.trackedBehaviourIds.every((id) => logged.has(id));
}

export function completionStreakEndingAt(input: {
  endDate: string;
  trackedBehaviourIds: readonly string[];
  entries: readonly BehaviourEntry[];
}): number {
  if (input.trackedBehaviourIds.length === 0) {
    return 0;
  }
  let cur = input.endDate;
  let n = 0;
  while (
    isDayComplete({
      date: cur,
      trackedBehaviourIds: input.trackedBehaviourIds,
      entries: input.entries,
    })
  ) {
    n += 1;
    cur = prevLocalYMD(cur);
  }
  return n;
}

export function completionPercentage(input: {
  endDate: string;
  dayCount: number;
  trackedBehaviourIds: readonly string[];
  entries: readonly BehaviourEntry[];
}): number {
  if (input.trackedBehaviourIds.length === 0 || input.dayCount < 1) {
    return 0;
  }
  let start = input.endDate;
  for (let i = 1; i < input.dayCount; i++) {
    start = prevLocalYMD(start);
  }
  const dates = listLocalDatesInclusive(start, input.endDate);
  let complete = 0;
  for (const date of dates) {
    if (
      isDayComplete({
        date,
        trackedBehaviourIds: input.trackedBehaviourIds,
        entries: input.entries,
      })
    ) {
      complete += 1;
    }
  }
  return Math.round((complete / dates.length) * 100);
}

export type CheckinStats = {
  currentStreak: number;
  completion7: number;
  completion30: number;
};

export function buildCheckinStats(input: {
  today: string;
  trackedBehaviourIds: readonly string[];
  entries: readonly BehaviourEntry[];
}): CheckinStats {
  return {
    currentStreak: completionStreakEndingAt({
      endDate: input.today,
      trackedBehaviourIds: input.trackedBehaviourIds,
      entries: input.entries,
    }),
    completion7: completionPercentage({
      endDate: input.today,
      dayCount: 7,
      trackedBehaviourIds: input.trackedBehaviourIds,
      entries: input.entries,
    }),
    completion30: completionPercentage({
      endDate: input.today,
      dayCount: 30,
      trackedBehaviourIds: input.trackedBehaviourIds,
      entries: input.entries,
    }),
  };
}
