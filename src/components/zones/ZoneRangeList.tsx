import { useLargeText } from '@/src/hooks/useLargeText';
import type { ZoneRange } from '@/src/types/heartRate';
import {
  findZoneRange,
  formatZonePercent,
  formatZoneRange,
  HR_ZONES,
} from '@/src/utils/heartRateZones';
import React from 'react';
import { Text, View } from 'react-native';
import { ZoneNumberTile } from './ZoneNumberTile';
import { zoneScreenStyles as styles } from './zoneScreenStyles';

type ZoneRangeListProps = {
  /** `null` until set up: rows show percentages only. */
  ranges: ZoneRange[] | null;
};

/** One row per zone: number tile, name, percentage and bpm range. */
export function ZoneRangeList({ ranges }: ZoneRangeListProps) {
  const largeText = useLargeText();

  return (
    <View style={styles.card}>
      {HR_ZONES.map((info) => {
        const range = findZoneRange(ranges, info.zone);
        const rangeLabel = range ? formatZoneRange(range) : null;
        const percent = formatZonePercent(info);
        return (
          <View
            key={info.zone}
            style={[styles.zoneRow, largeText && styles.zoneRowStacked]}
            accessible
            accessibilityLabel={`Zone ${info.zone}, ${info.name}, ${percent}${
              rangeLabel ? `, ${rangeLabel}` : ''
            }. ${info.description}`}
          >
            <ZoneNumberTile zone={info.zone} />
            <View style={styles.zoneRowText}>
              <Text style={styles.zoneName}>{info.name}</Text>
              <Text style={styles.zonePercent}>
                {percent} · {info.description}
              </Text>
            </View>
            {rangeLabel ? (
              <Text style={styles.zoneBpm}>{rangeLabel}</Text>
            ) : (
              <Text style={styles.zoneBpmEmpty}>— bpm</Text>
            )}
          </View>
        );
      })}
    </View>
  );
}
