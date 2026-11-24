import * as temperedDailyConstants from '@/src/components/temperedDaily/temperedDailyConstants';
import { getTemperedDailyWorkoutLabels } from '@/src/components/temperedDaily/temperedDailyConstants';
import { WORKOUT_EQUIPMENT_OPTIONS } from '@/src/components/workouts/workoutsScreenConstants';
import { getExerciseById } from '@/src/data/exercises';
import {
  temperedDailyProgram,
  temperedDailyWorkouts,
} from '@/src/data/temperedDaily';
import { allStandaloneWorkouts } from '@/src/data/workouts';
import {
  WORKOUT_BODY_FOCUSES,
  WORKOUT_DISCIPLINES,
  type SingleWorkout,
  type WorkoutBlockBase,
} from '@/src/types/workouts';
import { blockHasLoadPercentTokens } from '@/src/utils/loadPercent';
import { getTemperedDayDate, parseLocalDate } from '@/src/utils/temperedDaily';
import { blocksOfWorkout, mentionedHrZone } from '@/src/utils/workoutHrZones';

function scaledBlocks(
  workout: SingleWorkout
): { scale: string; block: WorkoutBlockBase }[] {
  const rows: { scale: string; block: WorkoutBlockBase }[] = [];
  for (const entry of workout.blocks) {
    if ('blocks' in entry) {
      for (const block of entry.blocks) {
        rows.push({ scale: entry.scale, block });
      }
    }
  }
  return rows;
}

const BRAND_NAMES = /crossfit|hyrox/i;

/** Every string anywhere inside `value`, with a path for failure messages. */
function collectStrings(
  value: unknown,
  path: string
): { path: string; text: string }[] {
  if (typeof value === 'string') {
    return [{ path, text: value }];
  }
  if (Array.isArray(value)) {
    return value.flatMap((item, index) =>
      collectStrings(item, `${path}[${index}]`)
    );
  }
  if (typeof value === 'object' && value !== null) {
    return Object.entries(value).flatMap(([key, item]) =>
      collectStrings(item, `${path}.${key}`)
    );
  }
  return [];
}

function findMatches(value: unknown, path: string, pattern: RegExp): string[] {
  return collectStrings(value, path)
    .filter(({ text }) => pattern.test(text))
    .map(({ path: matchPath, text }) => `${matchPath}: ${text}`);
}

function findBrandNames(value: unknown, path: string): string[] {
  return findMatches(value, path, BRAND_NAMES);
}

const RETIRED_WORDING = /partner|forged|honed/i;
const ALLOWED_SCALES = ['RX', 'Scaled'];

function scaleNames(workout: SingleWorkout): string[] {
  const names: string[] = [];
  for (const block of workout.blocks) {
    if ('scale' in block) {
      names.push(block.scale);
    }
  }
  return names;
}

describe('Tempered Daily solo sessions and scales', () => {
  it('no workout is a partner workout', () => {
    for (const w of temperedDailyWorkouts) {
      expect(w.partner).toBeUndefined();
    }
  });

  it('no workout mentions partners or the old scale names', () => {
    const matches = temperedDailyWorkouts.flatMap((w) =>
      findMatches(w, w.id, RETIRED_WORDING)
    );
    expect(matches).toEqual([]);
  });

  it('every workout is scaled as RX and Scaled only', () => {
    for (const w of temperedDailyWorkouts) {
      const scales = scaleNames(w);
      expect(scales.length).toBeGreaterThan(0);
      for (const scale of scales) {
        expect(ALLOWED_SCALES).toContain(scale);
      }
    }
  });
});

describe('Tempered Daily brand names', () => {
  it('no workout contains a brand name in any string field', () => {
    const matches = temperedDailyWorkouts.flatMap((w) =>
      findBrandNames(w, w.id)
    );
    expect(matches).toEqual([]);
  });

  it('no week contains a brand name in any string field', () => {
    const matches = temperedDailyProgram.flatMap((week) =>
      findBrandNames(week, week.id)
    );
    expect(matches).toEqual([]);
  });

  it('no UI label or copy constant contains a brand name', () => {
    const labelMatches = temperedDailyWorkouts.flatMap((w) =>
      findBrandNames(getTemperedDailyWorkoutLabels(w), `${w.id} labels`)
    );
    const copyMatches = findBrandNames(
      Object.values(temperedDailyConstants),
      'temperedDailyConstants'
    );
    expect([...labelMatches, ...copyMatches]).toEqual([]);
  });
});

