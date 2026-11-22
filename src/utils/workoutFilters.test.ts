import { allStandaloneWorkouts } from '@/src/data/workouts';
import type { SingleWorkout } from '@/src/types/workouts';
import {
  countActiveWorkoutFilters,
  countWithEquipmentOption,
  countWithGroupOption,
  EMPTY_WORKOUT_FILTERS,
  workoutMatchesFilters,
  workoutMatchesTimeBucket,
  WORKOUT_TIME_BUCKET_OPTIONS,
  type WorkoutFilterContext,
  type WorkoutFilters,
} from '@/src/utils/workoutFilters';

const sampleWorkout: SingleWorkout = {
  id: 'test',
  title: 'Test Workout',
  description: 'A test',
  estimatedTime: 20,
  disciplines: ['Metcon', 'Gymnastics'],
  bodyFocus: ['Full Body'],
  format: 'AMRAP',
  levels: ['Intermediate'],
  equipment: ['dumbbell', 'pull-up bar'],
  isPremium: false,
  logSchema: { kind: 'none' },
  blocks: [{ name: 'WOD', movements: ['10 burpees'] }],
};

const context: WorkoutFilterContext = {
  favoriteIds: [],
  isPro: false,
  roles: [],
};

function matches(filters: Partial<WorkoutFilters>, workout = sampleWorkout) {
  return workoutMatchesFilters(
    workout,
    { ...EMPTY_WORKOUT_FILTERS, ...filters },
    context
  );
}

describe('workoutFilters', () => {
  it('maps estimated time to duration buckets', () => {
    expect(workoutMatchesTimeBucket(10, 'quick')).toBe(true);
    expect(workoutMatchesTimeBucket(14, 'quick')).toBe(true);
    expect(workoutMatchesTimeBucket(15, 'quick')).toBe(false);
    expect(workoutMatchesTimeBucket(20, 'short')).toBe(true);
    expect(workoutMatchesTimeBucket(35, 'medium')).toBe(true);
    expect(workoutMatchesTimeBucket(50, 'long')).toBe(true);
  });

  it('covers every minute with at least one bucket', () => {
    for (let minutes = 5; minutes <= 90; minutes += 1) {
      const covered = WORKOUT_TIME_BUCKET_OPTIONS.some((b) =>
        b.matches(minutes)
      );
      expect(covered).toBe(true);
    }
  });

  it('ORs options within a group and ANDs across groups', () => {
    expect(matches({ disciplines: ['Strength'] })).toBe(false);
    expect(matches({ disciplines: ['Strength', 'Gymnastics'] })).toBe(true);
    expect(
      matches({ disciplines: ['Gymnastics'], formats: ['For Time'] })
    ).toBe(false);
    expect(matches({ disciplines: ['Gymnastics'], formats: ['AMRAP'] })).toBe(
      true
    );
    expect(matches({ timeBuckets: ['quick'] })).toBe(false);
    expect(matches({ timeBuckets: ['quick', 'short'] })).toBe(true);
  });

  it('matches equipment as "what I have", not "needs all of"', () => {
    expect(matches({ equipment: ['dumbbell'] })).toBe(false);
    expect(matches({ equipment: ['dumbbell', 'pull-up bar'] })).toBe(true);
    expect(matches({ equipment: ['dumbbell', 'pull-up bar', 'barbell'] })).toBe(
      true
    );
    expect(matches({ bodyweightOnly: true })).toBe(false);
    expect(
      matches({ bodyweightOnly: true }, { ...sampleWorkout, equipment: [] })
    ).toBe(true);
  });

  it('always lets bodyweight workouts through an equipment filter', () => {
    expect(
      matches({ equipment: ['dumbbell'] }, { ...sampleWorkout, equipment: [] })
    ).toBe(true);
  });

  it('filters partner, favourites and locked workouts', () => {
    expect(matches({ partnerOnly: true })).toBe(false);
    expect(
      matches({ partnerOnly: true }, { ...sampleWorkout, partner: 'option' })
    ).toBe(true);
    expect(matches({ favouritesOnly: true })).toBe(false);
    expect(
      workoutMatchesFilters(
        sampleWorkout,
        { ...EMPTY_WORKOUT_FILTERS, favouritesOnly: true },
        { ...context, favoriteIds: ['test'] }
      )
    ).toBe(true);
    expect(
      matches({ hideLocked: true }, { ...sampleWorkout, isPremium: true })
    ).toBe(false);
  });

  it('searches disciplines, format and collection names', () => {
    expect(matches({ searchQuery: 'gymnastics' })).toBe(true);
    expect(matches({ searchQuery: 'amrap' })).toBe(true);
    expect(matches({ searchQuery: 'hyrox' })).toBe(false);
  });

  it('counts each selected option as one active filter', () => {
    expect(countActiveWorkoutFilters(EMPTY_WORKOUT_FILTERS)).toBe(0);
    expect(
      countActiveWorkoutFilters({
        ...EMPTY_WORKOUT_FILTERS,
        disciplines: ['Metcon', 'Gymnastics'],
        equipment: ['dumbbell'],
        partnerOnly: true,
      })
    ).toBe(4);
  });

  it('faceted group counts ignore the group own selection so they never grow', () => {
    const emomOnly = allStandaloneWorkouts.filter((w) =>
      workoutMatchesFilters(
        w,
        { ...EMPTY_WORKOUT_FILTERS, formats: ['EMOM'] },
        context
      )
    ).length;

    expect(
      countWithGroupOption(EMPTY_WORKOUT_FILTERS, context, 'formats', 'EMOM')
    ).toBe(emomOnly);
    expect(
      countWithGroupOption(
        { ...EMPTY_WORKOUT_FILTERS, formats: ['AMRAP'] },
        context,
        'formats',
        'EMOM'
      )
    ).toBe(emomOnly);
  });

  it('equipment counts grow as more kit is added', () => {
    const dumbbell = countWithEquipmentOption(
      EMPTY_WORKOUT_FILTERS,
      context,
      'dumbbell'
    );
    const dumbbellAndBar = countWithEquipmentOption(
      { ...EMPTY_WORKOUT_FILTERS, equipment: ['dumbbell'] },
      context,
      'pull-up bar'
    );
    expect(dumbbellAndBar).toBeGreaterThanOrEqual(dumbbell);
  });
});
