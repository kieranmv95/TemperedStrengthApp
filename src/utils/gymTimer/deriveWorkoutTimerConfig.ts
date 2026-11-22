import type { GymTimerConfig } from '@/src/types/gymTimer';
import type {
  StandaloneWorkoutSource,
  WorkoutFormat,
  WorkoutLogSchema,
} from '@/src/types/workouts';

const TIMED_FORMATS = new Set<WorkoutFormat>([
  'AMRAP',
  'EMOM',
  'Tabata',
  'For Time',
  'Intervals',
  'Chipper',
  'Ladder',
]);

function collectText(workout: StandaloneWorkoutSource): string {
  const parts: string[] = [
    workout.title,
    workout.description,
    workout.format ?? '',
  ];
  const walkBlocks = (blocks: StandaloneWorkoutSource['blocks']) => {
    for (const entry of blocks as unknown as Record<string, unknown>[]) {
      if (entry && typeof entry === 'object' && 'scale' in entry) {
        const scaled = entry as {
          scale: string;
          highlightInstructions?: string;
          blocks: {
            name?: string;
            instructions?: string;
            highlightInstructions?: string;
            movements?: unknown[];
          }[];
        };
        if (scaled.highlightInstructions) {
          parts.push(scaled.highlightInstructions);
        }
        for (const b of scaled.blocks) {
          if (b.name) parts.push(b.name);
          if (b.instructions) parts.push(b.instructions);
          if (b.highlightInstructions) parts.push(b.highlightInstructions);
          for (const m of b.movements ?? []) {
            if (typeof m === 'string') parts.push(m);
            else if (m && typeof m === 'object') {
              const obj = m as { note?: string; name?: string; value?: string };
              if (obj.note) parts.push(obj.note);
              if (obj.name) parts.push(obj.name);
              if (obj.value) parts.push(obj.value);
              if ('type' in (m as object) && (m as { type: string }).type === 'divider') {
                const d = m as { note?: string };
                if (d.note) parts.push(d.note);
              }
            }
          }
        }
      } else {
        const b = entry as {
          name?: string;
          instructions?: string;
          highlightInstructions?: string;
          movements?: unknown[];
        };
        if (b.name) parts.push(b.name);
        if (b.instructions) parts.push(b.instructions);
        if (b.highlightInstructions) parts.push(b.highlightInstructions);
        for (const m of b.movements ?? []) {
          if (typeof m === 'string') parts.push(m);
          else if (m && typeof m === 'object') {
            const obj = m as { note?: string; name?: string; value?: string; type?: string };
            if (obj.note) parts.push(obj.note);
            if (obj.name) parts.push(obj.name);
            if (obj.value) parts.push(obj.value);
          }
        }
      }
    }
  };
  walkBlocks(workout.blocks);
  return parts.join('\n');
}

function firstInt(re: RegExp, text: string): number | null {
  const m = text.match(re);
  if (!m) return null;
  const n = Number.parseInt(m[1], 10);
  return Number.isFinite(n) ? n : null;
}

function minutesToSec(minutes: number): number {
  return Math.max(1, minutes) * 60;
}

function amrapDurationSec(
  workout: StandaloneWorkoutSource,
  text: string,
  logSchema?: WorkoutLogSchema
): number {
  if (logSchema?.kind === 'amrap') {
    return minutesToSec(logSchema.timeCapMinutes);
  }
  const fromName =
    firstInt(/(\d+)\s*min(?:ute)?s?\s*amrap/i, text) ??
    firstInt(/amrap\s*(\d+)/i, text) ??
    firstInt(/(\d+)\s*min(?:ute)?s?/i, text);
  if (fromName) return minutesToSec(fromName);
  return minutesToSec(workout.estimatedTime || 15);
}

/**
 * Derive a gym timer for WOD / metcon formats only.
 * Returns null for strength / untimed sessions (no timed format).
 */
