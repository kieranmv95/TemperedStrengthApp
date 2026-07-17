import {
  loadLiveCompetition,
  peekLiveCompetitionCache,
  peekStaleLiveCompetitionCache,
  type CompetitionFetchEnvironment,
} from '@/src/services/liveCompetitionService';
import type { LiveCompetition } from '@/src/types/live-competition';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';

// Switch between test and production competition data from temperedstrength.com.
const COMPETITION_FETCH_ENVIRONMENT: CompetitionFetchEnvironment = 'test';

function readCachedCompetition(): LiveCompetition | null | undefined {
  return peekStaleLiveCompetitionCache(COMPETITION_FETCH_ENVIRONMENT);
}

/**
 * Loads the active live competition when the screen is focused.
 * Uses a short shared cache to avoid banner flashes between visits.
 */
export function useLiveCompetition(): {
  competition: LiveCompetition | null;
  isLoading: boolean;
  isRefetching: boolean;
  refetch: () => Promise<LiveCompetition | null>;
} {
  const [competition, setCompetition] = useState<LiveCompetition | null>(() => {
    const cached = readCachedCompetition();
    return cached === undefined ? null : cached;
  });
  const [isLoading, setIsLoading] = useState(
    () => readCachedCompetition() === undefined
  );
  const [isRefetching, setIsRefetching] = useState(false);

  const refetch = useCallback(async () => {
    setIsRefetching(true);
    try {
      const next = await loadLiveCompetition(COMPETITION_FETCH_ENVIRONMENT, {
        forceRefresh: true,
      });
      setCompetition(next);
      return next;
    } finally {
      setIsRefetching(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      const fresh = peekLiveCompetitionCache(COMPETITION_FETCH_ENVIRONMENT);
      if (fresh !== undefined) {
        setCompetition(fresh);
        setIsLoading(false);
        return;
      }

      const stale = peekStaleLiveCompetitionCache(
        COMPETITION_FETCH_ENVIRONMENT
      );
      if (stale !== undefined) {
        setCompetition(stale);
        setIsLoading(false);
      }

      void (async () => {
        if (stale === undefined) {
          setIsLoading(true);
        }

        try {
          const next = await loadLiveCompetition(COMPETITION_FETCH_ENVIRONMENT);
          if (!cancelled) {
            setCompetition(next);
          }
        } finally {
          if (!cancelled) {
            setIsLoading(false);
          }
        }
      })();

      return () => {
        cancelled = true;
      };
    }, [])
  );

  return { competition, isLoading, isRefetching, refetch };
}
