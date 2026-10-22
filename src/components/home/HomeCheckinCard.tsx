import { PressableCard } from '@/src/components/ds';
import { color, radius, space, typography } from '@/src/constants/tokens';
import { useMotion } from '@/src/hooks/useMotion';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

type HomeCheckinCardProps = {
  loggedCount: number;
  totalCount: number;
  supplementsDue: number;
  supplementsTotal: number;
  onPress: () => void;
};

/** More behaviours than this collapse into a "+k" label. */
const MAX_DOTS = 6;
const DOT_SIZE = 12;

function buildStatusLine(input: {
  loggedCount: number;
  totalCount: number;
  supplementsDue: number;
  supplementsTotal: number;
}): string {
  const parts: string[] = [];

  if (input.totalCount > 0) {
    parts.push(
      `${input.loggedCount} of ${input.totalCount} behaviour${
        input.totalCount === 1 ? '' : 's'
      }`
    );
  }

  if (input.supplementsTotal > 0) {
    if (input.supplementsDue < 1) {
      parts.push(
        input.supplementsTotal === 1 ? 'supplement done' : 'supplements done'
      );
    } else {
      parts.push(
        input.supplementsDue === 1
          ? '1 supplement due'
          : `${input.supplementsDue} supplements due`
      );
    }
  }

  if (parts.length === 0) {
    return 'Nothing tracked yet';
  }

  return parts.join(' · ');
}

function BehaviourDot({ filled }: { filled: boolean }) {
  const motionHelpers = useMotion();
  const fill = useSharedValue(filled ? 1 : 0);

  useEffect(() => {
    fill.set(motionHelpers.fade(filled ? 1 : 0, 'base'));
  }, [filled, fill, motionHelpers]);

  const ringStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      fill.get(),
      [0, 1],
      [color.borderStrong, color.gold]
    ),
  }));
  const fillStyle = useAnimatedStyle(() => ({ opacity: fill.get() }));

  return (
    <Animated.View style={[styles.dot, ringStyle]}>
      <Animated.View style={[styles.dotFill, fillStyle]} />
    </Animated.View>
  );
}

export function HomeCheckinCard({
  loggedCount,
  totalCount,
  supplementsDue,
  supplementsTotal,
  onPress,
}: HomeCheckinCardProps) {
  if (totalCount < 1 && supplementsTotal < 1) {
    return (
      <PressableCard
        onPress={onPress}
        accessibilityLabel="Check-in, add behaviours and supplements to track today"
      >
        <View style={styles.titleRow}>
          <Ionicons name="checkbox-outline" size={18} color={color.gold} />
          <Text style={styles.title}>Check-in</Text>
        </View>
        <Text style={styles.status}>
          Add behaviours and supplements to track today
        </Text>
      </PressableCard>
    );
  }

  const status = buildStatusLine({
    loggedCount,
    totalCount,
    supplementsDue,
    supplementsTotal,
  });
  const dotCount = Math.min(totalCount, MAX_DOTS);
  const overflow = totalCount - dotCount;

  return (
    <PressableCard onPress={onPress} accessibilityLabel={`Check-in, ${status}`}>
      <View style={styles.titleRow}>
        <Ionicons name="checkbox-outline" size={18} color={color.gold} />
        <Text style={styles.title}>Check-in</Text>
      </View>
      <View style={styles.indicators}>
        {totalCount > 0 ? (
          <View style={styles.dots}>
            {Array.from({ length: dotCount }).map((_, index) => (
              <BehaviourDot key={index} filled={index < loggedCount} />
            ))}
            {overflow > 0 ? (
              <Text style={styles.overflow}>+{overflow}</Text>
            ) : null}
          </View>
        ) : null}
        {supplementsTotal > 0 ? (
          <View style={styles.supplement}>
            <Ionicons
              name={supplementsDue < 1 ? 'checkmark-circle' : 'medical-outline'}
              size={16}
              color={supplementsDue < 1 ? color.success : color.textSecondary}
            />
          </View>
        ) : null}
      </View>
      <Text style={styles.status}>{status}</Text>
    </PressableCard>
  );
}

const styles = StyleSheet.create({
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
  },
  title: {
    ...typography.headline,
    color: color.textPrimary,
  },
  indicators: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    marginTop: space.xs,
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  dotFill: {
    flex: 1,
    backgroundColor: color.gold,
  },
  overflow: {
    ...typography.captionStrong,
    color: color.textSecondary,
  },
  supplement: {
    paddingLeft: space.sm,
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: color.borderSubtle,
  },
  status: {
    ...typography.callout,
    color: color.textSecondary,
    marginTop: space.xxs,
  },
});
