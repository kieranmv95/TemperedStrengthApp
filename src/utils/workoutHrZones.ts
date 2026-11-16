import type { HeartRateZoneId } from '@/src/types/heartRate';
import type { SingleWorkout, WorkoutBlockBase } from '@/src/types/workouts';

/** Word boundaries keep names like "Roxzone" from matching. */
const ZONE_MENTION = /\bzone\s*([1-5])\b/i;

/** Every block in a workout, across all scales. */
export function blocksOfWorkout(workout: SingleWorkout): WorkoutBlockBase[] {
  return workout.blocks.flatMap((entry) =>
    'scale' in entry ? entry.blocks : [entry]
  );
}

/**
 * Zone named in a block's name or instructions, e.g. "WOD: Zone 2 x 30".
 * Used by data tests so zone copy always comes with an `hrZone` widget.
 */
export function mentionedHrZone(
  block: WorkoutBlockBase
): HeartRateZoneId | null {
  const text = [block.name, block.instructions, block.highlightInstructions]
    .filter((value): value is string => typeof value === 'string')
    .join(' ');
  const match = ZONE_MENTION.exec(text);
  if (!match) {
    return null;
  }
  return Number(match[1]) as HeartRateZoneId;
}
