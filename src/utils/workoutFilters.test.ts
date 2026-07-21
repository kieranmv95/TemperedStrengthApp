import {
  isWorkoutFocusTag,
  isWorkoutFormatTag,
  WORKOUT_FOCUS_TAGS,
  WORKOUT_FORMAT_TAGS,
} from '@/src/types/workouts';
import {
  countWithMultiSelectOption,
  workoutMatchesFilters,
  workoutMatchesTimeBucket,
  WORKOUT_TIME_BUCKET_OPTIONS,
} from '@/src/utils/workoutFilters';
import type { SingleWorkout } from '@/src/types/workouts';
import { allStandaloneWorkouts } from '@/src/data/workouts';

const sampleWorkout: SingleWorkout = {
  id: 'test',
  title: 'Test Workout',
  description: 'A test',
  category: 'WOD',
  difficulty: 'Intermediate',
  estimatedTime: 20,
  tags: ['Full Body', 'AMRAP'],
  equipment: [],
  isPremium: false,
  logSchema: { kind: 'none' },
  blocks: [{ name: 'WOD', movements: ['10 burpees'] }],
};

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
      const matches = WORKOUT_TIME_BUCKET_OPTIONS.some((b) =>
        b.matches(minutes)
      );
      expect(matches).toBe(true);
    }
  });

  it('filters by focus OR within group and AND across groups', () => {
    expect(
      workoutMatchesFilters(sampleWorkout, {
        selectedFocus: ['Upper Body'],
      })
    ).toBe(false);
    expect(
      workoutMatchesFilters(sampleWorkout, {
        selectedFocus: ['Full Body'],
      })
    ).toBe(true);
    expect(
      workoutMatchesFilters(sampleWorkout, {
        selectedFocus: ['Full Body'],
        selectedFormat: ['For Time'],
      })
    ).toBe(false);
    expect(
      workoutMatchesFilters(sampleWorkout, {
        selectedFocus: ['Full Body'],
        selectedFormat: ['AMRAP'],
      })
    ).toBe(true);
  });

  it('filters by duration bucket', () => {
    expect(
      workoutMatchesFilters(sampleWorkout, {
        selectedTimeBuckets: ['short'],
      })
    ).toBe(true);
    expect(
      workoutMatchesFilters(sampleWorkout, {
        selectedTimeBuckets: ['quick'],
      })
    ).toBe(false);
  });

  it('classifies focus and format tags', () => {
    for (const tag of WORKOUT_FOCUS_TAGS) {
      expect(isWorkoutFocusTag(tag)).toBe(true);
      expect(isWorkoutFormatTag(tag)).toBe(false);
    }
    for (const tag of WORKOUT_FORMAT_TAGS) {
      expect(isWorkoutFormatTag(tag)).toBe(true);
      expect(isWorkoutFocusTag(tag)).toBe(false);
    }
    expect(isWorkoutFocusTag('Partner')).toBe(false);
    expect(isWorkoutFormatTag('Partner')).toBe(false);
  });

  it('faceted counts ignore the group own selection so they never grow', () => {
    const emomOnly = {
      activeCategoryFilter: 'All' as const,
      selectedFormat: ['EMOM' as const],
    };
    const emomOnlyCount = allStandaloneWorkouts.filter((w) =>
      workoutMatchesFilters(w, emomOnly)
    ).length;

    // With no format selected, EMOM's count is the plain EMOM count.
    expect(
      countWithMultiSelectOption(
        { activeCategoryFilter: 'All' },
        'selectedFormat',
        'EMOM'
      )
    ).toBe(emomOnlyCount);

    // Selecting another format (Benchmark) must not change EMOM's count.
    expect(
      countWithMultiSelectOption(
        { activeCategoryFilter: 'All', selectedFormat: ['Benchmark'] },
        'selectedFormat',
        'EMOM'
      )
    ).toBe(emomOnlyCount);
  });
});
