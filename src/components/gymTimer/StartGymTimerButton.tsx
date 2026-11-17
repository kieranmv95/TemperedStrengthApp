import { Badge } from '@/src/components/ds';
import {
  color,
  MIN_TARGET_SIZE,
  radius,
  space,
  typography,
} from '@/src/constants/tokens';
import { useGymTimer } from '@/src/hooks/gym-timer-context';
import { useSubscriptionContext } from '@/src/hooks/subscription-context';
import type { GymTimerConfig } from '@/src/types/gymTimer';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

type StartGymTimerButtonProps = {
  config: GymTimerConfig;
  label?: string;
  size?: 'regular' | 'compact';
};

/** Contextual Start timer. Free users see a Pro badge and are sent to paywall. */
export function StartGymTimerButton({
  config,
  label = 'Start timer',
  size = 'regular',
}: StartGymTimerButtonProps) {
  const compact = size === 'compact';
  const { startGymTimer } = useGymTimer();
  const { isPro } = useSubscriptionContext();

  return (
    <Pressable
      style={[styles.btn, compact && styles.btnCompact]}
      onPress={() => {
        if (!isPro) {
          router.push('/paywall');
          return;
        }
        startGymTimer(config);
      }}
      accessibilityRole="button"
      accessibilityLabel={isPro ? label : `${label}, Pro feature`}
    >
      <Ionicons
        name="timer-outline"
        size={compact ? 16 : 18}
        color={color.gold}
      />
      <Text style={[styles.label, compact && styles.labelCompact]}>
        {label}
      </Text>
      {!isPro ? <Badge label="PRO" /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    minHeight: MIN_TARGET_SIZE,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    paddingHorizontal: space.sm,
    paddingVertical: space.xs,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.borderStrong,
    backgroundColor: color.surface2,
    alignSelf: 'flex-start',
  },
  btnCompact: {
    minHeight: 40,
    paddingVertical: space.xxs,
    gap: space.xxs,
  },
  label: {
    ...typography.headline,
    color: color.textPrimary,
  },
  labelCompact: {
    ...typography.calloutStrong,
  },
});
