import {
  resolveDiscoverLocation,
  type UserCoords,
} from '@/src/services/discoverLocationService';
import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';

export function useDiscoverLocation() {
  const [userCoords, setUserCoords] = useState<UserCoords | null>(null);
  const [isResolvingLocation, setIsResolvingLocation] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      setIsResolvingLocation(true);

      void (async () => {
        const coords = await resolveDiscoverLocation();
        if (!cancelled) {
          setUserCoords(coords);
          setIsResolvingLocation(false);
        }
      })();

      return () => {
        cancelled = true;
      };
    }, [])
  );

  return { userCoords, isResolvingLocation };
}
