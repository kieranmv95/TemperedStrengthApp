import type {
  GymTimerConfig,
  GymTimerSegment,
} from '@/src/types/gymTimer';

const DEFAULT_LEAD_IN_SEC = 10;

function leadInSegment(config: GymTimerConfig): GymTimerSegment | null {
  const leadInSec = config.leadInSec ?? DEFAULT_LEAD_IN_SEC;
  if (leadInSec <= 0) return null;
  return { phase: 'LEAD_IN', durationSec: leadInSec, label: 'Get ready' };
}

function withLeadIn(
  config: GymTimerConfig,
  segments: GymTimerSegment[]
): GymTimerSegment[] {
  const leadIn = leadInSegment(config);
  return leadIn ? [leadIn, ...segments] : segments;
}

/**
 * Compile a typed timer config into a flat segment list the clock plays.
 * Open-ended work uses `durationSec: 0` + `openEnded: true`.
 */
export function compileConfig(config: GymTimerConfig): GymTimerSegment[] {
  switch (config.type) {
    case 'COUNTDOWN':
    case 'REST':
      return withLeadIn(config, [
        {
          phase: 'WORK',
          durationSec: config.config.durationSec,
          round: 1,
          totalRounds: 1,
        },
      ]);

    case 'COUNTUP':
    case 'FOR_TIME': {
      const cap = config.config.capSec;
      return withLeadIn(config, [
        {
          phase: 'WORK',
          durationSec: cap ?? 0,
          openEnded: cap === undefined || cap <= 0,
          round: 1,
          totalRounds: 1,
          label: config.type === 'FOR_TIME' ? 'For time' : 'Count up',
        },
      ]);
    }

    case 'AMRAP':
      return withLeadIn(config, [
        {
          phase: 'WORK',
          durationSec: config.config.durationSec,
          round: 1,
          totalRounds: 1,
          label: 'AMRAP',
        },
      ]);

    case 'EMOM': {
      const { rounds, intervalSec } = config.config;
      const segments: GymTimerSegment[] = [];
      for (let round = 1; round <= rounds; round += 1) {
        segments.push({
          phase: 'WORK',
          durationSec: intervalSec,
          round,
          totalRounds: rounds,
          label: 'EMOM',
        });
      }
      return withLeadIn(config, segments);
    }

    case 'TABATA': {
      const {
        rounds,
        workSec,
        restSec,
        sets = 1,
        restBetweenSetsSec = 0,
      } = config.config;
      const segments: GymTimerSegment[] = [];
      for (let set = 1; set <= sets; set += 1) {
        for (let round = 1; round <= rounds; round += 1) {
          segments.push({
            phase: 'WORK',
            durationSec: workSec,
            round,
            totalRounds: rounds,
            label: sets > 1 ? `Set ${set}` : 'Work',
          });
          if (round < rounds && restSec > 0) {
            segments.push({
              phase: 'REST',
              durationSec: restSec,
              round,
              totalRounds: rounds,
              label: 'Rest',
            });
          }
        }
        if (set < sets && restBetweenSetsSec > 0) {
          segments.push({
            phase: 'REST',
            durationSec: restBetweenSetsSec,
            label: 'Rest between sets',
          });
        }
      }
      return withLeadIn(config, segments);
    }

    case 'ROUNDS': {
      const { rounds, workSec, restSec } = config.config;
      const segments: GymTimerSegment[] = [];
      const openEnded = workSec <= 0;
      for (let round = 1; round <= rounds; round += 1) {
        segments.push({
          phase: 'WORK',
          durationSec: openEnded ? 0 : workSec,
          openEnded,
          round,
          totalRounds: rounds,
          label: openEnded ? 'Work — tap Next' : 'Work',
        });
        if (round < rounds && restSec > 0) {
          segments.push({
            phase: 'REST',
            durationSec: restSec,
            round,
            totalRounds: rounds,
            label: 'Rest',
          });
        }
      }
      return withLeadIn(config, segments);
    }

    case 'INTERVALS': {
      const repeats = Math.max(1, config.config.repeats ?? 1);
      const segments: GymTimerSegment[] = [];
      for (let rep = 1; rep <= repeats; rep += 1) {
        config.config.segments.forEach((seg, index) => {
          segments.push({
            phase: seg.phase,
            durationSec: seg.durationSec,
            round: rep,
            totalRounds: repeats,
            label:
              seg.label ??
              (repeats > 1
                ? `${seg.phase === 'WORK' ? 'Work' : 'Rest'} (${rep}/${repeats})`
                : seg.phase === 'WORK'
                  ? 'Work'
                  : 'Rest'),
          });
          void index;
        });
      }
      return withLeadIn(config, segments);
    }

    default: {
      const _exhaustive: never = config;
      return _exhaustive;
    }
  }
}

export function defaultLeadInSec(): number {
  return DEFAULT_LEAD_IN_SEC;
}
