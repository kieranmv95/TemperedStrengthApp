import {
  color,
  MIN_TARGET_SIZE,
  radius,
  space,
  typography,
} from '@/src/constants/tokens';
import type { HeartRateZoneId, ZoneRange } from '@/src/types/heartRate';
import {
  findZoneRange,
  formatZoneRange,
  getZoneInfo,
} from '@/src/utils/heartRateZones';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ZoneBar } from './ZoneBar';
import { ZoneNumberTile } from './ZoneNumberTile';

type HeartRateZoneChipProps = {
  zone: HeartRateZoneId;
  /** `null` until the user sets up zones. */
  ranges: ZoneRange[] | null;
};

/**
 * Inline widget for workout blocks that target a heart rate zone. Shows the
 * user's bpm range once zones are set up; otherwise prompts setup.
 */
export function HeartRateZoneChip({ zone, ranges }: HeartRateZoneChipProps) {
  const info = getZoneInfo(zone);
  const range = findZoneRange(ranges, zone);
  const rangeLabel = range ? formatZoneRange(range) : null;
  const title = `Zone ${zone} · ${info.name}`;

  return (
    <Pressable
      onPress={() => router.push('/zones')}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={
        rangeLabel
          ? `Zone ${zone}, ${info.name}, ${rangeLabel}`
          : `Zone ${zone}, ${info.name}. Set up your heart rate zones to see your bpm`
      }
      accessibilityHint="Opens heart rate zones"
    >
      <View style={styles.row}>
        <ZoneNumberTile zone={zone} />
        <View style={styles.text}>
          <Text style={styles.title}>{title}</Text>
          {rangeLabel ? (
            <Text style={styles.range}>{rangeLabel}</Text>
          ) : (
            <Text style={styles.setup}>Set up your zones to see your bpm</Text>
          )}
        </View>
        <Ionicons
          name={rangeLabel ? 'information-circle-outline' : 'chevron-forward'}
          size={20}
          color={color.textTertiary}
        />
      </View>
      <ZoneBar highlight={zone} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: MIN_TARGET_SIZE,
    padding: space.sm,
    gap: space.xs,
    borderRadius: radius.sm,
    backgroundColor: color.surface2,
  },
  pressed: {
    backgroundColor: color.surface3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  text: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  title: {
    ...typography.captionStrong,
    color: color.textSecondary,
  },
  range: {
    ...typography.numericSmall,
    color: color.textPrimary,
  },
  setup: {
    ...typography.calloutStrong,
    color: color.gold,
  },
});
