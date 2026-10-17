import { color } from '@/src/constants/tokens';
import { useSubscription } from '@/src/hooks/use-subscription';
import { useSwapModalActions } from '@/src/hooks/useSwapModalActions';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Alert, Text, View } from 'react-native';
import { getAllExercises, getExerciseById } from '../data/exercises';
import {
  findAlternatives,
  type ExerciseAlternative,
} from '../utils/pivotEngine';
import { ActionChip, BottomSheet, FilterChip, SectionHeader } from './ds';
import { SwapModalAlternativeRow } from './SwapModalAlternativeRow';
import { swapModalStyles as styles } from './swapModalStyles';

type SwapModalProps = {
  visible: boolean;
  currentExerciseId: number | null;
  originalExerciseId: number | null;
  dayIndex: number | null;
  slotIndex: number;
  programId: string | null;
  onClose: () => void;
  onClearData?: () => void;
};

export const SwapModal: React.FC<SwapModalProps> = ({
  visible,
  currentExerciseId,
  originalExerciseId,
  dayIndex,
  slotIndex,
  programId,
  onClose,
  onClearData,
}) => {
  const { isPro } = useSubscription();
  const [noEquipmentOnly, setNoEquipmentOnly] = React.useState(false);
  const { handleSelect, handleResetPress } = useSwapModalActions({
    isPro,
    dayIndex,
    slotIndex,
    originalExerciseId,
    programId,
    onClose,
    onClearData,
  });

  const currentExercise = currentExerciseId
    ? getExerciseById(currentExerciseId)
    : null;
  const originalExercise = originalExerciseId
    ? getExerciseById(originalExerciseId)
    : null;
  const rankedAlternatives: ExerciseAlternative[] = currentExerciseId
    ? findAlternatives(currentExerciseId, 10)
    : [];
  const filteredAlternatives = noEquipmentOnly
    ? rankedAlternatives.filter((a) => a.exercise.equipment === 'Bodyweight')
    : rankedAlternatives;
  const bestMatches = filteredAlternatives.filter((a) => a.matchScore === 100);
  const otherMatches = filteredAlternatives.filter((a) => a.matchScore === 50);
  const allExercisesForEmptySlot = currentExerciseId
    ? []
    : (noEquipmentOnly
        ? getAllExercises().filter((e) => e.equipment === 'Bodyweight')
        : getAllExercises()
      ).slice(0, 15);

  const isSwapped =
    currentExerciseId !== null &&
    originalExerciseId !== null &&
    currentExerciseId !== originalExerciseId;

  const confirmSelectExercise = (exerciseId: number) => {
    const isSwap = currentExerciseId !== null;
    Alert.alert(
      'Are you sure?',
      isSwap
        ? 'This will lock in your exercise swap for this slot.'
        : 'This will select this exercise for this slot.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: isSwap ? 'Swap' : 'Select',
          style: 'default',
          onPress: () => {
            void handleSelect(exerciseId);
          },
        },
      ]
    );
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title={
        currentExercise ? `Swap ${currentExercise.name}` : 'Select exercise'
      }
    >
      <Text style={styles.modalSubtitle}>
        {currentExercise
          ? `Alternatives for ${currentExercise.pattern}`
          : 'Choose an exercise'}
      </Text>

      <FilterChip
        label="No equipment (bodyweight only)"
        selected={noEquipmentOnly}
        onPress={() => setNoEquipmentOnly((prev) => !prev)}
      />

      <Text style={styles.deviationTitle}>
        Deviating from too many exercises could reduce the effectiveness of the
        overall program.
      </Text>

      {!isPro && (
        <View style={styles.disclaimer} accessible>
          <Ionicons
            name="information-circle-outline"
            size={18}
            color={color.textSecondary}
          />
          <Text style={styles.disclaimerText}>
            Swapping an exercise uses one of your free swaps. You get 10 per
            month, resetting on the 1st of each month. Upgrade to Pro in your
            account to get unlimited swaps.
          </Text>
        </View>
      )}

      {isSwapped && originalExercise && (
        <ActionChip
          label={`Reset to ${originalExercise.name}`}
          icon="refresh"
          tone="neutral"
          onPress={handleResetPress}
        />
      )}

      {filteredAlternatives.length === 0 && currentExerciseId && (
        <Text style={styles.noAlternatives}>
          No matches found with this filter.
        </Text>
      )}
      {currentExerciseId ? (
        <>
          {bestMatches.length > 0 && (
            <View style={styles.section}>
              <SectionHeader title="Best matches (100%)" />
              {bestMatches.map((a) => (
                <SwapModalAlternativeRow
                  key={a.exercise.id}
                  name={a.exercise.name}
                  equipment={a.exercise.equipment}
                  muscle={a.exercise.muscle}
                  matchScore={a.matchScore}
                  onPress={() => confirmSelectExercise(a.exercise.id)}
                />
              ))}
            </View>
          )}

          {otherMatches.length > 0 && (
            <View style={styles.section}>
              <SectionHeader title="Other options (50%)" />
              <Text style={styles.sectionHelperText}>
                These keep the muscle group but may use a different movement
                pattern.
              </Text>
              {otherMatches.map((a) => (
                <SwapModalAlternativeRow
                  key={a.exercise.id}
                  name={a.exercise.name}
                  equipment={a.exercise.equipment}
                  muscle={a.exercise.muscle}
                  matchScore={a.matchScore}
                  onPress={() => confirmSelectExercise(a.exercise.id)}
                />
              ))}
            </View>
          )}
        </>
      ) : (
        <View style={styles.section}>
          {allExercisesForEmptySlot.map((exercise) => (
            <SwapModalAlternativeRow
              key={exercise.id}
              name={exercise.name}
              equipment={exercise.equipment}
              muscle={exercise.muscle}
              onPress={() => confirmSelectExercise(exercise.id)}
            />
          ))}
        </View>
      )}
    </BottomSheet>
  );
};