export function deriveWorkoutTimerConfig(
  workout: StandaloneWorkoutSource,
  logSchema?: WorkoutLogSchema
): GymTimerConfig | null {
  if (!workout.format || !TIMED_FORMATS.has(workout.format)) {
    return null;
  }

  const text = collectText(workout);
  const base = {
    v: 1 as const,
    name: workout.title,
  };

  switch (workout.format) {
    case 'AMRAP':
      return {
        ...base,
        type: 'AMRAP',
        config: { durationSec: amrapDurationSec(workout, text, logSchema) },
      };

    case 'EMOM': {
      const minutes =
        firstInt(/e\s*(\d+)\s*mom/i, text) ??
        firstInt(/(\d+)\s*min(?:ute)?s?\s*emom/i, text) ??
        firstInt(/emom\s*(\d+)/i, text) ??
        firstInt(/(\d+)\s*min(?:ute)?s?/i, text) ??
        workout.estimatedTime ??
        10;
      const intervalSec =
        firstInt(/every\s*(\d+)\s*sec/i, text) ??
        ( /e2mom/i.test(text) ? 120 : /e3mom/i.test(text) ? 180 : 60);
      return {
        ...base,
        type: 'EMOM',
        config: {
          rounds: Math.max(1, minutes),
          intervalSec,
        },
      };
    }

    case 'Tabata': {
      const work =
        firstInt(/(\d+)\s*s(?:ec(?:onds)?)?\s*(?:work|on)/i, text) ?? 20;
      const rest =
        firstInt(/(\d+)\s*s(?:ec(?:onds)?)?\s*(?:rest|off)/i, text) ?? 10;
      const rounds =
        firstInt(/(\d+)\s*(?:rounds?|x)/i, text) ?? 8;
      return {
        ...base,
        type: 'TABATA',
        config: {
          rounds: Math.max(1, rounds),
          workSec: Math.max(1, work),
          restSec: Math.max(0, rest),
        },
      };
    }

    case 'For Time':
    case 'Chipper':
    case 'Ladder': {
      const capMin =
        firstInt(/(\d+)\s*min(?:ute)?s?\s*cap/i, text) ??
        firstInt(/cap\s*(\d+)/i, text) ??
        firstInt(/time\s*cap[:\s]+(\d+)/i, text);
      return {
        ...base,
        type: 'FOR_TIME',
        config: capMin ? { capSec: minutesToSec(capMin) } : {},
      };
    }

    case 'Intervals': {
      const work =
        firstInt(/(\d+)\s*s(?:ec(?:onds)?)?\s*(?:work|on)/i, text) ??
        firstInt(/(\d+)\s*\/\s*\d+/i, text);
      const rest =
        firstInt(/(\d+)\s*s(?:ec(?:onds)?)?\s*(?:rest|off)/i, text) ??
        firstInt(/\d+\s*\/\s*(\d+)/i, text);
      const rounds =
        firstInt(/(\d+)\s*(?:rounds?|sets?|x)/i, text) ?? 8;
      if (work && rest !== null) {
        return {
          ...base,
          type: 'INTERVALS',
          config: {
            segments: [
              { phase: 'WORK', durationSec: work },
              { phase: 'REST', durationSec: rest ?? 0 },
            ].filter((s) => s.durationSec > 0 || s.phase === 'WORK') as {
              phase: 'WORK' | 'REST';
              durationSec: number;
            }[],
            repeats: Math.max(1, rounds),
          },
        };
      }
      // Multi-AMRAP style intervals → countdown of estimated time as AMRAP fallback
      const amrapMin = firstInt(/(\d+)\s*min(?:ute)?s?\s*amrap/i, text);
      if (amrapMin) {
        return {
          ...base,
          type: 'AMRAP',
          config: { durationSec: minutesToSec(amrapMin) },
        };
      }
      return {
        ...base,
        type: 'ROUNDS',
        config: {
          rounds: Math.max(1, rounds),
          workSec: 0,
          restSec: firstInt(/rest\s*(\d+)\s*s/i, text) ?? 60,
        },
      };
    }

    default:
      return null;
  }
}

export function isTimedWorkoutFormat(
  format: WorkoutFormat | undefined
): boolean {
  return !!format && TIMED_FORMATS.has(format);
}
