import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAllWorkoutNotes, runStorageMigrations } from '../utils/storage';

const SCHEMA_VERSION_KEY = 'storage_schema_version';
const WORKOUT_NOTES_KEY = 'workout_notes';
const SWAP_COUNT_KEY = 'swap_count';
const SWAP_COUNT_MONTH_KEY = 'swap_count_month';
const SWAP_COUNT_STATE_KEY = 'swap_count_state';

describe('storage migrations', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  it('records the latest schema version after running', async () => {
    await runStorageMigrations();
    const version = await AsyncStorage.getItem(SCHEMA_VERSION_KEY);
    expect(Number(version)).toBeGreaterThanOrEqual(2);
  });

  it('is idempotent across repeated runs', async () => {
    await AsyncStorage.setItem(
      WORKOUT_NOTES_KEY,
      JSON.stringify({ 0: { text: 'A' } })
    );

    await runStorageMigrations();
    const afterFirst = await AsyncStorage.getItem(WORKOUT_NOTES_KEY);

    await runStorageMigrations();
    const afterSecond = await AsyncStorage.getItem(WORKOUT_NOTES_KEY);

    expect(afterSecond).toBe(afterFirst);
    await expect(getAllWorkoutNotes()).resolves.toEqual({ 0: 'A' });
  });

  describe('v1 normalize workout notes', () => {
    it('coerces object-shaped values to plain strings', async () => {
      await AsyncStorage.setItem(
        WORKOUT_NOTES_KEY,
        JSON.stringify({
          1: { text: 'One' },
          2: 'Two',
          bad: { text: 'skip' },
        })
      );

      await runStorageMigrations();

      const raw = await AsyncStorage.getItem(WORKOUT_NOTES_KEY);
      expect(JSON.parse(raw as string)).toEqual({ 1: 'One', 2: 'Two' });
    });

    it('converts an array shape to a numeric-keyed map', async () => {
      await AsyncStorage.setItem(
        WORKOUT_NOTES_KEY,
        JSON.stringify(['Zero', null, { text: 'Two' }])
      );

      await runStorageMigrations();

      const raw = await AsyncStorage.getItem(WORKOUT_NOTES_KEY);
      expect(JSON.parse(raw as string)).toEqual({ 0: 'Zero', 2: 'Two' });
    });

    it('leaves a missing notes key untouched', async () => {
      await runStorageMigrations();
      await expect(AsyncStorage.getItem(WORKOUT_NOTES_KEY)).resolves.toBeNull();
    });
  });

  describe('v2 fold swap count state', () => {
    it('combines legacy count and month keys into one value', async () => {
      await AsyncStorage.setItem(SWAP_COUNT_KEY, '4');
      await AsyncStorage.setItem(SWAP_COUNT_MONTH_KEY, '5');

      await runStorageMigrations();

      const state = await AsyncStorage.getItem(SWAP_COUNT_STATE_KEY);
      expect(JSON.parse(state as string)).toEqual({ count: 4, month: 5 });

      await expect(AsyncStorage.getItem(SWAP_COUNT_KEY)).resolves.toBeNull();
      await expect(
        AsyncStorage.getItem(SWAP_COUNT_MONTH_KEY)
      ).resolves.toBeNull();
    });

    it('does not overwrite an existing folded value', async () => {
      await AsyncStorage.setItem(
        SWAP_COUNT_STATE_KEY,
        JSON.stringify({ count: 1, month: 0 })
      );
      await AsyncStorage.setItem(SWAP_COUNT_KEY, '9');

      await runStorageMigrations();

      const state = await AsyncStorage.getItem(SWAP_COUNT_STATE_KEY);
      expect(JSON.parse(state as string)).toEqual({ count: 1, month: 0 });
    });

    it('no-ops when there is no legacy swap data', async () => {
      await runStorageMigrations();
      await expect(
        AsyncStorage.getItem(SWAP_COUNT_STATE_KEY)
      ).resolves.toBeNull();
    });
  });
});
