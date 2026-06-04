// Logs for standalone (non-program) workouts.
import type {
  StandaloneWorkoutLogEntry,
  StandaloneWorkoutLogsStore,
} from '@/src/types/standaloneWorkoutLogs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { syncSetItem } from '@/src/sync/syncStorage';
import { STANDALONE_WORKOUT_LOGS_KEY } from './keys';
import { withKeyLock } from './internal';

function sortStandaloneLogEntriesNewestFirst(
  entries: StandaloneWorkoutLogEntry[]
): StandaloneWorkoutLogEntry[] {
  return [...entries].sort(
    (a, b) => new Date(b.loggedAt).getTime() - new Date(a.loggedAt).getTime()
  );
}

function parseStore(raw: string | null): StandaloneWorkoutLogsStore {
  if (!raw) {
    return {};
  }
  const parsed = JSON.parse(raw) as unknown;
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    return {};
  }
  return parsed as StandaloneWorkoutLogsStore;
}

export const readStandaloneWorkoutLogsStore =
  async (): Promise<StandaloneWorkoutLogsStore> => {
    try {
      const raw = await AsyncStorage.getItem(STANDALONE_WORKOUT_LOGS_KEY);
      return parseStore(raw);
    } catch (error) {
      console.error('Error reading standalone workout logs:', error);
      return {};
    }
  };

export const getStandaloneWorkoutLogsForWorkout = async (
  workoutId: string
): Promise<StandaloneWorkoutLogEntry[]> => {
  const store = await readStandaloneWorkoutLogsStore();
  return sortStandaloneLogEntriesNewestFirst(store[workoutId] ?? []);
};

export const upsertStandaloneWorkoutLogEntry = async (
  entry: StandaloneWorkoutLogEntry
): Promise<void> => {
  await withKeyLock(STANDALONE_WORKOUT_LOGS_KEY, async () => {
    const raw = await AsyncStorage.getItem(STANDALONE_WORKOUT_LOGS_KEY);
    const store = parseStore(raw);
    const prev = [...(store[entry.workoutId] ?? [])];
    const idx = prev.findIndex((e) => e.id === entry.id);
    if (idx >= 0) {
      prev[idx] = entry;
    } else {
      prev.push(entry);
    }
    store[entry.workoutId] = sortStandaloneLogEntriesNewestFirst(prev);
    await syncSetItem(STANDALONE_WORKOUT_LOGS_KEY, JSON.stringify(store));
  });
};

export const deleteStandaloneWorkoutLogEntry = async (
  workoutId: string,
  logId: string
): Promise<void> => {
  await withKeyLock(STANDALONE_WORKOUT_LOGS_KEY, async () => {
    const raw = await AsyncStorage.getItem(STANDALONE_WORKOUT_LOGS_KEY);
    const store = parseStore(raw);
    const list = store[workoutId];
    if (!list) {
      return;
    }
    const next = list.filter((e) => e.id !== logId);
    if (next.length === 0) {
      delete store[workoutId];
    } else {
      store[workoutId] = sortStandaloneLogEntriesNewestFirst(next);
    }
    await syncSetItem(STANDALONE_WORKOUT_LOGS_KEY, JSON.stringify(store));
  });
};
