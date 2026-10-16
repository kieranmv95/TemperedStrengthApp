import { getExerciseById } from '@/src/data/exercises';
import type { RestTimerSurfacePayload } from '@/src/services/restTimerSurfaceTypes';
import type { RestTimerState } from '@/src/types/storage';

export function formatRestUntilLabel(endTimeMs: number): string {
  return new Date(endTimeMs).toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function getRestTimerLabel(exerciseId: number | null): string {
  if (exerciseId == null) return 'Rest';
  return getExerciseById(exerciseId)?.name ?? 'Rest';
}

export function buildRestTimerSurfacePayload(
  timer: RestTimerState,
  status: RestTimerSurfacePayload['status'] = timer.status === 'completed'
    ? 'complete'
    : 'running'
): RestTimerSurfacePayload {
  const endTimeMs = timer.startedAt + timer.restTimeSeconds * 1000;
  return {
    endTimeMs,
    startedAtMs: timer.startedAt,
    label: getRestTimerLabel(timer.exerciseId),
    untilLabel: formatRestUntilLabel(endTimeMs),
    status,
  };
}
