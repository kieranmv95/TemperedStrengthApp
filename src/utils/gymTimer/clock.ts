import type {
  GymTimerLifecycle,
  GymTimerRuntime,
  GymTimerSegment,
} from '@/src/types/gymTimer';

export type GymTimerDisplay = {
  lifecycle: GymTimerLifecycle;
  segment: GymTimerSegment | null;
  segmentIndex: number;
  /** Seconds shown on the clock (count-down remaining or count-up elapsed). */
  displaySec: number;
  countingUp: boolean;
  completedRounds: number;
  /** Whole seconds remaining in a fixed segment (for 3-2-1 beeps). */
  remainingSecInSegment: number | null;
};

function segmentElapsedMs(runtime: GymTimerRuntime, nowMs: number): number {
  const base = runtime.segmentElapsedBeforePauseMs;
  if (
    runtime.lifecycle === 'running' ||
    runtime.lifecycle === 'lead_in'
  ) {
    if (runtime.segmentStartedAt === null) return base;
    return base + Math.max(0, nowMs - runtime.segmentStartedAt);
  }
  return base;
}

export function isCountingUpType(type: GymTimerRuntime['config']['type']): boolean {
  return type === 'COUNTUP' || type === 'FOR_TIME';
}

export function getDisplay(
  runtime: GymTimerRuntime,
  nowMs: number = Date.now()
): GymTimerDisplay {
  const { lifecycle, segments, segmentIndex, completedRounds, config } =
    runtime;

  if (lifecycle === 'ready') {
    const first = segments[0] ?? null;
    const countingUp =
      isCountingUpType(config.type) &&
      (first?.phase !== 'LEAD_IN');
    const readySegment =
      first?.phase === 'LEAD_IN' ? (segments[1] ?? first) : first;
    const displaySec = countingUp
      ? 0
      : (readySegment?.durationSec ?? 0);
    return {
      lifecycle,
      segment: readySegment,
      segmentIndex: 0,
      displaySec,
      countingUp: isCountingUpType(config.type) && readySegment?.phase !== 'LEAD_IN',
      completedRounds,
      remainingSecInSegment: readySegment?.openEnded
        ? null
        : (readySegment?.durationSec ?? null),
    };
  }

  if (lifecycle === 'done') {
    const last = segments[segments.length - 1] ?? null;
    const countingUp = isCountingUpType(config.type);
    const elapsedMs = segmentElapsedMs(runtime, nowMs);
    const displaySec = countingUp
      ? Math.floor(elapsedMs / 1000)
      : 0;
    return {
      lifecycle,
      segment: last,
      segmentIndex: Math.max(0, segments.length - 1),
      displaySec,
      countingUp,
      completedRounds,
      remainingSecInSegment: 0,
    };
  }

  const segment = segments[segmentIndex] ?? null;
  if (!segment) {
    return {
      lifecycle,
      segment: null,
      segmentIndex,
      displaySec: 0,
      countingUp: false,
      completedRounds,
      remainingSecInSegment: 0,
    };
  }

  const elapsedMs = segmentElapsedMs(runtime, nowMs);
  const countingUp =
    segment.openEnded === true ||
    (isCountingUpType(config.type) && segment.phase === 'WORK');

  if (countingUp) {
    const elapsedSec = Math.floor(elapsedMs / 1000);
    const cap = segment.openEnded ? null : segment.durationSec;
    const remainingSecInSegment =
      cap === null ? null : Math.max(0, cap - elapsedSec);
    return {
      lifecycle,
      segment,
      segmentIndex,
      displaySec: elapsedSec,
      countingUp: true,
      completedRounds,
      remainingSecInSegment,
    };
  }

  const remainingMs = Math.max(0, segment.durationSec * 1000 - elapsedMs);
  const remainingSec = Math.ceil(remainingMs / 1000);
  return {
    lifecycle,
    segment,
    segmentIndex,
    displaySec: remainingSec,
    countingUp: false,
    completedRounds,
    remainingSecInSegment: remainingSec,
  };
}

