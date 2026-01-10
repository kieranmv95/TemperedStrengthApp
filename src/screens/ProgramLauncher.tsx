import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Program, programs } from "../utils/program";
import { setActiveProgramId, setProgramStartDate } from "../utils/storage";

interface ProgramLauncherProps {
  onProgramSelected: () => void;
}

export const ProgramLauncher: React.FC<ProgramLauncherProps> = ({
  onProgramSelected,
}) => {
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [showProgramDetails, setShowProgramDetails] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState(new Date());

  const handleSelectProgram = (program: Program) => {
    setSelectedProgram(program);
    setShowProgramDetails(true);
  };

  const handleStartProgram = () => {
    setShowProgramDetails(false);
    setShowDatePicker(true);
  };

  const handleDateChange = (event: any, date?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
    if (date) {
      setStartDate(date);
      if (Platform.OS === "android") {
        handleConfirmDate(date);
      }
    }
  };

  const handleConfirmDate = async (date: Date) => {
    if (!selectedProgram) return;

    try {
      await setActiveProgramId(selectedProgram.id);
      await setProgramStartDate(date.toISOString());
      setShowDatePicker(false);
      onProgramSelected();
    } catch (error) {
      console.error("Error saving program selection:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Select a Program</Text>
          <Text style={styles.subtitle}>
            Choose your training program to get started
          </Text>
        </View>

        {programs.map((program) => {
          // Calculate number of weeks from the maximum dayIndex
          const maxDayIndex = Math.max(
            ...program.workouts.map((w) => w.dayIndex)
          );
          const weekCount = Math.ceil((maxDayIndex + 1) / 7);
          const sessionsPerWeek = (program.workouts.length / weekCount)
            .toFixed(1)
            .replace(/\.0$/, "");

          return (
            <TouchableOpacity
              key={program.id}
              style={styles.programCard}
              onPress={() => handleSelectProgram(program)}
            >
              <View style={styles.programContent}>
                <Text style={styles.programName}>{program.name}</Text>
                <Text style={styles.programDescription}>
                  {program.description}
                </Text>
                <Text style={styles.programStats}>
                  {program.workouts.length} workouts • {weekCount}{" "}
                  {weekCount === 1 ? "week" : "weeks"} • {sessionsPerWeek}{" "}
                  sessions/week
                </Text>
              </View>
              <Text style={styles.selectArrow}>→</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <Modal
        visible={showProgramDetails}
        transparent
        animationType="slide"
        onRequestClose={() => setShowProgramDetails(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.programDetailsModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedProgram?.name || "Program Details"}
              </Text>
              <TouchableOpacity
                onPress={() => setShowProgramDetails(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <Text style={styles.programDescription}>
                {selectedProgram?.description}
              </Text>

              <Text style={styles.sectionTitle}>Program Overview</Text>
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>
                    {selectedProgram?.workouts.length}
                  </Text>
                  <Text style={styles.statLabel}>Workouts</Text>
                </View>
                {selectedProgram &&
                  (() => {
                    const maxDayIndex = Math.max(
                      ...selectedProgram.workouts.map((w) => w.dayIndex)
                    );
                    const weekCount = Math.ceil((maxDayIndex + 1) / 7);
                    const sessionsPerWeek = (
                      selectedProgram.workouts.length / weekCount
                    )
                      .toFixed(1)
                      .replace(/\.0$/, "");
                    return (
                      <>
                        <View style={styles.statItem}>
                          <Text style={styles.statValue}>{weekCount}</Text>
                          <Text style={styles.statLabel}>
                            {weekCount === 1 ? "Week" : "Weeks"}
                          </Text>
                        </View>
                        <View style={styles.statItem}>
                          <Text style={styles.statValue}>
                            {sessionsPerWeek}
                          </Text>
                          <Text style={styles.statLabel}>SPW</Text>
                        </View>
                      </>
                    );
                  })()}
              </View>

              <Text style={styles.sectionTitle}>Workouts</Text>
              {selectedProgram?.workouts.map((workout, index) => (
                <View key={index} style={styles.workoutItem}>
                  <Text style={styles.workoutLabel}>{workout.label}</Text>
                  {workout.description && (
                    <Text style={styles.workoutDescription}>
                      {workout.description}
                    </Text>
                  )}
                  <View style={styles.workoutMeta}>
                    <Text style={styles.workoutExercises}>
                      {workout.exercises.length} exercises
                    </Text>
                    <View style={styles.workoutIntensity}>
                      <Text style={styles.workoutIntensityLabel}>
                        Intensity:
                      </Text>
                      <View style={styles.workoutIntensityBar}>
                        {Array.from({ length: 10 }).map((_, i) => (
                          <View
                            key={i}
                            style={[
                              styles.workoutIntensityDot,
                              i < workout.intensity &&
                                styles.workoutIntensityDotFilled,
                            ]}
                          />
                        ))}
                      </View>
                      <Text style={styles.workoutIntensityValue}>
                        {workout.intensity}/10
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.startProgramButton}
                onPress={handleStartProgram}
              >
                <Text style={styles.startProgramButtonText}>Start Program</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {showDatePicker && (
        <>
          {Platform.OS === "ios" && (
            <View style={styles.datePickerContainer}>
              <View style={styles.datePickerHeader}>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(false)}
                  style={styles.cancelButton}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.datePickerTitle}>Select Start Date</Text>
                <TouchableOpacity
                  onPress={() => handleConfirmDate(startDate)}
                  style={styles.confirmButton}
                >
                  <Text style={styles.confirmButtonText}>Confirm</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.datePickerWrapper}>
                <DateTimePicker
                  value={startDate}
                  mode="date"
                  display="spinner"
                  onChange={handleDateChange}
                  style={styles.datePicker}
                />
              </View>
            </View>
          )}
          {Platform.OS === "android" && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
    paddingTop: 16,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    color: "#888",
    fontSize: 16,
    fontWeight: "500",
  },
  programCard: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  programContent: {
    flex: 1,
  },
  programName: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
  },
  programDescription: {
    color: "#CCC",
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  programStats: {
    color: "#00E676",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  selectArrow: {
    color: "#00E676",
    fontSize: 24,
    fontWeight: "600",
    marginLeft: 16,
  },
  datePickerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#1E1E1E",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    paddingBottom: 40,
    alignItems: "center",
  },
  datePickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
  },
  datePickerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    flex: 1,
    textAlign: "center",
  },
  cancelButton: {
    padding: 8,
  },
  cancelButtonText: {
    color: "#888",
    fontSize: 16,
    fontWeight: "600",
  },
  confirmButton: {
    padding: 8,
  },
  confirmButtonText: {
    color: "#00E676",
    fontSize: 16,
    fontWeight: "700",
  },
  datePickerWrapper: {
    alignItems: "center",
    width: "100%",
  },
  datePicker: {
    backgroundColor: "#1E1E1E",
    alignSelf: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "flex-end",
  },
  programDetailsModal: {
    backgroundColor: "#1E1E1E",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: "90%",
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
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
  modalContent: {
    maxHeight: 400,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
    marginTop: 8,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 24,
  },
  statItem: {
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    minWidth: 100,
  },
  statValue: {
    color: "#00E676",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  statLabel: {
    color: "#888",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  workoutItem: {
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#333",
  },
  workoutLabel: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  workoutDescription: {
    color: "#CCC",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  workoutMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  workoutExercises: {
    color: "#888",
    fontSize: 14,
  },
  workoutIntensity: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  workoutIntensityLabel: {
    color: "#888",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  workoutIntensityBar: {
    flexDirection: "row",
    gap: 3,
    alignItems: "center",
  },
  workoutIntensityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#333",
  },
  workoutIntensityDotFilled: {
    backgroundColor: "#00E676",
  },
  workoutIntensityValue: {
    color: "#888",
    fontSize: 12,
    fontWeight: "600",
  },
  modalFooter: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#2A2A2A",
  },
  startProgramButton: {
    backgroundColor: "#00E676",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  startProgramButtonText: {
    color: "#121212",
    fontSize: 16,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
