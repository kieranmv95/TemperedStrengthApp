import { gymClock, gymClockFont } from '@/src/constants/gymClock';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type SevenSegmentDigitsProps = {
  value: string;
  color: string;
  fontSize: number;
  paused?: boolean;
  accessibilityLabel?: string;
};

/**
 * LED-style digits using DSEG7. A full ghost "8" mask sits behind each digit
 * so unlit segments stay faintly visible.
 */
export function SevenSegmentDigits({
  value,
  color,
  fontSize,
  paused = false,
  accessibilityLabel,
}: SevenSegmentDigitsProps) {
  const ghost = value.replace(/[0-9]/g, '8').replace(/:/g, ':');

  return (
    <View
      style={[styles.wrap, paused && styles.paused]}
      accessibilityLabel={accessibilityLabel ?? value}
    >
      <Text
        style={[
          styles.digits,
          styles.ghost,
          { fontSize, lineHeight: fontSize * 1.05 },
        ]}
        importantForAccessibility="no"
      >
        {ghost}
      </Text>
      <Text
        style={[
          styles.digits,
          styles.lit,
          {
            fontSize,
            lineHeight: fontSize * 1.05,
            color,
            textShadowColor: color,
          },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paused: {
    opacity: 0.55,
  },
  digits: {
    fontFamily: gymClockFont.digits,
    fontVariant: ['tabular-nums'],
    letterSpacing: 2,
    textAlign: 'center',
  },
  ghost: {
    color: gymClock.ghostDigit,
  },
  lit: {
    position: 'absolute',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 14,
  },
});
