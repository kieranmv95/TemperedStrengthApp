import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  color,
  elevation,
  MIN_TARGET_SIZE,
  radius,
  space,
  typography,
} from '../constants/tokens';

type ProgramStartingInXScreenProps = {
  daysUntilStart: number;
};

const COUNTDOWN_SIZE = 140;

export const ProgramStartingInXScreen: React.FC<
  ProgramStartingInXScreenProps
> = ({ daysUntilStart }) => {
  const safeDaysUntilStart = Math.max(0, Math.floor(daysUntilStart));
  const headline =
    safeDaysUntilStart === 0
      ? 'Your program starts today'
      : safeDaysUntilStart === 1
        ? 'Program starts tomorrow'
        : `Program starts in ${safeDaysUntilStart} days`;

  const countdownLabel =
    safeDaysUntilStart === 0
      ? 'Today'
      : safeDaysUntilStart === 1
        ? '1 day'
        : `${safeDaysUntilStart} days`;

  return (
    <View style={styles.container}>
      <View style={styles.content} accessibilityRole="summary">
        <View style={styles.card}>
          <View
            style={styles.countdownCircle}
            accessible
            accessibilityLabel={`${countdownLabel} until start`}
          >
            <Text style={styles.countdownValue}>{countdownLabel}</Text>
            <Text style={styles.countdownCaption}>until start</Text>
          </View>

          <Text style={styles.title} accessibilityRole="header">
            {headline}
          </Text>
          <Text style={styles.subtitle}>
            While you’re waiting, you can still get a great session in. Browse
            standalone workouts, or scroll the dates above to preview what’s
            coming up.
          </Text>

          <Pressable
            onPress={() => router.push('/workouts')}
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && styles.secondaryButtonPressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Browse workouts"
          >
            <Text style={styles.secondaryButtonText}>Browse workouts</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: space.xl,
  },
  card: {
    width: '100%',
    alignItems: 'center',
    gap: space.sm,
  },
  countdownCircle: {
    ...elevation.raised,
    minWidth: COUNTDOWN_SIZE,
    minHeight: COUNTDOWN_SIZE,
    padding: space.md,
    borderRadius: radius.pill,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.surface1,
    marginBottom: space.sm,
  },
  countdownValue: {
    ...typography.numericMedium,
    color: color.textPrimary,
    textAlign: 'center',
  },
  countdownCaption: {
    ...typography.caption,
    color: color.textTertiary,
    textAlign: 'center',
  },
  title: {
    ...typography.title1,
    color: color.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: color.textSecondary,
    textAlign: 'center',
    marginBottom: space.sm,
  },
  secondaryButton: {
    alignSelf: 'stretch',
    minHeight: MIN_TARGET_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.lg,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: color.borderStrong,
  },
  secondaryButtonPressed: {
    backgroundColor: color.surface3,
  },
  secondaryButtonText: {
    ...typography.calloutStrong,
    color: color.textPrimary,
  },
});
