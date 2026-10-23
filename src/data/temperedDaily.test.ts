import * as temperedDailyConstants from '@/src/components/temperedDaily/temperedDailyConstants';
import { getTemperedDailyWorkoutLabels } from '@/src/components/temperedDaily/temperedDailyConstants';
import { WORKOUT_EQUIPMENT_OPTIONS } from '@/src/components/workouts/workoutsScreenConstants';
import {
  temperedDailyProgram,
  temperedDailyWorkouts,
} from '@/src/data/temperedDaily';
import { allStandaloneWorkouts } from '@/src/data/workouts';
import {
  isWorkoutFocusTag,
  isWorkoutTag,
  type SingleWorkout,
} from '@/src/types/workouts';
import { getTemperedDayDate, parseLocalDate } from '@/src/utils/temperedDaily';

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
      expect(w.partner).not.toBe(true);
      expect(w.tags).not.toContain('Partner');
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

  it('focus tags are known focus tags', () => {
    for (const week of temperedDailyProgram) {
      expect(isWorkoutFocusTag(week.primaryFocus)).toBe(true);
      for (const tag of week.otherFocuses) {
        expect(isWorkoutFocusTag(tag)).toBe(true);
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

  it('every workout follows the Tempered Daily conventions', () => {
    const allowedEquipment = new Set(WORKOUT_EQUIPMENT_OPTIONS);
    for (const w of temperedDailyWorkouts) {
      expect(w.isPremium).toBe(true);
      expect(w.difficulty).toBe('Multiple Difficulties');
      for (const tag of w.tags) {
        expect(isWorkoutTag(tag)).toBe(true);
      }
      for (const eq of w.equipment) {
        expect(allowedEquipment.has(eq)).toBe(true);
      }
    }
  });

  it('never uses the Hyrox category', () => {
    for (const w of temperedDailyWorkouts) {
      expect(w.category).not.toBe('Hyrox');
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
