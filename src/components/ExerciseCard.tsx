import { PBDetectedModal } from '@/src/components/PBDetectedModal';
import { useSubscription } from '@/src/hooks/use-subscription';
import { useExerciseCardState } from '@/src/hooks/useExerciseCardState';
import { useWeightUnit } from '@/src/hooks/useWeightUnit';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/theme';
import { getExerciseById } from '../data/exercises';
import type { Exercise as ProgramExercise } from '../types/program';
import { getAutoRestTimersEnabled } from '../utils/storage';
import { formatWeightFromKg } from '../utils/weightUnits';
import { ExerciseCardSetRow } from './ExerciseCardSetRow';
import { exerciseCardStyles as styles } from './exerciseCardStyles';

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
  onRestStart: (payload: RestTimerStartPayload) => void;
  onRestDismiss: () => void;
};

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exerciseId,
  programExercise,
  slotNumber,
  dayIndex,
  slotIndex,
  onSwap,
  onRestStart,
  onRestDismiss,
}) => {
  const { isPro } = useSubscription();
  const { unit: weightUnit } = useWeightUnit();
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
    pbPrompt,
    dismissPbPrompt,
    confirmPbPrompt,
    exercisePbSubtitle,
  } = useExerciseCardState({
    isPro,
    exerciseId,
    programExercise,
    dayIndex,
    slotIndex,
    exerciseLoggingType: exercise?.logging_type ?? 'reps_and_weight',
    weightUnit,
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
          <Pressable
            style={({ pressed }) => [
              styles.swapButton,
              pressed && styles.swapButtonPressed,
            ]}
            onPress={onSwap}
          >
            <Text style={styles.swapButtonText}>Add Exercise</Text>
          </Pressable>
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

  const categoryLabel = !isSwapped ? programExercise?.additionalHeader : null;
  const pbSeparatorIndex = exercisePbSubtitle?.indexOf(':') ?? -1;
  const pbStatLabel =
    exercisePbSubtitle && pbSeparatorIndex > 0
      ? exercisePbSubtitle.slice(0, pbSeparatorIndex)
      : 'Best';
  const pbStatValue =
    exercisePbSubtitle && pbSeparatorIndex > 0
      ? exercisePbSubtitle.slice(pbSeparatorIndex + 1).trim()
      : exercisePbSubtitle;
  const repStatLabel = exercise.logging_type === 'time' ? 'Time' : 'Reps';
  const repsHeaderLabel = exercise.logging_type === 'time' ? 'Time' : 'Reps';
  const weightHeaderLabel =
    exercise.logging_type === 'reps' ? 'Added weight' : `Weight (${weightUnit})`;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.exerciseTitleRow}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            {categoryLabel ? (
              <View style={styles.additionalHeaderPill}>
                <Text style={styles.additionalHeader}>{categoryLabel}</Text>
              </View>
            ) : null}
          </View>
          {(pbStatValue || repRangeText) && (
            <View style={styles.exerciseStatsRow}>
              {pbStatValue ? (
                <View style={styles.exerciseStatItem}>
                  <Text style={styles.exerciseStatLabel}>{pbStatLabel}</Text>
                  <Text style={styles.exerciseStatValue}>{pbStatValue}</Text>
                </View>
              ) : null}
              {pbStatValue && repRangeText ? (
                <View style={styles.exerciseStatDivider} />
              ) : null}
              {repRangeText ? (
                <View style={styles.exerciseStatItem}>
                  <Text style={styles.exerciseStatLabel}>{repStatLabel}</Text>
                  <Text
                    style={[
                      styles.exerciseStatValue,
                      programExercise?.isAmrap && styles.amrapLabel,
                    ]}
                  >
                    {repRangeText}
                  </Text>
                </View>
              ) : null}
            </View>
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
              name="remove"
              size={18}
              color={numberOfSets <= 1 ? Colors.textOnDark : Colors.accent}
            />
          </TouchableOpacity>
          <Text style={styles.setCountText}>{numberOfSets}</Text>
          <TouchableOpacity
            style={styles.setControlButton}
            onPress={incrementSets}
          >
            <Ionicons
              name="add"
              size={18}
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

      <View style={styles.setTable}>
        <View style={styles.setTableHeaderRow}>
          <Text style={[styles.inputLabel, styles.setNumberHeader]}>Set</Text>
          <Text style={[styles.inputLabel, styles.inputGroup]}>
            {weightHeaderLabel}
          </Text>
          <Text style={[styles.inputLabel, styles.repsHeaderLabel]}>
            {repsHeaderLabel}
          </Text>
        </View>
        {Array.from({ length: numberOfSets }).map((_, setIndex) => {
          const setState = setStates.get(setIndex);
          const canLog = !!reps[setIndex] && !loading;

          return (
            <ExerciseCardSetRow
              key={setIndex}
              setIndex={setIndex}
              loggingType={exercise.logging_type}
              weightValue={weights[setIndex] || ''}
              repsValue={reps[setIndex] || ''}
              setState={setState}
              loading={loading}
              canLog={canLog}
              onWeightChange={handleWeightChange}
              onRepsChange={handleRepsChange}
              onToggleSetState={async (idx) => {
                const nextState = await handleToggleSetState(idx);
                if (nextState !== 'completed') return;
                if (!restTimeSeconds || dayIndex === null) return;

                const autoTimersEnabled = await getAutoRestTimersEnabled();
                if (!autoTimersEnabled) return;

                const isLastSet = idx === numberOfSets - 1;
                if (isLastSet) {
                  onRestDismiss();
                  return;
                }

                onRestStart({
                  dayIndex,
                  slotIndex,
                  exerciseId,
                  restTimeSeconds,
                });
              }}
            />
          );
        })}
      </View>

      {programExercise?.canSwap !== false && (
        <View style={styles.swapButtonContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.swapButton,
              pressed && styles.swapButtonPressed,
            ]}
            onPress={onSwap}
          >
            <Text style={styles.swapButtonText}>
              {isPro
                ? 'Swap Exercise'
                : `Swap Exercise${
                    remainingSwaps !== null ? ` (${remainingSwaps})` : ''
                  }`}
            </Text>
          </Pressable>
        </View>
      )}

      {pbPrompt && exercise ? (
        <PBDetectedModal
          visible
          exerciseName={exercise.name}
          primaryTier={pbPrompt.primaryTier}
          weightText={formatWeightFromKg(pbPrompt.weight, weightUnit)}
          newRecords={pbPrompt.newRecords}
          onDismiss={dismissPbPrompt}
          onUpdate={confirmPbPrompt}
        />
      ) : null}
    </View>
  );
};
