import {
  color,
  elevation,
  motion,
  radius,
  space,
} from '@/src/constants/tokens';
import { useMotion } from '@/src/hooks/useMotion';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

export type PressableCardVariant = 'default' | 'hero' | 'promo';

type PressableCardProps = {
  children: React.ReactNode;
  onPress: () => void;
  /** Read as one element: combine the title and subtitle, e.g. "Advanced Olympic Performance, Rest day". */
  accessibilityLabel: string;
  /** Use when the destination isn't obvious from the label. */
  accessibilityHint?: string;
  variant?: PressableCardVariant;
  /** Promo only: partner brand colour shown as a narrow leading edge. */
  accentColor?: string;
  showChevron?: boolean;
  /** Light impact on press. Supplementary only; the visual press state always shows. */
  haptic?: boolean;
  disabled?: boolean;
  /** Stretch to the height of its container, e.g. equal-height tiles in a row. */
  fill?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

const SURFACES: Record<
  PressableCardVariant,
  { rest: string; pressed: string }
> = {
  default: { rest: color.surface1, pressed: color.surface2 },
  hero: { rest: color.surface2, pressed: color.surface3 },
  promo: { rest: color.surface1, pressed: color.surface2 },
};

const HERO_EDGE_HEIGHT = 2;
const PROMO_EDGE_WIDTH = 4;

function HeroEdge() {
  return (
    <View style={styles.heroEdge} pointerEvents="none">
      <Svg width="100%" height={HERO_EDGE_HEIGHT}>
        <Defs>
          <LinearGradient id="heroEdge" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor={color.gold} stopOpacity={1} />
            <Stop offset="1" stopColor={color.gold} stopOpacity={0} />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height={HERO_EDGE_HEIGHT} fill="url(#heroEdge)" />
      </Svg>
    </View>
  );
}

export function PressableCard({
  children,
  onPress,
  accessibilityLabel,
  accessibilityHint,
  variant = 'default',
  accentColor,
  showChevron = true,
  haptic = true,
  disabled = false,
  fill = false,
  style,
  testID,
}: PressableCardProps) {
  const motionHelpers = useMotion();
  const pressed = useSharedValue(0);
  const scale = useSharedValue(1);
  const surfaces = SURFACES[variant];

  const surfaceStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      pressed.get(),
      [0, 1],
      [surfaces.rest, surfaces.pressed]
    ),
    transform: [{ scale: scale.get() }],
  }));

  const handlePressIn = () => {
    pressed.set(motionHelpers.fade(1, 'instant'));
    if (!motionHelpers.reduceMotion) {
      scale.set(motionHelpers.spring(motion.pressScale, 'snappy'));
    }
  };

  const handlePressOut = () => {
    pressed.set(motionHelpers.fade(0, 'instant'));
    if (!motionHelpers.reduceMotion) {
      scale.set(motionHelpers.spring(1, 'snappy'));
    }
  };

  const handlePress = () => {
    if (haptic) {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  return (
    <Pressable
      style={[fill && styles.fill, style]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
      testID={testID}
    >
      <Animated.View
        style={[
          styles.surface,
          fill && styles.fill,
          elevation.raised,
          surfaceStyle,
          disabled && styles.disabled,
        ]}
      >
        <View style={[styles.clip, fill && styles.fill]}>
          {variant === 'hero' ? <HeroEdge /> : null}
          {variant === 'promo' && accentColor ? (
            <View
              style={[styles.promoEdge, { backgroundColor: accentColor }]}
              pointerEvents="none"
            />
          ) : null}
          <View
            style={[
              styles.row,
              fill && styles.rowFill,
              variant === 'hero' && styles.rowHero,
              variant === 'promo' && accentColor ? styles.rowPromo : null,
            ]}
          >
            <View style={styles.content}>{children}</View>
            {showChevron ? (
              <Ionicons
                name="chevron-forward"
                size={18}
                color={color.textTertiary}
              />
            ) : null}
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  surface: {
    borderRadius: radius.md,
  },
  clip: {
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  disabled: {
    opacity: 0.6,
  },
  fill: {
    flex: 1,
  },
  rowFill: {
    flex: 1,
    alignItems: 'flex-start',
  },
  heroEdge: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HERO_EDGE_HEIGHT,
  },
  promoEdge: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: PROMO_EDGE_WIDTH,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    padding: space.md,
  },
  rowHero: {
    padding: space.lg,
  },
  rowPromo: {
    paddingLeft: space.md + PROMO_EDGE_WIDTH,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
});
