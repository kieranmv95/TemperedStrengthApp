// Active workout session, rest timer, and completed-session records.
import type {
  ActiveSession,
  CompletedSession,
  CompletedSessions,
  RestTimerState,
} from '@/src/types/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { syncRemoveItem, syncSetItem } from '@/src/sync/syncStorage';
import {
  ACTIVE_SESSION_KEY,
  COMPLETED_SESSIONS_KEY,
  REST_TIMER_KEY,
} from './keys';
import { mutate, parseJsonMap } from './internal';

/**
 * Save the active rest timer state (or clear if null)
 */
export const saveRestTimer = async (
  timer: RestTimerState | null
): Promise<void> => {
  try {
    if (!timer) {
      await syncRemoveItem(REST_TIMER_KEY);
      return;
    }

    await syncSetItem(REST_TIMER_KEY, JSON.stringify(timer));
  } catch (error) {
    console.error('Error saving rest timer:', error);
    throw error;
  }
};

/**
 * Get the active rest timer state
 */
export const getRestTimer = async (): Promise<RestTimerState | null> => {
  try {
    const data = await AsyncStorage.getItem(REST_TIMER_KEY);
    return data ? (JSON.parse(data) as RestTimerState) : null;
  } catch (error) {
    console.error('Error getting rest timer:', error);
    return null;
  }
};

/**
 * Clear the active rest timer
 */
export const clearRestTimer = async (): Promise<void> => {
  try {
    await syncRemoveItem(REST_TIMER_KEY);
  } catch (error) {
    console.error('Error clearing rest timer:', error);
    throw error;
  }
};

/**
 * Save the active session state (or clear if null)
 */
export const saveActiveSession = async (
  session: ActiveSession | null
): Promise<void> => {
  try {
    if (!session) {
      await syncRemoveItem(ACTIVE_SESSION_KEY);
      return;
    }
    await syncSetItem(ACTIVE_SESSION_KEY, JSON.stringify(session));
  } catch (error) {
    console.error('Error saving active session:', error);
    throw error;
  }
};

/**
 * Get the active session state
 */
export const getActiveSession = async (): Promise<ActiveSession | null> => {
  try {
    const data = await AsyncStorage.getItem(ACTIVE_SESSION_KEY);
    return data ? (JSON.parse(data) as ActiveSession) : null;
  } catch (error) {
    console.error('Error getting active session:', error);
    return null;
  }
};

/**
 * Clear the active session
 */
export const clearActiveSession = async (): Promise<void> => {
  try {
    await syncRemoveItem(ACTIVE_SESSION_KEY);
  } catch (error) {
    console.error('Error clearing active session:', error);
    throw error;
  }
};

/**
 * Save a completed session keyed by dayIndex
 */
export const saveCompletedSession = async (
  session: CompletedSession
): Promise<void> => {
  try {
    await mutate<CompletedSessions>(
      COMPLETED_SESSIONS_KEY,
      parseJsonMap,
      (sessions) => {
        sessions[session.dayIndex] = session;
        return sessions;
      }
    );
  } catch (error) {
    console.error('Error saving completed session:', error);
    throw error;
  }
};

/**
 * Get a completed session for a specific day
 */
export const getCompletedSession = async (
  dayIndex: number
): Promise<CompletedSession | null> => {
  try {
    const data = await AsyncStorage.getItem(COMPLETED_SESSIONS_KEY);
    const sessions: CompletedSessions = data ? JSON.parse(data) : {};
    return sessions[dayIndex] ?? null;
  } catch (error) {
    console.error('Error getting completed session:', error);
    return null;
  }
};

export const getCompletedSessionsStore =
  async (): Promise<CompletedSessions> => {
    try {
      const data = await AsyncStorage.getItem(COMPLETED_SESSIONS_KEY);
      return data ? (JSON.parse(data) as CompletedSessions) : {};
    } catch (error) {
      console.error('Error getting completed sessions store:', error);
      return {};
    }
  };

/**
 * Clear a completed session for a specific day (used by redo workout flow)
 */
export const clearCompletedSession = async (
  dayIndex: number
): Promise<void> => {
  try {
    await mutate<CompletedSessions>(
      COMPLETED_SESSIONS_KEY,
      parseJsonMap,
      (sessions) => {
        if (sessions[dayIndex] !== undefined) {
          delete sessions[dayIndex];
        }
        return sessions;
      }
    );
  } catch (error) {
    console.error('Error clearing completed session:', error);
    throw error;
  }
};
