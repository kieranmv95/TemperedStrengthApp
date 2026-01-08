import React from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getAllExercises, getExerciseById } from "../data/exercises";
import { findAlternatives } from "../utils/pivotEngine";

interface SwapModalProps {
  visible: boolean;
  currentExerciseId: string | null;
  onClose: () => void;
  onSelectExercise: (exerciseId: string) => void;
}

export const SwapModal: React.FC<SwapModalProps> = ({
  visible,
  currentExerciseId,
  onClose,
  onSelectExercise,
}) => {
  const currentExercise = currentExerciseId
    ? getExerciseById(currentExerciseId)
    : null;
  const alternatives = currentExerciseId
    ? findAlternatives(currentExerciseId, 3)
    : getAllExercises().slice(0, 15); // Show all exercises for empty slots

  const handleSelect = (exerciseId: string) => {
    onSelectExercise(exerciseId);
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
    marginBottom: 20,
    fontWeight: "500",
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
