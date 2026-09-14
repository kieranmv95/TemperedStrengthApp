import type { BehaviourEntry } from '@/src/types/checkin';

export type DerivedCyclePhase = 'period' | 'not_on_period' | 'unknown';

/**
 * Derive cycle phase for display only — never stored as its own behaviour.
 * Period in progress when the latest period_started is after the latest period_ended.
 */
export function deriveCyclePhase(
  entries: readonly BehaviourEntry[]
): DerivedCyclePhase {
  let lastStart: string | null = null;
  let lastEnd: string | null = null;

  for (const entry of entries) {
    if (entry.behaviourId === 'period_started' && entry.value === true) {
      if (!lastStart || entry.date >= lastStart) {
        lastStart = entry.date;
      }
    }
    if (entry.behaviourId === 'period_ended' && entry.value === true) {
      if (!lastEnd || entry.date >= lastEnd) {
        lastEnd = entry.date;
      }
    }
  }

  if (!lastStart && !lastEnd) {
    return 'unknown';
  }
  if (lastStart && (!lastEnd || lastStart > lastEnd)) {
    return 'period';
  }
  return 'not_on_period';
}

export function cyclePhaseLabel(phase: DerivedCyclePhase): string | null {
  if (phase === 'period') return 'Period in progress';
  if (phase === 'not_on_period') return 'Not on period';
  return null;
}
