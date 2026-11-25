import { color } from '@/src/constants/tokens';
import { useBarbellLoad } from '@/src/hooks/barbell-load-context';
import {
  formatLoadPercentSegment,
  parseLoadPercentSegments,
  resolveLoadPercentWeights,
  stringHasLoadPercentTokens,
} from '@/src/utils/loadPercent';
import type { WeightUnit } from '@/src/utils/storage';
import React from 'react';
import { StyleSheet, Text, type StyleProp, type TextStyle } from 'react-native';

type LoadPercentTextProps = {
  text: string;
  oneRmKg: number | null;
  unit: WeightUnit;
  style?: StyleProp<TextStyle>;
};

/**
 * Renders copy that may contain `{{percent}}` load tokens. Marked runs are gold;
 * when a 1RM is known, bracketed weights are included and underlined so they
 * read as tappable — opening the bar loader sheet.
 */
export function LoadPercentText({
  text,
  oneRmKg,
  unit,
  style,
}: LoadPercentTextProps) {
  const { openBarbellLoad } = useBarbellLoad();

  if (!stringHasLoadPercentTokens(text)) {
    return <Text style={style}>{text}</Text>;
  }

  const segments = parseLoadPercentSegments(text);
  return (
    <Text style={style}>
      {segments.map((segment, index) => {
        if (segment.type === 'text') {
          return (
            <Text key={index} style={styles.inherit}>
              {segment.text}
            </Text>
          );
        }

        const label = formatLoadPercentSegment(segment, oneRmKg, unit);
        const weights = resolveLoadPercentWeights(segment, oneRmKg, unit);

        if (weights === null) {
          return (
            <Text key={index} style={styles.load}>
              {label}
            </Text>
          );
        }

        return (
          <Text
            key={index}
            style={styles.loadTappable}
            onPress={() => {
              openBarbellLoad({
                weight: weights.low,
                rangeHighWeight: weights.high,
                label,
              });
            }}
            accessibilityRole="button"
            accessibilityLabel={`Open bar loader for ${label}`}
            accessibilityHint="Shows which plates to load on the bar"
          >
            {label}
          </Text>
        );
      })}
    </Text>
  );
}

const styles = StyleSheet.create({
  inherit: {},
  load: {
    color: color.gold,
  },
  loadTappable: {
    color: color.gold,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
