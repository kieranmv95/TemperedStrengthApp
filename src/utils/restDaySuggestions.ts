import {
  coreRestDayActivities,
  genericRestDaySuggestions,
  restDaySuggestionsByProgramId,
} from '@/src/data/programs/restDaySuggestions';
import type {
  ProgramRestDaySuggestions,
  RestDayActivitySuggestion,
  RestDaySuggestionSet,
} from '@/src/types/restDaySuggestions';
import type { ProgramDaySplitKey } from '@/src/utils/programStartWeekday';
import { getRestDayOrdinalInWeek } from '@/src/utils/restDayOrdinal';

function withCoreRestActivities(
  activities: RestDayActivitySuggestion[]
): RestDayActivitySuggestion[] {
  const titles = new Set(activities.map((activity) => activity.title));
  const extras = coreRestDayActivities.filter(
    (activity) => !titles.has(activity.title)
  );
  return [...extras, ...activities];
}

export function getRestDaySuggestionsForProgram(
  programId: string | null
): ProgramRestDaySuggestions {
  if (programId && restDaySuggestionsByProgramId[programId]) {
    return restDaySuggestionsByProgramId[programId];
  }
  return genericRestDaySuggestions;
}

export function getRestDaySuggestionsForDay(
  programId: string | null,
  dayIndex: number,
  startISO: string | null,
  pattern: ProgramDaySplitKey[] | null
): RestDaySuggestionSet {
  const suggestions = getRestDaySuggestionsForProgram(programId);
  const { sets } = suggestions;

  if (sets.length === 0) {
    const fallback = genericRestDaySuggestions.sets[0];
    return {
      ...fallback,
      activities: withCoreRestActivities(fallback.activities),
    };
  }

  const ordinal =
    startISO != null
      ? getRestDayOrdinalInWeek(dayIndex, startISO, pattern)
      : Math.max(0, dayIndex);

  const setIndex = ordinal % sets.length;
  const set = sets[setIndex] ?? sets[0];
  return {
    ...set,
    activities: withCoreRestActivities(set.activities),
  };
}

/** @deprecated use getRestDaySuggestionsForProgram */
export function getRestDaySuggestionPool(programId: string | null) {
  return getRestDaySuggestionsForProgram(programId);
}
