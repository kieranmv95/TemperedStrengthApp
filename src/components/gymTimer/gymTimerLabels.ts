import type { GymTimerPhase, GymTimerType } from '@/src/types/gymTimer';
import { gymClock } from '@/src/constants/gymClock';

export function phaseWord(phase: GymTimerPhase | undefined): string {
  switch (phase) {
    case 'LEAD_IN':
      return 'GET READY';
    case 'REST':
      return 'REST';
    case 'WORK':
      return 'WORK';
    default:
      return '';
  }
}

export function phaseColor(
  type: GymTimerType,
  phase: GymTimerPhase | undefined
): string {
  if (phase === 'LEAD_IN') return gymClock.leadIn;
  if (phase === 'REST') return gymClock.rest;
  if (type === 'COUNTDOWN' || type === 'REST' || type === 'COUNTUP') {
    return gymClock.plain;
  }
  return gymClock.work;
}
