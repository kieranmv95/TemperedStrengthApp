import { BorderRadius, Colors, FontSize, Spacing } from '@/src/constants/theme';
import { INTENSITY_LEVELS } from '@/src/screens/workoutScreenConstants';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type IntensityLevelsModalProps = {
  visible: boolean;
  currentIntensity: number | undefined;
  onClose: () => void;
};

export function IntensityLevelsModal({
  visible,
  currentIntensity,
  onClose,
}: IntensityLevelsModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.intensityModalOverlay}>
        <View style={styles.intensityModalContent}>
          <Text style={styles.intensityModalTitle}>Intensity Levels</Text>
          <Text style={styles.intensityModalSubtitle}>
            How each level should feel during your session
          </Text>
          {INTENSITY_LEVELS.map((level) => {
            const isActive =
              currentIntensity !== undefined &&
              currentIntensity >= level.range[0] &&
              currentIntensity <= level.range[1];
            return (
              <View
                key={level.label}
                style={[
                  styles.intensityModalRow,
                  isActive && styles.intensityModalRowActive,
                ]}
              >
                <View style={styles.intensityModalRowHeader}>
                  <Text style={styles.intensityModalRange}>
                    {level.range[0]}–{level.range[1]}
                  </Text>
                  <Text
                    style={[
                      styles.intensityModalLabel,
                      isActive && styles.intensityModalLabelActive,
                    ]}
                  >
                    {level.label}
                  </Text>
                </View>
                <Text style={styles.intensityModalFeel}>{level.feel}</Text>
              </View>
            );
          })}
          <TouchableOpacity
            style={styles.intensityModalClose}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={styles.intensityModalCloseText}>Got it</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  intensityModalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    padding: Spacing.xxl,
  },
  intensityModalContent: {
    backgroundColor: '#151517',
    borderRadius: BorderRadius.xxl,
    padding: Spacing.xxl,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    shadowColor: '#000000',
    shadowOpacity: 0.32,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 5,
  },
  intensityModalTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.displayLg,
    fontWeight: '900',
    marginBottom: Spacing.xs,
  },
  intensityModalSubtitle: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    marginBottom: Spacing.xxl,
  },
  intensityModalRow: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.xxl,
    marginBottom: Spacing.md,
  },
  intensityModalRowActive: {
    backgroundColor: Colors.accentSoft,
    borderWidth: 1,
    borderColor: Colors.accent,
  },
  intensityModalRowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.xs,
  },
  intensityModalRange: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
    fontWeight: '700',
    minWidth: 30,
  },
  intensityModalLabel: {
    color: Colors.textPrimary,
    fontSize: FontSize.xxl,
    fontWeight: '700',
  },
  intensityModalLabelActive: {
    color: Colors.accent,
  },
  intensityModalFeel: {
    color: Colors.textSecondary,
    fontSize: FontSize.base,
    lineHeight: 18,
    paddingLeft: 38,
  },
  intensityModalClose: {
    backgroundColor: Colors.accentSoft,
    borderRadius: BorderRadius.xxl,
    paddingVertical: Spacing.xl,
    alignItems: 'center',
    marginTop: Spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(201,150,58,0.34)',
  },
  intensityModalCloseText: {
    color: Colors.accent,
    fontSize: FontSize.xxl,
    fontWeight: '700',
  },
});
