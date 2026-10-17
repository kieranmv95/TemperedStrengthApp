import { CuratedSection, PressableCard } from '@/src/components/ds';
import { color, radius, space, typography } from '@/src/constants/tokens';
import { usePartnerListings } from '@/src/hooks/use-partner-listings';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const ICON_WELL_SIZE = 40;

type DiscoverHubEntryProps = {
  onPress: () => void;
};

export function DiscoverHubEntry({ onPress }: DiscoverHubEntryProps) {
  const { gyms, clubs, coaches } = usePartnerListings();
  const hasListings = gyms.length > 0 || clubs.length > 0 || coaches.length > 0;

  if (!hasListings) {
    return null;
  }

  return (
    <View style={styles.subSection}>
      <CuratedSection
        icon="compass-outline"
        iconSizeOverride={18}
        title="Discover"
        description="Find local gyms, PTs and coaches near you."
        size="large"
      />

      <PressableCard
        onPress={onPress}
        accessibilityLabel="Browse the network, gyms, clubs, and coaches approved by Tempered Strength"
        accessibilityHint="Browse gyms, clubs, and coaches"
      >
        <View style={styles.row}>
          <View style={styles.iconWell}>
            <Ionicons name="compass-outline" size={22} color={color.gold} />
          </View>
          <View style={styles.textColumn}>
            <Text style={styles.eyebrow}>Discover</Text>
            <Text style={styles.title}>Browse the network</Text>
            <Text style={styles.description}>
              Gyms, clubs, and coaches approved by Tempered Strength.
            </Text>
          </View>
        </View>
      </PressableCard>
    </View>
  );
}

const styles = StyleSheet.create({
  subSection: {
    gap: space.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  iconWell: {
    width: ICON_WELL_SIZE,
    height: ICON_WELL_SIZE,
    borderRadius: radius.sm,
    backgroundColor: color.goldTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textColumn: {
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
