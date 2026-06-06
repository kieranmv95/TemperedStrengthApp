import type { RecoveryDose } from '@/src/types/recovery';

export type RecoveryTimerStep = {
  label?: string;
  seconds: number;
};

function sequentialStepLabel(index: number, total: number): string | undefined {
  if (total <= 1) return undefined;
  if (total === 2) return index === 0 ? 'First' : 'Then';
  return `Step ${index + 1}`;
}

export function isTimeBasedRecoveryDose(dose: RecoveryDose): boolean {
  return dose.kind !== 'reps' && dose.kind !== 'reps_bilateral';
}

/** Ordered countdown segments for a time-based block dose. */
export function getRecoveryTimerSteps(dose: RecoveryDose): RecoveryTimerStep[] {
  switch (dose.kind) {
    case 'reps':
    case 'reps_bilateral':
      return [];
    case 'duration': {
      const rounds = dose.rounds ?? 1;
      return Array.from({ length: rounds }, (_, index) => ({
        label:
          rounds > 1 && dose.roundsLabel
            ? `${dose.roundsLabel} (${index + 1}/${rounds})`
            : undefined,
        seconds: dose.seconds,
      }));
    }
    case 'duration_bilateral': {
      const rounds = dose.rounds ?? 1;
      const steps: RecoveryTimerStep[] = [];
      for (let round = 0; round < rounds; round += 1) {
        const roundPrefix =
          rounds > 1 && dose.roundsLabel ? `${dose.roundsLabel} · ` : '';
        steps.push(
          { label: `${roundPrefix}Left`, seconds: dose.secondsPerSide },
          { label: `${roundPrefix}Right`, seconds: dose.secondsPerSide }
        );
      }
      return steps;
    }
    case 'percussive':
      return dose.passes.map((pass, index) => ({
        label: sequentialStepLabel(index, dose.passes.length),
        seconds: pass.seconds,
      }));
    case 'percussive_bilateral':
      return dose.passes.flatMap((pass, index) => {
        const stepLabel = sequentialStepLabel(index, dose.passes.length);
        const intensity = pass.intensity;
        const prefix = stepLabel ? `${stepLabel} · ` : '';
        return [
          {
            label: `${prefix}Left (${intensity})`,
            seconds: pass.seconds,
          },
          {
            label: `${prefix}Right (${intensity})`,
            seconds: pass.seconds,
          },
        ];
      });
  }
}

export function formatCountdownSeconds(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const pad = (value: number) => value.toString().padStart(2, '0');
  return `${pad(minutes)}:${pad(seconds)}`;
}
