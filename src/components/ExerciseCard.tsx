import { ExerciseVideoPlayButton } from '@/src/components/exercise/ExerciseVideoPlayButton';
import { ActionChip, Tag } from '@/src/components/ds';
import { PBDetectedModal } from '@/src/components/PBDetectedModal';
import { color } from '@/src/constants/tokens';
import { useSubscription } from '@/src/hooks/use-subscription';
import { useToast } from '@/src/hooks/toast-context';
import { useExerciseCardState } from '@/src/hooks/useExerciseCardState';
import { useWeightUnit } from '@/src/hooks/useWeightUnit';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { getExerciseById } from '../data/exercises';
import type { Exercise as ProgramExercise } from '../types/program';
import { getAutoRestTimersEnabled } from '../utils/storage';
import { formatWeightFromKg } from '../utils/weightUnits';
import { exerciseHasVideo } from '../utils/youtube';
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
  onSetReorderDragChange?: (dragging: boolean) => void;
};

/** Coaching notes longer than this are clamped behind "Show more". */
const LONG_NOTES_LENGTH = 180;
const CLAMPED_NOTES_LINES = 3;

function formatRestTime(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}:${remainder.toString().padStart(2, '0')}`;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exerciseId,
  programExercise,
  slotNumber,
  dayIndex,
  slotIndex,
  onSwap,
  onRestStart,
  onRestDismiss,
  onSetReorderDragChange,
}) => {
  const { isPro } = useSubscription();
  const { unit: weightUnit } = useWeightUnit();
  const { showToast } = useToast();
  const exercise = exerciseId ? getExerciseById(exerciseId) : null;
  const rowHeightsRef = useRef<Record<number, number>>({});
  const [reorderMode, setReorderMode] = useState(false);
  const [notesExpanded, setNotesExpanded] = useState(false);

  const {
    weights,
    reps,
    rpes,
    setStates,
    loading,
    remainingSwaps,
    numberOfSets,
    restTimeSeconds,
    handleWeightChange,
    handleRepsChange,
    handleRpeChange,
    handleToggleSetState,
    handleClearSetState,
    handleReorderSets,
    decrementSets,
    incrementSets,
    pbPrompt,
    dismissPbPrompt,
    confirmPbPrompt,
    exercisePbChip,
  } = useExerciseCardState({
    isPro,
    exerciseId,
    programExercise,
    dayIndex,
    slotIndex,
    exerciseLoggingType: exercise?.logging_type ?? 'reps_and_weight',
    weightUnit,
  });

  useEffect(() => {
    if (pbPrompt) {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
  }, [pbPrompt]);

  const isSwapped =
    exerciseId !== null &&
    programExercise !== null &&
    exerciseId !== programExercise.id;

  const handleRowLayout = useCallback((setIndex: number, height: number) => {
    if (height > 0) {
      rowHeightsRef.current[setIndex] = height;
    }
  }, []);

  const handleDragStart = useCallback(
    (_setIndex: number) => {
      onSetReorderDragChange?.(true);
    },
    [onSetReorderDragChange]
  );

  const handleDragEnd = useCallback(
    (fromIndex: number, translationY: number) => {
      onSetReorderDragChange?.(false);
      if (numberOfSets <= 1) {
        return;
      }
      const rowHeight = rowHeightsRef.current[fromIndex] ?? 64;
      const delta = Math.round(translationY / rowHeight);
      const toIndex = Math.max(
        0,
        Math.min(numberOfSets - 1, fromIndex + delta)
      );
      if (toIndex !== fromIndex) {
        void handleReorderSets(fromIndex, toIndex);
      }
    },
    [handleReorderSets, numberOfSets, onSetReorderDragChange]
  );

  if (!exercise) {
    return (
      <View style={[styles.card, styles.emptySlot]}>
        <Text style={styles.emptySlotLabel}>Slot {slotNumber}: empty</Text>
        <ActionChip
          label="Add exercise"
          icon="add"
          tone="gold"
          onPress={onSwap}
        />
      </View>
    );
  }

  const weightLabel = `${
    exercise.logging_type === 'reps' ? 'Added weight' : 'Weight'
  } (${weightUnit})`;
  const repsLabel = exercise.logging_type === 'time' ? 'Time (s)' : 'Reps';

  let repRangeText: string | null = null;
  let repsPlaceholder: string | undefined;

  // `setScheme` lifts (e.g. 5/3/1) vary reps per set, so the single header chip
  // would be misleading - each set row shows its own target instead.
  if (!programExercise?.hideReps && !programExercise?.setScheme) {
    if (programExercise?.isAmrap) {
      repRangeText = 'Max reps (AMRAP)';
      repsPlaceholder = 'Max';
    } else if (programExercise?.repRange) {
      const [min, max] = programExercise.repRange;
      const unit = exercise.logging_type === 'time' ? 'seconds' : 'reps';
      const range = min === max ? `${min}` : `${min}–${max}`;
      repRangeText = `${range} ${unit}`;
      repsPlaceholder = range;
    }
  }

  const additionalHeader =
    !isSwapped && programExercise?.additionalHeader
      ? programExercise.additionalHeader
      : null;
  const metaParts = [repRangeText, exercisePbChip].filter(
    (part): part is string => !!part
  );
  const description = isSwapped
    ? exercise.description
    : (programExercise?.additionalDescription ?? exercise.description);
  const notesAreLong = (description?.length ?? 0) > LONG_NOTES_LENGTH;

  const firstUnloggedSet = Array.from({ length: numberOfSets }).findIndex(
    (_, i) => setStates.get(i) === undefined
  );
  const canReorder = reorderMode && numberOfSets > 1;

  const handleToggle = async (idx: number) => {
    const nextState = await handleToggleSetState(idx);
    if (nextState !== 'completed') return;

    let startedRest = false;
    if (restTimeSeconds && dayIndex !== null) {
      const autoTimersEnabled = await getAutoRestTimersEnabled();
      if (autoTimersEnabled) {
        const isLastSet = idx === numberOfSets - 1;
        if (isLastSet) {
          onRestDismiss();
        } else {
          onRestStart({
            dayIndex,
            slotIndex,
            exerciseId,
            restTimeSeconds,
          });
          startedRest = true;
        }
      }
    }

    showToast({
      message: `${exercise.name}, set ${idx + 1} logged`,
      icon: 'checkmark-circle',
      action: {
        label: 'Undo',
        onPress: () => {
          void handleClearSetState(idx);
          if (startedRest) {
            onRestDismiss();
          }
        },
      },
    });
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.exerciseName} accessibilityRole="header">
          {exercise.name}
        </Text>
        {additionalHeader || metaParts.length > 0 ? (
          <Text style={styles.metaLine}>
            {additionalHeader ? (
              <Text style={styles.metaLineAccent}>{additionalHeader}</Text>
            ) : null}
            {additionalHeader && metaParts.length > 0 ? ' · ' : ''}
            {metaParts.join(' · ')}
          </Text>
        ) : null}
        {exerciseHasVideo(exercise) || isSwapped ? (
          <View style={styles.actionRow}>
            <ExerciseVideoPlayButton exerciseId={exercise.id} />
            {isSwapped ? <Tag label="Swapped" /> : null}
          </View>
        ) : null}
        {description ? (
          <View style={styles.notes}>
            <Text
              style={styles.notesText}
              numberOfLines={
                notesAreLong && !notesExpanded ? CLAMPED_NOTES_LINES : undefined
              }
            >
              {description}
            </Text>
            {notesAreLong ? (
              <Pressable
                onPress={() => setNotesExpanded((prev) => !prev)}
                style={styles.notesToggle}
                accessibilityRole="button"
                accessibilityState={{ expanded: notesExpanded }}
                accessibilityLabel={
                  notesExpanded
                    ? 'Show less coaching notes'
                    : 'Show more coaching notes'
                }
              >
                <Text style={styles.notesToggleText}>
                  {notesExpanded ? 'Show less' : 'Show more'}
                </Text>
              </Pressable>
            ) : null}
          </View>
        ) : null}
      </View>

      <View style={styles.setsHeader}>
        <Text style={styles.setsTitle}>Sets</Text>
        <View style={styles.setControls}>
          <Pressable
            style={({ pressed }) => [
              styles.roundButton,
              pressed && styles.roundButtonPressed,
            ]}
            onPress={decrementSets}
            disabled={numberOfSets <= 1}
            accessibilityRole="button"
            accessibilityLabel={`Remove a set from ${exercise.name}`}
            accessibilityState={{ disabled: numberOfSets <= 1 }}
          >
            <Ionicons
              name="remove"
              size={22}
              color={numberOfSets <= 1 ? color.textDisabled : color.textPrimary}
            />
          </Pressable>
          <Text
            style={styles.setCountText}
            accessibilityLabel={`${numberOfSets} sets`}
          >
            {numberOfSets}
          </Text>
          <Pressable
            style={({ pressed }) => [
              styles.roundButton,
              pressed && styles.roundButtonPressed,
            ]}
            onPress={incrementSets}
            accessibilityRole="button"
            accessibilityLabel={`Add a set to ${exercise.name}`}
          >
            <Ionicons name="add" size={22} color={color.textPrimary} />
          </Pressable>
          {restTimeSeconds && dayIndex !== null ? (
            <Pressable
              style={({ pressed }) => [
                styles.roundButton,
                pressed && styles.roundButtonPressed,
              ]}
              onPress={() =>
                onRestStart({
                  dayIndex,
                  slotIndex,
                  exerciseId,
                  restTimeSeconds,
                })
              }
              accessibilityRole="button"
              accessibilityLabel={`Start rest timer, ${formatRestTime(restTimeSeconds)}`}
            >
              <Ionicons name="time-outline" size={20} color={color.gold} />
            </Pressable>
          ) : null}
          {numberOfSets > 1 ? (
            <Pressable
              style={({ pressed }) => [
                styles.roundButton,
                reorderMode && styles.roundButtonActive,
                pressed && styles.roundButtonPressed,
              ]}
              onPress={() => setReorderMode((prev) => !prev)}
              accessibilityRole="button"
              accessibilityLabel="Reorder sets"
              accessibilityState={{ selected: reorderMode }}
            >
              <Ionicons
                name="swap-vertical"
                size={20}
                color={reorderMode ? color.gold : color.textSecondary}
              />
            </Pressable>
          ) : null}
        </View>
      </View>

      <View
        style={styles.columnHeaders}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <Text style={[styles.columnLabel, styles.columnSet]}>
          {canReorder ? 'Move' : 'Set'}
        </Text>
        <Text style={[styles.columnLabel, styles.columnFlex]}>
          {weightLabel}
        </Text>
        <Text style={[styles.columnLabel, styles.columnReps]}>{repsLabel}</Text>
        <Text style={[styles.columnLabel, styles.columnRpe]}>RPE</Text>
        <View style={styles.columnCheck} />
      </View>

      {Array.from({ length: numberOfSets }).map((_, setIndex) => {
        const setState = setStates.get(setIndex);

        return (
          <ExerciseCardSetRow
            key={setIndex}
            setIndex={setIndex}
            exerciseName={exercise.name}
            loggingType={exercise.logging_type}
            weightLabel={weightLabel}
            weightUnitLabel={weightUnit}
            weightValue={weights[setIndex] || ''}
            repsValue={reps[setIndex] || ''}
            rpeValue={rpes[setIndex] || ''}
            setState={setState}
            isActive={!canReorder && setIndex === firstUnloggedSet}
            repsPlaceholder={repsPlaceholder}
            loading={loading}
            canLog={!!reps[setIndex] && !loading}
            canReorder={canReorder}
            onWeightChange={handleWeightChange}
            onRepsChange={handleRepsChange}
            onRpeChange={handleRpeChange}
            onToggleSetState={(idx) => void handleToggle(idx)}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onRowLayout={handleRowLayout}
          />
        );
      })}

      {programExercise?.canSwap !== false ? (
        <View style={styles.footer}>
          <ActionChip
            label={
              isPro
                ? 'Swap exercise'
                : `Swap exercise${
                    remainingSwaps !== null ? ` (${remainingSwaps} left)` : ''
                  }`
            }
            icon="swap-horizontal"
            tone="gold"
            onPress={onSwap}
          />
        </View>
      ) : null}

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
