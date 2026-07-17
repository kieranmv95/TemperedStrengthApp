import type { Program } from '@/src/types/program';
import {
  clampStartDateToPatternAndToday,
  getWorkoutForDaySinceStart,
  getShiftedWorkoutForDaySinceStart,
  jsDayToSplitKey,
  listTrainingDayDeltasForProgram,
  listShiftedTrainingDayDeltasForProgram,
  nearestDateOnOrAfterAllowingWeekdays,
  patternWithRequiredStartDay,
  sessionsPerWeekFromProgram,
  sortPatternByCalendarOrder,
} from './programWeekPattern';
import { weekKeysStartingFrom } from '@/src/screens/programLauncherConstants';

function threeDayMiniProgram(): Program {
  return {
    id: 'mini',
    name: 'Mini',
    description: '',
    isPro: false,
    categories: ['strength'],
    difficulty: 'beginner',
    goals: ['stronger'],
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

  it('sessionsPerWeekFromProgram uses daysSplit when present', () => {
    expect(sessionsPerWeekFromProgram(threeDayMiniProgram())).toBe(3);
  });

  it('weekKeysStartingFrom rotates Mon-first strip from start day', () => {
    expect(weekKeysStartingFrom('tue')).toEqual([
      'tue',
      'wed',
      'thu',
      'fri',
      'sat',
      'sun',
      'mon',
    ]);
    expect(weekKeysStartingFrom('fri')).toEqual([
      'fri',
      'sat',
      'sun',
      'mon',
      'tue',
      'wed',
      'thu',
    ]);
  });

  it('patternWithRequiredStartDay keeps defaults when start is included', () => {
    expect(
      patternWithRequiredStartDay(['mon', 'wed', 'fri'], 'fri', 3)
    ).toEqual(['fri', 'mon', 'wed']);
  });

  it('patternWithRequiredStartDay inserts start and trims to session count', () => {
    expect(
      patternWithRequiredStartDay(['mon', 'wed', 'fri'], 'tue', 3)
    ).toEqual(['tue', 'wed', 'fri']);
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
      expect(getWorkoutForDaySinceStart(program, startISO, null, 1)).toBeNull();
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

    it('pattern Mon/Wed/Fri from Monday start maps block 0 (legacy earliest-day)', () => {
      const startMon = new Date(2024, 0, 1); // Monday
      startMon.setHours(0, 0, 0, 0);
      const monPattern = sortPatternByCalendarOrder(['mon', 'wed', 'fri']);
      expect(
        getWorkoutForDaySinceStart(
          program,
          startMon.toISOString(),
          monPattern,
          0
        )?.label
      ).toBe('Push');
      expect(
        getWorkoutForDaySinceStart(
          program,
          startMon.toISOString(),
          monPattern,
          2
        )?.label
      ).toBe('Pull');
      expect(
        getWorkoutForDaySinceStart(
          program,
          startMon.toISOString(),
          monPattern,
          4
        )?.label
      ).toBe('Legs');
    });

    it('pattern Mon/Wed/Fri from Friday start maps block 0 in chrono order', () => {
      const startFri = new Date(2024, 0, 5); // Friday
      startFri.setHours(0, 0, 0, 0);
      const monPattern = sortPatternByCalendarOrder(['mon', 'wed', 'fri']);
      expect(
        getWorkoutForDaySinceStart(
          program,
          startFri.toISOString(),
          monPattern,
          0
        )?.label
      ).toBe('Push');
      expect(
        getWorkoutForDaySinceStart(
          program,
          startFri.toISOString(),
          monPattern,
          3
        )?.label
      ).toBe('Pull');
      expect(
        getWorkoutForDaySinceStart(
          program,
          startFri.toISOString(),
          monPattern,
          5
        )?.label
      ).toBe('Legs');
    });
  });

  describe('shifted scheduling', () => {
    const program = threeDayMiniProgram();
    const startTue = new Date(2024, 0, 2);
    startTue.setHours(0, 0, 0, 0);
    const startISO = startTue.toISOString();
    const pattern = sortPatternByCalendarOrder(['tue', 'thu', 'sat']);

    it('moves a workout into a rest day within the same week', () => {
      const shifts = {
        0: [
          {
            weekIndex: 0,
            fromDayIndex: 2, // Thu (Pull)
            toDayIndex: 1, // Wed (rest)
            movedAt: 1,
          },
        ],
      };

      expect(
        getShiftedWorkoutForDaySinceStart(program, startISO, pattern, shifts, 1)
          ?.label
      ).toBe('Pull');
      expect(
        getShiftedWorkoutForDaySinceStart(program, startISO, pattern, shifts, 2)
      ).toBeNull();
    });

    it('listShiftedTrainingDayDeltasForProgram reflects shifted days', () => {
      const shifts = {
        0: [
          {
            weekIndex: 0,
            fromDayIndex: 4, // Sat (Legs)
            toDayIndex: 3, // Fri (rest)
            movedAt: 1,
          },
        ],
      };
      expect(
        listShiftedTrainingDayDeltasForProgram(
          program,
          startISO,
          pattern,
          shifts
        )
      ).toEqual([0, 2, 3, 7, 9, 11]);
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
