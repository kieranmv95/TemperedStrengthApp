import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { getExerciseById } from "../data/exercises";
import { Exercise as ProgramExercise } from "../utils/program";
import {
  clearLoggedSet,
  getCustomSetCount,
  getLoggedSets,
  saveCustomSetCount,
  saveLoggedSet,
} from "../utils/storage";

interface ExerciseCardProps {
  exerciseId: number | null;
  programExercise: ProgramExercise | null;
  slotNumber: number;
  dayIndex: number | null;
  slotIndex: number;
  onSwap: () => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exerciseId,
  programExercise,
  slotNumber,
  dayIndex,
  slotIndex,
  onSwap,
}) => {
  const [weights, setWeights] = useState<string[]>([]);
  const [reps, setReps] = useState<string[]>([]);
  const [setStates, setSetStates] = useState<
    Map<number, "completed" | "failed">
  >(new Map());
  const [loading, setLoading] = useState(false);
  const saveTimersRef = useRef<{
    [key: number]: ReturnType<typeof setTimeout>;
  }>({});

  const exercise = exerciseId ? getExerciseById(exerciseId) : null;
  const defaultNumberOfSets = programExercise?.sets || 1;
  const [numberOfSets, setNumberOfSets] = useState(defaultNumberOfSets);

  // Check if exercise has been swapped (deviation from program)
  const isSwapped =
    exerciseId !== null &&
    programExercise !== null &&
    exerciseId !== programExercise.id;

  // Load custom set count and logged sets from storage
  useEffect(() => {
    const loadData = async () => {
      if (dayIndex !== null && programExercise) {
        try {
          // Load custom set count
          const customCount = await getCustomSetCount(dayIndex, slotIndex);
          const actualSetCount = customCount ?? defaultNumberOfSets;
          setNumberOfSets(actualSetCount);

          const savedSets = await getLoggedSets(dayIndex, slotIndex);

          // Initialize arrays with saved data or empty strings
          const initialWeights: string[] = [];
          const initialReps: string[] = [];
          const initialSetStates: Map<number, "completed" | "failed"> =
            new Map();

          for (let i = 0; i < actualSetCount; i++) {
            if (savedSets[i]) {
              initialWeights[i] = savedSets[i].weight.toString();
              initialReps[i] = savedSets[i].reps.toString();
              // Restore state from storage if available (excluding null which means unchecked)
              if (savedSets[i].state && savedSets[i].state !== null) {
                const state = savedSets[i].state;
                if (state === "completed" || state === "failed") {
                  initialSetStates.set(i, state);
                }
              }
            } else {
              initialWeights[i] = "";
              initialReps[i] = "";
            }
          }

          setWeights(initialWeights);
          setReps(initialReps);
          setSetStates(initialSetStates);
        } catch (error) {
          console.error("Error loading data:", error);
          // Initialize with empty arrays if error
          setWeights(Array(defaultNumberOfSets).fill(""));
          setReps(Array(defaultNumberOfSets).fill(""));
          setNumberOfSets(defaultNumberOfSets);
        }
      } else {
        // Initialize arrays for sets
        setWeights(Array(defaultNumberOfSets).fill(""));
        setReps(Array(defaultNumberOfSets).fill(""));
        setSetStates(new Map());
        setNumberOfSets(defaultNumberOfSets);
      }
    };

    loadData();
  }, [programExercise, defaultNumberOfSets, dayIndex, slotIndex, exerciseId]);

  // Cleanup timers on unmount
  useEffect(() => {
    const timers = saveTimersRef.current;
    return () => {
      Object.values(timers).forEach((timer) => {
        if (timer) clearTimeout(timer);
      });
    };
  }, []);

  const autoSaveSet = async (
    setIndex: number,
    weightStr: string,
    repsStr: string
  ) => {
    if (!exerciseId || dayIndex === null || !weightStr || !repsStr) {
      return;
    }

    const weightNum = parseFloat(weightStr);
    const repsNum = parseInt(repsStr, 10);

    if (isNaN(weightNum) || isNaN(repsNum) || weightNum <= 0 || repsNum <= 0) {
      return;
    }

    try {
      // Preserve existing state when auto-saving
      const currentState = setStates.get(setIndex);
      await saveLoggedSet(
        dayIndex,
        slotIndex,
        setIndex,
        weightNum,
        repsNum,
        currentState
      );
    } catch (error) {
      console.error("Error auto-saving set:", error);
    }
  };

  const handleWeightChange = (setIndex: number, value: string) => {
    const newWeights = [...weights];
    newWeights[setIndex] = value;
    setWeights(newWeights);

    // Clear existing timer for this set
    if (saveTimersRef.current[setIndex]) {
      clearTimeout(saveTimersRef.current[setIndex]);
    }

    // Auto-save after 500ms of no typing
    saveTimersRef.current[setIndex] = setTimeout(() => {
      autoSaveSet(setIndex, value, reps[setIndex] || "");
    }, 500);
  };

  const handleRepsChange = (setIndex: number, value: string) => {
    const newReps = [...reps];
    newReps[setIndex] = value;
    setReps(newReps);

    // Clear existing timer for this set
    if (saveTimersRef.current[setIndex]) {
      clearTimeout(saveTimersRef.current[setIndex]);
    }

    // Auto-save after 500ms of no typing
    saveTimersRef.current[setIndex] = setTimeout(() => {
      autoSaveSet(setIndex, weights[setIndex] || "", value);
    }, 500);
  };

  const handleToggleSetState = async (setIndex: number) => {
    if (
      !exerciseId ||
      !weights[setIndex] ||
      !reps[setIndex] ||
      dayIndex === null
    ) {
      return;
    }

    const weightNum = parseFloat(weights[setIndex]);
    const repsNum = parseInt(reps[setIndex], 10);

    if (isNaN(weightNum) || isNaN(repsNum) || weightNum <= 0 || repsNum <= 0) {
      return;
    }

    setLoading(true);
    try {
      const currentState = setStates.get(setIndex);
      const newSetStates = new Map(setStates);

      // Cycle through states: none -> completed -> failed -> none
      if (currentState === undefined) {
        // Default -> Completed (green)
        newSetStates.set(setIndex, "completed");
        await saveLoggedSet(
          dayIndex,
          slotIndex,
          setIndex,
          weightNum,
          repsNum,
          "completed"
        );
      } else if (currentState === "completed") {
        // Completed -> Failed (red)
        newSetStates.set(setIndex, "failed");
        await saveLoggedSet(
          dayIndex,
          slotIndex,
          setIndex,
          weightNum,
          repsNum,
          "failed"
        );
      } else if (currentState === "failed") {
        // Failed -> Default (explicitly unchecked)
        newSetStates.delete(setIndex);
        await saveLoggedSet(
          dayIndex,
          slotIndex,
          setIndex,
          weightNum,
          repsNum,
          null
        );
      }

      setSetStates(newSetStates);
    } catch (error) {
      console.error("Error toggling set state:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!exercise) {
    return (
      <View style={styles.card}>
        <View style={styles.slotHeader}>
          <Text style={styles.slotLabel}>Slot {slotNumber}: Empty</Text>
          <TouchableOpacity style={styles.swapButton} onPress={onSwap}>
            <Text style={styles.swapButtonText}>Add Exercise</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Build rep range text based on exercise logging type
  let repRangeText: string | null = null;

  if (!programExercise?.hideReps) {
    if (programExercise?.isAmrap) {
      repRangeText = "MAX REPS (AMRAP)";
    } else if (programExercise?.repRange) {
      const [min, max] = programExercise.repRange;
      const unit = exercise?.logging_type === "time" ? "seconds" : "reps";

      // If min and max are the same, just show the single value
      if (min === max) {
        repRangeText = `${min} ${unit}`;
      } else {
        repRangeText = `${min}-${max} ${unit}`;
      }
    }
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.exerciseName}>
            {exercise.name}
            {!isSwapped && programExercise?.additionalHeader && (
              <Text style={styles.additionalHeader}>
                {" - " + programExercise.additionalHeader}
              </Text>
            )}
          </Text>
          {repRangeText && (
            <Text
              style={[
                styles.repRangeLabel,
                programExercise?.isAmrap && styles.amrapLabel,
              ]}
            >
              {repRangeText}
            </Text>
          )}
          {!isSwapped && programExercise?.additionalDescription && (
            <Text style={styles.additionalDescription}>
              {programExercise.additionalDescription}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.setsHeader}>
        <Text style={styles.setsLabel}>Sets</Text>
        <View style={styles.setControls}>
          <TouchableOpacity
            style={[
              styles.setControlButton,
              numberOfSets <= 1 && styles.setControlButtonDisabled,
            ]}
            onPress={async () => {
              if (numberOfSets > 1 && dayIndex !== null) {
                const newCount = numberOfSets - 1;
                setNumberOfSets(newCount);
                setWeights((prev) => prev.slice(0, newCount));
                setReps((prev) => prev.slice(0, newCount));

                // Remove set states for removed sets
                const newSetStates = new Map(setStates);
                for (let i = newCount; i < numberOfSets; i++) {
                  newSetStates.delete(i);
                }
                setSetStates(newSetStates);

                // Save custom set count
                await saveCustomSetCount(dayIndex, slotIndex, newCount);

                // Clear logged sets for removed set indices
                try {
                  for (let i = newCount; i < numberOfSets; i++) {
                    await clearLoggedSet(dayIndex, slotIndex, i);
                  }
                } catch (error) {
                  console.error("Error clearing removed sets:", error);
                }
              }
            }}
            disabled={numberOfSets <= 1}
          >
            <Ionicons
              name="remove-circle-outline"
              size={24}
              color={numberOfSets <= 1 ? "#444" : "#00E676"}
            />
          </TouchableOpacity>
          <Text style={styles.setCountText}>{numberOfSets}</Text>
          <TouchableOpacity
            style={styles.setControlButton}
            onPress={async () => {
              if (dayIndex !== null) {
                const newCount = numberOfSets + 1;
                setNumberOfSets(newCount);
                setWeights((prev) => [...prev, ""]);
                setReps((prev) => [...prev, ""]);

                // Save custom set count
                await saveCustomSetCount(dayIndex, slotIndex, newCount);
              }
            }}
          >
            <Ionicons name="add-circle-outline" size={24} color="#00E676" />
          </TouchableOpacity>
        </View>
      </View>

      {Array.from({ length: numberOfSets }).map((_, setIndex) => {
        const setState = setStates.get(setIndex);
        const isCompleted = setState === "completed";
        const isFailed = setState === "failed";
        const canLog = weights[setIndex] && reps[setIndex] && !loading;
        const isFirstSet = setIndex === 0;

        return (
          <View key={setIndex} style={styles.setContainer}>
            <View style={styles.inputContainer}>
              <View style={styles.inputGroup}>
                {isFirstSet && (
                  <Text style={styles.inputLabel}>Weight (kg)</Text>
                )}
                <TextInput
                  style={[
                    styles.input,
                    isCompleted && styles.inputCompleted,
                    isFailed && styles.inputFailed,
                  ]}
                  value={weights[setIndex] || ""}
                  onChangeText={(value) => handleWeightChange(setIndex, value)}
                  keyboardType="numeric"
                  returnKeyType="done"
                  blurOnSubmit={true}
                  placeholder="0"
                  placeholderTextColor="#666"
                />
              </View>

              <View style={styles.inputGroupWithCheckmark}>
                <View style={styles.inputGroup}>
                  {isFirstSet && (
                    <Text style={styles.inputLabel}>
                      {exercise.logging_type === "time" ? "Time" : "Reps"}
                    </Text>
                  )}
                  <TextInput
                    style={[
                      styles.input,
                      isCompleted && styles.inputCompleted,
                      isFailed && styles.inputFailed,
                    ]}
                    value={reps[setIndex] || ""}
                    onChangeText={(value) => handleRepsChange(setIndex, value)}
                    keyboardType="numeric"
                    returnKeyType="done"
                    blurOnSubmit={true}
                    placeholder="0"
                    placeholderTextColor="#666"
                  />
                </View>
                <TouchableOpacity
                  style={[
                    styles.checkmarkButton,
                    !canLog && styles.checkmarkButtonDisabled,
                  ]}
                  onPress={() => handleToggleSetState(setIndex)}
                  disabled={!canLog}
                >
                  <Ionicons
                    name={
                      setState ? "checkmark-circle" : "checkmark-circle-outline"
                    }
                    size={32}
                    color={
                      isCompleted ? "#00E676" : isFailed ? "#FF6B6B" : "#666"
                    }
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
      })}

      {programExercise?.canSwap !== false && (
        <View style={styles.swapButtonContainer}>
          <TouchableOpacity style={styles.swapButton} onPress={onSwap}>
            <Text style={styles.swapButtonText}>Swap Exercise</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  header: {
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  exerciseName: {
    color: "#00E676",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  additionalHeader: {
    color: "#CCC",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },
  additionalDescription: {
    color: "#CCC",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
    marginTop: 12,
  },
  repRangeLabel: {
    color: "#CCC",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  amrapLabel: {
    color: "#FF4444",
    fontWeight: "800",
  },
  setsHeader: {
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  setsLabel: {
    color: "#888",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  setControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  setControlButton: {
    padding: 4,
  },
  setControlButtonDisabled: {
    opacity: 0.3,
  },
  setCountText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    minWidth: 24,
    textAlign: "center",
  },
  setContainer: {
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 0,
  },
  inputGroup: {
    flex: 1,
  },
  inputGroupWithCheckmark: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },
  inputLabel: {
    color: "#CCC",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: "#2A2A2A",
    borderRadius: 8,
    padding: 12,
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    borderWidth: 1,
    borderColor: "#333",
  },
  inputCompleted: {
    borderColor: "#00E676",
    borderWidth: 2,
  },
  inputFailed: {
    borderColor: "#FF6B6B",
    borderWidth: 2,
  },
  checkmarkButton: {
    paddingBottom: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  checkmarkButtonDisabled: {
    opacity: 0.3,
  },
  swapButtonContainer: {
    marginTop: 8,
  },
  swapButton: {
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#00E676",
    alignItems: "center",
    justifyContent: "center",
  },
  swapButtonText: {
    color: "#00E676",
    fontSize: 14,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  slotHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  slotLabel: {
    color: "#00E676",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
});
