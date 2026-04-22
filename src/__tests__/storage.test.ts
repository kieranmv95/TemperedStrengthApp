import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getActiveProgramId,
  getAllWorkoutNotes,
  getFavoriteWorkouts,
  getAutoRestTimersEnabled,
  getAutoPbDetectionInProgramsEnabled,
  getRestTimer,
  getWorkoutNotes,
  incrementSwapCount,
  saveRestTimer,
  saveWorkoutNotes,
  clearRestTimer,
  setActiveProgramId,
  setAutoRestTimersEnabled,
  setAutoPbDetectionInProgramsEnabled,
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

  it('returns all workout notes from legacy object shapes', async () => {
    await AsyncStorage.setItem(
      'workout_notes',
      JSON.stringify({
        0: { text: 'Legacy A' },
        2: { text: 'Legacy B', updatedAt: 123 },
        nope: { text: 'Ignored' },
      })
    );

    await expect(getAllWorkoutNotes()).resolves.toEqual({
      0: 'Legacy A',
      2: 'Legacy B',
    });
  });

  it('returns all workout notes from legacy array shapes', async () => {
    await AsyncStorage.setItem(
      'workout_notes',
      JSON.stringify(['Zero', null, { text: 'Two' }])
    );

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

    await AsyncStorage.setItem('swap_count', '2');
    await AsyncStorage.setItem('swap_count_month', now.getMonth().toString());

    await expect(incrementSwapCount()).resolves.toBe(3);
  });

  it('resets swap count when the month changes', async () => {
    const now = new Date('2025-07-01T10:00:00Z');
    jest.useFakeTimers().setSystemTime(now);

    await AsyncStorage.setItem('swap_count', '9');
    await AsyncStorage.setItem(
      'swap_count_month',
      new Date('2025-06-01T10:00:00Z').getMonth().toString()
    );

    await expect(incrementSwapCount()).resolves.toBe(1);
  });
});
