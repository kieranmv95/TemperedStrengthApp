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
  title: {
    color: Colors.textPrimary,
    fontSize: FontSize.hero,
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
  primaryButton: {
    backgroundColor: Colors.accentSoft,
    borderRadius: BorderRadius.xxl,
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.section,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(201,150,58,0.34)',
  },
  primaryButtonText: {
    color: Colors.accent,
    fontSize: FontSize.displaySm,
    fontWeight: '800',
  },
  secondaryButton: {
    backgroundColor: 'rgba(255,255,255,0.045)',
    borderRadius: BorderRadius.xxl,
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.section,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderDefault,
  },
  secondaryButtonText: {
    color: Colors.textSecondary,
    fontSize: FontSize.displaySm,
    fontWeight: '600',
  },
});
