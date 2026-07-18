import type {
  CompletedSessions,
  ProgramSessionStatus,
  ProgramSessionStatuses,
} from '@/src/types/storage';
import { getProgramById } from '@/src/utils/program';
import type { ProgramDaySplitKey } from '@/src/utils/programStartWeekday';
import {
  getShiftedWorkoutForDaySinceStart,
  listShiftedTrainingDayDeltasForProgram,
} from '@/src/utils/programWeekPattern';
import {
  getActiveProgramId,
  getCompletedSessionsStore,
  getProgramSessionShiftsStore,
  getProgramSessionStatuses,
  getProgramStartDate,
  getProgramWorkoutWeekdays,
} from '@/src/utils/storage';

/** Explicit status wins over legacy completed-session records. */
function mergeSessionStatuses(
  completedSessions: CompletedSessions,
  explicitStatuses: ProgramSessionStatuses
): Record<number, ProgramSessionStatus> {
  const merged: Record<number, ProgramSessionStatus> = {};
  for (const dayKey of Object.keys(completedSessions)) {
    merged[Number(dayKey)] = 'completed';
  }
  for (const [dayKey, record] of Object.entries(explicitStatuses)) {
    merged[Number(dayKey)] = record.status;
  }
  return merged;
}

function countTrainingSessionStatuses(
  trainingDeltas: number[],
  statuses: Record<number, ProgramSessionStatus>
): { sessionsCompleted: number; sessionsSkipped: number } {
  const trainingDays = new Set(trainingDeltas);
  let sessionsCompleted = 0;
  let sessionsSkipped = 0;
  for (const [dayKey, status] of Object.entries(statuses)) {
    if (!trainingDays.has(Number(dayKey))) {
      continue;
    }
    if (status === 'completed') {
      sessionsCompleted += 1;
    } else if (status === 'skipped') {
      sessionsSkipped += 1;
    }
  }
  return { sessionsCompleted, sessionsSkipped };
}

/** e.g. `2 completed · 1 skip · 11 sessions left` */
export function formatHomeProgramSessionMeta(args: {
  sessionsCompleted: number;
  sessionsSkipped: number;
  sessionsRemaining: number;
}): string {
  const parts: string[] = [];
  if (args.sessionsCompleted > 0) {
    parts.push(`${args.sessionsCompleted} completed`);
  }
  if (args.sessionsSkipped > 0) {
    parts.push(
      `${args.sessionsSkipped} ${args.sessionsSkipped === 1 ? 'skip' : 'skips'}`
    );
  }
  const remaining = args.sessionsRemaining;
  parts.push(`${remaining} session${remaining === 1 ? '' : 's'} left`);
  return parts.join(' · ');
}

function calculateDaysSinceStart(startDateStr: string): number {
  const start = new Date(startDateStr);
  const today = new Date();

  start.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - start.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

function normalizeToLocalMidnight(d: Date): Date {
  const out = new Date(d);
  out.setHours(0, 0, 0, 0);
  return out;
}

function isTodayOnOrAfterLocalDate(target: Date): boolean {
  const today = normalizeToLocalMidnight(new Date());
  const t = normalizeToLocalMidnight(target);
  return today.getTime() >= t.getTime();
}

/**
 * 0–1 fill for a bar spanning local calendar days from the first to the last
 * scheduled session (inclusive). Shift-aware via `trainingDeltas`. Calendar-only
 * (no session completion).
 */
function calendarSessionSpanProgress(args: {
  trainingDeltas: number[];
  todayDayDelta: number;
  programCompleted: boolean;
}): number {
  const { trainingDeltas, todayDayDelta, programCompleted } = args;
  if (programCompleted) {
    return 1;
  }
  const firstDelta = Math.min(...trainingDeltas);
  const lastDelta = Math.max(...trainingDeltas);
  const spanDays = lastDelta - firstDelta + 1;
  if (spanDays <= 0) {
    return 1;
  }
  if (todayDayDelta < 0 || todayDayDelta < firstDelta) {
    return 0;
  }
  if (todayDayDelta > lastDelta) {
    return 1;
  }
  const raw = (todayDayDelta - firstDelta + 1) / spanDays;
  return Math.min(1, Math.max(0, raw));
}

export type HomeProgramSummary = {
  programId: string;
  programName: string;
  todaySessionLabel: string;
  sessionsRemaining: number;
  sessionsCompleted: number;
  sessionsSkipped: number;
  programCompleted: boolean;
  /** True while calendar is before the program start date (label is e.g. "Starts in N days"). */
  awaitingProgramStart: boolean;
  /** Calendar progress from first scheduled session day through last (shift-aware), 0–1. */
  calendarSessionSpanProgress: number;
};

export async function loadHomeProgramSummary(): Promise<HomeProgramSummary | null> {
  const [programId, startISO] = await Promise.all([
    getActiveProgramId(),
    getProgramStartDate(),
  ]);

  if (!programId || !startISO) {
    return null;
  }

  const program = getProgramById(programId);
  if (!program) {
    return null;
  }

  const [savedWeekPattern, shifts, completedSessions, explicitStatuses] =
    await Promise.all([
      getProgramWorkoutWeekdays(),
      getProgramSessionShiftsStore(),
      getCompletedSessionsStore(),
      getProgramSessionStatuses(),
    ]);

  const effectivePattern: ProgramDaySplitKey[] | null =
    savedWeekPattern && savedWeekPattern.length > 0 ? savedWeekPattern : null;

  const trainingDeltas = listShiftedTrainingDayDeltasForProgram(
    program,
    startISO,
    effectivePattern,
    shifts
  );

  if (trainingDeltas.length === 0) {
    return null;
  }

  const start = normalizeToLocalMidnight(new Date(startISO));
  const lastDelta = Math.max(...trainingDeltas);
  const programEndDate = new Date(start);
  programEndDate.setDate(start.getDate() + lastDelta);
  programEndDate.setHours(0, 0, 0, 0);
  const programCompleted = isTodayOnOrAfterLocalDate(programEndDate);

  const todayDayDelta = calculateDaysSinceStart(startISO);

  const spanProgress = calendarSessionSpanProgress({
    trainingDeltas,
    todayDayDelta,
    programCompleted,
  });

  /** Training sessions strictly after today’s calendar offset from program start. */
  const sessionsRemaining = trainingDeltas.filter(
    (d) => d > todayDayDelta
  ).length;

  const { sessionsCompleted, sessionsSkipped } = countTrainingSessionStatuses(
    trainingDeltas,
    mergeSessionStatuses(completedSessions, explicitStatuses)
  );

  let todaySessionLabel: string;
  if (programCompleted) {
    todaySessionLabel = 'Program finished';
  } else if (todayDayDelta < 0) {
    const n = -todayDayDelta;
    todaySessionLabel = n === 1 ? 'Starts in 1 day' : `Starts in ${n} days`;
  } else {
    const workout = getShiftedWorkoutForDaySinceStart(
      program,
      startISO,
      effectivePattern,
      shifts,
      todayDayDelta
    );
    todaySessionLabel = workout?.label.trim() ? workout.label : 'Rest Day';
  }

  return {
    programId,
    programName: program.name,
    todaySessionLabel,
    sessionsRemaining,
    sessionsCompleted,
    sessionsSkipped,
    programCompleted,
    awaitingProgramStart: todayDayDelta < 0,
    calendarSessionSpanProgress: spanProgress,
  };
}
