import { DiscoverPartnersContent } from '@/src/components/partners/DiscoverPartnersContent';
import { Colors, FontSize, Spacing } from '@/src/constants/theme';
import { useDiscoverLocation } from '@/src/hooks/use-discover-location';
import { usePartnerListings } from '@/src/hooks/use-partner-listings';
import { sortPartnerListingsByDistance } from '@/src/services/partnerApiService';
import { posthogEventsNames } from '@/src/services/posthogEvents';
import type { PartnerListing } from '@/src/types/partner';
import { partnerFavoriteKey } from '@/src/types/partner';
import {
  getFavoritePartners,
  setFavoritePartners,
} from '@/src/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { usePostHog } from 'posthog-react-native';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { AppSafeAreaView } from '@/src/components/AppSafeAreaView';

function sortListingsByDistance<T extends PartnerListing>(
  listings: T[],
  userCoords: { latitude: number; longitude: number } | null
): T[] {
  if (!userCoords) {
    return listings;
  }
  return sortPartnerListingsByDistance(listings, userCoords) as T[];
}

export default function DiscoverScreen() {
  const posthog = usePostHog();
  const { gyms, clubs, coaches } = usePartnerListings();
  const { userCoords } = useDiscoverLocation();
  const [partnerFavorites, setPartnerFavorites] = useState<string[]>([]);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(true);
  const partnerFavoritesRef = useRef<string[]>([]);
  const partnerPersistChainRef = useRef<Promise<void>>(Promise.resolve());

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      void (async () => {
        setIsLoadingFavorites(true);
        try {
          const favorites = await getFavoritePartners();
          if (cancelled) {
            return;
          }
          partnerFavoritesRef.current = favorites;
          setPartnerFavorites(favorites);
        } catch (error) {
          console.error('Failed to load favorite partners:', error);
        } finally {
          if (!cancelled) {
            setIsLoadingFavorites(false);
          }
        }
      })();

      return () => {
        cancelled = true;
      };
    }, [])
  );

  const gymListings = useMemo(
    () =>
      sortListingsByDistance(
        gyms.map((gym) => ({ ...gym, kind: 'gym' as const })),
        userCoords
      ),
    [gyms, userCoords]
  );
  const clubListings = useMemo(
    () =>
      sortListingsByDistance(
        clubs.map((club) => ({ ...club, kind: 'club' as const })),
        userCoords
      ),
    [clubs, userCoords]
  );
  const coachListings = useMemo(
    () =>
      sortListingsByDistance(
        coaches.map((coach) => ({ ...coach, kind: 'coach' as const })),
        userCoords
      ),
    [coaches, userCoords]
  );
  const allPartnerListings = useMemo(
    () => [...gymListings, ...clubListings, ...coachListings],
    [gymListings, clubListings, coachListings]
  );
  const savedPartnerListings = useMemo(
    () =>
      sortListingsByDistance(
        allPartnerListings.filter((listing) =>
          partnerFavorites.includes(
            partnerFavoriteKey(listing.kind, listing.id)
          )
        ),
        userCoords
      ),
    [allPartnerListings, partnerFavorites, userCoords]
  );

  const hasListings = allPartnerListings.length > 0;

  const handleTogglePartnerFavorite = useCallback(
    (listing: PartnerListing) => {
      const key = partnerFavoriteKey(listing.kind, listing.id);
      const prev = partnerFavoritesRef.current;
      const isAdd = !prev.includes(key);
      const next = isAdd ? [...prev, key] : prev.filter((item) => item !== key);

      posthog.capture(posthogEventsNames.content.partnerFavourite, {
        partner_kind: listing.kind,
        partner_id: listing.id,
        action: isAdd ? 'add' : 'remove',
      });

      partnerFavoritesRef.current = next;
      setPartnerFavorites(next);

      partnerPersistChainRef.current = partnerPersistChainRef.current
        .then(() => setFavoritePartners(next))
        .catch((error) => {
          console.error('Failed to persist favorite partners:', error);
        });
    },
    [posthog]
  );

  const handlePartnerPress = useCallback((listing: PartnerListing) => {
    router.push({
      pathname: '/partner/[kind]/[id]',
      params: { kind: listing.kind, id: listing.id },
    });
  }, []);

  return (
    <AppSafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBackButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Discover</Text>
        <View style={styles.headerSpacer} />
      </View>

      {isLoadingFavorites && !hasListings ? (
        <View style={styles.centeredState}>
          <ActivityIndicator size="large" color={Colors.accent} />
        </View>
      ) : !hasListings ? (
        <View style={styles.centeredState}>
          <Ionicons
            name="compass-outline"
            size={64}
            color={Colors.backgroundSubtle}
          />
          <Text style={styles.emptyTitle}>Nothing to discover yet</Text>
          <Text style={styles.emptyDescription}>
            Approved gyms, clubs, and coaches will appear here when they join the
            network.
          </Text>
        </View>
      ) : (
        <DiscoverPartnersContent
          gymListings={gymListings}
          clubListings={clubListings}
          coachListings={coachListings}
          savedListings={savedPartnerListings}
          favoriteKeys={partnerFavorites}
          userCoords={userCoords}
          onPressListing={handlePartnerPress}
          onToggleFavorite={handleTogglePartnerFavorite}
        />
      )}
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundScreen,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.backgroundElevated,
  },
  headerBackButton: {
    padding: Spacing.sm,
    marginLeft: -Spacing.sm,
  },
  headerTitle: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: FontSize.xl,
    fontWeight: '700',
    textAlign: 'center',
    marginHorizontal: Spacing.md,
  },
  headerSpacer: {
    width: 40,
  },
  centeredState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.section,
    gap: Spacing.lg,
  },
  emptyTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.displaySm,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptyDescription: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    lineHeight: 22,
    textAlign: 'center',
  },
});
