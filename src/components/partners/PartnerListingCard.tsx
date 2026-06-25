import { Card, SmallChevron } from '@/src/components/ds';
import { Colors } from '@/src/constants/theme';
import {
  formatLocationSubtitle,
  isOpenNow,
} from '@/src/services/partnerApiService';
import {
  partnerListingHidesLocation,
  type PartnerKind,
  type PartnerListing,
} from '@/src/types/partner';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { partnerListingCardStyles as styles } from './partnerListingCardStyles';

const KIND_LABELS: Record<PartnerKind, string> = {
  gym: 'Gym',
  club: 'Club',
  coach: 'Coach',
};

const KIND_ICONS: Record<
  PartnerKind,
  keyof typeof Ionicons.glyphMap
> = {
  gym: 'barbell-outline',
  club: 'people-outline',
  coach: 'person-outline',
};

type PartnerListingCardProps = {
  listing: PartnerListing;
  isFavorite?: boolean;
  onPress: (listing: PartnerListing) => void;
  onToggleFavorite?: (listing: PartnerListing) => void;
  variant?: 'default' | 'compact';
};

export function PartnerListingCard({
  listing,
  isFavorite = false,
  onPress,
  onToggleFavorite,
  variant = 'default',
}: PartnerListingCardProps) {
  const isCompact = variant === 'compact';
  const canFavorite = Boolean(onToggleFavorite);
  const openStatus =
    listing.kind === 'coach' ? null : isOpenNow(listing.openingHours);
  const coachSpecialtiesSubtitle =
    listing.kind === 'coach' && listing.specialties.length > 0
      ? listing.specialties.slice(0, 2).join(', ')
      : null;
  const showsLocation = !partnerListingHidesLocation(listing);
  const locationSubtitle = showsLocation
    ? formatLocationSubtitle(listing.address)
    : null;

  const stopPropagation = (event: { stopPropagation: () => void }) => {
    event.stopPropagation();
  };

  const handleToggleFavorite = (event: { stopPropagation: () => void }) => {
    event.stopPropagation();
    onToggleFavorite?.(listing);
  };

  return (
    <Card
      onPress={() => onPress(listing)}
      accessibilityLabel={`Open ${listing.name}`}
      style={[styles.card, isCompact && styles.cardCompact]}
    >
      {!isCompact ? (
        <View style={styles.iconTile}>
          <Ionicons
            name={KIND_ICONS[listing.kind]}
            size={28}
            color={Colors.accent}
          />
        </View>
      ) : null}
      <View style={[styles.content, isCompact && styles.contentCompact]}>
        {!isCompact ? (
          <Text style={styles.kindLabel}>{KIND_LABELS[listing.kind]}</Text>
        ) : null}
        <Text style={styles.title} numberOfLines={isCompact ? 1 : 2}>
          {listing.name}
        </Text>
        {locationSubtitle || (isCompact && openStatus !== null) ? (
          <View style={styles.locationRow}>
            {locationSubtitle ? (
              <>
                <Ionicons
                  name="location-outline"
                  size={12}
                  color={Colors.textPlaceholder}
                />
                <Text style={styles.locationText} numberOfLines={1}>
                  {locationSubtitle}
                </Text>
              </>
            ) : null}
            {isCompact && openStatus !== null ? (
              <Text
                style={[
                  styles.compactStatus,
                  openStatus
                    ? styles.compactStatusOpen
                    : styles.compactStatusClosed,
                ]}
              >
                {openStatus ? 'Open now' : 'Closed'}
              </Text>
            ) : null}
          </View>
        ) : null}
        {coachSpecialtiesSubtitle ? (
          <Text style={styles.specialtiesText} numberOfLines={1}>
            {coachSpecialtiesSubtitle}
          </Text>
        ) : null}
        {!isCompact && listing.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {listing.description}
          </Text>
        ) : null}
        {!isCompact && openStatus !== null ? (
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
        ) : null}
      </View>
      <View style={styles.actions}>
        {canFavorite ? (
          <TouchableOpacity
            onPress={handleToggleFavorite}
            onPressIn={stopPropagation}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={isFavorite ? 'bookmark' : 'bookmark-outline'}
              size={22}
              color={isFavorite ? Colors.accent : Colors.textPlaceholder}
            />
          </TouchableOpacity>
        ) : null}
        <SmallChevron />
      </View>
    </Card>
  );
}
