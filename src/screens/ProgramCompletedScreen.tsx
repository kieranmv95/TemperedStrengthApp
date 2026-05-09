import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BorderRadius, Colors, FontSize, Spacing } from '../constants/theme';

type ProgramCompletedScreenProps = {
  onViewAllPrograms: () => void | Promise<void>;
};

export const ProgramCompletedScreen: React.FC<ProgramCompletedScreenProps> = ({
  onViewAllPrograms,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.content} accessibilityRole="summary">
        <View style={styles.card}>
          <Text style={styles.title}>Congratulations</Text>
          <Text style={styles.subtitle}>
            You’ve completed your program. Incredible work, time to choose
            what’s next.
          </Text>

          <View style={styles.actions}>
            <TouchableOpacity
              onPress={onViewAllPrograms}
              activeOpacity={0.8}
              style={styles.primaryButton}
              accessibilityRole="button"
              accessibilityLabel="View all programs"
            >
              <Text style={styles.primaryButtonText}>View all programs</Text>
            </TouchableOpacity>

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
    marginBottom: Spacing.section,
  },
  actions: {
    gap: Spacing.md,
  },
  primaryButton: {
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.pill,
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.section,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: Colors.backgroundScreen,
    fontSize: FontSize.displaySm,
    fontWeight: '600',
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
    fontWeight: '600',
  },
});
