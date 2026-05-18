import {
  loadHomeSponsorAds,
  type HomeSponsorAd,
} from '@/src/services/sanitySponsorAds';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';

/**
 * Loads Sanity-driven home sponsor ads when the screen is focused. See
 * `loadHomeSponsorAds` for caching behavior (TTL disabled in __DEV__).
 */
export function useHomeSponsorAds(): {
  ads: HomeSponsorAd[];
  refetch: () => Promise<HomeSponsorAd[]>;
  isRefetching: boolean;
} {
  const [ads, setAds] = useState<HomeSponsorAd[]>([]);
  const [isRefetching, setIsRefetching] = useState(false);

  const fetchAds = useCallback(async (forceRefresh: boolean) => {
    return loadHomeSponsorAds(forceRefresh ? { forceRefresh: true } : undefined);
  }, []);

  const refetch = useCallback(async () => {
    setIsRefetching(true);
    try {
      const next = await fetchAds(true);
      setAds(next);
      return next;
    } finally {
      setIsRefetching(false);
    }
  }, [fetchAds]);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      void (async () => {
        const next = await fetchAds(false);
        if (!cancelled) {
          setAds(next);
        }
      })();
      return () => {
        cancelled = true;
      };
    }, [fetchAds])
  );

  return { ads, refetch, isRefetching };
}
