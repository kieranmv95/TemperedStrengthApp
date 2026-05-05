import type { ProgramDaySplitKey } from '@/src/utils/programStartWeekday';
import { getProgramById } from '@/src/utils/program';
import {
  getShiftedWorkoutForDaySinceStart,
  listShiftedTrainingDayDeltasForProgram,
} from '@/src/utils/programWeekPattern';
import {
  getActiveProgramId,
  getProgramSessionShiftsStore,
  getProgramStartDate,
  getProgramWorkoutWeekdays,
} from '@/src/utils/storage';

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

export type HomeProgramSummary = {
  programId: string;
  programName: string;
  todaySessionLabel: string;
  sessionsRemaining: number;
  programCompleted: boolean;
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

  const [savedWeekPattern, shifts] = await Promise.all([
    getProgramWorkoutWeekdays(),
    getProgramSessionShiftsStore(),
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

  /** Training sessions strictly after today’s calendar offset from program start. */
  const sessionsRemaining = trainingDeltas.filter(
    (d) => d > todayDayDelta
  ).length;

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
    programCompleted,
  };
}
