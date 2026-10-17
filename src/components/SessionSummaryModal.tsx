import { AnimatedNumber, BottomSheet } from '@/src/components/ds';
import {
  color,
  MIN_TARGET_SIZE,
  radius,
  space,
  typography,
} from '@/src/constants/tokens';
import { useMotion } from '@/src/hooks/useMotion';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import type { WeightUnit } from '../utils/storage';
import { formatVolumeFromKg } from '../utils/weightUnits';

type SessionSummaryModalProps = {
  visible: boolean;
  duration: number;
  totalVolume: number;
  setsCompleted: number;
  showStrengthStats?: boolean;
  weightUnit: WeightUnit;
  onDismiss: () => void;
};

const BADGE_SIZE = 64;
const BURST_END_SCALE = 1.6;

const formatDuration = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
};

/** A single gold ring that expands and fades once. Not rendered under Reduce Motion. */
function CelebrationBurst() {
  const motionHelpers = useMotion();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.set(motionHelpers.timing(1, 'celebrate', 'standard'));
  }, [progress, motionHelpers]);

  const burstStyle = useAnimatedStyle(() => ({
    opacity: 0.6 * (1 - progress.get()),
    transform: [{ scale: 1 + (BURST_END_SCALE - 1) * progress.get() }],
  }));

  return (
    <Animated.View
      style={[styles.burst, burstStyle]}
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    />
  );
}

type StatProps = {
  label: string;
  value: number;
  format: (value: number) => string;
};

function Stat({ label, value, format }: StatProps) {
  return (
    <View
      style={styles.stat}
      accessible
      accessibilityLabel={`${label}, ${format(value)}`}
    >
      <AnimatedNumber
        value={value}
        format={format}
        style={styles.statValue}
        animateOnMount
      />
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export const SessionSummaryModal: React.FC<SessionSummaryModalProps> = ({
  visible,
  duration,
  totalVolume,
  setsCompleted,
  showStrengthStats = true,
  weightUnit,
  onDismiss,
}) => {
  const { reduceMotion } = useMotion();
  const durationSeconds = Math.floor(duration / 1000);

  return (
    <BottomSheet
      visible={visible}
      onClose={onDismiss}
      title="Session complete"
      footer={
        <Pressable
          style={({ pressed }) => [
            styles.doneButton,
            pressed && styles.doneButtonPressed,
          ]}
          onPress={onDismiss}
          accessibilityRole="button"
        >
          <Text style={styles.doneButtonText}>Done</Text>
        </Pressable>
      }
    >
      <View style={styles.hero}>
        <View style={styles.badgeFrame}>
          {visible && !reduceMotion ? <CelebrationBurst /> : null}
          <View style={styles.badge}>
            <Ionicons name="trophy" size={28} color={color.onGold} />
          </View>
        </View>
        <Text style={styles.subtitle}>Great work. Here’s your summary.</Text>
      </View>

      <View style={styles.stats}>
        <Stat
          label="Duration"
          value={durationSeconds}
          format={formatDuration}
        />
        {showStrengthStats ? (
          <>
            <Stat
              label="Total volume"
              value={totalVolume}
              format={(value) => formatVolumeFromKg(value, weightUnit)}
            />
            <Stat
              label="Sets completed"
              value={setsCompleted}
              format={String}
            />
          </>
        ) : null}
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    gap: space.sm,
  },
  badgeFrame: {
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  burst: {
    ...StyleSheet.absoluteFill,
    borderRadius: BADGE_SIZE / 2,
    borderWidth: 2,
    borderColor: color.gold,
  },
  badge: {
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    borderRadius: BADGE_SIZE / 2,
    backgroundColor: color.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    ...typography.callout,
    color: color.textSecondary,
    textAlign: 'center',
  },
  stats: {
    gap: space.xs,
  },
  stat: {
    backgroundColor: color.surface2,
    borderRadius: radius.md,
    padding: space.md,
    gap: space.xxs,
  },
  statValue: {
    ...typography.numericLarge,
    color: color.gold,
  },
  statLabel: {
    ...typography.caption,
    color: color.textSecondary,
  },
  doneButton: {
    minHeight: MIN_TARGET_SIZE,
    borderRadius: radius.pill,
    backgroundColor: color.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneButtonPressed: {
    backgroundColor: color.goldStrong,
  },
  doneButtonText: {
    ...typography.calloutStrong,
    color: color.onGold,
  },
});
