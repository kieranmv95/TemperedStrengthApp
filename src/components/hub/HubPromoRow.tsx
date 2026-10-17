import { PressableCard, Skeleton } from '@/src/components/ds';
import { color, radius, space, typography } from '@/src/constants/tokens';
import { usePartnerListings } from '@/src/hooks/use-partner-listings';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

/** Discover ("Explore near you") isn't ready to ship yet — flip to true to re-enable. */
const DISCOVER_ENABLED = true;

const ICON_WELL_SIZE = 40;
const TILE_MIN_HEIGHT = 148;

type HubPromoCardProps = {
  icon: keyof typeof Ionicons.glyphMap;
  eyebrow: string;
  title: string;
  description: string;
  onPress: () => void;
  /** Spoken as the hint, describing where the card goes. */
  accessibilityLabel: string;
  isLoading?: boolean;
  /** `tile` is the compact half-width card used in two-up rows. */
  layout?: 'row' | 'tile';
};

export function HubPromoCard({
  icon,
  eyebrow,
  title,
  description,
  onPress,
  accessibilityLabel,
  isLoading = false,
  layout = 'row',
}: HubPromoCardProps) {
  const isTile = layout === 'tile';

  if (isLoading) {
    return (
      <Skeleton
        width="100%"
        height={isTile ? TILE_MIN_HEIGHT : 96}
        radius="md"
        accessibilityLabel={`Loading ${title}`}
        style={isTile ? styles.tileSlot : undefined}
      />
    );
  }

  return (
    <PressableCard
      onPress={onPress}
      accessibilityLabel={`${title}, ${description}`}
      accessibilityHint={accessibilityLabel}
      showChevron={!isTile}
      fill={isTile}
      style={isTile ? styles.tileSlot : undefined}
    >
      <View style={isTile ? styles.tileContent : styles.rowContent}>
        <View style={styles.iconWell}>
          <Ionicons name={icon} size={22} color={color.gold} />
        </View>
        <View style={styles.textBlock}>
          <Text style={styles.eyebrow}>{eyebrow}</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description} numberOfLines={isTile ? 2 : 3}>
            {description}
          </Text>
        </View>
      </View>
    </PressableCard>
  );
}

type HubPromoOfflineSlotProps = {
  label: string;
};

function HubPromoOfflineSlot({ label }: HubPromoOfflineSlotProps) {
  return (
    <View
      style={[styles.tileSlot, styles.offlineSlot]}
      accessible
      accessibilityLabel={`${label} unavailable, no connection`}
    >
      <Ionicons
        name="cloud-offline-outline"
        size={22}
        color={color.textSecondary}
      />
      <Text style={styles.offlineTitle}>No connection</Text>
      <Text style={styles.offlineLabel}>{label}</Text>
    </View>
  );
}

type HubPromoRowProps = {
  onPressShop: () => void;
  onPressDiscover: () => void;
  shopUnavailable?: boolean;
};

/** Two-up row: partner shop and Discover. */
export function HubPromoRow({
  onPressShop,
  onPressDiscover,
  shopUnavailable = false,
}: HubPromoRowProps) {
  const {
    gyms,
    clubs,
    coaches,
    isLoading: isDiscoverLoading,
  } = usePartnerListings();
  const hasDiscoverListings =
    gyms.length > 0 || clubs.length > 0 || coaches.length > 0;
  const showDiscoverCard =
    DISCOVER_ENABLED && (isDiscoverLoading || hasDiscoverListings);

  if (shopUnavailable && !showDiscoverCard) {
    return null;
  }

  return (
    <View style={styles.row}>
      {shopUnavailable ? (
        <HubPromoOfflineSlot label="Shop" />
      ) : (
        <HubPromoCard
          layout="tile"
          icon="cart-outline"
          eyebrow="Partner picks"
          title="Browse the shop"
          description="The best gear at exclusive prices."
          onPress={onPressShop}
          accessibilityLabel="Browse partner products"
        />
      )}
      {showDiscoverCard ? (
        <HubPromoCard
          layout="tile"
          icon="compass-outline"
          eyebrow="Discover"
          title="Explore near you"
          description="Find your next gym, club or PT in one place."
          onPress={onPressDiscover}
          accessibilityLabel="Browse gyms, clubs, and coaches"
          isLoading={isDiscoverLoading}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: space.sm,
  },
  tileSlot: {
    flex: 1,
  },
  rowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  tileContent: {
    gap: space.sm,
    minHeight: TILE_MIN_HEIGHT - space.md * 2,
  },
  iconWell: {
    width: ICON_WELL_SIZE,
    height: ICON_WELL_SIZE,
    borderRadius: radius.sm,
    backgroundColor: color.goldTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: {
    flex: 1,
    minWidth: 0,
    gap: space.xxs,
  },
  eyebrow: {
    ...typography.overline,
    color: color.textTertiary,
  },
  title: {
    ...typography.headline,
    color: color.textPrimary,
  },
  description: {
    ...typography.callout,
    color: color.textSecondary,
  },
  offlineSlot: {
    minHeight: TILE_MIN_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.xxs,
    padding: space.md,
    borderRadius: radius.md,
    backgroundColor: color.surface1,
  },
  offlineTitle: {
    ...typography.calloutStrong,
    color: color.textPrimary,
    textAlign: 'center',
  },
  offlineLabel: {
    ...typography.caption,
    color: color.textSecondary,
    textAlign: 'center',
  },
});
