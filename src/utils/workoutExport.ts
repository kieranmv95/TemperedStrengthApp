import { getExerciseById } from '@/src/data/exercises';
import type { WorkoutSlot } from '@/src/screens/workoutScreenConstants';
import type { Exercise } from '@/src/types/exercise';
import type { LoggedSet } from '@/src/types/storage';
import type { WeightUnit } from '@/src/utils/storage';
import { formatWeightValueFromKg } from '@/src/utils/weightUnits';

type DayLogs = { [slotIndex: number]: { [setIndex: number]: LoggedSet } };

function formatSetLine(
  set: LoggedSet,
  loggingType: Exercise['logging_type'],
  weightUnit: WeightUnit
): string {
  if (loggingType === 'time') {
    return `${set.reps}s`;
  }

  if (set.weight !== null && set.weight > 0) {
    const value = formatWeightValueFromKg(set.weight, weightUnit);
    return `${value}${weightUnit}x${set.reps}`;
  }

  return `x${set.reps}`;
}

export function buildWorkoutExportText(
  workoutLabel: string,
  slots: WorkoutSlot[],
  logs: DayLogs,
  weightUnit: WeightUnit
): string {
  const blocks: string[] = [];

  let exerciseSlotIndex = 0;
  for (const slot of slots) {
    if (slot.type === 'warmup') {
      continue;
    }

    const slotLogs = logs[exerciseSlotIndex] ?? {};
    exerciseSlotIndex++;

    const exercise = slot.exerciseId ? getExerciseById(slot.exerciseId) : null;
    if (!exercise) {
      continue;
    }

    const setIndices = Object.keys(slotLogs)
      .map((k) => parseInt(k, 10))
      .filter((n) => Number.isFinite(n))
      .sort((a, b) => a - b);

    const setLines: string[] = [];
    for (const idx of setIndices) {
      const set = slotLogs[idx];
      if (!set) continue;
      setLines.push(formatSetLine(set, exercise.logging_type, weightUnit));
    }

    if (setLines.length === 0) {
      continue;
    }

    blocks.push([exercise.name, ...setLines].join('\n'));
  }

  if (blocks.length === 0) {
    return '';
  }

  return [workoutLabel, '', blocks.join('\n\n')].join('\n');
}
