import { Colors } from '@/src/constants/theme';
import type { Exercise } from '@/src/types/exercise';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { exerciseCardStyles as styles } from './exerciseCardStyles';

type ExerciseCardSetRowProps = {
  setIndex: number;
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
  const isRepsOnly = loggingType === 'reps';
  const [showWeight, setShowWeight] = useState(!isRepsOnly);
  const [focusedInput, setFocusedInput] = useState<'weight' | 'reps' | null>(
    null
  );
  const checkmarkScale = useRef(new Animated.Value(1)).current;
  const checkmarkOpacity = useRef(new Animated.Value(1)).current;
  const showOptionalWeightReset = isRepsOnly && showWeight;

  useEffect(() => {
    if (!isRepsOnly) {
      setShowWeight(true);
      return;
    }
    if (weightValue.trim().length > 0) {
      setShowWeight(true);
    }
  }, [isRepsOnly, weightValue]);

  const handleToggle = () => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(checkmarkScale, {
          toValue: 0.82,
          useNativeDriver: true,
          speed: 34,
          bounciness: 5,
        }),
        Animated.timing(checkmarkOpacity, {
          toValue: 0.45,
          duration: 90,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.spring(checkmarkScale, {
          toValue: 1,
          useNativeDriver: true,
          speed: 28,
          bounciness: 8,
        }),
        Animated.timing(checkmarkOpacity, {
          toValue: 1,
          duration: 120,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    onToggleSetState(setIndex);
  };

  return (
    <View style={[styles.setTableRow, isCompleted && styles.setTableRowDone]}>
      <View style={styles.setNumberCell}>
        <Text style={styles.setNumberText}>{setIndex + 1}</Text>
      </View>
      <View style={styles.inputContainer}>
        {showWeight ? (
          <View style={styles.inputGroup}>
            <View
              style={
                showOptionalWeightReset
                  ? styles.inputWithLeadingButtonRow
                  : undefined
              }
            >
              {showOptionalWeightReset && (
                <TouchableOpacity
                  onPress={() => {
                    onWeightChange(setIndex, '');
                    setShowWeight(false);
                  }}
                  disabled={loading}
                  accessibilityLabel="Remove weight"
                  style={[
                    styles.leadingIconButton,
                    loading && styles.leadingIconButtonDisabled,
                  ]}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons
                    name="trash-outline"
                    size={18}
                    color={Colors.accent}
                  />
                </TouchableOpacity>
              )}
              <TextInput
                style={[
                  styles.input,
                  showOptionalWeightReset && styles.inputFlex,
                  focusedInput === 'weight' && styles.inputFocused,
                  isCompleted && styles.inputCompleted,
                  isFailed && styles.inputFailed,
                ]}
                value={weightValue || ''}
                onChangeText={(value) => onWeightChange(setIndex, value)}
                onFocus={() => setFocusedInput('weight')}
                onBlur={() => setFocusedInput(null)}
                keyboardType="numeric"
                returnKeyType="done"
                blurOnSubmit={true}
                placeholder="0"
                placeholderTextColor={Colors.textPlaceholder}
              />
            </View>
          </View>
        ) : (
          <View style={styles.inputGroup}>
            <TouchableOpacity
              onPress={() => setShowWeight(true)}
              disabled={loading}
              style={[
                styles.input,
                styles.inputButton,
                { justifyContent: 'center' },
              ]}
              accessibilityLabel="Add weight"
            >
              <Text style={styles.inputButtonText}>Add weight</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.inputGroupWithCheckmark}>
          <View style={[styles.inputGroup, styles.inputGroupRepsOrTime]}>
            <TextInput
              style={[
                styles.input,
                focusedInput === 'reps' && styles.inputFocused,
                isCompleted && styles.inputCompleted,
                isFailed && styles.inputFailed,
              ]}
              value={repsValue || ''}
              onChangeText={(value) => onRepsChange(setIndex, value)}
              onFocus={() => setFocusedInput('reps')}
              onBlur={() => setFocusedInput(null)}
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
            onPress={handleToggle}
            disabled={!canLog}
          >
            <Animated.View
              style={{
                opacity: checkmarkOpacity,
                transform: [{ scale: checkmarkScale }],
              }}
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
            </Animated.View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
