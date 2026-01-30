import { useSubscription } from "@/hooks/use-subscription";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getExerciseById } from "../data/exercises";
import { Program, programs } from "../utils/program";
import { setActiveProgramId, setProgramStartDate } from "../utils/storage";

interface ProgramLauncherProps {
  onProgramSelected: () => void;
}

export const ProgramLauncher: React.FC<ProgramLauncherProps> = ({
  onProgramSelected,
}) => {
  const { isPro } = useSubscription();
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [showProgramDetails, setShowProgramDetails] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [showWorkoutDaysMoreInfo, setShowWorkoutDaysMoreInfo] = useState(false);

  const handleSelectProgram = (program: Program) => {
    // Allow viewing program details regardless of Pro status
    setSelectedProgram(program);
    setShowProgramDetails(true);
  };

  const handleStartProgram = () => {
    // Double check Pro status before starting (in case entitlement changed)
    if (selectedProgram?.isPro && !isPro) {
      Alert.alert(
        "Pro Required",
        "This program requires Tempered Strength Pro. Please upgrade to continue.",
        [
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => setShowProgramDetails(false),
          },
          {
            text: "Upgrade to Pro",
            style: "default",
            onPress: () => {
              setShowProgramDetails(false);
              router.push("/paywall");
            },
          },
        ]
      );
      return;
    }

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

  const renderProgramCard = (program: Program, isLocked: boolean) => {
    // Calculate number of weeks from the maximum dayIndex
    const maxDayIndex = Math.max(...program.workouts.map((w) => w.dayIndex));
    const weekCount = Math.ceil((maxDayIndex + 1) / 7);
    // Calculate sessions per week from daysSplit if available
    const sessionsPerWeek = program.daysSplit?.length || 0;

    return (
      <TouchableOpacity
        key={program.id}
        style={[styles.programCard, isLocked && styles.programCardLocked]}
        onPress={() => handleSelectProgram(program)}
        disabled={false} // Always allow press to show upgrade prompt
      >
        <View style={styles.programContent}>
          <View style={styles.programNameRow}>
            <Text
              style={[styles.programName, isLocked && styles.programNameLocked]}
            >
              {program.name}
            </Text>
            {program.isPro && (
              <View style={styles.proBadge}>
                <Text style={styles.proBadgeText}>PRO</Text>
              </View>
            )}
          </View>
          <Text
            style={[
              styles.programDescription,
              isLocked && styles.programDescriptionLocked,
            ]}
          >
            {program.description}
          </Text>
          <Text style={styles.programStats}>
            {program.workouts.length} workouts • {weekCount}{" "}
            {weekCount === 1 ? "week" : "weeks"}
            {sessionsPerWeek > 0 && ` • ${sessionsPerWeek} sessions/week`}
            {program.averageSessionDuration && ` • ${program.averageSessionDuration}`}
          </Text>
        </View>
        <Text
          style={[styles.selectArrow, isLocked && styles.selectArrowLocked]}
        >
          →
        </Text>
      </TouchableOpacity>
    );
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

        {programs.map((program) =>
          renderProgramCard(program, program.isPro && !isPro)
        )}
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
              <View style={styles.modalTitleRow}>
                <Text style={styles.modalTitle}>
                  {selectedProgram?.name || "Program Details"}
                </Text>
                {selectedProgram?.isPro && (
                  <View style={styles.proBadge}>
                    <Text style={styles.proBadgeText}>PRO</Text>
                  </View>
                )}
              </View>
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

            <View style={styles.programOverviewContainer}>
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
                    return (
                      <View style={styles.statItem}>
                        <Text style={styles.statValue}>{weekCount}</Text>
                        <Text style={styles.statLabel}>
                          {weekCount === 1 ? "Week" : "Weeks"}
                        </Text>
                      </View>
                    );
                  })()}
              </View>

              {selectedProgram?.averageSessionDuration && (
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>
                    {selectedProgram.averageSessionDuration}
                  </Text>
                  <Text style={styles.statLabel}>Avg Session</Text>
                </View>
              )}
