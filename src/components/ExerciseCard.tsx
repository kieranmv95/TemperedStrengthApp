import { useSubscription } from '@/src/hooks/use-subscription';
import { useExerciseCardState } from '@/src/hooks/useExerciseCardState';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/theme';
import { getExerciseById } from '../data/exercises';
import type { Exercise as ProgramExercise } from '../types/program';
import type { RestTimerState } from '../types/storage';
import { exerciseCardStyles as styles } from './exerciseCardStyles';
import { ExerciseCardSetRow } from './ExerciseCardSetRow';
import { RestTimer } from './RestTimer';

export type RestTimerStartPayload = {
  dayIndex: number;
  slotIndex: number;
  exerciseId: number | null;
  restTimeSeconds: number;
};

type ExerciseCardProps = {
  exerciseId: number | null;
  programExercise: ProgramExercise | null;
  slotNumber: number;
  dayIndex: number | null;
  slotIndex: number;
  onSwap: () => void;
  restTimer: RestTimerState | null;
  onRestStart: (payload: RestTimerStartPayload) => void;
  onRestDismiss: () => void;
  onRestComplete: () => void;
  onRestRestart: () => void;
};

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exerciseId,
  programExercise,
  slotNumber,
  dayIndex,
  slotIndex,
  onSwap,
  restTimer,
  onRestStart,
  onRestDismiss,
  onRestComplete,
  onRestRestart,
}) => {
  const { isPro } = useSubscription();
  const exercise = exerciseId ? getExerciseById(exerciseId) : null;

  const {
    weights,
    reps,
    setStates,
    loading,
    remainingSwaps,
    numberOfSets,
    restTimeSeconds,
    handleWeightChange,
    handleRepsChange,
    handleToggleSetState,
    decrementSets,
    incrementSets,
  } = useExerciseCardState({
    isPro,
    exerciseId,
    programExercise,
    dayIndex,
    slotIndex,
  });

  const isSwapped =
    exerciseId !== null &&
    programExercise !== null &&
    exerciseId !== programExercise.id;

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

  let repRangeText: string | null = null;

  if (!programExercise?.hideReps) {
    if (programExercise?.isAmrap) {
      repRangeText = 'MAX REPS (AMRAP)';
    } else if (programExercise?.repRange) {
      const [min, max] = programExercise.repRange;
      const unit = exercise.logging_type === 'time' ? 'seconds' : 'reps';

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
                {' - ' + programExercise.additionalHeader}
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
          {(() => {
            const description = isSwapped
              ? exercise.description
              : (programExercise?.additionalDescription ??
                exercise.description);
            return description ? (
              <Text style={styles.additionalDescription}>{description}</Text>
            ) : null;
          })()}
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
            onPress={decrementSets}
            disabled={numberOfSets <= 1}
          >
            <Ionicons
              name="remove-circle-outline"
              size={24}
              color={numberOfSets <= 1 ? Colors.textOnDark : Colors.accent}
            />
          </TouchableOpacity>
          <Text style={styles.setCountText}>{numberOfSets}</Text>
          <TouchableOpacity
            style={styles.setControlButton}
            onPress={incrementSets}
          >
            <Ionicons
              name="add-circle-outline"
              size={24}
              color={Colors.accent}
            />
          </TouchableOpacity>
          {restTimeSeconds && dayIndex !== null && (
            <TouchableOpacity
              style={styles.restTimerButton}
              onPress={() =>
                onRestStart({
                  dayIndex,
                  slotIndex,
                  exerciseId,
                  restTimeSeconds,
                })
              }
            >
              <Ionicons name="time-outline" size={20} color={Colors.accent} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {restTimer && (
        <View style={styles.restTimerContainer}>
          <RestTimer
            timer={restTimer}
            onDismiss={onRestDismiss}
            onComplete={onRestComplete}
            onRestart={onRestRestart}
          />
        </View>
      )}

      {Array.from({ length: numberOfSets }).map((_, setIndex) => {
        const setState = setStates.get(setIndex);
        const canLog = !!reps[setIndex] && !loading;
        const isFirstSet = setIndex === 0;

        return (
          <ExerciseCardSetRow
            key={setIndex}
            setIndex={setIndex}
            isFirstSet={isFirstSet}
            loggingType={exercise.logging_type}
            weightValue={weights[setIndex] || ''}
            repsValue={reps[setIndex] || ''}
            setState={setState}
            loading={loading}
            canLog={canLog}
            onWeightChange={handleWeightChange}
            onRepsChange={handleRepsChange}
            onToggleSetState={handleToggleSetState}
          />
        );
      })}

      {programExercise?.canSwap !== false && (
        <View style={styles.swapButtonContainer}>
          <TouchableOpacity style={styles.swapButton} onPress={onSwap}>
            <Text style={styles.swapButtonText}>
              {isPro
                ? 'Swap Exercise'
                : `Swap Exercise${
                    remainingSwaps !== null ? ` (${remainingSwaps})` : ''
                  }`}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
