import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { DaySelector } from "../components/DaySelector";
import { ExerciseCard } from "../components/ExerciseCard";
import { SwapModal } from "../components/SwapModal";
import {
  getProgramById,
  Exercise as ProgramExercise,
  Warmup,
  Workout,
} from "../utils/program";
import {
  clearFutureWorkoutData,
  getActiveProgramId,
  getExerciseSwapsForDay,
  getProgramStartDate,
  getWorkoutNotes,
  saveWorkoutNotes,
  setProgramStartDate,
} from "../utils/storage";
import { RestDayScreen } from "./RestDayScreen";

interface ExerciseSlot {
  type: "exercise";
  exerciseId: number | null;
  programExercise: ProgramExercise | null;
}

interface WarmupSlot {
  type: "warmup";
  warmup: Warmup;
}

type WorkoutSlot = ExerciseSlot | WarmupSlot;

interface WorkoutScreenProps {
  onProgramReset?: () => void;
}

export const WorkoutScreen: React.FC<WorkoutScreenProps> = ({
  onProgramReset,
}) => {
  const [slots, setSlots] = useState<WorkoutSlot[]>([]);
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
  const [swapRefreshCounter, setSwapRefreshCounter] = useState(0);
  const [notes, setNotes] = useState<string>("");
  const [isNotesExpanded, setIsNotesExpanded] = useState(false);
  const notesDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const loadExerciseSlots = useCallback(
    async (workout: Workout, dayIdx: number) => {
      try {
        const swaps = await getExerciseSwapsForDay(dayIdx);

        // Track exercise slot index separately (warmups don't count for swap indices)
        let exerciseSlotIndex = 0;

        const workoutSlots: WorkoutSlot[] = workout.exercises.map((item) => {
          if (item.type === "warmup") {
            return {
              type: "warmup" as const,
              warmup: item,
            };
          } else {
            // It's an exercise
            const currentIndex = exerciseSlotIndex;
            exerciseSlotIndex++;
            const swappedExerciseId = swaps[currentIndex];
            return {
              type: "exercise" as const,
              exerciseId: swappedExerciseId || item.id,
              programExercise: item,
            };
          }
        });

        setSlots(workoutSlots);
      } catch (error) {
        console.error("Error loading exercise slots:", error);
        setSlots([]);
      }
    },
    []
  );

  const loadWorkoutForDay = useCallback(
    async (dayIdx: number, programData?: ReturnType<typeof getProgramById>) => {
      const programToUse = programData || program;
      if (!programToUse) return;

      // Load notes for this day
      const savedNotes = await getWorkoutNotes(dayIdx);
      setNotes(savedNotes);
      setIsNotesExpanded(savedNotes.length > 0);

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

  const handleSwapClick = (exerciseSlotIndex: number) => {
    setCurrentSwapSlot(exerciseSlotIndex);
    setSwapModalVisible(true);
  };

  // Get only exercise slots for swap modal calculations
  const getExerciseSlots = useCallback(() => {
    return slots.filter(
      (slot): slot is ExerciseSlot => slot.type === "exercise"
    );
  }, [slots]);

  // Handle notes change with debounced save
  const handleNotesChange = useCallback(
    (text: string) => {
      setNotes(text);

      // Clear existing debounce timer
      if (notesDebounceRef.current) {
        clearTimeout(notesDebounceRef.current);
      }

      // Debounce save to avoid too many writes
      notesDebounceRef.current = setTimeout(async () => {
        if (selectedDayIndex !== null) {
          try {
            await saveWorkoutNotes(selectedDayIndex, text);
          } catch (error) {
            console.error("Error saving notes:", error);
          }
        }
      }, 500);
    },
    [selectedDayIndex]
  );

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (notesDebounceRef.current) {
        clearTimeout(notesDebounceRef.current);
      }
    };
  }, []);

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
                          i < currentWorkout.intensity &&
                            styles.intensityDotFilled,
                        ]}
                      />
                    ))}
                  </View>
                  <Text style={styles.intensityValue}>
                    {currentWorkout.intensity}/10
                  </Text>
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
                  <Text style={styles.setCurrentDayButtonText}>
                    Set as Today
                  </Text>
                </TouchableOpacity>
              )}
          </View>

          {(() => {
            let exerciseSlotIndex = 0;
            return slots.map((slot, index) => {
              if (slot.type === "warmup") {
                return (
                  <View key={`warmup-${index}`} style={styles.warmupCard}>
                    <Text style={styles.warmupTitle}>Warm-Up</Text>
                    {slot.warmup.additionalDescription && (
                      <Text style={styles.warmupDescription}>
                        {slot.warmup.additionalDescription}
                      </Text>
                    )}
                    <View style={styles.warmupList}>
                      {slot.warmup.description.map((item, itemIndex) => (
                        <View key={itemIndex} style={styles.warmupItem}>
                          <Text style={styles.warmupBullet}>•</Text>
                          <Text style={styles.warmupText}>{item}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                );
              } else {
                const currentExerciseIndex = exerciseSlotIndex;
                exerciseSlotIndex++;
                return (
                  <ExerciseCard
                    key={`${selectedDayIndex}-${index}-${slot.exerciseId}-${swapRefreshCounter}`}
                    exerciseId={slot.exerciseId}
                    programExercise={slot.programExercise}
                    slotNumber={currentExerciseIndex + 1}
                    dayIndex={selectedDayIndex}
                    slotIndex={currentExerciseIndex}
                    onSwap={() => handleSwapClick(currentExerciseIndex)}
                  />
                );
              }
            });
          })()}

          {/* Notes Section */}
          <View style={styles.notesContainer}>
            <TouchableOpacity
              style={styles.notesHeader}
              onPress={() => setIsNotesExpanded(!isNotesExpanded)}
              activeOpacity={0.7}
            >
              <Text style={styles.notesTitle}>Notes</Text>
              <View style={styles.notesHeaderRight}>
                {notes.length > 0 && !isNotesExpanded && (
                  <View style={styles.notesBadge}>
                    <Text style={styles.notesBadgeText}>Has notes</Text>
                  </View>
                )}
                <Text style={styles.notesExpandIcon}>
                  {isNotesExpanded ? "▼" : "▶"}
                </Text>
              </View>
            </TouchableOpacity>
            {isNotesExpanded && (
              <TextInput
                style={styles.notesInput}
                value={notes}
                onChangeText={handleNotesChange}
                placeholder="Add notes for this workout..."
                placeholderTextColor="#666"
                multiline
                textAlignVertical="top"
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <SwapModal
        visible={swapModalVisible}
        currentExerciseId={
          currentSwapSlot !== null
            ? getExerciseSlots()[currentSwapSlot]?.exerciseId || null
            : null
        }
        originalExerciseId={
          currentSwapSlot !== null
            ? getExerciseSlots()[currentSwapSlot]?.programExercise?.id || null
            : null
        }
        dayIndex={selectedDayIndex}
        slotIndex={currentSwapSlot !== null ? currentSwapSlot : 0}
        onClose={() => {
          setSwapModalVisible(false);
          setCurrentSwapSlot(null);
        }}
        onClearData={async () => {
          // Reload workout data to refresh the exercise card
          if (selectedDayIndex !== null) {
            await loadWorkoutForDay(selectedDayIndex);
            // Increment refresh counter to force all ExerciseCard components to remount and refresh swap count
            setSwapRefreshCounter((prev) => prev + 1);
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
    fontSize: 28,
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
    backgroundColor: "#c9b072",
  },
  intensityValue: {
    color: "#888",
    fontSize: 12,
    fontWeight: "600",
  },
  setCurrentDayButton: {
    marginTop: 16,
    backgroundColor: "#c9b072",
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
  warmupCard: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  warmupTitle: {
    color: "#c9b072",
    fontSize: 16,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  warmupDescription: {
    color: "#888",
    fontSize: 14,
    fontStyle: "italic",
    marginBottom: 12,
    lineHeight: 20,
  },
  warmupList: {
    gap: 8,
  },
  warmupItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  warmupBullet: {
    color: "#c9b072",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 1,
  },
  warmupText: {
    color: "#CCCCCC",
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  notesContainer: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    overflow: "hidden",
  },
  notesHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  notesTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  notesHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  notesBadge: {
    backgroundColor: "#333",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  notesBadgeText: {
    color: "#888",
    fontSize: 12,
    fontWeight: "500",
  },
  notesExpandIcon: {
    color: "#888",
    fontSize: 12,
  },
  notesInput: {
    color: "#FFFFFF",
    fontSize: 14,
    lineHeight: 22,
    padding: 16,
    paddingTop: 0,
    minHeight: 100,
  },
});
