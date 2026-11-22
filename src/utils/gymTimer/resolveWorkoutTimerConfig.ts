import type { GymTimerConfig } from '@/src/types/gymTimer';
import type { SingleWorkout } from '@/src/types/workouts';

/**
 * Prefer explicit `timerConfig`; fall back to AMRAP logSchema time cap.
 */
export function resolveWorkoutTimerConfig(
  workout: SingleWorkout
): GymTimerConfig | null {
  if (workout.timerConfig) {
    return {
      ...workout.timerConfig,
      source: workout.timerConfig.source ?? {
        kind: 'standalone',
        workoutId: workout.id,
      },
      name: workout.timerConfig.name ?? workout.title,
    };
  }

  if (workout.logSchema.kind === 'amrap') {
    return {
      v: 1,
      name: workout.title,
      source: { kind: 'standalone', workoutId: workout.id },
      type: 'AMRAP',
      config: { durationSec: workout.logSchema.timeCapMinutes * 60 },
    };
  }

  return null;
}
