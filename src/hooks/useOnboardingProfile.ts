import type { OnboardingProfile } from '@/src/types/onboarding';
import { getOnboardingProfile } from '@/src/utils/storage';
import { useSyncManager } from '@/src/hooks/sync-manager-context';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';

export function useOnboardingProfile(): {
  profile: OnboardingProfile | null;
  isLoading: boolean;
  refresh: () => Promise<void>;
} {
  const { dataRevision } = useSyncManager();
  const [profile, setProfile] = useState<OnboardingProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refresh = useCallback(async () => {
    try {
      const next = await getOnboardingProfile();
      setProfile(next);
    } catch (error) {
      console.error('Error loading onboarding profile:', error);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      refresh();
    }, [refresh])
  );

  useEffect(() => {
    if (dataRevision === 0) return;
    void refresh();
  }, [dataRevision, refresh]);

  return { profile, isLoading, refresh };
}
