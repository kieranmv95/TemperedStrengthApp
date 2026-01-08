import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getExerciseById } from '../data/exercises';
import { getLastWeight, saveSet, saveLoggedSet, getLoggedSets, hasLoggedSets } from '../utils/storage';
import { Exercise as ProgramExercise } from '../utils/program';

interface ExerciseCardProps {
  exerciseId: string | null;
  programExercise: ProgramExercise | null;
  slotNumber: number;
  dayIndex: number | null;
  slotIndex: number;
  onSwap: () => void;
  onSetLogged: (weight: number) => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exerciseId,
  programExercise,
  slotNumber,
  dayIndex,
  slotIndex,
  onSwap,
  onSetLogged,
}) => {
  const [weights, setWeights] = useState<string[]>([]);
  const [reps, setReps] = useState<string[]>([]);
  const [loggedSets, setLoggedSets] = useState<Set<number>>(new Set());
  const [previousWeight, setPreviousWeight] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasAnyLoggedSets, setHasAnyLoggedSets] = useState(false);

  const exercise = exerciseId ? getExerciseById(exerciseId) : null;
  const numberOfSets = programExercise?.sets || 1;

  // Load logged sets from storage
  useEffect(() => {
    const loadLoggedSets = async () => {
      if (dayIndex !== null && programExercise) {
        try {
          const savedSets = await getLoggedSets(dayIndex, slotIndex);
          const hasLogged = await hasLoggedSets(dayIndex, slotIndex);
          setHasAnyLoggedSets(hasLogged);

          // Initialize arrays with saved data or empty strings
          const initialWeights: string[] = [];
          const initialReps: string[] = [];
          const loggedSetIndices = new Set<number>();

          for (let i = 0; i < numberOfSets; i++) {
            if (savedSets[i]) {
              initialWeights[i] = savedSets[i].weight.toString();
              initialReps[i] = savedSets[i].reps.toString();
              loggedSetIndices.add(i);
            } else {
              initialWeights[i] = '';
              initialReps[i] = '';
            }
          }

          setWeights(initialWeights);
          setReps(initialReps);
          setLoggedSets(loggedSetIndices);
        } catch (error) {
          console.error('Error loading logged sets:', error);
          // Initialize with empty arrays if error
          setWeights(Array(numberOfSets).fill(''));
          setReps(Array(numberOfSets).fill(''));
        }
      } else {
        // Initialize arrays for sets
        setWeights(Array(numberOfSets).fill(''));
        setReps(Array(numberOfSets).fill(''));
        setLoggedSets(new Set());
      }
    };

    loadLoggedSets();
  }, [programExercise, numberOfSets, dayIndex, slotIndex]);

  useEffect(() => {
    if (exerciseId) {
      loadPreviousWeight();
    } else {
      setPreviousWeight(null);
    }
  }, [exerciseId]);

  const loadPreviousWeight = async () => {
    if (!exerciseId) return;
    try {
      const lastWeight = await getLastWeight(exerciseId);
      setPreviousWeight(lastWeight);
    } catch (error) {
      console.error('Error loading previous weight:', error);
    }
  };

  const handleWeightChange = (setIndex: number, value: string) => {
    const newWeights = [...weights];
    newWeights[setIndex] = value;
    setWeights(newWeights);
  };

  const handleRepsChange = (setIndex: number, value: string) => {
    const newReps = [...reps];
    newReps[setIndex] = value;
    setReps(newReps);
  };

  const handleLogSet = async (setIndex: number) => {
    if (!exerciseId || !weights[setIndex] || !reps[setIndex] || dayIndex === null) {
      return;
    }

    const weightNum = parseFloat(weights[setIndex]);
    const repsNum = parseInt(reps[setIndex], 10);

    if (isNaN(weightNum) || isNaN(repsNum) || weightNum <= 0 || repsNum <= 0) {
      return;
    }

    setLoading(true);
    try {
      // Save to both old storage (for backward compatibility) and new workout logs
      await saveSet(exerciseId, weightNum, repsNum);
      await saveLoggedSet(dayIndex, slotIndex, setIndex, weightNum, repsNum);
      await loadPreviousWeight();
      onSetLogged(weightNum);
      
      // Mark this set as logged, but keep the values
      const newLoggedSets = new Set([...loggedSets, setIndex]);
      setLoggedSets(newLoggedSets);
      setHasAnyLoggedSets(true);
    } catch (error) {
      console.error('Error logging set:', error);
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

  const repRangeText = programExercise?.isAmrap
    ? 'MAX REPS'
    : programExercise?.repRange
    ? `${programExercise.repRange[0]}-${programExercise.repRange[1]} reps`
    : null;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.exerciseName}>{exercise.name}</Text>
          {repRangeText && (
            <Text style={[styles.repRangeLabel, programExercise?.isAmrap && styles.amrapLabel]}>
              {repRangeText}
            </Text>
          )}
          {previousWeight !== null && (
            <Text style={styles.previousLabel}>Previous: {previousWeight}kg</Text>
          )}
        </View>
      </View>

      <View style={styles.setsHeader}>
        <Text style={styles.setsLabel}>Sets</Text>
      </View>

      {Array.from({ length: numberOfSets }).map((_, setIndex) => {
        const isLogged = loggedSets.has(setIndex);
        const canLog = weights[setIndex] && reps[setIndex] && !loading;

        return (
          <View key={setIndex} style={styles.setContainer}>
            <View style={styles.inputContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Weight (kg)</Text>
                <TextInput
                  style={[styles.input, isLogged && styles.inputLogged]}
                  value={weights[setIndex] || ''}
                  onChangeText={(value) => handleWeightChange(setIndex, value)}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor="#666"
                  editable={!isLogged}
                />
              </View>

              <View style={styles.inputGroupWithCheckmark}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Reps</Text>
                  <TextInput
                    style={[styles.input, isLogged && styles.inputLogged]}
                    value={reps[setIndex] || ''}
                    onChangeText={(value) => handleRepsChange(setIndex, value)}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor="#666"
                    editable={!isLogged}
                  />
                </View>
                <TouchableOpacity
                  style={[styles.checkmarkButton, !canLog && styles.checkmarkButtonDisabled]}
                  onPress={() => handleLogSet(setIndex)}
                  disabled={!canLog || isLogged}
                >
                  <Ionicons
                    name={isLogged ? 'checkmark-circle' : 'checkmark-circle-outline'}
                    size={32}
                    color={isLogged ? '#00E676' : canLog ? '#00E676' : '#666'}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
      })}

      <View style={styles.swapButtonContainer}>
        <TouchableOpacity
          style={[styles.swapButton, hasAnyLoggedSets && styles.swapButtonDisabled]}
          onPress={onSwap}
          disabled={hasAnyLoggedSets}
        >
          <Text style={[styles.swapButtonText, hasAnyLoggedSets && styles.swapButtonTextDisabled]}>
            Swap Exercise
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  header: {
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  exerciseName: {
    color: '#00E676',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  repRangeLabel: {
    color: '#CCC',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  amrapLabel: {
    color: '#FF4444',
    fontWeight: '800',
  },
  previousLabel: {
    color: '#888',
    fontSize: 14,
    fontWeight: '500',
  },
  setsHeader: {
    marginBottom: 12,
  },
  setsLabel: {
    color: '#888',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  setContainer: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 0,
  },
  inputGroup: {
    flex: 1,
  },
  inputGroupWithCheckmark: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  inputLabel: {
    color: '#CCC',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    borderWidth: 1,
    borderColor: '#333',
  },
  inputLogged: {
    borderColor: '#00E676',
    borderWidth: 2,
    opacity: 0.7,
  },
  checkmarkButton: {
    paddingBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
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
    borderColor: '#00E676',
    alignItems: 'center',
    justifyContent: 'center',
  },
  swapButtonText: {
    color: '#00E676',
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  swapButtonDisabled: {
    opacity: 0.5,
    borderColor: '#666',
  },
  swapButtonTextDisabled: {
    color: '#666',
  },
  slotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  slotLabel: {
    color: '#00E676',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
});
