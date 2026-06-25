import { Card, CuratedSection, SmallChevron } from '@/src/components/ds';
import { BorderRadius, Colors, FontSize, Spacing } from '@/src/constants/theme';
import { usePartnerListings } from '@/src/hooks/use-partner-listings';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type DiscoverHubEntryProps = {
  onPress: () => void;
};

export function DiscoverHubEntry({ onPress }: DiscoverHubEntryProps) {
  const { gyms, clubs, coaches } = usePartnerListings();
  const hasListings =
    gyms.length > 0 || clubs.length > 0 || coaches.length > 0;

  if (!hasListings) {
    return null;
  }

  return (
    <View style={styles.subSection}>
      <CuratedSection
        icon="compass-outline"
        iconSizeOverride={18}
        title="Discover"
        description="Find local gyms, PT's and coaches near you"
        size="large"
      />

      <Card
        onPress={onPress}
        accessibilityLabel="Browse gyms, clubs, and coaches"
        style={styles.discoverCard}
      >
        <View style={styles.visualTile}>
          <Ionicons name="compass-outline" size={30} color={Colors.accent} />
        </View>
        <View style={styles.textColumn}>
          <Text style={styles.eyebrow}>Near you</Text>
          <Text style={styles.title}>Browse the network</Text>
          <Text style={styles.description}>
            Gyms, clubs, and coaches approved by Tempered Strength.
          </Text>
        </View>
        <SmallChevron />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  subSection: {
    gap: Spacing.md,
  },
  discoverCard: {
    backgroundColor: Colors.accentWashFill,
    borderColor: Colors.accentWashBorder,
  },
  visualTile: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.backgroundElevated,
    borderWidth: 1,
    borderColor: Colors.accentWashOutline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textColumn: {
    flex: 1,
    marginLeft: Spacing.xl,
    gap: Spacing.xs,
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
    fontSize: FontSize.xl,
    fontWeight: '700',
  },
  description: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    lineHeight: 20,
  },
});
