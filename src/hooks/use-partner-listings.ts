import { fetchAllPartnerListings } from '@/src/services/partnerApiService';
import type {
  PublicClubListing,
  PublicCoachListing,
  PublicGymListing,
} from '@/src/types/partner';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

export function usePartnerListings() {
  const [gyms, setGyms] = useState<PublicGymListing[]>([]);
  const [clubs, setClubs] = useState<PublicClubListing[]>([]);
  const [coaches, setCoaches] = useState<PublicCoachListing[]>([]);

  const loadPartners = useCallback(async (force = false) => {
    const data = await fetchAllPartnerListings(
      force ? { force: true } : undefined
    );
    setGyms(data.gyms);
    setClubs(data.clubs);
    setCoaches(data.coaches);
  }, []);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      void (async () => {
        const data = await fetchAllPartnerListings();
        if (cancelled) {
          return;
        }
        setGyms(data.gyms);
        setClubs(data.clubs);
        setCoaches(data.coaches);
      })();

      const handleAppState = (state: AppStateStatus) => {
        if (state === 'active') {
          void loadPartners(true);
        }
      };

      const subscription = AppState.addEventListener(
        'change',
        handleAppState
      );

      return () => {
        cancelled = true;
        subscription.remove();
      };
    }, [loadPartners])
  );

  return { gyms, clubs, coaches };
}
