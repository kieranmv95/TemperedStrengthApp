import {
  BorderRadius,
  Colors,
  FontSize,
  Spacing,
} from '../constants/theme';
import { useSubscription } from '@/src/hooks/use-subscription';
import { router } from 'expo-router';
import React from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { getAllExercises, getExerciseById } from '../data/exercises';
import { findAlternatives } from '../utils/pivotEngine';
import {
  clearExerciseSwap,
  clearLoggedSetsForSlot,
  getRemainingSwapCount,
  hasLoggedSets,
  incrementSwapCount,
  saveExerciseSwap,
} from '../utils/storage';

type SwapModalProps = {
  visible: boolean;
  currentExerciseId: number | null;
  originalExerciseId: number | null; // Original program exercise ID
  dayIndex: number | null;
  slotIndex: number;
  onClose: () => void;
  onClearData?: () => void;
};

export const SwapModal: React.FC<SwapModalProps> = ({
  visible,
  currentExerciseId,
  originalExerciseId,
  dayIndex,
  slotIndex,
  onClose,
  onClearData,
}) => {
  const { isPro } = useSubscription();
  const currentExercise = currentExerciseId
    ? getExerciseById(currentExerciseId)
    : null;
  const originalExercise = originalExerciseId
    ? getExerciseById(originalExerciseId)
    : null;
  const alternatives = currentExerciseId
    ? findAlternatives(currentExerciseId, 10)
    : getAllExercises().slice(0, 15); // Show all exercises for empty slots

  // Check if the current exercise is swapped (different from original)
  const isSwapped =
    currentExerciseId !== null &&
    originalExerciseId !== null &&
    currentExerciseId !== originalExerciseId;

  const handleSelect = async (exerciseId: number) => {
    // Check swap limit for non-Pro users (only if actually swapping to a different exercise)
    if (!isPro && dayIndex !== null && originalExerciseId !== null) {
      // Only check limit if swapping to a different exercise (not resetting)
      if (exerciseId !== originalExerciseId) {
        const remainingSwaps = await getRemainingSwapCount();
        if (remainingSwaps <= 0) {
          Alert.alert(
            'Upgrade to Pro',
            'Unlimited swaps is part of a Pro membership. Free users get 10 swaps per month, resetting on the 1st of each month. You can reset a exercise back to the original exercise at any time for free.',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'Upgrade to Pro',
                style: 'default',
                onPress: () => {
                  onClose();
                  router.push('/paywall');
                },
              },
            ]
          );
          return;
        }
      }
    }

    // Check if there's logged data before swapping
    if (dayIndex !== null) {
      const hasLogged = await hasLoggedSets(dayIndex, slotIndex);

      if (hasLogged) {
        Alert.alert(
          'Clear Workout Data?',
          'Swapping the exercise will clear all logged sets for this exercise. This cannot be undone.',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Clear and Swap',
              style: 'destructive',
              onPress: async () => {
                try {
                  await clearLoggedSetsForSlot(dayIndex, slotIndex);
                  // Save the swap directly to storage
                  if (dayIndex !== null) {
                    await saveExerciseSwap(dayIndex, slotIndex, exerciseId);
                    // Increment swap count only if actually swapping (not resetting)
                    if (
                      !isPro &&
                      originalExerciseId !== null &&
                      exerciseId !== originalExerciseId
                    ) {
                      await incrementSwapCount();
                    }
                  }
                  // Reload after swap is saved to ensure UI updates
                  if (onClearData) {
                    await onClearData();
                  }
                  onClose();
                } catch (error) {
                  console.error('Error clearing logged sets:', error);
                  Alert.alert(
                    'Error',
                    'Failed to clear workout data. Please try again.'
                  );
                }
              },
            },
          ]
        );
        return;
      }
    }

    // No logged data, swap immediately
    // Save the swap directly to storage
    if (dayIndex !== null) {
      await saveExerciseSwap(dayIndex, slotIndex, exerciseId);
      // Increment swap count only if actually swapping (not resetting)
      if (
        !isPro &&
        originalExerciseId !== null &&
        exerciseId !== originalExerciseId
      ) {
        await incrementSwapCount();
      }
    }
    // Reload to ensure UI updates
    if (onClearData) {
      await onClearData();
    }
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {currentExercise
                ? `Swap ${currentExercise.name}`
                : 'Select Exercise'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.modalSubtitle}>
            {currentExercise
              ? `Alternatives for ${currentExercise.pattern}`
              : 'Choose an exercise'}
          </Text>

          <Text style={styles.deviationTitle}>
            Deviating from too many exercises could reduce the effectiveness of
            the overall program.
          </Text>

          {!isPro && (
            <Text style={styles.disclaimer}>
              Swapping an exercise will use one of your free swaps, you get 10
              per month, resetting on the 1st of each month. Upgrade to PRO in
              the settings to get unlimited swaps.
            </Text>
          )}

          {isSwapped && originalExercise && (
            <TouchableOpacity
              style={styles.resetButton}
              onPress={async () => {
                // Check if there's logged data before resetting
                if (dayIndex !== null) {
                  const hasLogged = await hasLoggedSets(dayIndex, slotIndex);

                  if (hasLogged) {
                    Alert.alert(
                      'Clear Workout Data?',
                      'Resetting to the original exercise will clear all logged sets for this exercise. This cannot be undone.',
                      [
                        {
                          text: 'Cancel',
                          style: 'cancel',
                        },
                        {
                          text: 'Clear and Reset',
                          style: 'destructive',
                          onPress: async () => {
                            try {
                              // Clear logged sets/reps data for this slot
                              await clearLoggedSetsForSlot(dayIndex, slotIndex);
                              // Clear the swap to reset to original exercise
                              await clearExerciseSwap(dayIndex, slotIndex);
                              // Reload data to refresh the UI
                              if (onClearData) {
                                onClearData();
                              }
                              onClose();
                            } catch (error) {
                              console.error(
                                'Error clearing logged sets and swap:',
                                error
                              );
                              Alert.alert(
                                'Error',
                                'Failed to clear workout data. Please try again.'
                              );
                            }
                          },
                        },
                      ]
                    );
                    return;
                  }
                }

                // No logged data, reset immediately
                if (dayIndex !== null) {
                  try {
                    // Clear the swap to reset to original exercise
                    await clearExerciseSwap(dayIndex, slotIndex);
                    // Reload data to refresh the UI
                    if (onClearData) {
                      await onClearData();
                    }
                    onClose();
                  } catch (error) {
                    console.error('Error clearing swap:', error);
                    Alert.alert(
                      'Error',
                      'Failed to reset exercise. Please try again.'
                    );
                  }
                }
              }}
            >
              <Text style={styles.resetButtonText}>
                Reset to {originalExercise.name}
              </Text>
            </TouchableOpacity>
          )}

          <ScrollView style={styles.alternativesList}>
            {alternatives.length === 0 && currentExerciseId && (
              <Text style={styles.noAlternatives}>
                No alternatives found for this pattern.
              </Text>
            )}
            {alternatives.map((exercise) => (
              <TouchableOpacity
                key={exercise.id}
                style={styles.alternativeItem}
                onPress={() => handleSelect(exercise.id)}
              >
                <View style={styles.alternativeContent}>
                  <Text style={styles.alternativeName}>{exercise.name}</Text>
                  <View style={styles.alternativeMeta}>
                    <Text style={styles.alternativeEquipment}>
                      {exercise.equipment}
                    </Text>
                    <Text style={styles.alternativeMuscle}>
                      {exercise.muscle}
                    </Text>
                  </View>
                </View>
                <Text style={styles.selectArrow}>→</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.backgroundCard,
    borderTopLeftRadius: BorderRadius.pill,
    borderTopRightRadius: BorderRadius.pill,
    padding: Spacing.section,
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    flexDirection: 'column',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  modalTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.displayXl,
    fontWeight: '700',
    flex: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.backgroundElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: Colors.textPrimary,
    fontSize: FontSize.displaySm,
    fontWeight: '600',
  },
  modalSubtitle: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    marginBottom: Spacing.xl,
    fontWeight: '500',
  },
  disclaimer: {
    backgroundColor: Colors.warning,
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    fontSize: FontSize.md,
    marginBottom: Spacing.xxxl,
    fontWeight: '500',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  deviationTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.lg,
    marginBottom: Spacing.xl,
    fontWeight: '500',
  },
  resetButton: {
    backgroundColor: Colors.backgroundElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing.xxl,
    borderWidth: 1,
    borderColor: Colors.accent,
    alignItems: 'center',
  },
  resetButtonText: {
    color: Colors.accent,
    fontSize: FontSize.xxl,
    fontWeight: '600',
  },
  alternativesList: {
    flexShrink: 1,
    minHeight: 200,
  },
  noAlternatives: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    textAlign: 'center',
    padding: Spacing.xxxl,
  },
  alternativeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.backgroundElevated,
    borderRadius: BorderRadius.xxl,
    padding: Spacing.xxl,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  alternativeContent: {
    flex: 1,
  },
  alternativeName: {
    color: Colors.textPrimary,
    fontSize: FontSize.displaySm,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  alternativeMeta: {
    flexDirection: 'row',
    gap: Spacing.xl,
  },
  alternativeEquipment: {
    color: Colors.accent,
    fontSize: FontSize.md,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  alternativeMuscle: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
    fontWeight: '500',
  },
  selectArrow: {
    color: Colors.accent,
    fontSize: FontSize.displayXl,
    fontWeight: '600',
    marginLeft: Spacing.xl,
  },
});
