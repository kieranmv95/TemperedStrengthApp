import {
  color,
  MIN_TARGET_SIZE,
  motion,
  radius,
  space,
  typography,
  type DurationToken,
  type EasingToken,
  type SpringToken,
} from '@/src/constants/tokens';
import { useMotion } from '@/src/hooks/useMotion';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

const DOT_SIZE = 20;

type TimingTrackProps = {
  label: string;
  duration: DurationToken;
  easing: EasingToken;
};

function TimingTrack({ label, duration, easing }: TimingTrackProps) {
  const motionHelpers = useMotion();
  const [atEnd, setAtEnd] = useState(false);
  const progress = useSharedValue(0);
  const travel = useSharedValue(0);

  const dotStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.get() * travel.get() }],
  }));

  const handlePress = () => {
    const next = !atEnd;
    setAtEnd(next);
    progress.set(motionHelpers.timing(next ? 1 : 0, duration, easing));
  };

  return (
    <Pressable
      style={styles.row}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={`Play ${label}`}
    >
      <Text style={styles.label}>{label}</Text>
      <View
        style={styles.track}
        onLayout={(event) => {
          travel.set(event.nativeEvent.layout.width - DOT_SIZE);
        }}
      >
        <Animated.View style={[styles.dot, dotStyle]} />
      </View>
    </Pressable>
  );
}

type SpringTrackProps = {
  preset: SpringToken;
};

function SpringTrack({ preset }: SpringTrackProps) {
  const motionHelpers = useMotion();
  const [atEnd, setAtEnd] = useState(false);
  const progress = useSharedValue(0);
  const travel = useSharedValue(0);
  const { damping, stiffness } = motion.spring[preset];
  const label = `spring.${preset} · d${damping} s${stiffness}`;

  const dotStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.get() * travel.get() }],
  }));

  const handlePress = () => {
    const next = !atEnd;
    setAtEnd(next);
    progress.set(motionHelpers.spring(next ? 1 : 0, preset));
  };

  return (
    <Pressable
      style={styles.row}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={`Play ${label}`}
    >
      <Text style={styles.label}>{label}</Text>
      <View
        style={styles.track}
        onLayout={(event) => {
          travel.set(event.nativeEvent.layout.width - DOT_SIZE);
        }}
      >
        <Animated.View style={[styles.dot, dotStyle]} />
      </View>
    </Pressable>
  );
}

function FadeSample() {
  const motionHelpers = useMotion();
  const [visible, setVisible] = useState(true);
  const opacity = useSharedValue(1);

  const fadeStyle = useAnimatedStyle(() => ({ opacity: opacity.get() }));

  const handlePress = () => {
    const next = !visible;
    setVisible(next);
    opacity.set(motionHelpers.fade(next ? 1 : 0, 'base'));
  };

  return (
    <Pressable
      style={styles.row}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel="Play fade, base duration"
    >
      <Text style={styles.label}>fade · base (≤150ms when reduced)</Text>
      <Animated.View style={[styles.fadeBlock, fadeStyle]} />
    </Pressable>
  );
}

function PressScaleSample() {
  const motionHelpers = useMotion();
  const scale = useSharedValue(1);

  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.get() }],
  }));

  return (
    <Pressable
      onPressIn={() => {
        scale.set(motionHelpers.spring(motion.pressScale, 'snappy'));
      }}
      onPressOut={() => {
        scale.set(motionHelpers.spring(1, 'snappy'));
      }}
      accessibilityRole="button"
      accessibilityLabel="Press scale sample"
    >
      <Animated.View style={[styles.pressCard, scaleStyle]}>
        <Text style={styles.pressCardTitle}>Press and hold</Text>
        <Text style={styles.label}>
          scale {motion.pressScale} · spring.snappy
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const DURATION_TOKENS = Object.keys(motion.duration) as DurationToken[];

export function MotionTokenPreview() {
  const { reduceMotion } = useMotion();

  return (
    <View style={styles.container}>
      <Text style={styles.status}>
        Reduce Motion is {reduceMotion ? 'on' : 'off'}.{' '}
        {reduceMotion
          ? 'Movement is instant; fades are capped at 150ms.'
          : 'Tap a row to play it.'}
      </Text>
      {DURATION_TOKENS.map((token) => (
        <TimingTrack
          key={token}
          label={`duration.${token} · ${motion.duration[token]}ms · standard`}
          duration={token}
          easing="standard"
        />
      ))}
      <TimingTrack
        label={`duration.base · ${motion.duration.base}ms · exit`}
        duration="base"
        easing="exit"
      />
      <SpringTrack preset="snappy" />
      <SpringTrack preset="gentle" />
      <FadeSample />
      <PressScaleSample />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: space.xs,
  },
  status: {
    ...typography.callout,
    color: color.textSecondary,
    marginBottom: space.xs,
  },
  row: {
    gap: space.xs,
    paddingVertical: space.xs,
    minHeight: MIN_TARGET_SIZE,
  },
  label: {
    ...typography.caption,
    color: color.textTertiary,
  },
  track: {
    height: DOT_SIZE,
    borderRadius: radius.pill,
    backgroundColor: color.surface2,
    justifyContent: 'center',
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: radius.pill,
    backgroundColor: color.gold,
  },
  fadeBlock: {
    height: DOT_SIZE,
    borderRadius: radius.sm,
    backgroundColor: color.gold,
  },
  pressCard: {
    backgroundColor: color.surface1,
    borderRadius: radius.md,
    padding: space.md,
    gap: space.xxs,
  },
  pressCardTitle: {
    ...typography.headline,
    color: color.textPrimary,
  },
});
