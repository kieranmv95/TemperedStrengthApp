import {
  getTemperedDailyWorkoutById,
  temperedDailyWorkouts,
} from '@/src/data/temperedDaily';
import type { SingleWorkout, WorkoutBlockBase } from '@/src/types/workouts';
import {
  deriveDailyBlockTimerConfig,
  isTemperedDailyWorkoutId,
} from './deriveDailyBlockTimerConfig';

type ScaledBlocks = { scale: string; blocks: WorkoutBlockBase[] };

/** Every block of a daily workout, tagged with the scale it belongs to. */
function blocksByScale(workout: SingleWorkout): ScaledBlocks[] {
  return workout.blocks as ScaledBlocks[];
}

function findBlock(
  workoutId: string,
  scale: string,
  namePart: string
): WorkoutBlockBase {
  const workout = getTemperedDailyWorkoutById(workoutId);
  if (!workout) throw new Error(`Missing workout ${workoutId}`);
  const group = blocksByScale(workout).find((g) => g.scale === scale);
  const block = group?.blocks.find((b) => b.name.includes(namePart));
  if (!block) throw new Error(`Missing block ${namePart} in ${workoutId}`);
  return block;
}

/** WOD blocks that are logged or untimed on purpose. */
const UNTIMED_WOD_NAMES = [
  'WOD: Flush',
  'WOD: Easy Flow',
  'WOD: Broad Jump Test',
  'WOD: 40m Sprint Test',
  'WOD: 20m Sprint Test',
];

describe('isTemperedDailyWorkoutId', () => {
  it('matches daily ids only', () => {
    expect(isTemperedDailyWorkoutId('td_011')).toBe(true);
    expect(isTemperedDailyWorkoutId('murph')).toBe(false);
  });
});

describe('deriveDailyBlockTimerConfig', () => {
  it('gives Overhead Speed a 12 x 1 min clock on strength and 5 x 5 min on the WOD', () => {
    for (const scale of ['RX', 'Scaled']) {
      expect(
        deriveDailyBlockTimerConfig(
          findBlock('td_011', scale, 'Strength: Snatch Technique EMOM 12'),
          'td_011'
        )
      ).toEqual({
        v: 1,
        name: 'Strength: Snatch Technique EMOM 12',
        source: { kind: 'tempered_daily', workoutId: 'td_011' },
        type: 'EMOM',
        config: { rounds: 12, intervalSec: 60 },
      });
      expect(
        deriveDailyBlockTimerConfig(
          findBlock('td_011', scale, 'WOD: 5 x 5 Min Intervals'),
          'td_011'
        )
      ).toMatchObject({
        type: 'EMOM',
        config: { rounds: 5, intervalSec: 300 },
      });
    }
  });

  it('reads RX and Scaled round counts separately', () => {
    expect(
      deriveDailyBlockTimerConfig(findBlock('td_071', 'RX', 'Bike Sprints'))
    ).toMatchObject({ type: 'ROUNDS', config: { rounds: 6, workSec: 10 } });
    expect(
      deriveDailyBlockTimerConfig(findBlock('td_071', 'Scaled', 'Bike Sprints'))
    ).toMatchObject({ type: 'ROUNDS', config: { rounds: 4, workSec: 10 } });
  });

  it('maps tabata sets and rest between them', () => {
    expect(
      deriveDailyBlockTimerConfig(findBlock('td_039', 'RX', 'WOD: 4 x Tabata'))
    ).toMatchObject({
      type: 'TABATA',
      config: {
        rounds: 8,
        workSec: 20,
        restSec: 10,
        sets: 4,
        restBetweenSetsSec: 60,
      },
    });
  });

  it('maps repeated AMRAPs with rest between them', () => {
    expect(
      deriveDailyBlockTimerConfig(findBlock('td_044', 'RX', 'WOD: 3 x AMRAP 4'))
    ).toMatchObject({
      type: 'ROUNDS',
      config: { rounds: 3, workSec: 240, restSec: 120 },
    });
  });

  it('maps distance repeats to open rounds with the written rest', () => {
    expect(
      deriveDailyBlockTimerConfig(findBlock('td_036', 'RX', 'WOD: 4 x 1000m'))
    ).toMatchObject({
      type: 'ROUNDS',
      config: { rounds: 4, workSec: 0, restSec: 150 },
    });
  });

  it('uses the stated cap for for-time blocks and none for tests', () => {
    expect(
      deriveDailyBlockTimerConfig(findBlock('td_012', 'RX', 'WOD: 3 Rounds'))
    ).toMatchObject({ type: 'FOR_TIME', config: { capSec: 1440 } });
    expect(
      deriveDailyBlockTimerConfig(findBlock('td_050', 'RX', 'Row Test'))
    ).toMatchObject({ type: 'FOR_TIME', config: {} });
  });

  it('returns null for warmup, optional work and straight sets', () => {
    expect(
      deriveDailyBlockTimerConfig({
        name: 'Warmup',
        instructions: '3 rounds. Rest 60s.',
      })
    ).toBeNull();
    expect(
      deriveDailyBlockTimerConfig({
        name: 'Additional Work',
        optional: true,
        instructions: 'Optional. 3 rounds, rest 45s between rounds.',
      })
    ).toBeNull();
    expect(
      deriveDailyBlockTimerConfig(
        findBlock('td_008', 'RX', 'Strength: Back Squat 5x5')
      )
    ).toBeNull();
  });
});

describe('Tempered Daily block timer audit', () => {
  it('has a timer on every timed block and none on the rest, for both scales', () => {
    const unclassified: string[] = [];

    for (const workout of temperedDailyWorkouts) {
      for (const group of blocksByScale(workout)) {
        for (const block of group.blocks) {
          const label = `${workout.id} ${group.scale} ${block.name}`;
          const config = deriveDailyBlockTimerConfig(block, workout.id);
          const isWod = block.name.startsWith('WOD:');
          const isEmom = /\bEMOM\b/i.test(block.name);

          if (isWod && !UNTIMED_WOD_NAMES.includes(block.name) && !config) {
            unclassified.push(label);
          }
          if (isEmom && !config) {
            unclassified.push(label);
          }
          if (!isWod && !isEmom && config) {
            unclassified.push(`${label} (unexpected timer)`);
          }
          if (UNTIMED_WOD_NAMES.includes(block.name) && config) {
            unclassified.push(`${label} (unexpected timer)`);
          }
        }
      }
    }

    expect(unclassified).toEqual([]);
  });

  it('keeps every derived clock valid', () => {
    const invalid: string[] = [];

    for (const workout of temperedDailyWorkouts) {
      for (const group of blocksByScale(workout)) {
        for (const block of group.blocks) {
          const config = deriveDailyBlockTimerConfig(block, workout.id);
          if (!config) continue;
          const label = `${workout.id} ${group.scale} ${block.name}`;
          switch (config.type) {
            case 'EMOM':
              if (config.config.rounds <= 0 || config.config.intervalSec <= 0) {
                invalid.push(label);
              }
              break;
            case 'ROUNDS':
              if (config.config.rounds <= 0) invalid.push(label);
              break;
            case 'TABATA':
              if (config.config.rounds <= 0 || config.config.workSec <= 0) {
                invalid.push(label);
              }
              break;
            case 'AMRAP':
            case 'COUNTDOWN':
              if (config.config.durationSec <= 0) invalid.push(label);
              break;
            default:
              break;
          }
        }
      }
    }

    expect(invalid).toEqual([]);
  });
});
