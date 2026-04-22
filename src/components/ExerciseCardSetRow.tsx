import { Colors } from '@/src/constants/theme';
import type { Exercise } from '@/src/types/exercise';
import type { WeightUnit } from '@/src/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { exerciseCardStyles as styles } from './exerciseCardStyles';

type ExerciseCardSetRowProps = {
  setIndex: number;
  isFirstSet: boolean;
  loggingType: Exercise['logging_type'];
  weightUnit: WeightUnit;
  weightValue: string;
  repsValue: string;
  setState: 'completed' | 'failed' | undefined;
  loading: boolean;
  canLog: boolean;
  onWeightChange: (setIndex: number, value: string) => void;
  onRepsChange: (setIndex: number, value: string) => void;
  onToggleSetState: (setIndex: number) => void;
};

export function ExerciseCardSetRow({
  setIndex,
  isFirstSet,
  loggingType,
  weightUnit,
  weightValue,
  repsValue,
  setState,
  loading,
  canLog,
  onWeightChange,
  onRepsChange,
  onToggleSetState,
}: ExerciseCardSetRowProps) {
  const isCompleted = setState === 'completed';
  const isFailed = setState === 'failed';
  const isRepsOnly = loggingType === 'reps';
  const [showWeight, setShowWeight] = useState(!isRepsOnly);

  useEffect(() => {
    if (!isRepsOnly) {
      setShowWeight(true);
      return;
    }
    if (weightValue.trim().length > 0) {
      setShowWeight(true);
    }
  }, [isRepsOnly, weightValue]);

  return (
    <View style={styles.setContainer}>
      <View style={styles.inputContainer}>
        {showWeight ? (
          <View style={styles.inputGroup}>
            {isFirstSet && (
              <Text style={styles.inputLabel}>
                {isRepsOnly ? 'Added weight' : 'Weight'} ({weightUnit})
              </Text>
            )}
            <TextInput
              style={[
                styles.input,
                isCompleted && styles.inputCompleted,
                isFailed && styles.inputFailed,
              ]}
              value={weightValue || ''}
              onChangeText={(value) => onWeightChange(setIndex, value)}
              keyboardType="numeric"
              returnKeyType="done"
              blurOnSubmit={true}
              placeholder="0"
              placeholderTextColor={Colors.textPlaceholder}
            />
          </View>
        ) : (
          <View style={styles.inputGroup}>
            {isFirstSet && <Text style={styles.inputLabel}>Added weight</Text>}
            <TouchableOpacity
              onPress={() => setShowWeight(true)}
              disabled={loading}
              style={[styles.input, { justifyContent: 'center' }]}
              accessibilityLabel="Add weight"
            >
              <Text style={{ color: Colors.textPlaceholder, fontWeight: '600' }}>
                Add weight
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.inputGroupWithCheckmark}>
          <View style={styles.inputGroup}>
            {isFirstSet && (
              <Text style={styles.inputLabel}>
                {loggingType === 'time' ? 'Time' : 'Reps'}
              </Text>
            )}
            <TextInput
              style={[
                styles.input,
                isCompleted && styles.inputCompleted,
                isFailed && styles.inputFailed,
              ]}
              value={repsValue || ''}
              onChangeText={(value) => onRepsChange(setIndex, value)}
              keyboardType="numeric"
              returnKeyType="done"
              blurOnSubmit={true}
              placeholder="0"
              placeholderTextColor={Colors.textPlaceholder}
            />
          </View>
          <TouchableOpacity
            style={[
              styles.checkmarkButton,
              !canLog && styles.checkmarkButtonDisabled,
            ]}
            onPress={() => onToggleSetState(setIndex)}
            disabled={!canLog}
          >
            <Ionicons
              name={setState ? 'checkmark-circle' : 'checkmark-circle-outline'}
              size={32}
              color={
                isCompleted
                  ? Colors.accent
                  : isFailed
                    ? Colors.destructive
                    : Colors.textPlaceholder
              }
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
