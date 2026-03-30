import AsyncStorage from '@react-native-async-storage/async-storage';
import type { StandaloneWorkoutLogEntry } from '@/src/types/standaloneWorkoutLogs';
import {
  deleteStandaloneWorkoutLogEntry,
  getStandaloneWorkoutLogsForWorkout,
  readStandaloneWorkoutLogsStore,
  upsertStandaloneWorkoutLogEntry,
} from '@/src/utils/storage';

const KEY = 'standalone_workout_logs';

function entry(
  id: string,
  workoutId: string,
  loggedAt: string,
  payload: StandaloneWorkoutLogEntry['payload'] = {
    kind: 'duration',
    durationSeconds: 60,
  }
): StandaloneWorkoutLogEntry {
  return {
    id,
    workoutId,
    loggedAt,
    updatedAt: loggedAt,
    payload,
  };
}

describe('standalone workout logs storage', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  describe('readStandaloneWorkoutLogsStore', () => {
    it('returns empty object when key missing', async () => {
      await expect(readStandaloneWorkoutLogsStore()).resolves.toEqual({});
    });

    it('returns empty object when JSON is array', async () => {
      await AsyncStorage.setItem(KEY, '[]');
      await expect(readStandaloneWorkoutLogsStore()).resolves.toEqual({});
    });

    it('returns empty object when JSON is null literal', async () => {
      await AsyncStorage.setItem(KEY, 'null');
      await expect(readStandaloneWorkoutLogsStore()).resolves.toEqual({});
    });

    it('returns empty object when JSON is malformed', async () => {
      const err = jest.spyOn(console, 'error').mockImplementation(() => {});
      await AsyncStorage.setItem(KEY, '{ not json');
      await expect(readStandaloneWorkoutLogsStore()).resolves.toEqual({});
      err.mockRestore();
    });
  });

  describe('getStandaloneWorkoutLogsForWorkout', () => {
    it('sorts by loggedAt newest first', async () => {
      await AsyncStorage.setItem(
        KEY,
        JSON.stringify({
          w1: [
            entry('a', 'w1', '2026-01-01T10:00:00.000Z'),
            entry('b', 'w1', '2026-01-03T10:00:00.000Z'),
            entry('c', 'w1', '2026-01-02T10:00:00.000Z'),
          ],
        })
      );

      const list = await getStandaloneWorkoutLogsForWorkout('w1');
      expect(list.map((e) => e.id)).toEqual(['b', 'c', 'a']);
    });

    it('returns empty array for unknown workout', async () => {
      await expect(getStandaloneWorkoutLogsForWorkout('none')).resolves.toEqual(
        []
      );
    });
  });

  describe('upsertStandaloneWorkoutLogEntry', () => {
    it('inserts a new log', async () => {
      const e = entry('log1', 'w1', '2026-01-01T12:00:00.000Z');
      await upsertStandaloneWorkoutLogEntry(e);

      const store = await readStandaloneWorkoutLogsStore();
      expect(store.w1).toHaveLength(1);
      expect(store.w1?.[0]).toEqual(e);
    });

    it('updates existing log by id', async () => {
      const original = entry('log1', 'w1', '2026-01-01T12:00:00.000Z');
      await upsertStandaloneWorkoutLogEntry(original);

      const updated: StandaloneWorkoutLogEntry = {
        ...original,
        loggedAt: '2026-01-02T12:00:00.000Z',
        updatedAt: '2026-01-02T12:00:00.000Z',
        payload: { kind: 'duration', durationSeconds: 120 },
      };
      await upsertStandaloneWorkoutLogEntry(updated);

      const list = await getStandaloneWorkoutLogsForWorkout('w1');
      expect(list).toHaveLength(1);
      expect(list[0].payload).toEqual({
        kind: 'duration',
        durationSeconds: 120,
      });
    });

    it('does not affect other workout ids', async () => {
      await upsertStandaloneWorkoutLogEntry(
        entry('a', 'w1', '2026-01-01T12:00:00.000Z')
      );
      await upsertStandaloneWorkoutLogEntry(
        entry('b', 'w2', '2026-01-02T12:00:00.000Z')
      );

      const store = await readStandaloneWorkoutLogsStore();
      expect(Object.keys(store).sort()).toEqual(['w1', 'w2']);
      expect(store.w1).toHaveLength(1);
      expect(store.w2).toHaveLength(1);
    });
  });

  describe('deleteStandaloneWorkoutLogEntry', () => {
    it('removes one log and keeps others sorted', async () => {
      await upsertStandaloneWorkoutLogEntry(
        entry('a', 'w1', '2026-01-01T12:00:00.000Z')
      );
      await upsertStandaloneWorkoutLogEntry(
        entry('b', 'w1', '2026-01-03T12:00:00.000Z')
      );
      await upsertStandaloneWorkoutLogEntry(
        entry('c', 'w1', '2026-01-02T12:00:00.000Z')
      );

      await deleteStandaloneWorkoutLogEntry('w1', 'b');

      const list = await getStandaloneWorkoutLogsForWorkout('w1');
      expect(list.map((e) => e.id)).toEqual(['c', 'a']);
    });

    it('removes workout key when last log deleted', async () => {
      await upsertStandaloneWorkoutLogEntry(
        entry('only', 'w1', '2026-01-01T12:00:00.000Z')
      );
      await deleteStandaloneWorkoutLogEntry('w1', 'only');

      const store = await readStandaloneWorkoutLogsStore();
      expect(store.w1).toBeUndefined();
    });

    it('no-ops when workout id missing', async () => {
      await deleteStandaloneWorkoutLogEntry('missing', 'x');
      await expect(readStandaloneWorkoutLogsStore()).resolves.toEqual({});
    });
  });
});
