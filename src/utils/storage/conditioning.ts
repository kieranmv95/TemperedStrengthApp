// Completion logs for conditioning-style program workouts.
import type { ConditioningWorkoutLogs } from '@/src/types/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CONDITIONING_WORKOUT_LOGS_KEY } from './keys';
import { parseJsonMap, withKeyLock } from './internal';
import { syncSetItem } from '@/src/sync/syncStorage';

/**
 * Get conditioning completion logs for a specific day.
 */
export const getConditioningLogsForDay = async (
  dayIndex: number
): Promise<{
  [blockId: string]: { completed: boolean; completedAt?: number };
}> => {
  try {
    const raw = await AsyncStorage.getItem(CONDITIONING_WORKOUT_LOGS_KEY);
    const logs: ConditioningWorkoutLogs = raw ? JSON.parse(raw) : {};
    return logs[dayIndex] ?? {};
  } catch (error) {
    console.error('Error getting conditioning logs for day:', error);
    return {};
  }
};

/**
 * Toggle completion for a conditioning workout block.
 * Returns the next completed state.
 */
export const toggleConditioningBlockCompleted = async (
  dayIndex: number,
  blockId: string
): Promise<boolean> => {
  return withKeyLock(CONDITIONING_WORKOUT_LOGS_KEY, async () => {
    try {
      const raw = await AsyncStorage.getItem(CONDITIONING_WORKOUT_LOGS_KEY);
      const logs = parseJsonMap<ConditioningWorkoutLogs>(raw);
      if (!logs[dayIndex]) {
        logs[dayIndex] = {};
      }

      const prev = logs[dayIndex][blockId];
      const nextCompleted = !(prev?.completed ?? false);

      if (!nextCompleted) {
        delete logs[dayIndex][blockId];
        if (Object.keys(logs[dayIndex]).length === 0) {
          delete logs[dayIndex];
        }
        await syncSetItem(CONDITIONING_WORKOUT_LOGS_KEY, JSON.stringify(logs));
        return false;
      }

      logs[dayIndex][blockId] = {
        completed: true,
        completedAt: Date.now(),
      };
      await syncSetItem(CONDITIONING_WORKOUT_LOGS_KEY, JSON.stringify(logs));
      return true;
    } catch (error) {
      console.error('Error toggling conditioning block completion:', error);
      throw error;
    }
  });
};

export const clearConditioningLogsForDay = async (
  dayIndex: number
): Promise<void> => {
  return withKeyLock(CONDITIONING_WORKOUT_LOGS_KEY, async () => {
    try {
      const raw = await AsyncStorage.getItem(CONDITIONING_WORKOUT_LOGS_KEY);
      if (!raw) return;
      const logs: ConditioningWorkoutLogs = JSON.parse(raw);
      if (logs[dayIndex] !== undefined) {
        delete logs[dayIndex];
        await syncSetItem(CONDITIONING_WORKOUT_LOGS_KEY, JSON.stringify(logs));
      }
    } catch (error) {
      console.error('Error clearing conditioning logs for day:', error);
      throw error;
    }
  });
};
