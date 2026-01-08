import React, { useCallback, useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CoachFeedback } from "../components/CoachFeedback";
import { ExerciseCard } from "../components/ExerciseCard";
import { SettingsModal } from "../components/SettingsModal";
import { SwapModal } from "../components/SwapModal";
import {
  getProgramById,
  Exercise as ProgramExercise,
  Workout,
} from "../utils/program";
import {
  getActiveProgramId,
  getExerciseSwapsForDay,
  getProgramStartDate,
  saveExerciseSwap,
  setProgramStartDate,
} from "../utils/storage";
import { RestDayScreen } from "./RestDayScreen";

interface ExerciseSlot {
  exerciseId: string | null;
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
  const [isRestDay, setIsRestDay] = useState(false);
  const [loading, setLoading] = useState(true);
  const [swapModalVisible, setSwapModalVisible] = useState(false);
  const [currentSwapSlot, setCurrentSwapSlot] = useState<number | null>(null);
  const [coachModalVisible, setCoachModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [lastLoggedWeight, setLastLoggedWeight] = useState<number>(0);

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

  const loadWorkoutData = useCallback(async () => {
    try {
      setLoading(true);
      const programId = await getActiveProgramId();
      const startDate = await getProgramStartDate();

      if (!programId || !startDate) {
        // No program selected, should show ProgramLauncher
        setLoading(false);
        return;
      }

      const program = getProgramById(programId);
      if (!program) {
        console.error("Program not found:", programId);
        setLoading(false);
        return;
      }

      const daysSinceStart = calculateDaysSinceStart(startDate);
      setDayIndex(daysSinceStart);

      // Find workout for today
      const workout = program.workouts.find(
        (w) => w.dayIndex === daysSinceStart
      );

      if (workout) {
        setCurrentWorkout(workout);
        setIsRestDay(false);
        await loadExerciseSlots(workout, daysSinceStart);
      } else {
        setIsRestDay(true);
        // Find next workout
        const next = program.workouts.find((w) => w.dayIndex > daysSinceStart);
        setNextWorkout(next || null);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error loading workout data:", error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWorkoutData();
  }, [loadWorkoutData]);

  const loadExerciseSlots = async (workout: Workout, dayIdx: number) => {
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
    }
  };

  const handleSwapClick = (slotNumber: number) => {
    setCurrentSwapSlot(slotNumber);
    setSwapModalVisible(true);
  };

  const handleSelectExercise = async (exerciseId: string) => {
    if (currentSwapSlot !== null && dayIndex !== null) {
      const newSlots = [...slots];
      newSlots[currentSwapSlot - 1] = {
        ...newSlots[currentSwapSlot - 1],
        exerciseId: exerciseId,
      };
      setSlots(newSlots);

      // Save the swap
      await saveExerciseSwap(dayIndex, currentSwapSlot - 1, exerciseId);
    }
  };

  const handleSetLogged = (weight: number) => {
    setLastLoggedWeight(weight);
    setCoachModalVisible(true);
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

  if (isRestDay) {
    return (
      <RestDayScreen
        nextWorkout={nextWorkout}
        onViewNextWorkout={() => {
          // For now, just show the next workout info
          // Could implement a preview modal
        }}
        onSkipToNextWorkout={handleSkipToNextWorkout}
      />
    );
  }

  if (!currentWorkout || slots.length === 0) {
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
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.headerTextContainer}>
              <Text style={styles.title}>{currentWorkout.label}</Text>
              <Text style={styles.subtitle}>
                Track your sets, adapt your training
              </Text>
            </View>
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => setSettingsModalVisible(true)}
            >
              <Text style={styles.settingsButtonText}>⚙️</Text>
            </TouchableOpacity>
          </View>
        </View>

        {slots.map((slot, index) => (
          <ExerciseCard
            key={index}
            exerciseId={slot.exerciseId}
            programExercise={slot.programExercise}
            slotNumber={index + 1}
            dayIndex={dayIndex}
            slotIndex={index}
            onSwap={() => handleSwapClick(index + 1)}
            onSetLogged={handleSetLogged}
          />
        ))}
      </ScrollView>

      <SwapModal
        visible={swapModalVisible}
        currentExerciseId={
          currentSwapSlot !== null
            ? slots[currentSwapSlot - 1]?.exerciseId || null
            : null
        }
        onClose={() => {
          setSwapModalVisible(false);
          setCurrentSwapSlot(null);
        }}
        onSelectExercise={handleSelectExercise}
      />

      <CoachFeedback
        visible={coachModalVisible}
        currentWeight={lastLoggedWeight}
        onClose={() => setCoachModalVisible(false)}
      />

      <SettingsModal
        visible={settingsModalVisible}
        onClose={() => setSettingsModalVisible(false)}
        onProgramReset={() => {
          if (onProgramReset) {
            onProgramReset();
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
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1E1E1E",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 16,
  },
  settingsButtonText: {
    fontSize: 20,
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
