import { useSyncManager } from '@/src/hooks/sync-manager-context';
import {
  getAccountPromptState,
  markAccountCreationSkipped,
  markAccountIntroDismissed,
  markAccountNudgeShown,
} from '@/src/sync/accountStorage';
import { getOnboarded } from '@/src/utils/storage';
import { router, type Href } from 'expo-router';
import { useCallback, useEffect, useRef } from 'react';
import { Alert, AppState } from 'react-native';

const FIVE_DAYS_MS = 5 * 24 * 60 * 60 * 1000;

export function AccountPromptController() {
  const { isConfigured, isReady, user } = useSyncManager();
  const promptOpen = useRef(false);

  const checkPrompts = useCallback(async () => {
    if (!isConfigured || !isReady || user || promptOpen.current) return;
    if (!(await getOnboarded())) return;

    const state = await getAccountPromptState();
    if (!state.introDismissed) {
      promptOpen.current = true;
      Alert.alert(
        'Accounts are here',
        'Create an account to protect your training data and restore it on another device.',
        [
          {
            text: 'Skip for now',
            style: 'cancel',
            onPress: () => {
              void markAccountCreationSkipped().finally(() => {
                promptOpen.current = false;
              });
            },
          },
          {
            text: 'Create account',
            onPress: () => {
              void markAccountIntroDismissed().finally(() => {
                promptOpen.current = false;
                router.push({
                  pathname: '/account/create-account',
                  params: { intent: 'create', returnTo: '/' },
                } as unknown as Href);
              });
            },
          },
        ],
        { cancelable: false }
      );
      return;
    }

    if (!state.skippedAt || state.nudgeShown) return;
    const skippedAt = Date.parse(state.skippedAt);
    if (Number.isNaN(skippedAt) || Date.now() - skippedAt < FIVE_DAYS_MS) {
      return;
    }

    promptOpen.current = true;
    Alert.alert(
      'Your data is not backed up',
      'If you uninstall the app or lose this phone, your training history and preferences may be lost. Create an account to protect them.',
      [
        {
          text: 'Not now',
          style: 'cancel',
          onPress: () => {
            void markAccountNudgeShown().finally(() => {
              promptOpen.current = false;
            });
          },
        },
        {
          text: 'Create account',
          onPress: () => {
            void markAccountNudgeShown().finally(() => {
              promptOpen.current = false;
              router.push({
                pathname: '/account/create-account',
                params: { intent: 'create', returnTo: '/' },
              } as unknown as Href);
            });
          },
        },
      ],
      { cancelable: false }
    );
  }, [isConfigured, isReady, user]);

  useEffect(() => {
    void checkPrompts();
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') void checkPrompts();
    });
    return () => subscription.remove();
  }, [checkPrompts]);

  return null;
}
