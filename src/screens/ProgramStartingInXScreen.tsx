import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BorderRadius, Colors, FontSize, Spacing } from '../constants/theme';

type ProgramStartingInXScreenProps = {
  daysUntilStart: number;
};

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
          <View style={styles.countdownRow}>
            <View style={styles.countdownCircle} accessibilityRole="image">
              <Text style={styles.countdownValue}>{countdownLabel}</Text>
              <Text style={styles.countdownCaption}>until start</Text>
            </View>
          </View>

          <Text style={styles.title}>{headline}</Text>
          <Text style={styles.subtitle}>
            While you’re waiting, you can still get a great session in. Browse
            standalone workouts, or scroll the dates above to preview what’s
            coming up.
          </Text>

          <View style={styles.actions}>
            <TouchableOpacity
              onPress={() => router.push('/workouts')}
              activeOpacity={0.8}
              style={styles.secondaryButton}
              accessibilityRole="button"
              accessibilityLabel="Browse workouts"
            >
              <Text style={styles.secondaryButtonText}>Browse workouts</Text>
            </TouchableOpacity>
          </View>
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
    padding: Spacing.section,
  },
  card: {
    width: '100%',
    backgroundColor: '#151517',
    borderRadius: BorderRadius.xxl,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    padding: Spacing.section,
    shadowColor: '#000000',
    shadowOpacity: 0.24,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  countdownRow: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  countdownCircle: {
    width: 168,
    height: 168,
    borderRadius: 84,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.accentSoft,
    borderWidth: 1,
    borderColor: Colors.accentOverlay,
  },
  countdownValue: {
    color: Colors.accent,
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  countdownCaption: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
    fontWeight: '700',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: FontSize.displayXXl,
    fontWeight: '900',
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: FontSize.xxl,
    lineHeight: 24,
    textAlign: 'center',
    paddingHorizontal: Spacing.xxl,
    marginBottom: Spacing.section,
  },
  actions: {
    gap: Spacing.md,
  },
  secondaryButton: {
    backgroundColor: Colors.accentSoft,
    borderRadius: BorderRadius.xxl,
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.section,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(201,150,58,0.34)',
  },
  secondaryButtonText: {
    color: Colors.accent,
    fontSize: FontSize.displaySm,
    fontWeight: '800',
  },
});
