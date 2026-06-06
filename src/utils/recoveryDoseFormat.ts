import type { RecoveryDose, RecoveryIntensity } from '@/src/types/recovery';

function formatSeconds(seconds: number): string {
  if (seconds >= 60 && seconds % 60 === 0) {
    const minutes = seconds / 60;
    return minutes === 1 ? '1 minute' : `${minutes} minutes`;
  }
  return seconds === 1 ? '1 second' : `${seconds} seconds`;
}

function formatIntensity(intensity: RecoveryIntensity): string {
  return intensity;
}

function formatRoundsSuffix(
  rounds: number | undefined,
  roundsLabel: string | undefined
): string {
  if (!rounds || rounds <= 1 || !roundsLabel) return '';
  return ` ${roundsLabel}`;
}

function sequentialStepLabel(index: number, total: number): string | undefined {
  if (total <= 1) return undefined;
  if (total === 2) return index === 0 ? 'First' : 'Then';
  return `Step ${index + 1}`;
}

export type RecoveryDoseStep = {
  label?: string;
  text: string;
};

/** Stacked dose rows with optional sequence labels when there are multiple steps. */
export function getRecoveryDoseSteps(dose: RecoveryDose): RecoveryDoseStep[] {
  const lines = getRecoveryDoseLines(dose);
  return lines.map((text, index) => ({
    text,
    label: sequentialStepLabel(index, lines.length),
  }));
}

/** Human-readable lines for a block dose. Multi-pass doses return one line per step. */
export function getRecoveryDoseLines(dose: RecoveryDose): string[] {
  switch (dose.kind) {
    case 'reps': {
      const unit = dose.unit ?? 'reps';
      const base = `${dose.count} ${unit}`;
      return [base + formatRoundsSuffix(dose.rounds, dose.roundsLabel)];
    }
    case 'reps_bilateral':
      return [`${dose.countPerSide} ${dose.unit ?? 'reps'} each side`];
    case 'duration': {
      const base = formatSeconds(dose.seconds);
      return [base + formatRoundsSuffix(dose.rounds, dose.roundsLabel)];
    }
    case 'duration_bilateral': {
      const base = `${formatSeconds(dose.secondsPerSide)} each side`;
      return [base + formatRoundsSuffix(dose.rounds, dose.roundsLabel)];
    }
    case 'percussive':
      return dose.passes.map(
        (pass) =>
          `${formatSeconds(pass.seconds)} ${formatIntensity(pass.intensity)}`
      );
    case 'percussive_bilateral':
      return dose.passes.map(
        (pass) =>
          `${formatSeconds(pass.seconds)} ${formatIntensity(pass.intensity)} each side`
      );
    default: {
      const _exhaustive: never = dose;
      return [String(_exhaustive)];
    }
  }
}

/** Single-line summary (e.g. list cards). Multi-pass doses are comma-separated. */
export function formatRecoveryDose(dose: RecoveryDose): string {
  return getRecoveryDoseLines(dose).join(', ');
}
