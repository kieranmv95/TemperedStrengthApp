import type { Program } from '@/src/types/program';
import {
  clampStartDateToPatternAndToday,
  firstSessionWeekdayForPattern,
  getWorkoutForDaySinceStart,
  jsDayToSplitKey,
  listTrainingDayDeltasForProgram,
  nearestDateOnOrAfterAllowingWeekdays,
  sessionsPerWeekFromProgram,
  sortPatternByCalendarOrder,
} from './programWeekPattern';

function threeDayMiniProgram(): Program {
  return {
    id: 'mini',
    name: 'Mini',
    description: '',
    isPro: false,
    daysSplit: ['mon', 'wed', 'fri'],
    workouts: [
      {
        dayIndex: 0,
        label: 'Push',
        description: '',
        intensity: 5,
        exercises: [],
      },
      {
        dayIndex: 2,
        label: 'Pull',
        description: '',
        intensity: 5,
        exercises: [],
      },
      {
        dayIndex: 4,
        label: 'Legs',
        description: '',
        intensity: 5,
        exercises: [],
      },
      {
        dayIndex: 7,
        label: 'Push W2',
        description: '',
        intensity: 5,
        exercises: [],
      },
      {
        dayIndex: 9,
        label: 'Pull W2',
        description: '',
        intensity: 5,
        exercises: [],
      },
      {
        dayIndex: 11,
        label: 'Legs W2',
        description: '',
        intensity: 5,
        exercises: [],
      },
    ],
  };
}

describe('programWeekPattern', () => {
  it('jsDayToSplitKey matches Date.getDay()', () => {
    const d = new Date(2024, 0, 7); // Sunday
    expect(jsDayToSplitKey(d.getDay())).toBe('sun');
  });

  it('sortPatternByCalendarOrder sorts Sun before Mon', () => {
    expect(sortPatternByCalendarOrder(['mon', 'sun', 'wed'])).toEqual([
      'sun',
      'mon',
      'wed',
    ]);
  });

  it('firstSessionWeekdayForPattern picks earliest Mon→Sun among selection', () => {
    expect(firstSessionWeekdayForPattern(['tue', 'sat', 'sun'])).toBe('tue');
    expect(firstSessionWeekdayForPattern(['sat', 'sun'])).toBe('sat');
    expect(firstSessionWeekdayForPattern(['sun', 'mon'])).toBe('mon');
  });

  it('sessionsPerWeekFromProgram uses daysSplit when present', () => {
    expect(sessionsPerWeekFromProgram(threeDayMiniProgram())).toBe(3);
  });

  it('nearestDateOnOrAfterAllowingWeekdays finds next Tue from Mon', () => {
    const mon = new Date(2024, 0, 1); // Monday
    const next = nearestDateOnOrAfterAllowingWeekdays(mon, ['tue']);
    expect(next.getDay()).toBe(2);
    expect(next.getDate()).toBe(2);
  });

  describe('getWorkoutForDaySinceStart', () => {
    const program = threeDayMiniProgram();
    // Tuesday 2 Jan 2024
    const startTue = new Date(2024, 0, 2);
    startTue.setHours(0, 0, 0, 0);
    const startISO = startTue.toISOString();
    const pattern = sortPatternByCalendarOrder(['tue', 'thu', 'sat']);

    it('legacy null pattern uses dayIndex match', () => {
      expect(
        getWorkoutForDaySinceStart(program, startISO, null, 0)?.label
      ).toBe('Push');
      expect(
        getWorkoutForDaySinceStart(program, startISO, null, 1)
      ).toBeNull();
      expect(
        getWorkoutForDaySinceStart(program, startISO, null, 2)?.label
      ).toBe('Pull');
    });

    it('pattern Tue/Thu/Sat from Tuesday start maps block 0 to Push/Pull/Legs', () => {
      expect(
        getWorkoutForDaySinceStart(program, startISO, pattern, 0)?.label
      ).toBe('Push');
      expect(
        getWorkoutForDaySinceStart(program, startISO, pattern, 1)
      ).toBeNull();
      expect(
        getWorkoutForDaySinceStart(program, startISO, pattern, 2)?.label
      ).toBe('Pull');
      expect(
        getWorkoutForDaySinceStart(program, startISO, pattern, 3)
      ).toBeNull();
      expect(
        getWorkoutForDaySinceStart(program, startISO, pattern, 4)?.label
      ).toBe('Legs');
      expect(
        getWorkoutForDaySinceStart(program, startISO, pattern, 5)
      ).toBeNull();
    });

    it('pattern week 1 starts on day 7 (next Tue)', () => {
      expect(
        getWorkoutForDaySinceStart(program, startISO, pattern, 7)?.label
      ).toBe('Push W2');
      expect(
        getWorkoutForDaySinceStart(program, startISO, pattern, 9)?.label
      ).toBe('Pull W2');
      expect(
        getWorkoutForDaySinceStart(program, startISO, pattern, 11)?.label
      ).toBe('Legs W2');
    });
  });

  it('listTrainingDayDeltasForProgram legacy returns unique sorted day indices', () => {
    const program = threeDayMiniProgram();
    expect(
      listTrainingDayDeltasForProgram(program, new Date().toISOString(), null)
    ).toEqual([0, 2, 4, 7, 9, 11]);
  });

  it('listTrainingDayDeltasForProgram with pattern lists calendar training days', () => {
    const program = threeDayMiniProgram();
    const startTue = new Date(2024, 0, 2);
    const pattern = sortPatternByCalendarOrder(['tue', 'thu', 'sat']);
    expect(
      listTrainingDayDeltasForProgram(program, startTue.toISOString(), pattern)
    ).toEqual([0, 2, 4, 7, 9, 11]);
  });

  it('clampStartDateToPatternAndToday snaps invalid weekday and past dates', () => {
    const pattern = sortPatternByCalendarOrder(['wed', 'fri']);
    const today = new Date(2024, 0, 10); // Wed
    const chosenMonday = new Date(2024, 0, 8); // Mon — not allowed
    const out = clampStartDateToPatternAndToday(chosenMonday, today, pattern);
    expect(out.getDay()).toBe(3); // Wed
    expect(out.getTime()).toBeGreaterThanOrEqual(
      new Date(2024, 0, 10).setHours(0, 0, 0, 0)
    );
  });
});
