import { Colors } from '@/src/constants/theme';
import type { Exercise } from '@/src/types/exercise';
import type { WeightUnit } from '@/src/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { exerciseCardStyles as styles } from './exerciseCardStyles';

type ExerciseCardSetRowProps = {
  setIndex: number;
  isFirstSet: boolean;
  loggingType: Exercise['logging_type'];
  weightUnit: WeightUnit;
  weightValue: string;
  repsValue: string;
  rpeValue: string;
  setState: 'completed' | 'failed' | undefined;
  loading: boolean;
  canLog: boolean;
  canReorder: boolean;
  onWeightChange: (setIndex: number, value: string) => void;
  onRepsChange: (setIndex: number, value: string) => void;
  onRpeChange: (setIndex: number, value: string) => void;
  onToggleSetState: (setIndex: number) => void;
  onDragStart: (setIndex: number) => void;
  onDragEnd: (setIndex: number, translationY: number) => void;
  onRowLayout: (setIndex: number, height: number) => void;
};

export function ExerciseCardSetRow({
  setIndex,
  isFirstSet,
  loggingType,
  weightUnit,
  weightValue,
  repsValue,
  rpeValue,
  setState,
  loading,
  canLog,
  canReorder,
  onWeightChange,
  onRepsChange,
  onRpeChange,
  onToggleSetState,
  onDragStart,
  onDragEnd,
  onRowLayout,
}: ExerciseCardSetRowProps) {
  const isCompleted = setState === 'completed';
  const isFailed = setState === 'failed';
  const isRepsOnly = loggingType === 'reps';
  const [showWeight, setShowWeight] = useState(!isRepsOnly);
  const showOptionalWeightReset = isRepsOnly && showWeight;
  const translateY = useSharedValue(0);
  const dragging = useSharedValue(0);

  useEffect(() => {
    if (!isRepsOnly) {
      setShowWeight(true);
      return;
    }
    if (weightValue.trim().length > 0) {
      setShowWeight(true);
    }
  }, [isRepsOnly, weightValue]);

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .activateAfterLongPress(180)
        .enabled(canReorder && !loading)
        .onStart(() => {
          dragging.value = 1;
          runOnJS(onDragStart)(setIndex);
        })
        .onUpdate((event) => {
          translateY.value = event.translationY;
        })
        .onEnd((event) => {
          dragging.value = 0;
          translateY.value = 0;
          runOnJS(onDragEnd)(setIndex, event.translationY);
        })
        .onFinalize(() => {
          // Interrupted after activate (no onEnd): release scroll lock.
          if (dragging.value === 1) {
            dragging.value = 0;
            translateY.value = 0;
            runOnJS(onDragEnd)(setIndex, 0);
          }
        }),
    [
      canReorder,
      loading,
      onDragEnd,
      onDragStart,
      setIndex,
      dragging,
      translateY,
    ]
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    zIndex: dragging.value ? 20 : 0,
    elevation: dragging.value ? 4 : 0,
    opacity: dragging.value ? 0.92 : 1,
  }));

  return (
    <Animated.View
      style={[styles.setContainer, animatedStyle]}
      onLayout={(event) => {
        onRowLayout(setIndex, event.nativeEvent.layout.height);
      }}
    >
      <View style={styles.inputContainer}>
        <GestureDetector gesture={panGesture}>
          <View
            style={[
              styles.dragHandle,
              (!canReorder || loading) && styles.dragHandleDisabled,
            ]}
            hitSlop={{ top: 8, bottom: 8, left: 10, right: 10 }}
            accessibilityLabel="Reorder set"
            accessibilityHint="Long press and drag to reorder"
          >
            <Ionicons
              name="ellipsis-vertical"
              size={18}
              color={Colors.textMuted}
            />
          </View>
        </GestureDetector>

        {showWeight ? (
          <View style={styles.inputGroup}>
            {isFirstSet && (
              <Text style={styles.inputLabel}>
                {isRepsOnly ? 'Added weight' : 'Weight'} ({weightUnit})
              </Text>
            )}
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
          </View>
        ) : (
          <View style={styles.inputGroup}>
            {isFirstSet && <Text style={styles.inputLabel}>Weight</Text>}
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

        <View style={styles.inputGroupRepsOrTime}>
          {isFirstSet && (
            <Text style={styles.inputLabel}>
              {loggingType === 'time' ? 'Time' : 'Reps'}
            </Text>
          )}
          <TextInput
            style={[
              styles.input,
              styles.inputReps,
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

        <View style={styles.inputGroupRpe}>
          {isFirstSet && <Text style={styles.inputLabel}>RPE</Text>}
          <TextInput
            style={[
              styles.input,
              styles.inputRpe,
              isCompleted && styles.inputCompleted,
              isFailed && styles.inputFailed,
            ]}
            value={rpeValue || ''}
            onChangeText={(value) => onRpeChange(setIndex, value)}
            keyboardType="number-pad"
            returnKeyType="done"
            blurOnSubmit={true}
            placeholder="—"
            placeholderTextColor={Colors.textPlaceholder}
            maxLength={2}
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
    </Animated.View>
  );
}
