import { AppSafeAreaView } from '@/src/components/AppSafeAreaView';
import { PartnerDiscoverMap } from '@/src/components/partners/PartnerDiscoverMap';
import { Colors, FontSize, Spacing } from '@/src/constants/theme';
import { useDiscoverLocation } from '@/src/hooks/use-discover-location';
import { usePartnerListings } from '@/src/hooks/use-partner-listings';
import { getPartnerMapPoints } from '@/src/services/partnerApiService';
import type { PartnerKind, PartnerListing } from '@/src/types/partner';
import { partnerFavoriteKey } from '@/src/types/partner';
import { getFavoritePartners } from '@/src/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const KIND_LABELS: Record<PartnerKind | 'all' | 'saved', string> = {
  all: 'Discover',
  saved: 'Saved',
  gym: 'Gyms',
  club: 'Clubs',
  coach: 'Coaches',
};

function isPartnerKind(value: string | undefined): value is PartnerKind {
  return value === 'gym' || value === 'club' || value === 'coach';
}

function isMapKind(
  value: string | undefined
): value is PartnerKind | 'all' | 'saved' {
  return value === 'all' || value === 'saved' || isPartnerKind(value);
}

export default function DiscoverMapScreen() {
  const { kind: kindParam } = useLocalSearchParams<{ kind?: string }>();
  const kind = isMapKind(kindParam) ? kindParam : 'all';
  const { gyms, clubs, coaches, isLoading } = usePartnerListings();
  const { userCoords } = useDiscoverLocation();
  const [favoriteKeys, setFavoriteKeys] = useState<string[]>([]);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      void (async () => {
        try {
          const favorites = await getFavoritePartners();
          if (!cancelled) {
            setFavoriteKeys(favorites);
          }
        } catch (error) {
          console.error('Failed to load favorite partners for map:', error);
        }
      })();

      return () => {
        cancelled = true;
      };
    }, [])
  );

  const allListings = useMemo(
    (): PartnerListing[] => [
      ...gyms.map((gym) => ({ ...gym, kind: 'gym' as const })),
      ...clubs.map((club) => ({ ...club, kind: 'club' as const })),
      ...coaches.map((coach) => ({ ...coach, kind: 'coach' as const })),
    ],
    [clubs, coaches, gyms]
  );

  const listings = useMemo((): PartnerListing[] => {
    if (kind === 'saved') {
      return allListings.filter((listing) =>
        favoriteKeys.includes(partnerFavoriteKey(listing.kind, listing.id))
      );
    }
    if (kind === 'gym') {
      return gyms.map((gym) => ({ ...gym, kind: 'gym' }));
    }
    if (kind === 'coach') {
      return coaches.map((coach) => ({ ...coach, kind: 'coach' }));
    }
    if (kind === 'club') {
      return clubs.map((club) => ({ ...club, kind: 'club' }));
    }

    return allListings;
  }, [allListings, clubs, coaches, favoriteKeys, gyms, kind]);

  const mapPoints = useMemo(() => getPartnerMapPoints(listings), [listings]);

  const handlePressListing = useCallback((listingId: string, listingKind: PartnerKind) => {
    router.push({
      pathname: '/partner/[kind]/[id]',
      params: { kind: listingKind, id: listingId },
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
        <Text style={styles.headerTitle}>{KIND_LABELS[kind]} on map</Text>
        <View style={styles.headerSpacer} />
      </View>

      {isLoading ? (
        <View style={styles.centeredState}>
          <ActivityIndicator size="large" color={Colors.accent} />
        </View>
      ) : (
        <PartnerDiscoverMap
          points={mapPoints}
          userCoords={userCoords}
          onPressListing={handlePressListing}
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
  },
});
