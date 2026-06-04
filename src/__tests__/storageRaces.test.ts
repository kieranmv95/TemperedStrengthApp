import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  addFavoriteWorkout,
  getFavoriteWorkouts,
  getLoggedSets,
  getWorkoutLogsForDay,
  saveCustomSetCount,
  getCustomSetCount,
  saveLoggedSet,
} from '../utils/storage';

describe('storage write-race safety', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  it('keeps every concurrent logged set on the same day', async () => {
    const SET_COUNT = 25;

    await Promise.all(
      Array.from({ length: SET_COUNT }, (_, setIndex) =>
        saveLoggedSet(0, 0, setIndex, 100 + setIndex, 5, 'completed')
      )
    );

    const sets = await getLoggedSets(0, 0);
    expect(Object.keys(sets)).toHaveLength(SET_COUNT);
    for (let setIndex = 0; setIndex < SET_COUNT; setIndex += 1) {
      expect(sets[setIndex]).toEqual({
        weight: 100 + setIndex,
        reps: 5,
        state: 'completed',
      });
    }
  });

  it('keeps concurrent logged sets across different slots', async () => {
    await Promise.all([
      saveLoggedSet(0, 0, 0, 60, 8, 'completed'),
      saveLoggedSet(0, 1, 0, 70, 8, 'completed'),
      saveLoggedSet(0, 2, 0, 80, 8, 'completed'),
      saveLoggedSet(1, 0, 0, 90, 8, 'completed'),
    ]);

    const day0 = await getWorkoutLogsForDay(0);
    expect(Object.keys(day0)).toHaveLength(3);

    const day1 = await getWorkoutLogsForDay(1);
    expect(Object.keys(day1)).toHaveLength(1);
  });

  it('keeps every concurrently added favorite', async () => {
    const ids = Array.from({ length: 20 }, (_, i) => `workout-${i}`);

    await Promise.all(ids.map((id) => addFavoriteWorkout(id)));

    const favorites = await getFavoriteWorkouts();
    expect(favorites.sort()).toEqual([...ids].sort());
  });

  it('keeps concurrent custom set counts across slots', async () => {
    await Promise.all([
      saveCustomSetCount(0, 0, 3),
      saveCustomSetCount(0, 1, 4),
      saveCustomSetCount(0, 2, 5),
    ]);

    await expect(getCustomSetCount(0, 0)).resolves.toBe(3);
    await expect(getCustomSetCount(0, 1)).resolves.toBe(4);
    await expect(getCustomSetCount(0, 2)).resolves.toBe(5);
  });
});
