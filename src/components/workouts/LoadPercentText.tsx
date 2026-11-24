import { color } from '@/src/constants/tokens';
import {
  formatLoadPercentSegment,
  parseLoadPercentSegments,
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
 * when a 1RM is known, bracketed weights are included in the same gold run.
 */
export function LoadPercentText({
  text,
  oneRmKg,
  unit,
  style,
}: LoadPercentTextProps) {
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
        return (
          <Text key={index} style={styles.load}>
            {formatLoadPercentSegment(segment, oneRmKg, unit)}
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
});