</View>

              {selectedProgram?.daysSplit && (
                <View>
                  <View style={styles.workoutDaysTitleRow}>
                    <View>
                      <Text style={styles.workoutTitle}>Workout Days</Text>
                    </View>
                    <View>
                      <TouchableOpacity style={styles.changeDaysButton} onPress={() => setShowWorkoutDaysMoreInfo(!showWorkoutDaysMoreInfo)}>
                        <Text style={styles.moreInfoButtonText}>Change Days?</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  {showWorkoutDaysMoreInfo && (
                    <Text style={styles.programDescription}>
                    The first session working day will be the first day of the program you select. You can change the session days at any time in the program once started.
                  </Text>
                  )}
                  <View style={styles.daysSplitContainer}>
                    <View
                      style={[
                        styles.dayItem,
                        selectedProgram.daysSplit.includes("mon") &&
                          styles.dayItemSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.dayLabel,
                          selectedProgram.daysSplit.includes("mon") &&
                            styles.dayLabelSelected,
                        ]}
                      >
                        M
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.dayItem,
                        selectedProgram.daysSplit.includes("tue") &&
                          styles.dayItemSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.dayLabel,
                          selectedProgram.daysSplit.includes("tue") &&
                            styles.dayLabelSelected,
                        ]}
                      >
                        T
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.dayItem,
                        selectedProgram.daysSplit.includes("wed") &&
                          styles.dayItemSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.dayLabel,
                          selectedProgram.daysSplit.includes("wed") &&
                            styles.dayLabelSelected,
                        ]}
                      >
                        W
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.dayItem,
                        selectedProgram.daysSplit.includes("thu") &&
                          styles.dayItemSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.dayLabel,
                          selectedProgram.daysSplit.includes("thu") &&
                            styles.dayLabelSelected,
                        ]}
                      >
                        T
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.dayItem,
                        selectedProgram.daysSplit.includes("fri") &&
                          styles.dayItemSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.dayLabel,
                          selectedProgram.daysSplit.includes("fri") &&
                            styles.dayLabelSelected,
                        ]}
                      >
                        F
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.dayItem,
                        selectedProgram.daysSplit.includes("sat") &&
                          styles.dayItemSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.dayLabel,
                          selectedProgram.daysSplit.includes("sat") &&
                            styles.dayLabelSelected,
                        ]}
                      >
                        S
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.dayItem,
                        selectedProgram.daysSplit.includes("sun") &&
                          styles.dayItemSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.dayLabel,
                          selectedProgram.daysSplit.includes("sun") &&
                            styles.dayLabelSelected,
                        ]}
                      >
                        S
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              <Text style={styles.sectionTitle}>Workouts</Text>
              {selectedProgram?.workouts.map((workout, index) => (
                <View key={index} style={styles.workoutItem}>
                  <Text style={styles.workoutLabel}>{workout.label}</Text>
                  {workout.description && (
                    <Text style={styles.workoutDescription}>
                      {workout.description}
                    </Text>
                  )}
                  {(() => {
                    const exerciseIds = workout.exercises
                      .filter((ex) => ex.type === "exercise")
                      .map((ex) => (ex as { id: number }).id);
                    const exerciseNames = exerciseIds
                      .map((id) => getExerciseById(id)?.name)
                      .filter((name): name is string => name !== undefined);
                    return exerciseNames.length > 0 ? (
                      <Text style={styles.workoutExercisesList}>
                        {exerciseNames.join(", ")}
                      </Text>
                    ) : null;
                  })()}
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
              {selectedProgram?.isPro && !isPro ? (
                <TouchableOpacity
                  style={styles.upgradeProgramButton}
                  onPress={() => {
                    setShowProgramDetails(false);
                    router.push("/paywall");
                  }}
                >
                  <Text style={styles.upgradeProgramButtonText}>
                    Upgrade to Pro to Start
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.startProgramButton}
                  onPress={handleStartProgram}
                >
                  <Text style={styles.startProgramButtonText}>
                    Start Program
                  </Text>
                </TouchableOpacity>
              )}
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
  programOverviewContainer: {
    marginBottom: 24,
  },
  workoutDaysTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 8,
    marginTop: 8,
  },
  changeDaysButton: {
    padding: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#c9b072",
  },
  moreInfoButtonText: {
    color: "#c9b072",
    fontSize: 9,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
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
  programCardLocked: {
    opacity: 0.7,
    borderColor: "#c9b072",
  },
  programContent: {
    flex: 1,
  },
  programNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
    flexWrap: "wrap",
  },
  programName: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
  },
  programNameLocked: {
    color: "#888",
  },
  programDescription: {
    color: "#CCC",
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  programDescriptionLocked: {
    color: "#666",
  },
  programStats: {
    color: "#c9b072",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  selectArrow: {
    color: "#c9b072",
    fontSize: 24,
    fontWeight: "600",
    marginLeft: 16,
  },
  selectArrowLocked: {
    color: "#666",
  },
  proBadge: {
    backgroundColor: "#c9b072",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  proBadgeText: {
    color: "#000000",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
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
    color: "#c9b072",
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
    maxHeight: "95%",
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
    flexWrap: "wrap",
  },
  modalTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#2A2A2A",
    alignItems: "center",
    justifyContent: "center",
  },
  daysSplitContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 24,
  },
  dayItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2A2A2A",
    borderRadius: 8,
    padding: 8,
  },
  dayLabel: {
    color: "#888",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  dayItemSelected: {
    backgroundColor: "#c9b072",
  },
  dayLabelSelected: {
    color: "#000000",
  },
  closeButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  modalContent: {
    maxHeight: 500,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
    marginTop: 8,
  },
  workoutTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  statsContainer: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    minWidth: 100,
  },
  statValue: {
    color: "#c9b072",
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
  workoutExercisesList: {
    color: "#c9b072",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
    fontStyle: "italic",
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
    backgroundColor: "#c9b072",
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
    backgroundColor: "#c9b072",
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
  upgradeProgramButton: {
    backgroundColor: "transparent",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#c9b072",
  },
  upgradeProgramButtonText: {
    color: "#c9b072",
    fontSize: 16,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
