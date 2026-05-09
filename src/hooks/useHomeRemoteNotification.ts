import {
  loadHomeRemoteNotificationBanner,
  type HomeRemoteNotificationBanner,
} from '@/src/services/sanityAppConfig';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';

/**
 * Loads the Sanity-driven home notification when the screen is focused. See
 * `loadHomeRemoteNotificationBanner` for caching behavior.
 */
export function useHomeRemoteNotification(): HomeRemoteNotificationBanner | null {
  const [banner, setBanner] = useState<HomeRemoteNotificationBanner | null>(
    null
  );

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      void (async () => {
        const next = await loadHomeRemoteNotificationBanner();
        if (!cancelled) {
          setBanner(next);
        }
      })();
      return () => {
        cancelled = true;
      };
    }, [])
  );

  return banner;
}
