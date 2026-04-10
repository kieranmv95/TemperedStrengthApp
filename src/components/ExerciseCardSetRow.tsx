import { Colors } from '@/src/constants/theme';
import type { Exercise } from '@/src/types/exercise';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { exerciseCardStyles as styles } from './exerciseCardStyles';

type ExerciseCardSetRowProps = {
  setIndex: number;
  isFirstSet: boolean;
  loggingType: Exercise['logging_type'];
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

  return (
    <View style={styles.setContainer}>
      <View style={styles.inputContainer}>
        <View style={styles.inputGroup}>
          {isFirstSet && <Text style={styles.inputLabel}>Weight (kg)</Text>}
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
