import { PressableCard } from '@/src/components/ds';
import { color, space, typography } from '@/src/constants/tokens';
import type { ZoneRange } from '@/src/types/heartRate';
import { formatZoneRange } from '@/src/utils/heartRateZones';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ZoneBar } from './ZoneBar';

type ZonesSummaryCardProps = {
  /** `null` until the user sets up zones. */
  ranges: ZoneRange[] | null;
  onPress: () => void;
};

function rangesAccessibilityLabel(ranges: ZoneRange[]): string {
  return ranges
    .map((range) => `Zone ${range.zone}, ${formatZoneRange(range)}`)
    .join('; ');
}

/** Compact bpm label for the summary strip — no "bpm" suffix so five columns fit. */
function compactZoneBpm(range: ZoneRange): string {
  if (range.maxBpm === null) {
    return `${range.minBpm}+`;
  }
  return `${range.minBpm}–${range.maxBpm}`;
}

type ZoneColumnProps = {
  range: ZoneRange;
};

function ZoneColumn({ range }: ZoneColumnProps) {
  return (
    <View style={styles.column}>
      <Text style={styles.bpm} numberOfLines={1} adjustsFontSizeToFit>
        {compactZoneBpm(range)}
      </Text>
    </View>
  );
}

/** Zones card for the You and Home tabs. Opens the Zones screen. */
export function ZonesSummaryCard({ ranges, onPress }: ZonesSummaryCardProps) {
  if (!ranges) {
    return (
      <PressableCard
        onPress={onPress}
        accessibilityLabel="Heart rate zones. Zones will appear here once set up."
        accessibilityHint="Opens heart rate zones setup"
      >
        <View style={styles.setupRow}>
          <View style={styles.setupLead}>
            <Text style={styles.title}>Zones</Text>
            <Ionicons name="speedometer-outline" size={40} color={color.gold} />
          </View>
          <View style={styles.setupText}>
            <Text style={styles.body}>
              Your heart rate zones will appear here once set up.
            </Text>
            <Text style={styles.cta}>Set up zones</Text>
          </View>
        </View>
      </PressableCard>
    );
  }

  return (
    <PressableCard
      onPress={onPress}
      accessibilityLabel={`Heart rate zones. ${rangesAccessibilityLabel(ranges)}`}
      accessibilityHint="Opens heart rate zones"
    >
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Ionicons name="speedometer-outline" size={18} color={color.gold} />
          <Text style={styles.title}>Zones</Text>
        </View>
        <View style={styles.columns}>
          {ranges.map((range) => (
            <ZoneColumn key={range.zone} range={range} />
          ))}
        </View>
        <ZoneBar />
        <View style={styles.columns}>
          {ranges.map((range) => (
            <Text key={range.zone} style={styles.zoneLabel}>
              {range.zone}
            </Text>
          ))}
        </View>
      </View>
    </PressableCard>
  );
}

const styles = StyleSheet.create({
  setupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
  },
  setupLead: {
    alignItems: 'flex-start',
    gap: space.xs,
  },
  setupText: {
    flex: 1,
    minWidth: 0,
    gap: space.xxs,
  },
  content: {
    gap: space.xs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
  },
  title: {
    ...typography.headline,
    color: color.textPrimary,
  },
  body: {
    ...typography.callout,
    color: color.textSecondary,
  },
  cta: {
    ...typography.calloutStrong,
    color: color.gold,
  },
  columns: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  column: {
    flex: 1,
    alignItems: 'center',
    minWidth: 0,
  },
  bpm: {
    ...typography.captionStrong,
    fontVariant: ['tabular-nums'],
    color: color.textPrimary,
    textAlign: 'center',
  },
  zoneLabel: {
    ...typography.caption,
    flex: 1,
    textAlign: 'center',
    color: color.textTertiary,
  },
});
