import { programList } from '@/src/data/programs';
import { restDaySuggestionsByProgramId } from '@/src/data/programs/restDaySuggestions';
import { getRecoveryById } from '@/src/data/recovery';
import { getStandaloneWorkoutById } from '@/src/data/workouts';
import { getRestDayOrdinalInWeek } from '@/src/utils/restDayOrdinal';
import {
  getRestDaySuggestionsForDay,
  getRestDaySuggestionsForProgram,
} from '@/src/utils/restDaySuggestions';

describe('restDaySuggestions', () => {
  it('defines explicit sets for every program', () => {
    for (const program of programList) {
      const suggestions = restDaySuggestionsByProgramId[program.id];
      expect(suggestions).toBeDefined();
      expect(suggestions.sets.length).toBeGreaterThan(0);

      for (const set of suggestions.sets) {
        expect(set.context.length).toBeGreaterThan(0);
        expect(set.recoveryIds.length).toBeGreaterThan(0);
        expect(set.workoutIds.length).toBeGreaterThan(0);
        expect(set.skillWorkoutIds.length).toBeGreaterThan(0);
        expect(set.activities.length).toBeGreaterThan(0);
      }
    }
  });

  it('resolves only valid recovery and workout ids', () => {
    for (const { sets } of Object.values(restDaySuggestionsByProgramId)) {
      for (const set of sets) {
        for (const recoveryId of set.recoveryIds) {
          expect(getRecoveryById(recoveryId)).toBeDefined();
        }
        for (const workoutId of set.workoutIds) {
          expect(getStandaloneWorkoutById(workoutId)).toBeDefined();
        }
        for (const skillId of set.skillWorkoutIds) {
          expect(getStandaloneWorkoutById(skillId)).toBeDefined();
        }
      }
    }
  });

  it('returns the explicit set for a known program and day', () => {
    const startISO = '2026-01-05T00:00:00.000Z'; // Monday
    const pattern = ['mon', 'wed', 'fri'] as const;

    const suggestions = getRestDaySuggestionsForDay(
      'ppl_01',
      1,
      startISO,
      [...pattern]
    );

    expect(suggestions.context).toContain('push');
    expect(suggestions.recoveryIds).toEqual(['r_04', 'r_07', 'p_02']);
    expect(suggestions.workoutIds).toEqual([
      'f_12',
      'f_19',
      'f_33',
      'p_10',
      'f_42',
      'p_09',
    ]);
    expect(suggestions.skillWorkoutIds).toEqual([
      'sw_04',
      'sw_17',
      'sw_09',
      'sw_07',
    ]);
  });

  it('falls back to a generic program for unknown ids', () => {
    const suggestions = getRestDaySuggestionsForProgram('missing-program');
    expect(suggestions.sets.length).toBeGreaterThan(0);
  });

  it('varies suggestions across rest days in the same week', () => {
    const startISO = '2026-01-05T00:00:00.000Z'; // Monday
    const pattern = ['mon', 'wed', 'fri'] as const;

    const tuesday = getRestDaySuggestionsForDay('ppl_01', 1, startISO, [
      ...pattern,
    ]);
    const thursday = getRestDaySuggestionsForDay('ppl_01', 3, startISO, [
      ...pattern,
    ]);
    const saturday = getRestDaySuggestionsForDay('ppl_01', 5, startISO, [
      ...pattern,
    ]);

    expect(tuesday.context).not.toEqual(thursday.context);
    expect(thursday.context).not.toEqual(saturday.context);
    expect(tuesday.workoutIds).not.toEqual(thursday.workoutIds);
  });

  it('maps rest day ordinals within a week', () => {
    const startISO = '2026-01-05T00:00:00.000Z';
    const pattern = ['mon', 'wed', 'fri'] as const;

    expect(getRestDayOrdinalInWeek(1, startISO, [...pattern])).toBe(0);
    expect(getRestDayOrdinalInWeek(3, startISO, [...pattern])).toBe(1);
    expect(getRestDayOrdinalInWeek(5, startISO, [...pattern])).toBe(2);
    expect(getRestDayOrdinalInWeek(6, startISO, [...pattern])).toBe(3);
  });

  it('gives bb_3day and ppl distinct copy for the same rest day slot', () => {
    const startISO = '2026-01-05T00:00:00.000Z';
    const pattern = ['mon', 'wed', 'fri'] as const;

    const bodybuilding = getRestDaySuggestionsForDay(
      'bb_3day_01',
      1,
      startISO,
      [...pattern]
    );
    const ppl = getRestDaySuggestionsForDay('ppl_01', 1, startISO, [...pattern]);

    expect(bodybuilding.context).not.toEqual(ppl.context);
  });
});
