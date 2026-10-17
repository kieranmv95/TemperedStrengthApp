import { NumberField, SetCheckButton } from '@/src/components/ds';
import { color } from '@/src/constants/tokens';
import type { Exercise } from '@/src/types/exercise';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { exerciseCardStyles as styles } from './exerciseCardStyles';

type ExerciseCardSetRowProps = {
  setIndex: number;
  /** Prefixes accessible names, e.g. "Snatch set 2 Weight (kg)". */
  exerciseName: string;
  loggingType: Exercise['logging_type'];
  /** Visible label for the weight field, e.g. "Weight (kg)". */
  weightLabel: string;
  weightUnitLabel: string;
  weightValue: string;
  repsValue: string;
  rpeValue: string;
  setState: 'completed' | 'failed' | undefined;
  /** The next set to log: its set number is highlighted. */
  isActive: boolean;
  repsPlaceholder?: string;
  loading: boolean;
  canLog: boolean;
  /** Reorder mode: shows the drag handle in place of the set number. */
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
  exerciseName,
  loggingType,
  weightLabel,
  weightUnitLabel,
  weightValue,
  repsValue,
  rpeValue,
  setState,
  isActive,
  repsPlaceholder,
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
  const isRepsOnly = loggingType === 'reps';
  const isTime = loggingType === 'time';
  const [showWeight, setShowWeight] = useState(!isRepsOnly);
  const showOptionalWeightReset = isRepsOnly && showWeight;
  const translateY = useSharedValue(0);
  const dragging = useSharedValue(0);
  const setNumber = setIndex + 1;
  const context = `${exerciseName} set ${setNumber}`;
  const fieldState =
    setState === 'completed'
      ? 'completed'
      : setState === 'failed'
        ? 'failed'
        : 'default';

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

  const weightField = showWeight ? (
    <View style={showOptionalWeightReset ? styles.weightWithRemove : null}>
      {showOptionalWeightReset ? (
        <Pressable
          onPress={() => {
            onWeightChange(setIndex, '');
            setShowWeight(false);
          }}
          disabled={loading}
          style={styles.dragHandle}
          accessibilityRole="button"
          accessibilityLabel={`Remove added weight from ${context}`}
        >
          <Ionicons
            name="trash-outline"
            size={18}
            color={color.textSecondary}
          />
        </Pressable>
      ) : null}
      <View style={styles.fieldFlex}>
        <NumberField
          label={weightLabel}
          accessibilityContext={context}
          value={weightValue}
          onChangeText={(value) => onWeightChange(setIndex, value)}
          placeholder={weightUnitLabel}
          allowDecimal
          showLabel={false}
          state={fieldState}
          editable={!loading}
        />
      </View>
    </View>
  ) : (
    <Pressable
      onPress={() => setShowWeight(true)}
      disabled={loading}
      style={styles.addWeightButton}
      accessibilityRole="button"
      accessibilityLabel={`Add weight to ${context}`}
    >
      <Text style={styles.addWeightText}>Add</Text>
    </Pressable>
  );

  return (
    <Animated.View
      style={[styles.setRow, animatedStyle]}
      onLayout={(event) => {
        onRowLayout(setIndex, event.nativeEvent.layout.height);
      }}
    >
      {canReorder ? (
        <GestureDetector gesture={panGesture}>
          <View
            style={styles.dragHandle}
            accessible
            accessibilityLabel={`Reorder set ${setNumber}`}
            accessibilityHint="Long press and drag to move this set"
          >
            <Ionicons
              name="reorder-three"
              size={24}
              color={color.textSecondary}
            />
          </View>
        </GestureDetector>
      ) : (
        <View style={styles.setNumberColumn}>
          <Text
            style={[styles.setNumber, isActive && styles.setNumberActive]}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          >
            {setNumber}
          </Text>
        </View>
      )}

      <View style={styles.fields}>
        <View style={styles.fieldFlex}>{weightField}</View>
        <View style={styles.fieldReps}>
          <NumberField
            label={isTime ? 'Time (s)' : 'Reps'}
            accessibilityContext={context}
            value={repsValue}
            onChangeText={(value) => onRepsChange(setIndex, value)}
            placeholder={repsPlaceholder}
            showLabel={false}
            state={fieldState}
            editable={!loading}
          />
        </View>
        <View style={styles.fieldRpe}>
          <NumberField
            label="RPE"
            accessibilityContext={context}
            value={rpeValue}
            onChangeText={(value) => onRpeChange(setIndex, value)}
            placeholder="1–10"
            min={1}
            max={10}
            showLabel={false}
            hint="Rate of perceived exertion, 1 to 10. Optional."
            state={fieldState}
            editable={!loading}
          />
        </View>
      </View>

      <SetCheckButton
        state={
          setState === 'completed'
            ? 'completed'
            : setState === 'failed'
              ? 'failed'
              : 'pending'
        }
        onPress={() => onToggleSetState(setIndex)}
        disabled={!canLog}
        accessibilityLabel={`${exerciseName} set ${setNumber}`}
        disabledHint={
          isTime ? 'Enter a time to log this set' : 'Enter reps to log this set'
        }
      />
    </Animated.View>
  );
}
