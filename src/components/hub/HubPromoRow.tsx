import { PressableCard, Skeleton } from '@/src/components/ds';
import { color, radius, space, typography } from '@/src/constants/tokens';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

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

type HubPromoRowProps = {
  onPressShop: () => void;
  shopUnavailable?: boolean;
};

/** Partner shop entry on Explore. Hidden when the network is down. */
export function HubPromoRow({
  onPressShop,
  shopUnavailable = false,
}: HubPromoRowProps) {
  if (shopUnavailable) {
    return null;
  }

  return (
    <HubPromoCard
      icon="cart-outline"
      eyebrow="Partner picks"
      title="Browse the shop"
      description="The best gear at exclusive prices."
      onPress={onPressShop}
      accessibilityLabel="Browse partner products"
    />
  );
}

const styles = StyleSheet.create({
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
});
