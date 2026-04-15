import { Colors, FontSize, Spacing } from '@/src/constants/theme';
import type { RepMax } from '@/src/types/personalBests';
import { formatRepMaxLabel } from '@/src/utils/personalBests';
import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

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
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>New personal best</Text>
          <Text style={styles.body}>
            Update your {primaryLabel} for {exerciseName} to {weightText}?
          </Text>
          {cascadeTiers.length > 0 ? (
            <Text style={styles.cascade}>
              This also beats your{' '}
              {cascadeTiers.map(formatRepMaxLabel).join(', ')}.
            </Text>
          ) : null}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.buttonSecondary]}
              onPress={onDismiss}
            >
              <Text style={styles.buttonSecondaryText}>Dismiss</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonPrimary]}
              onPress={onUpdate}
            >
              <Text style={styles.buttonPrimaryText}>Update</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxl,
  },
  card: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 12,
    padding: Spacing.section,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: FontSize.displaySm,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  body: {
    color: Colors.textSecondary,
    fontSize: FontSize.lg,
    lineHeight: 22,
  },
  cascade: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
    marginTop: Spacing.md,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.section,
  },
  button: {
    flex: 1,
    paddingVertical: Spacing.xxl,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: Colors.accent,
  },
  buttonPrimaryText: {
    color: Colors.textOnAccent,
    fontSize: FontSize.lg,
    fontWeight: '600',
  },
  buttonSecondary: {
    backgroundColor: Colors.backgroundElevated,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
  },
  buttonSecondaryText: {
    color: Colors.textPrimary,
    fontSize: FontSize.lg,
    fontWeight: '600',
  },
});
