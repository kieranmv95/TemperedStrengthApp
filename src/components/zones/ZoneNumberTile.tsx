import { radius, space, typography } from '@/src/constants/tokens';
import type { HeartRateZoneId } from '@/src/types/heartRate';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ZONE_COLORS, ZONE_TILE_FOREGROUND } from './zoneColors';

const TILE_SIZE = 32;

type ZoneNumberTileProps = {
  zone: HeartRateZoneId;
};

/** Coloured square with the zone number. Decorative; label the zone in text. */
export function ZoneNumberTile({ zone }: ZoneNumberTileProps) {
  return (
    <View
      style={[styles.tile, { backgroundColor: ZONE_COLORS[zone] }]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Text style={styles.number}>{zone}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    minWidth: TILE_SIZE,
    minHeight: TILE_SIZE,
    paddingHorizontal: space.xxs,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  number: {
    ...typography.numericSmall,
    color: ZONE_TILE_FOREGROUND,
  },
});
