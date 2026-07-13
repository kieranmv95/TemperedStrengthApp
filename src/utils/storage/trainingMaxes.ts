// Per-lift training maxes for programs that require them (e.g. Wendler 5/3/1).
// Keyed by exercise id, stored as the canonical weight in kilograms.
import type { TrainingMaxesStore } from '@/src/types/trainingMaxes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { syncRemoveItem, syncSetItem } from '@/src/sync/syncStorage';
import { TRAINING_MAXES_KEY } from './keys';
import { withKeyLock } from './internal';

function parseTrainingMaxesStore(raw: string | null): TrainingMaxesStore {
  if (!raw) {
    return {};
  }
  const parsed = JSON.parse(raw) as unknown;
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    return {};
  }
  return parsed as TrainingMaxesStore;
}

async function readTrainingMaxesStore(): Promise<TrainingMaxesStore> {
  try {
    const raw = await AsyncStorage.getItem(TRAINING_MAXES_KEY);
    return parseTrainingMaxesStore(raw);
  } catch (error) {
    console.error('Error reading training maxes:', error);
    return {};
  }
}

export const getTrainingMaxesStore = async (): Promise<TrainingMaxesStore> => {
  return readTrainingMaxesStore();
};

export const getTrainingMax = async (
  exerciseId: number
): Promise<number | null> => {
  const store = await readTrainingMaxesStore();
  const value = store[exerciseId];
  return typeof value === 'number' && Number.isFinite(value) && value > 0
    ? value
    : null;
};

/**
 * Merge a batch of training maxes (exercise id -> weight in kg) into the store.
 * Used at program start and when editing values mid-program.
 */
export const setTrainingMaxes = async (
  valuesKg: TrainingMaxesStore
): Promise<void> => {
  await withKeyLock(TRAINING_MAXES_KEY, async () => {
    const raw = await AsyncStorage.getItem(TRAINING_MAXES_KEY);
    const store = parseTrainingMaxesStore(raw);
    const next: TrainingMaxesStore = { ...store };
    for (const [id, weight] of Object.entries(valuesKg)) {
      if (Number.isFinite(weight) && weight > 0) {
        next[Number(id)] = weight;
      }
    }
    await syncSetItem(TRAINING_MAXES_KEY, JSON.stringify(next));
  });
};

export const clearTrainingMaxes = async (): Promise<void> => {
  try {
    await syncRemoveItem(TRAINING_MAXES_KEY);
  } catch (error) {
    console.error('Error clearing training maxes:', error);
    throw error;
  }
};
