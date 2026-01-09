import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { DaySelector } from "../components/DaySelector";
import { ExerciseCard } from "../components/ExerciseCard";
import { SwapModal } from "../components/SwapModal";
import {
  getProgramById,
  Exercise as ProgramExercise,
  Workout,
} from "../utils/program";
import {
  clearFutureWorkoutData,
  getActiveProgramId,
  getExerciseSwapsForDay,
  getProgramStartDate,
  saveExerciseSwap,
  setProgramStartDate,
} from "../utils/storage";
import { RestDayScreen } from "./RestDayScreen";

interface ExerciseSlot {
  exerciseId: number | null;
  programExercise: ProgramExercise | null;
}

interface WorkoutScreenProps {
  onProgramReset?: () => void;
}

export const WorkoutScreen: React.FC<WorkoutScreenProps> = ({
  onProgramReset,
}) => {
  const [slots, setSlots] = useState<ExerciseSlot[]>([]);
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
  const [nextWorkout, setNextWorkout] = useState<Workout | null>(null);
  const [dayIndex, setDayIndex] = useState<number | null>(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [program, setProgram] = useState<ReturnType<
    typeof getProgramById
  > | null>(null);
  const [isRestDay, setIsRestDay] = useState(false);
  const [loading, setLoading] = useState(true);
  const [swapModalVisible, setSwapModalVisible] = useState(false);
  const [currentSwapSlot, setCurrentSwapSlot] = useState<number | null>(null);

  const calculateDaysSinceStart = (startDate: string): number => {
    const start = new Date(startDate);
    const today = new Date();

    // Reset time to midnight for accurate day calculation
    start.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffTime = today.getTime() - start.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const loadExerciseSlots = useCallback(async (workout: Workout, dayIdx: number) => {
    try {
      const swaps = await getExerciseSwapsForDay(dayIdx);

      const exerciseSlots: ExerciseSlot[] = workout.exercises.map(
        (programExercise, index) => {
          // Check if there's a swap for this slot
          const swappedExerciseId = swaps[index];
          return {
            exerciseId: swappedExerciseId || programExercise.id,
            programExercise: programExercise,
          };
        }
      );

      setSlots(exerciseSlots);
    } catch (error) {
      console.error("Error loading exercise slots:", error);
      setSlots([]);
    }
  }, []);

  const loadWorkoutForDay = useCallback(
    async (dayIdx: number, programData?: ReturnType<typeof getProgramById>) => {
      const programToUse = programData || program;
      if (!programToUse) return;

      // Find workout for the selected day
      const workout = programToUse.workouts.find((w) => w.dayIndex === dayIdx);

      if (workout) {
        setCurrentWorkout(workout);
        setIsRestDay(false);
        await loadExerciseSlots(workout, dayIdx);
      } else {
        setIsRestDay(true);
        // Find next workout
        const next = programToUse.workouts.find((w) => w.dayIndex > dayIdx);
        setNextWorkout(next || null);
        setCurrentWorkout(null);
        setSlots([]);
      }
    },
    [program, loadExerciseSlots]
  );

  const loadWorkoutData = useCallback(async () => {
    try {
      setLoading(true);
      const programId = await getActiveProgramId();
      const savedStartDate = await getProgramStartDate();

      if (!programId || !savedStartDate) {
        // No program selected, should show ProgramLauncher
        setLoading(false);
        return;
      }

      const loadedProgram = getProgramById(programId);
      if (!loadedProgram) {
        console.error("Program not found:", programId);
        setLoading(false);
        return;
      }

      setProgram(loadedProgram);
      setStartDate(savedStartDate);

      const daysSinceStart = calculateDaysSinceStart(savedStartDate);
      setDayIndex(daysSinceStart);
      setSelectedDayIndex(daysSinceStart);

      // Load workout for today - pass programData directly to avoid dependency on program state
      await loadWorkoutForDay(daysSinceStart, loadedProgram);

      setLoading(false);
    } catch (error) {
      console.error("Error loading workout data:", error);
      setLoading(false);
    }
  }, [loadWorkoutForDay]);

  useEffect(() => {
    loadWorkoutData();
  }, [loadWorkoutData]);

  const handleDaySelect = async (dayIdx: number) => {
    // Always allow viewing any day
    setSelectedDayIndex(dayIdx);
    await loadWorkoutForDay(dayIdx);
  };

  const handleSetAsCurrentDay = async () => {
    if (
      selectedDayIndex === null ||
      dayIndex === null ||
      selectedDayIndex === dayIndex
    ) {
      return;
    }

    // Show confirmation dialog
    Alert.alert(
      "Set as Current Session?",
      "Setting this workout as the current session will adjust the program start date so this session becomes day 0, and clear any completed days ahead of this date. Are you sure?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          style: "destructive",
          onPress: async () => {
            try {
              // Calculate the date that corresponds to the selected day index
              if (startDate) {
                const currentStart = new Date(startDate);
                currentStart.setHours(0, 0, 0, 0);

                // Calculate the date of the selected day index
                const selectedDayDate = new Date();
                selectedDayDate.setDate(
                  selectedDayDate.getDate() - selectedDayIndex
                );
                selectedDayDate.setHours(0, 0, 0, 0);

                // Clear all future workout data (from selected day onwards)
                await clearFutureWorkoutData(selectedDayIndex);

                // Set the start date to the selected day's date so it becomes index 0
                await setProgramStartDate(selectedDayDate.toISOString());
                setStartDate(selectedDayDate.toISOString());

                // Reload workout data
                await loadWorkoutData();
              }
            } catch (error) {
              console.error("Error setting current session:", error);
              Alert.alert(
                "Error",
                "Failed to set current session. Please try again."
              );
            }
          },
        },
      ]
    );
  };

  const handleSwapClick = (slotNumber: number) => {
    setCurrentSwapSlot(slotNumber);
    setSwapModalVisible(true);
  };

  const handleSelectExercise = async (exerciseId: number) => {
    if (currentSwapSlot !== null && selectedDayIndex !== null) {
      const newSlots = [...slots];
      newSlots[currentSwapSlot - 1] = {
        ...newSlots[currentSwapSlot - 1],
        exerciseId: exerciseId,
      };
      setSlots(newSlots);

      // Save the swap
      await saveExerciseSwap(selectedDayIndex, currentSwapSlot - 1, exerciseId);
    }
  };

  const handleSkipToNextWorkout = async () => {
    if (!nextWorkout) return;

    const programId = await getActiveProgramId();
    if (!programId) return;

    const program = getProgramById(programId);
    if (!program) return;

    // Update start date to skip to next workout
    const currentStartDate = await getProgramStartDate();
    if (!currentStartDate) return;

    const startDate = new Date(currentStartDate);
    const daysToSkip = nextWorkout.dayIndex - (dayIndex || 0);
    startDate.setDate(startDate.getDate() - daysToSkip);

    await setProgramStartDate(startDate.toISOString());
    await loadWorkoutData();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const workoutDayIndices = program?.workouts.map((w) => w.dayIndex) || [];

  if (isRestDay) {
    return (
      <RestDayScreen
        nextWorkout={nextWorkout}
        startDate={startDate || ""}
        workoutDayIndices={workoutDayIndices}
        currentDayIndex={selectedDayIndex || dayIndex || 0}
        onViewNextWorkout={() => {
          // For now, just show the next workout info
          // Could implement a preview modal
        }}
        onSkipToNextWorkout={handleSkipToNextWorkout}
        onDaySelect={handleDaySelect}
        onProgramReset={onProgramReset}
      />
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!currentWorkout || (slots.length === 0 && !isRestDay)) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>No workout found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {startDate && dayIndex !== null && (
        <DaySelector
          startDate={startDate}
          workoutDayIndices={workoutDayIndices}
          currentDayIndex={selectedDayIndex ?? dayIndex}
          onDaySelect={handleDaySelect}
        />
      )}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.headerTextContainer}>
              <Text style={styles.title}>{currentWorkout.label}</Text>
              {currentWorkout.description && (
                <Text style={styles.description}>
                  {currentWorkout.description}
                </Text>
              )}
              <View style={styles.intensityContainer}>
                <Text style={styles.intensityLabel}>Intensity:</Text>
                <View style={styles.intensityBar}>
                  {Array.from({ length: 10 }).map((_, i) => (
                    <View
                      key={i}
                      style={[
                        styles.intensityDot,
                        i < currentWorkout.intensity && styles.intensityDotFilled,
                      ]}
                    />
                  ))}
                </View>
                <Text style={styles.intensityValue}>{currentWorkout.intensity}/10</Text>
              </View>
            </View>
          </View>
          {dayIndex !== null &&
            selectedDayIndex !== null &&
            selectedDayIndex !== dayIndex && (
              <TouchableOpacity
                style={styles.setCurrentDayButton}
                onPress={handleSetAsCurrentDay}
              >
                <Text style={styles.setCurrentDayButtonText}>Set as Today</Text>
              </TouchableOpacity>
            )}
        </View>

        {slots.map((slot, index) => (
          <ExerciseCard
            key={`${selectedDayIndex}-${index}-${slot.exerciseId}`}
            exerciseId={slot.exerciseId}
            programExercise={slot.programExercise}
            slotNumber={index + 1}
            dayIndex={selectedDayIndex}
            slotIndex={index}
            onSwap={() => handleSwapClick(index + 1)}
          />
        ))}
      </ScrollView>
      </KeyboardAvoidingView>

      <SwapModal
        visible={swapModalVisible}
        currentExerciseId={
          currentSwapSlot !== null
            ? slots[currentSwapSlot - 1]?.exerciseId || null
            : null
        }
        originalExerciseId={
          currentSwapSlot !== null
            ? slots[currentSwapSlot - 1]?.programExercise?.id || null
            : null
        }
        dayIndex={selectedDayIndex}
        slotIndex={currentSwapSlot !== null ? currentSwapSlot - 1 : 0}
        onClose={() => {
          setSwapModalVisible(false);
          setCurrentSwapSlot(null);
        }}
        onClearData={async () => {
          // Reload workout data to refresh the exercise card
          if (selectedDayIndex !== null) {
            await loadWorkoutForDay(selectedDayIndex);
          }
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  keyboardAvoidingView: {
    flex: 1,
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
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerTextContainer: {
    flex: 1,
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
  description: {
    color: "#CCC",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 12,
    lineHeight: 20,
  },
  intensityContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  intensityLabel: {
    color: "#888",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  intensityBar: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },
  intensityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#333",
  },
  intensityDotFilled: {
    backgroundColor: "#00E676",
  },
  intensityValue: {
    color: "#888",
    fontSize: 12,
    fontWeight: "600",
  },
  setCurrentDayButton: {
    marginTop: 16,
    backgroundColor: "#00E676",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  setCurrentDayButtonText: {
    color: "#121212",
    fontSize: 14,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
});
