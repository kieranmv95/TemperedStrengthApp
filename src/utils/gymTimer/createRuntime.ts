import type {
  GymTimerConfig,
  GymTimerRuntime,
  GymTimerSettings,
} from '@/src/types/gymTimer';
import { compileConfig, defaultLeadInSec } from './compileConfig';

export function resolveLeadInSec(
  config: GymTimerConfig,
  settings?: GymTimerSettings | null
): number {
  if (config.leadInSec !== undefined) return config.leadInSec;
  if (settings?.leadInSec !== undefined) return settings.leadInSec;
  return defaultLeadInSec();
}

export function createReadyRuntime(
  config: GymTimerConfig,
  settings?: GymTimerSettings | null
): GymTimerRuntime {
  const leadInSec = resolveLeadInSec(config, settings);
  const resolved: GymTimerConfig = { ...config, leadInSec };
  const segments = compileConfig(resolved);
  return {
    config: resolved,
    segments,
    viewState: 'open',
    lifecycle: 'ready',
    segmentIndex: 0,
    segmentStartedAt: null,
    pausedAccumMs: 0,
    segmentElapsedBeforePauseMs: 0,
    completedRounds: 0,
    muted: settings?.defaultMuted ?? false,
    finishedAt: null,
  };
}

export function startRuntime(
  runtime: GymTimerRuntime,
  nowMs: number = Date.now()
): GymTimerRuntime {
  if (runtime.segments.length === 0) {
    return {
      ...runtime,
      lifecycle: 'done',
      finishedAt: nowMs,
    };
  }
  const first = runtime.segments[0];
  return {
    ...runtime,
    lifecycle: first.phase === 'LEAD_IN' ? 'lead_in' : 'running',
    segmentIndex: 0,
    segmentStartedAt: nowMs,
    segmentElapsedBeforePauseMs: 0,
    pausedAccumMs: 0,
    finishedAt: null,
    viewState: runtime.viewState === 'closed' ? 'open' : runtime.viewState,
  };
}

export function pauseRuntime(
  runtime: GymTimerRuntime,
  nowMs: number = Date.now()
): GymTimerRuntime {
  if (
    runtime.lifecycle !== 'running' &&
    runtime.lifecycle !== 'lead_in'
  ) {
    return runtime;
  }
  const extra =
    runtime.segmentStartedAt !== null
      ? Math.max(0, nowMs - runtime.segmentStartedAt)
      : 0;
  return {
    ...runtime,
    lifecycle: 'paused',
    segmentStartedAt: null,
    segmentElapsedBeforePauseMs:
      runtime.segmentElapsedBeforePauseMs + extra,
    pausedAccumMs: runtime.pausedAccumMs + extra,
  };
}

export function resumeRuntime(
  runtime: GymTimerRuntime,
  nowMs: number = Date.now()
): GymTimerRuntime {
  if (runtime.lifecycle !== 'paused') return runtime;
  const segment = runtime.segments[runtime.segmentIndex];
  const lifecycle =
    segment?.phase === 'LEAD_IN' ? 'lead_in' : 'running';
  return {
    ...runtime,
    lifecycle,
    segmentStartedAt: nowMs,
  };
}
