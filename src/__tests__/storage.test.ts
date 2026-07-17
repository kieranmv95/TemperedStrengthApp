import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  buildPromoProGrant,
  clearPromoProGrant,
  getActiveProgramId,
  getAllWorkoutNotes,
  getFavoriteWorkouts,
  getAutoRestTimersEnabled,
  getAutoPbDetectionInProgramsEnabled,
  getCompletedSession,
  getProgramSessionStatus,
  getProgramSessionStatuses,
  getPromoProGrant,
  getRestTimer,
  getWorkoutNotes,
  incrementSwapCount,
  isPromoProGrantActive,
  moveProgramDayData,
  runStorageMigrations,
  saveCompletedSession,
  saveRestTimer,
  saveWorkoutNotes,
  setProgramSessionStatus,
  clearRestTimer,
  setActiveProgramId,
  setAutoRestTimersEnabled,
  setAutoPbDetectionInProgramsEnabled,
  setPromoProGrant,
  toggleFavoriteWorkout,
} from '../utils/storage';

describe('storage utilities', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('stores and retrieves the active program id', async () => {
    await setActiveProgramId('program-1');

    await expect(getActiveProgramId()).resolves.toBe('program-1');
  });

  it('saves and clears workout notes when empty', async () => {
    await saveWorkoutNotes(2, 'Keep shoulders down');

    await expect(getWorkoutNotes(2)).resolves.toBe('Keep shoulders down');

    await saveWorkoutNotes(2, '  ');

    await expect(getWorkoutNotes(2)).resolves.toBe('');
  });

  it('returns all workout notes with numeric keys', async () => {
    await saveWorkoutNotes(0, 'A');
    await saveWorkoutNotes(3, 'B');

    await expect(getAllWorkoutNotes()).resolves.toEqual({
      0: 'A',
      3: 'B',
    });
  });

  it('normalizes legacy object-shaped workout notes via migration', async () => {
    await AsyncStorage.setItem(
      'workout_notes',
      JSON.stringify({
        0: { text: 'Legacy A' },
        2: { text: 'Legacy B', updatedAt: 123 },
        nope: { text: 'Ignored' },
      })
    );

    await runStorageMigrations();

    await expect(getAllWorkoutNotes()).resolves.toEqual({
      0: 'Legacy A',
      2: 'Legacy B',
    });
  });

  it('normalizes legacy array-shaped workout notes via migration', async () => {
    await AsyncStorage.setItem(
      'workout_notes',
      JSON.stringify(['Zero', null, { text: 'Two' }])
    );

    await runStorageMigrations();

    await expect(getAllWorkoutNotes()).resolves.toEqual({
      0: 'Zero',
      2: 'Two',
    });
  });

  it('toggles favorites on and off', async () => {
    await expect(toggleFavoriteWorkout('workout-1')).resolves.toBe(true);
    await expect(getFavoriteWorkouts()).resolves.toEqual(['workout-1']);

    await expect(toggleFavoriteWorkout('workout-1')).resolves.toBe(false);
    await expect(getFavoriteWorkouts()).resolves.toEqual([]);
  });

  it('defaults auto rest timers enabled to true', async () => {
    await expect(getAutoRestTimersEnabled()).resolves.toBe(true);
  });

  it('persists auto rest timers enabled flag', async () => {
    await setAutoRestTimersEnabled(false);
    await expect(getAutoRestTimersEnabled()).resolves.toBe(false);

    await setAutoRestTimersEnabled(true);
    await expect(getAutoRestTimersEnabled()).resolves.toBe(true);
  });

  it('defaults auto PB detection in programs enabled to true', async () => {
    await expect(getAutoPbDetectionInProgramsEnabled()).resolves.toBe(true);
  });

  it('persists auto PB detection in programs enabled flag', async () => {
    await setAutoPbDetectionInProgramsEnabled(false);
    await expect(getAutoPbDetectionInProgramsEnabled()).resolves.toBe(false);

    await setAutoPbDetectionInProgramsEnabled(true);
    await expect(getAutoPbDetectionInProgramsEnabled()).resolves.toBe(true);
  });

  it('saves and restores rest timer state', async () => {
    const timerState = {
      dayIndex: 3,
      slotIndex: 1,
      exerciseId: 7,
      restTimeSeconds: 90,
      startedAt: Date.now(),
      status: 'running' as const,
    };

    await saveRestTimer(timerState);

    await expect(getRestTimer()).resolves.toEqual(timerState);
  });

  it('clears rest timer state', async () => {
    await saveRestTimer({
      dayIndex: 1,
      slotIndex: 0,
      exerciseId: 2,
      restTimeSeconds: 60,
      startedAt: Date.now(),
      status: 'running',
    });

    await clearRestTimer();

    await expect(getRestTimer()).resolves.toBeNull();
  });

  it('increments swap count within the same month', async () => {
    const now = new Date('2025-06-15T10:00:00Z');
    jest.useFakeTimers().setSystemTime(now);

    await AsyncStorage.setItem(
      'swap_count_state',
      JSON.stringify({ count: 2, month: now.getMonth() })
    );

    await expect(incrementSwapCount()).resolves.toBe(3);
  });

  it('resets swap count when the month changes', async () => {
    const now = new Date('2025-07-01T10:00:00Z');
    jest.useFakeTimers().setSystemTime(now);

    await AsyncStorage.setItem(
      'swap_count_state',
      JSON.stringify({
        count: 9,
        month: new Date('2025-06-01T10:00:00Z').getMonth(),
      })
    );

    await expect(incrementSwapCount()).resolves.toBe(1);
  });

  it('moves program day-index keyed data to a new day index', async () => {
    await saveWorkoutNotes(2, 'Keep shoulders down');
    await setProgramSessionStatus(2, 'skipped');
    await saveCompletedSession({
      dayIndex: 2,
      startedAt: 100,
      completedAt: 200,
      totalVolume: 1234,
      setsCompleted: 10,
    });

    await expect(moveProgramDayData(2, 3)).resolves.toEqual({ moved: true });

    await expect(getWorkoutNotes(2)).resolves.toBe('');
    await expect(getWorkoutNotes(3)).resolves.toBe('Keep shoulders down');

    await expect(getCompletedSession(2)).resolves.toBeNull();
    await expect(getCompletedSession(3)).resolves.toMatchObject({
      dayIndex: 3,
      startedAt: 100,
      completedAt: 200,
      totalVolume: 1234,
      setsCompleted: 10,
    });
    await expect(getProgramSessionStatus(2)).resolves.toBeNull();
    await expect(getProgramSessionStatus(3)).resolves.toMatchObject({
      dayIndex: 3,
      status: 'skipped',
    });
  });

  it('saves and updates explicit program session statuses', async () => {
    await setProgramSessionStatus(4, 'completed');
    await setProgramSessionStatus(7, 'skipped');

    await expect(getProgramSessionStatuses()).resolves.toMatchObject({
      4: { dayIndex: 4, status: 'completed' },
      7: { dayIndex: 7, status: 'skipped' },
    });

    await setProgramSessionStatus(4, 'skipped');
    await expect(getProgramSessionStatus(4)).resolves.toMatchObject({
      dayIndex: 4,
      status: 'skipped',
    });
  });

  describe('promo Pro grant', () => {
    it('persists and retrieves an active grant', async () => {
      const now = new Date('2026-07-17T10:00:00Z');
      jest.useFakeTimers().setSystemTime(now);

      const grant = buildPromoProGrant({
        code: 'rainhill',
        email: 'user@example.com',
        daysGranted: 365,
      });

      await setPromoProGrant(grant);

      await expect(getPromoProGrant()).resolves.toEqual({
        code: 'RAINHILL',
        email: 'user@example.com',
        daysGranted: 365,
        redeemedAt: '2026-07-17T10:00:00.000Z',
        expiresAt: '2027-07-17T10:00:00.000Z',
      });
      expect(isPromoProGrantActive(grant, now)).toBe(true);
    });

    it('treats an expired grant as inactive', async () => {
      const grant = buildPromoProGrant({
        code: 'OLDCODE',
        email: 'user@example.com',
        daysGranted: 1,
        redeemedAt: new Date('2026-01-01T00:00:00Z'),
      });

      expect(
        isPromoProGrantActive(grant, new Date('2026-01-03T00:00:00Z'))
      ).toBe(false);
    });

    it('returns null for malformed stored grants', async () => {
      await AsyncStorage.setItem(
        'promo_pro_grant',
        JSON.stringify({ code: 'X' })
      );

      await expect(getPromoProGrant()).resolves.toBeNull();
    });

    it('replaces an existing grant on re-redeem', async () => {
      const first = buildPromoProGrant({
        code: 'FIRST',
        email: 'a@example.com',
        daysGranted: 30,
        redeemedAt: new Date('2026-01-01T00:00:00Z'),
      });
      await setPromoProGrant(first);

      const second = buildPromoProGrant({
        code: 'SECOND',
        email: 'b@example.com',
        daysGranted: 10,
        redeemedAt: new Date('2026-07-17T12:00:00Z'),
      });
      await setPromoProGrant(second);

      await expect(getPromoProGrant()).resolves.toEqual(second);
    });

    it('clears a stored grant', async () => {
      await setPromoProGrant(
        buildPromoProGrant({
          code: 'CLEARME',
          email: 'user@example.com',
          daysGranted: 7,
        })
      );
      await clearPromoProGrant();
      await expect(getPromoProGrant()).resolves.toBeNull();
    });
  });
});
