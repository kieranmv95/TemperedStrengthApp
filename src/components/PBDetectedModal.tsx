import {
  color,
  elevation,
  MIN_TARGET_SIZE,
  radius,
  space,
  typography,
} from '@/src/constants/tokens';
import type { RepMax } from '@/src/types/personalBests';
import { formatRepMaxLabel } from '@/src/utils/personalBests';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

export type PBDetectedModalProps = {
  visible: boolean;
  exerciseName: string;
  primaryTier: RepMax;
  weightText: string;
  newRecords: RepMax[];
  onDismiss: () => void;
  onUpdate: () => void;
};

export function PBDetectedModal({
  visible,
  exerciseName,
  primaryTier,
  weightText,
  newRecords,
  onDismiss,
  onUpdate,
}: PBDetectedModalProps) {
  const primaryLabel = formatRepMaxLabel(primaryTier);
  const cascadeTiers = newRecords.filter((t) => t !== primaryTier);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <View
          style={[styles.card, elevation.overlay]}
          accessibilityViewIsModal
          onAccessibilityEscape={onDismiss}
        >
          <View style={styles.titleRow}>
            <Ionicons name="trophy" size={22} color={color.gold} />
            <Text style={styles.title} accessibilityRole="header">
              New personal best
            </Text>
          </View>
          <Text style={styles.body}>
            Update your {primaryLabel} for {exerciseName} to{' '}
            <Text style={styles.weight}>{weightText}</Text>?
          </Text>
          {cascadeTiers.length > 0 ? (
            <Text style={styles.cascade}>
              This also beats your{' '}
              {cascadeTiers.map(formatRepMaxLabel).join(', ')}.
            </Text>
          ) : null}
          <View style={styles.actions}>
            <Pressable
              style={({ pressed }) => [
                styles.button,
                styles.buttonSecondary,
                pressed && styles.buttonSecondaryPressed,
              ]}
              onPress={onDismiss}
              accessibilityRole="button"
              accessibilityLabel="Dismiss, keep current personal best"
            >
              <Text style={styles.buttonSecondaryText}>Dismiss</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.button,
                styles.buttonPrimary,
                pressed && styles.buttonPrimaryPressed,
              ]}
              onPress={onUpdate}
              accessibilityRole="button"
              accessibilityLabel={`Update ${primaryLabel} to ${weightText}`}
            >
              <Text style={styles.buttonPrimaryText}>Update</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: color.scrim,
    justifyContent: 'center',
    paddingHorizontal: space.md,
  },
  card: {
    backgroundColor: color.surface2,
    borderRadius: radius.lg,
    padding: space.xl,
    gap: space.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
  },
  title: {
    ...typography.title2,
    color: color.textPrimary,
    flex: 1,
  },
  body: {
    ...typography.body,
    color: color.textSecondary,
  },
  weight: {
    ...typography.headline,
    fontVariant: ['tabular-nums'],
    color: color.gold,
  },
  cascade: {
    ...typography.callout,
    color: color.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.xs,
    marginTop: space.sm,
  },
  button: {
    flexGrow: 1,
    flexBasis: 120,
    minHeight: MIN_TARGET_SIZE,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPrimary: {
    backgroundColor: color.gold,
  },
  buttonPrimaryPressed: {
    backgroundColor: color.goldStrong,
  },
  buttonPrimaryText: {
    ...typography.calloutStrong,
    color: color.onGold,
  },
  buttonSecondary: {
    borderWidth: 1,
    borderColor: color.borderStrong,
  },
  buttonSecondaryPressed: {
    backgroundColor: color.surface3,
  },
  buttonSecondaryText: {
    ...typography.calloutStrong,
    color: color.textPrimary,
  },
});
