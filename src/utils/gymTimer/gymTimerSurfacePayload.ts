import {
  GYM_TIMER_DEEP_LINK,
  type RestTimerSurfacePayload,
} from '@/src/services/restTimerSurfaceTypes';
import type { GymTimerPhase, GymTimerRuntime } from '@/src/types/gymTimer';
import { formatRestUntilLabel } from '@/src/utils/restTimerSurfacePayload';
import { getDisplay, modeLabel } from './clock';

function phaseLabel(phase: GymTimerPhase | undefined): string {
  switch (phase) {
    case 'LEAD_IN':
      return 'Get ready';
    case 'REST':
      return 'Rest';
    case 'WORK':
      return 'Work';
    default:
      return 'Timer';
  }
}

/**
 * Map a countdown gym-timer segment onto the shared Live Activity / Android
 * notification surface. Returns null for open-ended count-up (no end time).
 */
export function buildGymTimerSurfacePayload(
  runtime: GymTimerRuntime,
  nowMs: number = Date.now()
): RestTimerSurfacePayload | null {
  if (
    runtime.lifecycle !== 'running' &&
    runtime.lifecycle !== 'lead_in' &&
    runtime.lifecycle !== 'done'
  ) {
    return null;
  }

  const display = getDisplay(runtime, nowMs);
  const segment = display.segment;
  if (!segment || segment.openEnded) {
    return null;
  }
  if (display.countingUp && display.remainingSecInSegment === null) {
    return null;
  }

  const elapsedBefore = runtime.segmentElapsedBeforePauseMs;
  const startedAtMs =
    runtime.segmentStartedAt !== null
      ? runtime.segmentStartedAt - elapsedBefore
      : nowMs - elapsedBefore;
  const endTimeMs =
    runtime.lifecycle === 'done'
      ? (runtime.finishedAt ?? nowMs)
      : startedAtMs + segment.durationSec * 1000;

  const mode = modeLabel(runtime.config.type);
  const phase = phaseLabel(segment.phase);
  const round =
    segment.round && segment.totalRounds && segment.totalRounds > 1
      ? ` · R ${segment.round}/${segment.totalRounds}`
      : '';

  return {
    endTimeMs,
    startedAtMs,
    title: mode,
    label:
      runtime.lifecycle === 'done'
        ? (runtime.config.name ?? 'Gym timer')
        : `${phase}${round}`,
    untilLabel: formatRestUntilLabel(endTimeMs),
    status: runtime.lifecycle === 'done' ? 'complete' : 'running',
    url: GYM_TIMER_DEEP_LINK,
  };
}
