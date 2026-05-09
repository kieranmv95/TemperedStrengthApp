import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BorderRadius, Colors, FontSize, Spacing } from '../constants/theme';

type RestDayScreenProps = {
  onProgramReset?: () => void;
};

export const RestDayScreen: React.FC<RestDayScreenProps> = ({
  onProgramReset,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.content} accessibilityRole="summary">
        <Text style={styles.title}>Rest Day</Text>
        <Text style={styles.subtitle}>
          Your body needs recovery to grow stronger.
        </Text>
        <Text style={styles.description}>
          Take this time to perform active recovery activities such as
          stretching, foam rolling, or yoga, or simply take a day off.
        </Text>

        <Text style={styles.readyText}>
          Sometimes you’re ready to go, and when you are, check out the workouts
          if you’re still geared to go.
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
  title: {
    color: Colors.accent,
    fontSize: FontSize.displayXXl,
    fontWeight: '800',
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: FontSize.xxl,
    lineHeight: 24,
    textAlign: 'center',
    paddingHorizontal: Spacing.xxl,
    marginBottom: Spacing.xl,
  },
  description: {
    color: Colors.textSecondary,
    fontSize: FontSize.xxl,
    lineHeight: 24,
    textAlign: 'center',
    paddingHorizontal: Spacing.xxl,
    marginBottom: Spacing.xl,
  },
  readyText: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    lineHeight: 22,
    textAlign: 'center',
    paddingHorizontal: Spacing.xxl,
    marginBottom: Spacing.section,
  },
  actions: {
    gap: Spacing.md,
  },
  secondaryButton: {
    backgroundColor: Colors.backgroundElevated,
    borderRadius: BorderRadius.pill,
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.section,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: Colors.textSecondary,
    fontSize: FontSize.displaySm,
    fontWeight: '800',
  },
});
