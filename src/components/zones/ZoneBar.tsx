import { radius } from '@/src/constants/tokens';
import type { HeartRateZoneId } from '@/src/types/heartRate';
import { HR_ZONES } from '@/src/utils/heartRateZones';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ZONE_COLORS } from './zoneColors';

const SEGMENT_HEIGHT = 6;
const HIGHLIGHT_HEIGHT = 10;
const DIMMED_OPACITY = 0.3;

type ZoneBarProps = {
  /** Dims every other zone. Omit to show all zones at full strength. */
  highlight?: HeartRateZoneId;
};

/**
 * Five-colour zone scale. Decorative: the zone is always named in text
 * alongside it, so screen readers skip it.
 */
export function ZoneBar({ highlight }: ZoneBarProps) {
  return (
    <View
      style={styles.row}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {HR_ZONES.map((info) => {
        const isHighlighted = highlight === info.zone;
        const isDimmed = highlight !== undefined && !isHighlighted;
        return (
          <View
            key={info.zone}
            style={[
              styles.segment,
              { backgroundColor: ZONE_COLORS[info.zone] },
              isHighlighted && styles.segmentHighlighted,
              isDimmed && styles.segmentDimmed,
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    minHeight: HIGHLIGHT_HEIGHT,
  },
  segment: {
    flex: 1,
    height: SEGMENT_HEIGHT,
    borderRadius: radius.pill,
  },
  segmentHighlighted: {
    height: HIGHLIGHT_HEIGHT,
  },
  segmentDimmed: {
    opacity: DIMMED_OPACITY,
  },
});
