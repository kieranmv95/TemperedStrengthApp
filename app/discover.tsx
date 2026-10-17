import { Skeleton, StandardLayout } from '@/src/components/ds';
import { DiscoverPartnersContent } from '@/src/components/partners/DiscoverPartnersContent';
import { color, space, typography } from '@/src/constants/tokens';
import { useDiscoverLocation } from '@/src/hooks/use-discover-location';
import { usePartnerListings } from '@/src/hooks/use-partner-listings';
import { sortPartnerListingsByDistance } from '@/src/services/partnerApiService';
import { posthogEventsNames } from '@/src/services/posthogEvents';
import type { PartnerListing } from '@/src/types/partner';
import { partnerFavoriteKey } from '@/src/types/partner';
import { getFavoritePartners, setFavoritePartners } from '@/src/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, router } from 'expo-router';
import { usePostHog } from 'posthog-react-native';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const SKELETON_CARD_HEIGHT = 112;

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
    <StandardLayout
      title="Discover"
      onBackPress={() => router.back()}
      disableScroll
      edgeToEdgeBody
    >
      <StandardLayout.Body>
        {isLoadingFavorites && !hasListings ? (
          <View style={styles.loading}>
            <Skeleton
              width="100%"
              height={SKELETON_CARD_HEIGHT}
              radius="md"
              accessibilityLabel="Loading listings"
            />
            <Skeleton width="100%" height={SKELETON_CARD_HEIGHT} radius="md" />
            <Skeleton width="100%" height={SKELETON_CARD_HEIGHT} radius="md" />
          </View>
        ) : !hasListings ? (
          <View style={styles.centeredState}>
            <Ionicons
              name="compass-outline"
              size={48}
              color={color.textTertiary}
            />
            <Text style={styles.emptyTitle} accessibilityRole="header">
              Nothing to discover yet
            </Text>
            <Text style={styles.emptyDescription}>
              Approved gyms, clubs, and coaches will appear here when they join
              the network.
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
      </StandardLayout.Body>
    </StandardLayout>
  );
}

const styles = StyleSheet.create({
  loading: {
    gap: space.sm,
    paddingHorizontal: space.md,
    paddingTop: space.sm,
  },
  centeredState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.xxl,
    gap: space.xs,
  },
  emptyTitle: {
    ...typography.title2,
    color: color.textPrimary,
    textAlign: 'center',
  },
  emptyDescription: {
    ...typography.callout,
    color: color.textSecondary,
    textAlign: 'center',
  },
});
