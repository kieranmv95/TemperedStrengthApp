import { Badge } from '@/src/components/ds';
import {
  color,
  elevation,
  MIN_TARGET_SIZE,
  radius,
  space,
  typography,
} from '@/src/constants/tokens';
import { INTENSITY_LEVELS } from '@/src/screens/workoutScreenConstants';
import React from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type IntensityLevelsModalProps = {
  visible: boolean;
  currentIntensity: number | undefined;
  onClose: () => void;
};

const RANGE_COLUMN_WIDTH = 40;

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
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.intensityModalOverlay}>
        <View
          style={[styles.intensityModalContent, elevation.overlay]}
          accessibilityViewIsModal
          onAccessibilityEscape={onClose}
        >
          <ScrollView contentContainerStyle={styles.intensityModalScroll}>
            <Text style={styles.intensityModalTitle} accessibilityRole="header">
              Intensity levels
            </Text>
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
                  accessible
                  accessibilityLabel={`${level.range[0]} to ${level.range[1]}, ${level.label}${isActive ? ', this workout' : ''}. ${level.feel}`}
                >
                  <View style={styles.intensityModalRowHeader}>
                    <Text style={styles.intensityModalRange}>
                      {level.range[0]}–{level.range[1]}
                    </Text>
                    <Text style={styles.intensityModalLabel}>
                      {level.label}
                    </Text>
                    {isActive ? (
                      <Badge label="This workout" tone="gold" />
                    ) : null}
                  </View>
                  <Text style={styles.intensityModalFeel}>{level.feel}</Text>
                </View>
              );
            })}
          </ScrollView>
          <Pressable
            style={({ pressed }) => [
              styles.intensityModalClose,
              pressed && styles.intensityModalClosePressed,
            ]}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Got it, close intensity levels"
          >
            <Text style={styles.intensityModalCloseText}>Got it</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  intensityModalOverlay: {
    flex: 1,
    backgroundColor: color.scrim,
    justifyContent: 'center',
    padding: space.md,
  },
  intensityModalContent: {
    maxHeight: '90%',
    backgroundColor: color.surface2,
    borderRadius: radius.lg,
    padding: space.xl,
    gap: space.md,
  },
  intensityModalScroll: {
    gap: space.xs,
  },
  intensityModalTitle: {
    ...typography.title2,
    color: color.textPrimary,
  },
  intensityModalSubtitle: {
    ...typography.callout,
    color: color.textSecondary,
    marginBottom: space.xs,
  },
  intensityModalRow: {
    padding: space.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.borderSubtle,
    gap: space.xxs,
  },
  intensityModalRowActive: {
    backgroundColor: color.surface3,
    borderColor: color.gold,
  },
  intensityModalRowHeader: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: space.xs,
  },
  intensityModalRange: {
    ...typography.numericSmall,
    color: color.textTertiary,
    minWidth: RANGE_COLUMN_WIDTH,
  },
  intensityModalLabel: {
    ...typography.headline,
    color: color.textPrimary,
  },
  intensityModalFeel: {
    ...typography.callout,
    color: color.textSecondary,
    paddingLeft: RANGE_COLUMN_WIDTH + space.xs,
  },
  intensityModalClose: {
    minHeight: MIN_TARGET_SIZE,
    borderRadius: radius.pill,
    backgroundColor: color.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  intensityModalClosePressed: {
    backgroundColor: color.goldStrong,
  },
  intensityModalCloseText: {
    ...typography.calloutStrong,
    color: color.onGold,
  },
});