describe('temperedDailyProgram', () => {
  it('every week has exactly 7 days', () => {
    for (const week of temperedDailyProgram) {
      expect(week.days).toHaveLength(7);
    }
  });

  it('every scheduled id resolves to a Tempered Daily workout', () => {
    const ids = new Set(temperedDailyWorkouts.map((w) => w.id));
    for (const week of temperedDailyProgram) {
      for (const id of week.days) {
        if (id !== null) {
          expect(ids.has(id)).toBe(true);
        }
      }
    }
  });

  it('every weekStart is a Monday', () => {
    for (const week of temperedDailyProgram) {
      expect(parseLocalDate(week.weekStart).getDay()).toBe(1);
    }
  });

  it('weeks are ordered and never overlap', () => {
    for (let i = 1; i < temperedDailyProgram.length; i++) {
      const previousEnd = getTemperedDayDate(temperedDailyProgram[i - 1], 7);
      const start = parseLocalDate(temperedDailyProgram[i].weekStart);
      expect(start.getTime()).toBeGreaterThanOrEqual(previousEnd.getTime());
    }
  });

  it('week ids are unique', () => {
    const ids = temperedDailyProgram.map((w) => w.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('week focuses are disciplines or body areas', () => {
    const known: readonly string[] = [
      ...WORKOUT_DISCIPLINES,
      ...WORKOUT_BODY_FOCUSES,
    ];
    for (const week of temperedDailyProgram) {
      expect(known).toContain(week.primaryFocus);
      for (const focus of week.otherFocuses) {
        expect(known).toContain(focus);
      }
    }
  });
});

describe('temperedDailyWorkouts', () => {
  it('stays out of the public workouts catalog', () => {
    const publicIds = new Set(allStandaloneWorkouts.map((w) => w.id));
    for (const w of temperedDailyWorkouts) {
      expect(publicIds.has(w.id)).toBe(false);
    }
  });

  it('ids are unique', () => {
    const ids = temperedDailyWorkouts.map((w) => w.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('ids run td_001 through td_084 and each week lists its own seven days', () => {
    const expected = Array.from({ length: 84 }, (_, index) => {
      return `td_${String(index + 1).padStart(3, '0')}`;
    });
    expect(temperedDailyWorkouts.map((w) => w.id)).toEqual(expected);
    temperedDailyProgram.forEach((week, index) => {
      expect(week.id).toBe(`td_week_${String(index + 1).padStart(3, '0')}`);
      expect(week.days).toEqual(expected.slice(index * 7, index * 7 + 7));
    });
  });

  it('ties every load percentage to an exercise that exists', () => {
    const problems: string[] = [];
    for (const workout of temperedDailyWorkouts) {
      for (const { scale, block } of scaledBlocks(workout)) {
        const hasTokens = blockHasLoadPercentTokens(block);
        const exerciseId = block.loadExerciseId;
        if (hasTokens && typeof exerciseId !== 'number') {
          problems.push(
            `${workout.id} ${scale} "${block.name}" has a percentage and no loadExerciseId`
          );
        }
        if (typeof exerciseId === 'number' && !getExerciseById(exerciseId)) {
          problems.push(
            `${workout.id} ${scale} "${block.name}" loadExerciseId ${exerciseId} is missing from the catalog`
          );
        }
      }
    }
    expect(problems).toEqual([]);
  });

  it('every workout follows the Tempered Daily conventions', () => {
    const allowedEquipment = new Set(WORKOUT_EQUIPMENT_OPTIONS);
    for (const w of temperedDailyWorkouts) {
      expect(w.isPremium).toBe(true);
      expect(w.levels).toEqual(['Intermediate', 'Advanced']);
      for (const eq of w.equipment) {
        expect(allowedEquipment.has(eq)).toBe(true);
      }
    }
  });

  it('every block that names a heart rate zone shows the matching zone widget', () => {
    const missing: string[] = [];
    for (const w of temperedDailyWorkouts) {
      for (const block of blocksOfWorkout(w)) {
        const mentioned = mentionedHrZone(block);
        if (mentioned !== null && block.hrZone !== mentioned) {
          missing.push(`${w.id} "${block.name}": hrZone ${mentioned}`);
        }
      }
    }
    expect(missing).toEqual([]);
  });

  it('tags the Zone 2 block in both scales of every recovery session', () => {
    const recoveryIds = [
      'td_007',
      'td_014',
      'td_021',
      'td_028',
      'td_035',
      'td_042',
      'td_049',
      'td_056',
      'td_063',
      'td_070',
      'td_077',
      'td_084',
    ];
    for (const id of recoveryIds) {
      const workout = temperedDailyWorkouts.find((w) => w.id === id);
      expect(workout).toBeDefined();
      for (const entry of workout?.blocks ?? []) {
        if ('scale' in entry) {
          expect(entry.blocks.some((block) => block.hrZone === 2)).toBe(true);
        }
      }
    }
  });

  it('never uses the Hyrox discipline', () => {
    for (const w of temperedDailyWorkouts) {
      expect(w.disciplines).not.toContain('Hyrox');
    }
  });

  it('uses the inline logSchema from the week file', () => {
    const td001 = temperedDailyWorkouts.find((w) => w.id === 'td_001');
    expect(td001?.logSchema).toEqual({
      kind: 'amrap',
      timeCapMinutes: 10,
      roundsLabel: 'Rounds',
      extraRepsLabel: 'Extra reps',
    });
  });
});
