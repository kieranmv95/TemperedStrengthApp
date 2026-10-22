import { useMotion } from '@/src/hooks/useMotion';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] as const;
const DIGIT_PATTERN = /\d/;

type DigitColumnProps = {
  digit: number;
  rowHeight: number;
  animateOnMount: boolean;
  textStyle: StyleProp<TextStyle>;
};

function DigitColumn({
  digit,
  rowHeight,
  animateOnMount,
  textStyle,
}: DigitColumnProps) {
  const motionHelpers = useMotion();
  const position = useSharedValue(animateOnMount ? 0 : digit);

  useEffect(() => {
    position.set(motionHelpers.timing(digit, 'slow'));
  }, [digit, position, motionHelpers]);

  const stripStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -position.get() * rowHeight }],
  }));

  return (
    <View style={{ height: rowHeight, overflow: 'hidden' }}>
      <Animated.View style={stripStyle}>
        {DIGITS.map((d) => (
          <Text key={d} style={[textStyle, { height: rowHeight }]}>
            {d}
          </Text>
        ))}
      </Animated.View>
    </View>
  );
}

type AnimatedNumberProps = {
  value: number;
  /** Display text for the value, e.g. "12,340 kg". Digits roll; other characters stay static. */
  format?: (value: number) => string;
  /** A typography token (ideally a numeric one with tabular figures) plus colour. */
  style: StyleProp<TextStyle>;
  /** Count up from zero on first render, e.g. session summary totals. */
  animateOnMount?: boolean;
  /** Defaults to the formatted text. */
  accessibilityLabel?: string;
};

/**
 * Number whose digits roll to the new value when it changes. Uses transforms
 * only, so it runs on the UI thread. Read as one element with the final value.
 */
export function AnimatedNumber({
  value,
  format,
  style,
  animateOnMount = false,
  accessibilityLabel,
}: AnimatedNumberProps) {
  const [rowHeight, setRowHeight] = useState(0);
  const text = format ? format(value) : String(value);
  const characters = text.split('');

  return (
    <View
      style={styles.row}
      accessible
      accessibilityRole="text"
      accessibilityLabel={accessibilityLabel ?? text}
    >
      <Text
        style={[style, styles.sizer]}
        onLayout={(event) => setRowHeight(event.nativeEvent.layout.height)}
        aria-hidden
      >
        0
      </Text>
      {rowHeight === 0 ? (
        <Text style={[style, styles.hidden]}>{text}</Text>
      ) : (
        characters.map((character, index) => {
          const key = characters.length - index;
          return DIGIT_PATTERN.test(character) ? (
            <DigitColumn
              key={key}
              digit={Number(character)}
              rowHeight={rowHeight}
              animateOnMount={animateOnMount}
              textStyle={style}
            />
          ) : (
            <Text key={key} style={style}>
              {character}
            </Text>
          );
        })
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  sizer: {
    position: 'absolute',
    opacity: 0,
  },
  hidden: {
    opacity: 0,
  },
});