/**
 * Advance runtime based on wall clock. Returns the next runtime and whether
 * a segment boundary was crossed (for beeps / haptics).
 */
export function advanceRuntime(
  runtime: GymTimerRuntime,
  nowMs: number = Date.now()
): { runtime: GymTimerRuntime; crossedSegment: boolean; finished: boolean } {
  if (
    runtime.lifecycle !== 'running' &&
    runtime.lifecycle !== 'lead_in'
  ) {
    return { runtime, crossedSegment: false, finished: false };
  }

  const segment = runtime.segments[runtime.segmentIndex];
  if (!segment) {
    return {
      runtime: {
        ...runtime,
        lifecycle: 'done',
        segmentStartedAt: null,
        finishedAt: runtime.finishedAt ?? nowMs,
      },
      crossedSegment: false,
      finished: true,
    };
  }

  // Open-ended work only advances via nextSegment().
  if (segment.openEnded) {
    return { runtime, crossedSegment: false, finished: false };
  }

  const elapsedMs = segmentElapsedMs(runtime, nowMs);
  if (elapsedMs < segment.durationSec * 1000) {
    return { runtime, crossedSegment: false, finished: false };
  }

  const nextIndex = runtime.segmentIndex + 1;
  if (nextIndex >= runtime.segments.length) {
    return {
      runtime: {
        ...runtime,
        lifecycle: 'done',
        segmentIndex: runtime.segments.length - 1,
        segmentStartedAt: null,
        segmentElapsedBeforePauseMs: segment.durationSec * 1000,
        finishedAt: nowMs,
      },
      crossedSegment: true,
      finished: true,
    };
  }

  const nextSegment = runtime.segments[nextIndex];
  const lifecycle: GymTimerLifecycle =
    nextSegment.phase === 'LEAD_IN' ? 'lead_in' : 'running';

  return {
    runtime: {
      ...runtime,
      lifecycle,
      segmentIndex: nextIndex,
      segmentStartedAt: nowMs,
      segmentElapsedBeforePauseMs: 0,
      pausedAccumMs: 0,
    },
    crossedSegment: true,
    finished: false,
  };
}

export function nextSegment(
  runtime: GymTimerRuntime,
  nowMs: number = Date.now()
): GymTimerRuntime {
  if (runtime.lifecycle !== 'running' && runtime.lifecycle !== 'paused') {
    return runtime;
  }
  const nextIndex = runtime.segmentIndex + 1;
  if (nextIndex >= runtime.segments.length) {
    return {
      ...runtime,
      lifecycle: 'done',
      segmentStartedAt: null,
      finishedAt: nowMs,
    };
  }
  const next = runtime.segments[nextIndex];
  return {
    ...runtime,
    lifecycle: next.phase === 'LEAD_IN' ? 'lead_in' : 'running',
    segmentIndex: nextIndex,
    segmentStartedAt: nowMs,
    segmentElapsedBeforePauseMs: 0,
    pausedAccumMs: 0,
    viewState: runtime.viewState === 'closed' ? 'open' : runtime.viewState,
  };
}

export function formatGymTimerDigits(totalSec: number): string {
  const safe = Math.max(0, Math.floor(totalSec));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;
  const pad = (n: number) => n.toString().padStart(2, '0');
  if (hours > 0 || safe > 99 * 60 + 59) {
    return `${hours}:${pad(minutes)}:${pad(seconds)}`;
  }
  return `${pad(minutes)}:${pad(seconds)}`;
}

export function modeLabel(type: GymTimerRuntime['config']['type']): string {
  switch (type) {
    case 'COUNTDOWN':
    case 'REST':
      return 'DN';
    case 'COUNTUP':
      return 'UP';
    case 'FOR_TIME':
      return 'FT';
    case 'TABATA':
      return 'TB';
    case 'EMOM':
      return 'EM';
    case 'AMRAP':
      return 'AR';
    case 'ROUNDS':
      return 'RD';
    case 'INTERVALS':
      return 'IN';
    default: {
      const _exhaustive: never = type;
      return _exhaustive;
    }
  }
}
