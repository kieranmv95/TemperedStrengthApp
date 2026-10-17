import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  color,
  MIN_TARGET_SIZE,
  radius,
  space,
  typography,
} from '../constants/tokens';

type ProgramCompletedScreenProps = {
  onViewAllPrograms: () => void | Promise<void>;
};

const TROPHY_SIZE = 48;

export const ProgramCompletedScreen: React.FC<ProgramCompletedScreenProps> = ({
  onViewAllPrograms,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.content} accessibilityRole="summary">
        <View style={styles.card}>
          <Ionicons
            name="trophy"
            size={TROPHY_SIZE}
            color={color.gold}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          />
          <Text style={styles.title} accessibilityRole="header">
            Congratulations
          </Text>
          <Text style={styles.subtitle}>
            You’ve completed your program. Incredible work, time to choose
            what’s next.
          </Text>

          <View style={styles.actions}>
            <Pressable
              onPress={onViewAllPrograms}
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.primaryButtonPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="View all programs"
            >
              <Text style={styles.primaryButtonText}>View all programs</Text>
            </Pressable>

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
  title: {
    ...typography.display,
    color: color.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: color.textSecondary,
    textAlign: 'center',
  },
  actions: {
    alignSelf: 'stretch',
    gap: space.sm,
    marginTop: space.md,
  },
  primaryButton: {
    minHeight: MIN_TARGET_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.lg,
    borderRadius: radius.pill,
    backgroundColor: color.gold,
  },
  primaryButtonPressed: {
    backgroundColor: color.goldStrong,
  },
  primaryButtonText: {
    ...typography.calloutStrong,
    color: color.onGold,
  },
  secondaryButton: {
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
