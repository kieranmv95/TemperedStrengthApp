import React from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getAllExercises, getExerciseById } from "../data/exercises";
import { findAlternatives } from "../utils/pivotEngine";
import {
  clearExerciseSwap,
  clearLoggedSetsForSlot,
  hasLoggedSets,
  saveExerciseSwap,
} from "../utils/storage";

interface SwapModalProps {
  visible: boolean;
  currentExerciseId: number | null;
  originalExerciseId: number | null; // Original program exercise ID
  dayIndex: number | null;
  slotIndex: number;
  onClose: () => void;
  onClearData?: () => void;
}

export const SwapModal: React.FC<SwapModalProps> = ({
  visible,
  currentExerciseId,
  originalExerciseId,
  dayIndex,
  slotIndex,
  onClose,
  onClearData,
}) => {
  const currentExercise = currentExerciseId
    ? getExerciseById(currentExerciseId)
    : null;
  const originalExercise = originalExerciseId
    ? getExerciseById(originalExerciseId)
    : null;
  const alternatives = currentExerciseId
    ? findAlternatives(currentExerciseId, 3)
    : getAllExercises().slice(0, 15); // Show all exercises for empty slots

  // Check if the current exercise is swapped (different from original)
  const isSwapped =
    currentExerciseId !== null &&
    originalExerciseId !== null &&
    currentExerciseId !== originalExerciseId;

  const handleSelect = async (exerciseId: number) => {
    // Check if there's logged data before swapping
    if (dayIndex !== null) {
      const hasLogged = await hasLoggedSets(dayIndex, slotIndex);

      if (hasLogged) {
        Alert.alert(
          "Clear Workout Data?",
          "Swapping the exercise will clear all logged sets for this exercise. This cannot be undone.",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Clear and Swap",
              style: "destructive",
              onPress: async () => {
                try {
                  await clearLoggedSetsForSlot(dayIndex, slotIndex);
                  // Save the swap directly to storage
                  if (dayIndex !== null) {
                    await saveExerciseSwap(dayIndex, slotIndex, exerciseId);
                  }
                  // Reload after swap is saved to ensure UI updates
                  if (onClearData) {
                    await onClearData();
                  }
                  onClose();
                } catch (error) {
                  console.error("Error clearing logged sets:", error);
                  Alert.alert(
                    "Error",
                    "Failed to clear workout data. Please try again."
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
                : "Select Exercise"}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.modalSubtitle}>
            {currentExercise
              ? `Alternatives for ${currentExercise.pattern}`
              : "Choose an exercise"}
          </Text>

          <Text style={styles.disclaimer}>
            ⚠️ Deviating from too many exercises could reduce the effectiveness
            of the overall program.
          </Text>

          {isSwapped && originalExercise && (
            <TouchableOpacity
              style={styles.resetButton}
              onPress={async () => {
                // Check if there's logged data before resetting
                if (dayIndex !== null) {
                  const hasLogged = await hasLoggedSets(dayIndex, slotIndex);

                  if (hasLogged) {
                    Alert.alert(
                      "Clear Workout Data?",
                      "Resetting to the original exercise will clear all logged sets for this exercise. This cannot be undone.",
                      [
                        {
                          text: "Cancel",
                          style: "cancel",
                        },
                        {
                          text: "Clear and Reset",
                          style: "destructive",
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
                                "Error clearing logged sets and swap:",
                                error
                              );
                              Alert.alert(
                                "Error",
                                "Failed to clear workout data. Please try again."
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
                    console.error("Error clearing swap:", error);
                    Alert.alert(
                      "Error",
                      "Failed to reset exercise. Please try again."
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
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#1E1E1E",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: "80%",
    borderWidth: 1,
    borderColor: "#2A2A2A",
    flexDirection: "column",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
    flex: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#2A2A2A",
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  modalSubtitle: {
    color: "#888",
    fontSize: 14,
    marginBottom: 12,
    fontWeight: "500",
  },
  disclaimer: {
    color: "#FFA726",
    fontSize: 12,
    marginBottom: 20,
    fontWeight: "500",
    fontStyle: "italic",
    lineHeight: 18,
  },
  resetButton: {
    backgroundColor: "#2A2A2A",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#00E676",
    alignItems: "center",
  },
  resetButtonText: {
    color: "#00E676",
    fontSize: 16,
    fontWeight: "600",
  },
  alternativesList: {
    flexShrink: 1,
    minHeight: 200,
  },
  noAlternatives: {
    color: "#888",
    fontSize: 14,
    textAlign: "center",
    padding: 20,
  },
  alternativeItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#333",
  },
  alternativeContent: {
    flex: 1,
  },
  alternativeName: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  alternativeMeta: {
    flexDirection: "row",
    gap: 12,
  },
  alternativeEquipment: {
    color: "#00E676",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  alternativeMuscle: {
    color: "#888",
    fontSize: 12,
    fontWeight: "500",
  },
  selectArrow: {
    color: "#00E676",
    fontSize: 24,
    fontWeight: "600",
    marginLeft: 12,
  },
});
