import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { getExerciseById } from '../data/exercises';
import { getLastWeight, saveSet } from '../utils/storage';

interface ExerciseCardProps {
  exerciseId: string | null;
  slotNumber: number;
  onSwap: () => void;
  onSetLogged: (weight: number) => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exerciseId,
  slotNumber,
  onSwap,
  onSetLogged,
}) => {
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [previousWeight, setPreviousWeight] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const exercise = exerciseId ? getExerciseById(exerciseId) : null;

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

  const handleLogSet = async () => {
    if (!exerciseId || !weight || !reps) {
      return;
    }

    const weightNum = parseFloat(weight);
    const repsNum = parseInt(reps, 10);

    if (isNaN(weightNum) || isNaN(repsNum) || weightNum <= 0 || repsNum <= 0) {
      return;
    }

    setLoading(true);
    try {
      await saveSet(exerciseId, weightNum, repsNum);
      await loadPreviousWeight();
      onSetLogged(weightNum);
      setWeight('');
      setReps('');
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

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.slotLabel}>Slot {slotNumber}: {exercise.pattern}</Text>
          <Text style={styles.exerciseName}>{exercise.name}</Text>
          {previousWeight !== null && (
            <Text style={styles.previousLabel}>Previous: {previousWeight}kg</Text>
          )}
        </View>
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Weight (kg)</Text>
          <TextInput
            style={styles.input}
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor="#666"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Reps</Text>
          <TextInput
            style={styles.input}
            value={reps}
            onChangeText={setReps}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor="#666"
          />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.logButton, loading && styles.logButtonDisabled]}
          onPress={handleLogSet}
          disabled={loading || !weight || !reps}
        >
          <Text style={styles.logButtonText}>Log Set</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.swapButton} onPress={onSwap}>
          <Text style={styles.swapButtonText}>Swap</Text>
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
  slotLabel: {
    color: '#00E676',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  exerciseName: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  previousLabel: {
    color: '#888',
    fontSize: 14,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  inputGroup: {
    flex: 1,
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
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  logButton: {
    flex: 1,
    backgroundColor: '#00E676',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  logButtonDisabled: {
    opacity: 0.5,
  },
  logButtonText: {
    color: '#121212',
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  swapButton: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#00E676',
    alignItems: 'center',
    justifyContent: 'center',
  },
  swapButtonText: {
    color: '#00E676',
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

