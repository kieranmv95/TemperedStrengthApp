import { Card, SmallChevron } from '@/src/components/ds';
import { BorderRadius, Colors, FontSize, Spacing } from '@/src/constants/theme';
import { usePartnerListings } from '@/src/hooks/use-partner-listings';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type HubPromoCardProps = {
  icon: keyof typeof Ionicons.glyphMap;
  eyebrow: string;
  title: string;
  description: string;
  onPress: () => void;
  accessibilityLabel: string;
};

function HubPromoCard({
  icon,
  eyebrow,
  title,
  description,
  onPress,
  accessibilityLabel,
}: HubPromoCardProps) {
  return (
    <Card
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      style={styles.promoCard}
    >
      <View style={styles.promoTopRow}>
        <View style={styles.visualTile}>
          <Ionicons name={icon} size={22} color={Colors.accent} />
        </View>
        <SmallChevron />
      </View>
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </Card>
  );
}

type HubPromoOfflineSlotProps = {
  label: string;
};

function HubPromoOfflineSlot({ label }: HubPromoOfflineSlotProps) {
  return (
    <View style={[styles.promoCard, styles.offlineSlot]}>
      <Ionicons name="wifi-outline" size={22} color={Colors.backgroundSubtle} />
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

export function HubPromoRow({
  onPressShop,
  onPressDiscover,
  shopUnavailable = false,
}: HubPromoRowProps) {
  const { gyms, clubs, coaches } = usePartnerListings();
  const hasDiscoverListings =
    gyms.length > 0 || clubs.length > 0 || coaches.length > 0;

  if (shopUnavailable && !hasDiscoverListings) {
    return null;
  }

  return (
    <View style={styles.row}>
      {shopUnavailable ? (
        <HubPromoOfflineSlot label="Shop" />
      ) : (
        <HubPromoCard
          icon="cart-outline"
          eyebrow="Partner picks"
          title="Browse the shop"
          description="The best gear at exclusive prices."
          onPress={onPressShop}
          accessibilityLabel="Browse partner products"
        />
      )}
      {hasDiscoverListings ? (
        <HubPromoCard
          icon="compass-outline"
          eyebrow="Discover"
          title="Explore near you"
          description="Find your next gym, club or PT in one place."
          onPress={onPressDiscover}
          accessibilityLabel="Browse gyms, clubs, and coaches"
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  promoCard: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'column',
    alignItems: 'stretch',
    backgroundColor: Colors.accentWashFill,
    borderColor: Colors.accentWashBorder,
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  promoTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  visualTile: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.backgroundElevated,
    borderWidth: 1,
    borderColor: Colors.accentWashOutline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyebrow: {
    color: Colors.accent,
    fontSize: FontSize.sm,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  title: {
    color: Colors.textPrimary,
    fontSize: FontSize.lg,
    fontWeight: '700',
    lineHeight: 18,
  },
  description: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
    lineHeight: 16,
  },
  offlineSlot: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    minHeight: 108,
  },
  offlineTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.md,
    fontWeight: '700',
    textAlign: 'center',
  },
  offlineLabel: {
    color: Colors.textMuted,
    fontSize: FontSize.sm,
    textAlign: 'center',
  },
});
