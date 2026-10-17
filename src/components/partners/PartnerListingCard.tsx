import { Badge, LoadingImage, PressableCard } from '@/src/components/ds';
import { color } from '@/src/constants/tokens';
import {
  formatLocationSubtitle,
  formatPartnerDistanceKm,
  getPartnerListingDistanceKm,
  isOpenNow,
} from '@/src/services/partnerApiService';
import type { UserCoords } from '@/src/services/discoverLocationService';
import {
  partnerListingHidesLocation,
  partnerListingOpeningHours,
  type PartnerKind,
  type PartnerListing,
} from '@/src/types/partner';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { partnerListingCardStyles as styles } from './partnerListingCardStyles';

const KIND_LABELS: Record<PartnerKind, string> = {
  gym: 'Gym',
  club: 'Club',
  coach: 'Coach',
};

const KIND_ICONS: Record<PartnerKind, keyof typeof Ionicons.glyphMap> = {
  gym: 'barbell-outline',
  club: 'people-outline',
  coach: 'person-outline',
};

type PartnerListingLeadMediaProps = {
  listing: PartnerListing;
};

function PartnerListingLeadMedia({ listing }: PartnerListingLeadMediaProps) {
  if (listing.imageUrl) {
    return (
      <LoadingImage source={{ uri: listing.imageUrl }} style={styles.thumb} />
    );
  }

  return (
    <View style={styles.iconTile}>
      <Ionicons
        name={KIND_ICONS[listing.kind]}
        size={26}
        color={color.textSecondary}
      />
    </View>
  );
}

type OpenStatusBadgeProps = {
  isOpen: boolean;
};

function OpenStatusBadge({ isOpen }: OpenStatusBadgeProps) {
  return (
    <Badge
      label={isOpen ? 'Open now' : 'Closed'}
      tone={isOpen ? 'success' : 'danger'}
    />
  );
}

type PartnerListingCardProps = {
  listing: PartnerListing;
  isFavorite?: boolean;
  userCoords?: UserCoords | null;
  onPress: (listing: PartnerListing) => void;
  onToggleFavorite?: (listing: PartnerListing) => void;
  variant?: 'default' | 'compact';
};

export function PartnerListingCard({
  listing,
  isFavorite = false,
  userCoords = null,
  onPress,
  onToggleFavorite,
  variant = 'default',
}: PartnerListingCardProps) {
  const isCompact = variant === 'compact';
  const canFavorite = Boolean(onToggleFavorite);
  const openingHours = partnerListingOpeningHours(listing);
  const openStatus = openingHours ? isOpenNow(openingHours) : null;
  const tagsSubtitle =
    listing.kind === 'coach' && listing.specialties.length > 0
      ? listing.specialties.slice(0, 2).join(', ')
      : listing.kind === 'gym' && listing.focusAreas.length > 0
        ? listing.focusAreas.slice(0, 2).join(', ')
        : null;
  const showsLocation = !partnerListingHidesLocation(listing);
  const locationSubtitle = showsLocation
    ? formatLocationSubtitle(listing.address)
    : null;
  const distanceKm = userCoords
    ? getPartnerListingDistanceKm(listing, userCoords)
    : null;
  const distanceLabel =
    distanceKm != null ? formatPartnerDistanceKm(distanceKm) : null;
  const showMetaRow =
    !!locationSubtitle || !!distanceLabel || (isCompact && openStatus !== null);

  const accessibilityLabel = [
    listing.name,
    KIND_LABELS[listing.kind],
    locationSubtitle,
    distanceLabel ? `${distanceLabel} away` : null,
    openStatus === null ? null : openStatus ? 'Open now' : 'Closed',
    tagsSubtitle,
  ]
    .filter((part): part is string => !!part)
    .join(', ');

  return (
    <View style={[styles.container, isCompact && styles.containerCompact]}>
      <PressableCard
        onPress={() => onPress(listing)}
        showChevron={!canFavorite}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint="Opens the listing"
      >
        <View style={[styles.row, canFavorite && styles.rowWithFavorite]}>
          {!isCompact ? <PartnerListingLeadMedia listing={listing} /> : null}
          <View style={styles.content}>
            {!isCompact ? (
              <Text style={styles.kindLabel}>{KIND_LABELS[listing.kind]}</Text>
            ) : null}
            <Text style={styles.title}>{listing.name}</Text>
            {showMetaRow ? (
              <View style={styles.metaRow}>
                {locationSubtitle || distanceLabel ? (
                  <View style={styles.locationItem}>
                    <Ionicons
                      name="location-outline"
                      size={14}
                      color={color.textSecondary}
                    />
                    {locationSubtitle ? (
                      <Text style={styles.locationText}>
                        {locationSubtitle}
                      </Text>
                    ) : null}
                  </View>
                ) : null}
                {distanceLabel ? (
                  <Text style={styles.distanceText}>{distanceLabel}</Text>
                ) : null}
                {isCompact && openStatus !== null ? (
                  <OpenStatusBadge isOpen={openStatus} />
                ) : null}
              </View>
            ) : null}
            {tagsSubtitle ? (
              <Text style={styles.specialtiesText}>{tagsSubtitle}</Text>
            ) : null}
            {!isCompact && listing.description ? (
              <Text style={styles.description} numberOfLines={2}>
                {listing.description}
              </Text>
            ) : null}
            {!isCompact && openStatus !== null ? (
              <View style={styles.statusRow}>
                <OpenStatusBadge isOpen={openStatus} />
              </View>
            ) : null}
          </View>
        </View>
      </PressableCard>
      {canFavorite ? (
        <Pressable
          onPress={() => onToggleFavorite?.(listing)}
          style={styles.favoriteButton}
          accessibilityRole="button"
          accessibilityLabel={`Save ${listing.name}`}
          accessibilityState={{ selected: isFavorite }}
        >
          <Ionicons
            name={isFavorite ? 'bookmark' : 'bookmark-outline'}
            size={22}
            color={isFavorite ? color.gold : color.textSecondary}
          />
        </Pressable>
      ) : null}
    </View>
  );
}
