import { temperedDailyWorkouts } from '@/src/data/temperedDaily';
import { allStandaloneWorkouts } from '@/src/data/workouts';
import {
  WORKOUT_BODY_FOCUSES,
  WORKOUT_COLLECTIONS,
  WORKOUT_DISCIPLINES,
  WORKOUT_FORMATS,
  WORKOUT_LEVELS,
  type SingleWorkout,
} from '@/src/types/workouts';

const everyWorkout: SingleWorkout[] = [
  ...allStandaloneWorkouts,
  ...temperedDailyWorkouts,
];

function scaleNames(workout: SingleWorkout): string[] {
  return workout.blocks.flatMap((block) =>
    'scale' in block ? [block.scale] : []
  );
}

describe('workout metadata rules', () => {
  it('covers the whole library and Tempered Daily', () => {
    expect(allStandaloneWorkouts.length).toBe(174);
    expect(temperedDailyWorkouts.length).toBe(56);
  });

  it.each(everyWorkout.map((w) => [w.id, w] as const))(
    '%s has valid disciplines, body focus, format, levels and collections',
    (_id, workout) => {
      expect(workout.disciplines.length).toBeGreaterThan(0);
      expect(new Set(workout.disciplines).size).toBe(
        workout.disciplines.length
      );
      for (const discipline of workout.disciplines) {
        expect(WORKOUT_DISCIPLINES).toContain(discipline);
      }

      expect(workout.bodyFocus.length).toBeGreaterThan(0);
      for (const focus of workout.bodyFocus) {
        expect(WORKOUT_BODY_FOCUSES).toContain(focus);
      }

      if (workout.format) {
        expect(WORKOUT_FORMATS).toContain(workout.format);
      }

      expect(workout.levels.length).toBeGreaterThan(0);
      for (const level of workout.levels) {
        expect(WORKOUT_LEVELS).toContain(level);
      }

      for (const collection of workout.collections ?? []) {
        expect(WORKOUT_COLLECTIONS).toContain(collection);
      }
    }
  );

  it('keeps every Skills workout coach-gated', () => {
    const skills = everyWorkout.filter((w) => w.disciplines.includes('Skills'));
    expect(skills.length).toBeGreaterThan(0);
    for (const w of skills) {
      expect(w.allowedRoles).toEqual(['coach']);
      expect(w.isPremium).toBe(true);
    }
  });

  it('only marks barbell sessions as Olympic Lifting', () => {
    for (const w of everyWorkout) {
      if (w.disciplines.includes('Olympic Lifting')) {
        expect(w.equipment).toContain('barbell');
      }
    }
  });

  it('marks every workout with a partner scale as a partner workout', () => {
    for (const w of everyWorkout) {
      const scales = scaleNames(w);
      const hasPartnerScale = scales.some((s) => /partner/i.test(s));
      if (hasPartnerScale) {
        const soloScale = scales.some((s) => !/partner/i.test(s));
        expect(w.partner).toBe(soloScale ? 'option' : 'only');
      }
    }
  });

  it('keeps Tempered Daily solo', () => {
    for (const w of temperedDailyWorkouts) {
      expect(w.partner).toBeUndefined();
    }
  });
});
