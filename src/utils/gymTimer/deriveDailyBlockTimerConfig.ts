import type { GymTimerConfig } from '@/src/types/gymTimer';
import type { WorkoutBlockBase } from '@/src/types/workouts';

const TEMPERED_DAILY_ID = /^td_\d+$/;

/** Blocks that are logged or untimed even though they sit under a WOD title. */
const UNTIMED_WOD_NAME = /flush|easy flow|broad jump test|sprint test/i;

export function isTemperedDailyWorkoutId(id: string): boolean {
  return TEMPERED_DAILY_ID.test(id);
}

function firstInt(re: RegExp, text: string): number | null {
  const m = text.match(re);
  if (!m) return null;
  const n = Number.parseInt(m[1], 10);
  return Number.isFinite(n) ? n : null;
}

/** "rest 2:30", "rest 2 mins" or "rest 60s" → seconds. */
function restSeconds(text: string): number | null {
  const clock = text.match(/rest\s+(\d+):(\d{2})/i);
  if (clock) {
    return Number.parseInt(clock[1], 10) * 60 + Number.parseInt(clock[2], 10);
  }
  const mins = firstInt(/rest\s+(\d+)\s*mins?\b/i, text);
  if (mins !== null) return mins * 60;
  return firstInt(/rest\s+(\d+)\s*s\b/i, text);
}

/**
 * Derive a gym timer for one Tempered Daily block from that block's own
 * name, instructions and highlight. Movement notes are never read, so
 * weights and box heights cannot leak into a clock.
 *
 * Only `WOD:` blocks and EMOM blocks get a timer. Returns null for warmup,
 * cooldown, stretch, additional work, straight-set strength, and logged tests
 * with ranged attempts or rest.
 */
export function deriveDailyBlockTimerConfig(
  block: WorkoutBlockBase,
  workoutId?: string
): GymTimerConfig | null {
  if (block.optional) return null;

  const name = block.name;
  const isWod = /^WOD:/i.test(name);
  const isEmom = /\bEMOM\b/i.test(name);
  if (!isWod && !isEmom) return null;
  if (UNTIMED_WOD_NAME.test(name)) return null;

  const instructions = block.instructions ?? '';
  const nameAndHighlight = `${name}\n${block.highlightInstructions ?? ''}`;
  const base = {
    v: 1 as const,
    name,
    source: { kind: 'tempered_daily' as const, workoutId },
  };

  if (isEmom || /every\s+minute/i.test(instructions)) {
    const minutes =
      firstInt(
        /every\s+minute(?:\s+on\s+the\s+minute)?\s+for\s+(\d+)\s+minutes?/i,
        instructions
      ) ?? firstInt(/EMOM\s+(\d+)/i, nameAndHighlight);
    if (minutes === null) return null;
    return {
      ...base,
      type: 'EMOM',
      config: { rounds: minutes, intervalSec: 60 },
    };
  }

  if (/tabata/i.test(name)) {
    const sets =
      firstInt(/(\d+)\s*x\s*tabata/i, name) ??
      firstInt(/tabata\s*x\s*(\d+)/i, name) ??
      1;
    const rounds = firstInt(/(\d+)\s+rounds/i, instructions);
    const workSec = firstInt(/(\d+)\s*s\s+work/i, instructions);
    const restSec = firstInt(/(\d+)\s*s\s+rest/i, instructions);
    const restBetweenMins =
      firstInt(/(\d+)\s*min\s+rest/i, instructions) ??
      firstInt(/rest\s+(\d+)\s*min/i, instructions);
    if (rounds === null || workSec === null || restSec === null) return null;
    return {
      ...base,
      type: 'TABATA',
      config: {
        rounds,
        workSec,
        restSec,
        sets,
        restBetweenSetsSec: (restBetweenMins ?? 0) * 60,
      },
    };
  }

  const everyMinutes = firstInt(/every\s+(\d+)\s+min/i, instructions);
  if (everyMinutes !== null) {
    const intervals = firstInt(
      /(\d+)\s+(?:intervals|rounds)\s+in\s+total/i,
      instructions
    );
    if (intervals === null) return null;
    return {
      ...base,
      type: 'EMOM',
      config: { rounds: intervals, intervalSec: everyMinutes * 60 },
    };
  }

  const multiAmrap = name.match(/(\d+)\s*x\s*AMRAP\s*(\d+)/i);
  if (multiAmrap) {
    const rest = restSeconds(instructions);
    if (rest === null) return null;
    return {
      ...base,
      type: 'ROUNDS',
      config: {
        rounds: Number.parseInt(multiAmrap[1], 10),
        workSec: Number.parseInt(multiAmrap[2], 10) * 60,
        restSec: rest,
      },
    };
  }

  const amrapMinutes = firstInt(/AMRAP\s+(\d+)/i, name);
  if (amrapMinutes !== null) {
    return {
      ...base,
      type: 'AMRAP',
      config: { durationSec: amrapMinutes * 60 },
    };
  }

  const countdownMinutes =
    firstInt(/Zone\s*2\s*x\s*(\d+)/i, name) ??
    firstInt(/(\d+)\s*Min\s+Max\s+Cal/i, name) ??
    firstInt(/(\d+)\s*Min\s+Ascending\s+Ladder/i, name);
  if (countdownMinutes !== null) {
    return {
      ...base,
      type: 'COUNTDOWN',
      config: { durationSec: countdownMinutes * 60 },
    };
  }

  const timedBouts = instructions.match(
    /(\d+)\s+rounds:\s*(\d+)\s+seconds?[^,]*,\s*(\d+)\s+seconds?/i
  );
  if (timedBouts) {
    return {
      ...base,
      type: 'ROUNDS',
      config: {
        rounds: Number.parseInt(timedBouts[1], 10),
        workSec: Number.parseInt(timedBouts[2], 10),
        restSec: Number.parseInt(timedBouts[3], 10),
      },
    };
  }

  // Distance work with no fixed work time: user taps Next after each round.
  const openRounds =
    firstInt(/(\d+)\s+rounds:/i, instructions) ??
    firstInt(/^WOD:\s*(\d+)\s*x\s*\d+m\b/i, name);
  if (openRounds !== null) {
    return {
      ...base,
      type: 'ROUNDS',
      config: {
        rounds: openRounds,
        workSec: 0,
        restSec: restSeconds(instructions) ?? 0,
      },
    };
  }

  if (/\b(?:Row|Run)\s+Test\b/i.test(name)) {
    return { ...base, type: 'FOR_TIME', config: {} };
  }

  if (/for\s+time|chipper/i.test(name)) {
    const capMinutes = firstInt(/(\d+)\s*minute\s*cap/i, instructions);
    return {
      ...base,
      type: 'FOR_TIME',
      config: capMinutes === null ? {} : { capSec: capMinutes * 60 },
    };
  }

  return null;
}
