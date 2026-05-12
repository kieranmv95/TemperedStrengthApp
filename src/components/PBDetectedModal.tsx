import { BorderRadius, Colors, FontSize, Spacing } from '@/src/constants/theme';
import type { RepMax } from '@/src/types/personalBests';
import { formatRepMaxLabel } from '@/src/utils/personalBests';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
    backgroundColor: '#151517',
    borderRadius: BorderRadius.xxl,
    padding: Spacing.section,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    shadowColor: '#000000',
    shadowOpacity: 0.32,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 5,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: FontSize.displaySm,
    fontWeight: '900',
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
    borderRadius: BorderRadius.xxl,
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: Colors.accentSoft,
    borderWidth: 1,
    borderColor: 'rgba(201,150,58,0.34)',
  },
  buttonPrimaryText: {
    color: Colors.accent,
    fontSize: FontSize.lg,
    fontWeight: '600',
  },
  buttonSecondary: {
    backgroundColor: 'rgba(255,255,255,0.045)',
    borderWidth: 1,
    borderColor: Colors.borderDefault,
  },
  buttonSecondaryText: {
    color: Colors.textPrimary,
    fontSize: FontSize.lg,
    fontWeight: '600',
  },
});
