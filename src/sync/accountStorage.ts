import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ACCOUNT_FEATURE_INTRO_DISMISSED_KEY,
  ACCOUNT_NUDGE_SHOWN_AT_KEY,
  HAS_ACCOUNT_KEY,
  LAST_SYNCED_AT_KEY,
  SKIPPED_ACCOUNT_CREATION_AT_KEY,
  SYNC_QUEUE_KEY,
} from './constants';

export const ACTIVE_ACCOUNT_USER_ID_KEY = '__active_account_user_id__';

export async function setAccountActive(userId: string): Promise<void> {
  await AsyncStorage.multiSet([
    [HAS_ACCOUNT_KEY, 'true'],
    [ACTIVE_ACCOUNT_USER_ID_KEY, userId],
    [ACCOUNT_FEATURE_INTRO_DISMISSED_KEY, 'true'],
  ]);
  await AsyncStorage.multiRemove([
    SKIPPED_ACCOUNT_CREATION_AT_KEY,
    ACCOUNT_NUDGE_SHOWN_AT_KEY,
  ]);
}

export async function clearAccountActive(options?: {
  forgetUser?: boolean;
}): Promise<void> {
  await AsyncStorage.multiSet([
    [HAS_ACCOUNT_KEY, 'false'],
    [SYNC_QUEUE_KEY, JSON.stringify([])],
  ]);
  const keysToRemove = [LAST_SYNCED_AT_KEY];
  if (options?.forgetUser) {
    keysToRemove.push(ACTIVE_ACCOUNT_USER_ID_KEY);
  }
  await AsyncStorage.multiRemove(keysToRemove);
}

export async function getActiveAccountUserId(): Promise<string | null> {
  return AsyncStorage.getItem(ACTIVE_ACCOUNT_USER_ID_KEY);
}

export async function markAccountCreationSkipped(): Promise<void> {
  await AsyncStorage.multiSet([
    [SKIPPED_ACCOUNT_CREATION_AT_KEY, new Date().toISOString()],
    [ACCOUNT_FEATURE_INTRO_DISMISSED_KEY, 'true'],
  ]);
}

export async function markAccountIntroDismissed(): Promise<void> {
  await AsyncStorage.setItem(ACCOUNT_FEATURE_INTRO_DISMISSED_KEY, 'true');
}

export async function getAccountPromptState(): Promise<{
  introDismissed: boolean;
  skippedAt: string | null;
  nudgeShown: boolean;
}> {
  const [introDismissed, skippedAt, nudgeShown] = await AsyncStorage.multiGet([
    ACCOUNT_FEATURE_INTRO_DISMISSED_KEY,
    SKIPPED_ACCOUNT_CREATION_AT_KEY,
    ACCOUNT_NUDGE_SHOWN_AT_KEY,
  ]);
  return {
    introDismissed: introDismissed[1] === 'true',
    skippedAt: skippedAt[1],
    nudgeShown: nudgeShown[1] !== null,
  };
}

export async function markAccountNudgeShown(): Promise<void> {
  await AsyncStorage.setItem(
    ACCOUNT_NUDGE_SHOWN_AT_KEY,
    new Date().toISOString()
  );
}
