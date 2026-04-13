import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

type ConfettiPiece = {
  left: number; // 0..1
  size: number;
  rotate: number; // degrees
  color: string;
  delayMs: number;
  durationMs: number;
  swayPx: number;
};

export type ConfettiCelebrationProps = {
  /**
   * Increment this value to replay the animation.
   * Example: setTrigger((t) => t + 1)
   */
  trigger: number;
  pieces?: number;
  durationMs?: number;
};

const DEFAULT_COLORS = [
  '#22c55e', // green
  '#3b82f6', // blue
  '#a855f7', // purple
  '#f59e0b', // amber
  '#ef4444', // red
  '#06b6d4', // cyan
  '#f97316', // orange
];

function pseudoRandom(seed: number) {
  // Simple deterministic PRNG (mulberry32)
  let t = seed + 0x6d2b79f5;
  return () => {
    t += 0x6d2b79f5;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

function ConfettiParticle({
  piece,
  heightPx,
  active,
  onLastComplete,
  isLast,
}: {
  piece: ConfettiPiece;
  heightPx: number;
  active: boolean;
  onLastComplete: () => void;
  isLast: boolean;
}) {
  const progress = useSharedValue(0);

  useEffect(() => {
    if (!active) return;
    progress.value = 0;
    progress.value = withDelay(
      piece.delayMs,
      withTiming(
        1,
        {
          duration: piece.durationMs,
          easing: Easing.linear,
        },
        (finished) => {
          if (!finished || !isLast) return;
          runOnJS(onLastComplete)();
        }
      )
    );
  }, [active, isLast, onLastComplete, piece.delayMs, piece.durationMs, progress]);

  const style = useAnimatedStyle(() => {
    const y = -20 + (heightPx + 80) * progress.value;
    const x =
      piece.swayPx * Math.sin(progress.value * Math.PI * 2) * (1 - progress.value);
    const rot = `${piece.rotate + 720 * progress.value}deg`;
    const opacity = progress.value < 0.9 ? 1 : 1 - (progress.value - 0.9) / 0.1;
    return {
      transform: [{ translateY: y }, { translateX: x }, { rotateZ: rot }],
      opacity,
    };
  }, [heightPx, piece.rotate, piece.swayPx]);

  return (
    <Animated.View
      style={[
        styles.piece,
        {
          left: `${piece.left * 100}%`,
          width: piece.size,
          height: piece.size * 0.6,
          backgroundColor: piece.color,
          borderRadius: Math.max(2, piece.size * 0.12),
        },
        style,
      ]}
    />
  );
}

export function ConfettiCelebration({
  trigger,
  pieces = 42,
  durationMs = 1800,
}: ConfettiCelebrationProps) {
  const { width, height } = useWindowDimensions();
  const [active, setActive] = useState(false);

  const confetti = useMemo(() => {
    const rand = pseudoRandom(trigger || 1);
    const next: ConfettiPiece[] = [];
    for (let i = 0; i < pieces; i += 1) {
      const base = rand();
      const size = 6 + Math.floor(rand() * 10);
      next.push({
        left: Math.min(0.98, Math.max(0.02, rand())),
        size,
        rotate: Math.floor(rand() * 360),
        color: DEFAULT_COLORS[Math.floor(rand() * DEFAULT_COLORS.length)]!,
        delayMs: Math.floor(rand() * 280),
        durationMs: Math.floor(durationMs * (0.75 + rand() * 0.5)),
        swayPx: 12 + Math.floor(rand() * 24),
      });
      // Nudge distribution slightly to avoid clustering at exact edges
      if (base < 0.1) next[next.length - 1]!.left *= 0.9;
      if (base > 0.9) next[next.length - 1]!.left = 0.1 + next[next.length - 1]!.left * 0.9;
    }
    return next;
  }, [durationMs, pieces, trigger]);

  useEffect(() => {
    if (trigger <= 0) return;
    setActive(true);
  }, [trigger]);

  const onLastComplete = () => setActive(false);

  if (!active || width === 0 || height === 0) return null;

  return (
    <View pointerEvents="none" style={styles.container}>
      {confetti.map((piece, idx) => (
        <ConfettiParticle
          // Trigger changes rebuild deterministic pieces; idx is stable enough.
          key={`${trigger}-${idx}`}
          piece={piece}
          heightPx={height}
          active={active}
          onLastComplete={onLastComplete}
          isLast={idx === confetti.length - 1}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
  },
  piece: {
    position: 'absolute',
    top: 0,
  },
});

