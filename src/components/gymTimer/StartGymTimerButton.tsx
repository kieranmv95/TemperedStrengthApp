import { Badge } from '@/src/components/ds';
import { color, MIN_TARGET_SIZE, radius, space, typography } from '@/src/constants/tokens';
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
};

/** Contextual Start timer. Free users see a Pro badge and are sent to paywall. */
export function StartGymTimerButton({
  config,
  label = 'Start timer',
}: StartGymTimerButtonProps) {
  const { startGymTimer } = useGymTimer();
  const { isPro } = useSubscriptionContext();

  return (
    <Pressable
      style={styles.btn}
      onPress={() => {
        if (!isPro) {
          router.push('/paywall');
          return;
        }
        startGymTimer(config);
      }}
      accessibilityRole="button"
      accessibilityLabel={
        isPro ? label : `${label}, Pro feature`
      }
    >
      <Ionicons name="timer-outline" size={18} color={color.gold} />
      <Text style={styles.label}>{label}</Text>
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
  label: {
    ...typography.headline,
    color: color.textPrimary,
  },
});
