import { AppSafeAreaView, AppScrollView } from '@/src/components/AppSafeAreaView';
import { YoutubeEmbed } from '@/src/components/exercise/YoutubeEmbed';
import { PartnerMapPreview } from '@/src/components/partners/PartnerMapPreview';
import { partnerDetailStyles as styles } from '@/src/components/partners/partnerDetailStyles';
import { Pill } from '@/src/components/pill';
import { Colors } from '@/src/constants/theme';
import {
  buildPartnerMapsUrl,
  fetchAllPartnerListings,
  formatAddressMultiLine,
  formatServiceRadius,
  getCachedPartnerListing,
  getPartnerListingCoords,
  isOpenNow,
  orderedOpeningHours,
} from '@/src/services/partnerApiService';
import { posthogEventsNames } from '@/src/services/posthogEvents';
import type { PartnerKind, PartnerListing } from '@/src/types/partner';
import {
  gymHasVideo,
  gymShowsFocusAreas,
  partnerFavoriteKey,
  partnerListingHidesLocation,
  partnerListingOpeningHours,
} from '@/src/types/partner';
import {
  getFavoritePartners,
  setFavoritePartners,
} from '@/src/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { router, useLocalSearchParams } from 'expo-router';
import { usePostHog } from 'posthog-react-native';
import React, { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const KIND_LABELS: Record<PartnerKind, string> = {
  gym: 'Gym',
  club: 'Club',
  coach: 'Coach',
};

function isPartnerKind(value: string | undefined): value is PartnerKind {
  return value === 'gym' || value === 'club' || value === 'coach';
}

export default function PartnerDetailScreen() {
  const { kind, id } = useLocalSearchParams<{ kind: string; id: string }>();
  const posthog = usePostHog();
  const [listing, setListing] = useState<PartnerListing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const favoritesRef = useRef<string[]>([]);
  const persistChainRef = useRef<Promise<void>>(Promise.resolve());

  const loadListing = useCallback(async () => {
    if (!isPartnerKind(kind) || !id) {
      setListing(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    let resolved = getCachedPartnerListing(kind, id);
    if (!resolved) {
      await fetchAllPartnerListings({ force: true });
      resolved = getCachedPartnerListing(kind, id);
    }

    setListing(resolved);
    setIsLoading(false);

    if (resolved) {
      posthog.capture(posthogEventsNames.content.partnerView, {
        partner_kind: resolved.kind,
        partner_id: resolved.id,
        partner_name: resolved.name,
      });
    }
  }, [id, kind, posthog]);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      void (async () => {
        try {
          const favorites = await getFavoritePartners();
          if (cancelled) {
            return;
          }
          favoritesRef.current = favorites;
          if (isPartnerKind(kind) && id) {
            setIsFavorite(
              favorites.includes(partnerFavoriteKey(kind, id))
            );
          }
        } catch (error) {
          console.error('Failed to load favorite partners:', error);
        }

        if (!cancelled) {
          await loadListing();
        }
      })();

      return () => {
        cancelled = true;
      };
    }, [id, kind, loadListing])
  );

  const handleToggleFavorite = () => {
    if (!listing) {
      return;
    }

    const key = partnerFavoriteKey(listing.kind, listing.id);
    const prev = favoritesRef.current;
    const isAdd = !prev.includes(key);
    const next = isAdd ? [...prev, key] : prev.filter((item) => item !== key);

    posthog.capture(posthogEventsNames.content.partnerFavourite, {
      partner_kind: listing.kind,
      partner_id: listing.id,
      action: isAdd ? 'add' : 'remove',
    });

    favoritesRef.current = next;
    setIsFavorite(isAdd);

    persistChainRef.current = persistChainRef.current
      .then(() => setFavoritePartners(next))
      .catch((error) => {
        console.error('Failed to persist favorite partners:', error);
      });
  };

  const handleOpenLink = (url: string, label: string) => {
    if (!listing) {
      return;
    }
    posthog.capture(posthogEventsNames.content.partnerLinkPressed, {
      partner_kind: listing.kind,
      partner_id: listing.id,
      link_label: label,
    });
    Linking.openURL(url).catch((error) => {
      console.error('Failed to open partner link:', error);
    });
  };

  const handleOpenInMaps = () => {
    if (!listing) {
      return;
    }
    const url = buildPartnerMapsUrl(listing);
    if (!url) {
      return;
    }
    handleOpenLink(url, 'View on map');
  };

  if (isLoading) {
    return (
      <AppSafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerBackButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.errorContainer}>
          <ActivityIndicator size="large" color={Colors.accent} />
        </View>
      </AppSafeAreaView>
    );
  }

  if (!listing || !isPartnerKind(kind)) {
    return (
      <AppSafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerBackButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.errorContainer}>
          <Ionicons
            name="business-outline"
            size={64}
            color={Colors.backgroundSubtle}
          />
          <Text style={styles.errorText}>Listing not found</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </AppSafeAreaView>
    );
  }

  const openingHours = partnerListingOpeningHours(listing);
  const openStatus = openingHours ? isOpenNow(openingHours) : null;
  const mapCoords = getPartnerListingCoords(listing);

  return (
    <AppSafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBackButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {KIND_LABELS[listing.kind]}
        </Text>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={handleToggleFavorite}
          accessibilityLabel={
            isFavorite ? 'Remove from saved' : 'Save listing'
          }
        >
          <Ionicons
            name={isFavorite ? 'bookmark' : 'bookmark-outline'}
            size={24}
            color={isFavorite ? Colors.accent : Colors.textPrimary}
          />
        </TouchableOpacity>
      </View>

      <AppScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.kindBadge}>{KIND_LABELS[listing.kind]}</Text>
        <Text style={styles.title}>{listing.name}</Text>

        {listing.kind === 'gym' && gymShowsFocusAreas(listing) ? (
          <View style={styles.focusAreasRow}>
            {listing.focusAreas.map((focusArea) => (
              <Pill
                key={focusArea}
                label={focusArea}
                isActive={false}
                disabled
                onPress={() => { }}
              />
            ))}
          </View>
        ) : null}

        {listing.links.length > 0 ? (
          <View style={styles.linksSection}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.linksScrollContent}
            >
              {listing.links.map((link) => (
                <TouchableOpacity
                  key={`${link.label}-${link.url}`}
                  style={styles.linkChip}
                  onPress={() => handleOpenLink(link.url, link.label)}
                  accessibilityLabel={`Open ${link.label}`}
                >
                  <Text style={styles.linkChipLabel} numberOfLines={1}>
                    {link.label}
                  </Text>
                  <Ionicons
                    name="open-outline"
                    size={16}
                    color={Colors.accent}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        ) : null}

        {listing.description ? (
          <View style={styles.descriptionBlock}>
            <Text style={styles.description}>{listing.description}</Text>
          </View>
        ) : null}

        {listing.kind === 'gym' && gymHasVideo(listing) ? (
          <View style={styles.videoSection}>
            <YoutubeEmbed
              youtubeId={listing.videoId}
              accessibilityLabel={`Tour video for ${listing.name}`}
            />
          </View>
        ) : null}

        {openStatus !== null ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Status</Text>
            <View
              style={[
                styles.statusBadge,
                openStatus ? styles.statusBadgeOpen : styles.statusBadgeClosed,
              ]}
            >
              <Text
                style={[
                  styles.statusBadgeText,
                  openStatus
                    ? styles.statusBadgeTextOpen
                    : styles.statusBadgeTextClosed,
                ]}
              >
                {openStatus ? 'Open now' : 'Closed'}
              </Text>
            </View>
          </View>
        ) : null}

        {!partnerListingHidesLocation(listing) ? (
          <View style={styles.section}>
            <View style={styles.addressBlock}>
              <Text style={styles.sectionTitle}>Address</Text>
              <Text style={styles.addressBody}>
                {formatAddressMultiLine(listing.address)}
              </Text>
              {mapCoords ? (
                <PartnerMapPreview
                  latitude={mapCoords.latitude}
                  longitude={mapCoords.longitude}
                  onPress={handleOpenInMaps}
                  accessibilityLabel={`View ${listing.name} on map`}
                />
              ) : null}
            </View>
          </View>
        ) : null}

        {listing.kind === 'coach' && listing.specialties.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Specialties</Text>
            <View style={styles.tagsRow}>
              {listing.specialties.map((specialty) => (
                <Pill
                  key={specialty}
                  label={specialty}
                  isActive={false}
                  disabled
                  onPress={() => { }}
                />
              ))}
            </View>
          </View>
        ) : null}

        {listing.kind === 'coach' && listing.radiusServedKm != null ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Service area</Text>
            <Text style={styles.sectionBody}>
              {formatServiceRadius(listing.radiusServedKm)}
            </Text>
          </View>
        ) : null}

        {openingHours ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Opening hours</Text>
            {orderedOpeningHours(openingHours).map((row) => (
              <View key={row.day} style={styles.hoursRow}>
                <Text style={styles.hoursDay}>{row.label}</Text>
                <Text style={styles.hoursValue}>{row.hours}</Text>
              </View>
            ))}
          </View>
        ) : null}
      </AppScrollView>
    </AppSafeAreaView>
  );
}
