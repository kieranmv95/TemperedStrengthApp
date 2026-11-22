import type { GymTimerConfig } from '@/src/types/gymTimer';
import type { WorkoutBlock } from '@/src/types/program';

/**
 * Map a program v2 timed block to a gym timer config.
 * Returns null for warmup / cooldown.
 */
export function mapProgramBlockToGymTimer(
  block: WorkoutBlock,
  options?: { leadInSec?: number; workoutId?: string }
): GymTimerConfig | null {
  const source = {
    kind: 'program_v2' as const,
    workoutId: options?.workoutId,
    blockId: block.id,
  };
  const leadInSec = options?.leadInSec;
  const name = block.title;

  switch (block.type) {
    case 'warmup':
    case 'cooldown':
      return null;

    case 'tabata':
      return {
        v: 1,
        name,
        leadInSec,
        source,
        type: 'TABATA',
        config: {
          rounds: block.rounds,
          workSec: block.workSeconds,
          restSec: block.restSeconds,
        },
      };

    case 'emom':
      return {
        v: 1,
        name,
        leadInSec,
        source,
        type: 'EMOM',
        config: {
          rounds: block.minutes,
          intervalSec: block.intervalSec ?? 60,
        },
      };

    case 'amrap':
      return {
        v: 1,
        name,
        leadInSec,
        source,
        type: 'AMRAP',
        config: { durationSec: block.minutes * 60 },
      };

    case 'for_time':
      return {
        v: 1,
        name,
        leadInSec,
        source,
        type: 'FOR_TIME',
        config: {
          capSec: block.timeCapSeconds,
        },
      };

    case 'rounds':
      return {
        v: 1,
        name,
        leadInSec,
        source,
        type: 'ROUNDS',
        config: {
          rounds: block.rounds,
          workSec: block.workSeconds ?? 0,
          restSec: block.restSecondsBetweenRounds ?? 0,
        },
      };

    default: {
      const _exhaustive: never = block;
      return _exhaustive;
    }
  }
}
