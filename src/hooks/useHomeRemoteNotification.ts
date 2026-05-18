import {
  loadHomeRemoteNotificationBanner,
  type HomeRemoteNotificationBanner,
} from '@/src/services/sanityAppConfig';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';

/**
 * Loads the Sanity-driven home notification when the screen is focused. See
 * `loadHomeRemoteNotificationBanner` for caching behavior (TTL disabled in __DEV__).
 */
export function useHomeRemoteNotification(): {
  banner: HomeRemoteNotificationBanner | null;
  refetch: () => Promise<HomeRemoteNotificationBanner | null>;
  isRefetching: boolean;
} {
  const [banner, setBanner] = useState<HomeRemoteNotificationBanner | null>(
    null
  );
  const [isRefetching, setIsRefetching] = useState(false);

  const fetchBanner = useCallback(async (forceRefresh: boolean) => {
    return loadHomeRemoteNotificationBanner(
      forceRefresh ? { forceRefresh: true } : undefined
    );
  }, []);

  const refetch = useCallback(async () => {
    setIsRefetching(true);
    try {
      const next = await fetchBanner(true);
      setBanner(next);
      return next;
    } finally {
      setIsRefetching(false);
    }
  }, [fetchBanner]);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      void (async () => {
        const next = await fetchBanner(false);
        if (!cancelled) {
          setBanner(next);
        }
      })();
      return () => {
        cancelled = true;
      };
    }, [fetchBanner])
  );

  return { banner, refetch, isRefetching };
}
