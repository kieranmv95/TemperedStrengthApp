import type { PersonalBestsStore } from '@/src/types/personalBests';
import { getPersonalBestsStore } from '@/src/utils/storage';
import { useFocusEffect } from 'expo-router';
import { useCallback, useRef, useState } from 'react';

/**
 * Personal bests for load breakdowns. Reloads on focus; call
 * `refreshPersonalBests` after saving a PB. A newer reload wins over
 * an older one that resolves late.
 */
export function usePersonalBestsStore(): {
  pbStore: PersonalBestsStore;
  refreshPersonalBests: () => Promise<void>;
} {
  const [pbStore, setPbStore] = useState<PersonalBestsStore>({});
  const pbRequest = useRef(0);

  const refreshPersonalBests = useCallback(async () => {
    const requestId = ++pbRequest.current;
    try {
      const store = await getPersonalBestsStore();
      if (requestId !== pbRequest.current) {
        return;
      }
      setPbStore(store);
    } catch (error) {
      console.error('Error loading personal bests for load breakdown:', error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void refreshPersonalBests();
    }, [refreshPersonalBests])
  );

  return { pbStore, refreshPersonalBests };
}
