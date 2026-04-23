import { useSubscription } from '@/src/hooks/use-subscription';
import { useSwapModalActions } from '@/src/hooks/useSwapModalActions';
import React from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { getAllExercises, getExerciseById } from '../data/exercises';
import {
  findAlternatives,
  type ExerciseAlternative,
} from '../utils/pivotEngine';
import { SwapModalAlternativeRow } from './SwapModalAlternativeRow';
import { swapModalStyles as styles } from './swapModalStyles';

type SwapModalProps = {
  visible: boolean;
  currentExerciseId: number | null;
  originalExerciseId: number | null;
  dayIndex: number | null;
  slotIndex: number;
  onClose: () => void;
  onClearData?: () => void;
};

export const SwapModal: React.FC<SwapModalProps> = ({
  visible,
  currentExerciseId,
  originalExerciseId,
  dayIndex,
  slotIndex,
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

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {currentExercise
                ? `Swap ${currentExercise.name}`
                : 'Select Exercise'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.modalSubtitle}>
            {currentExercise
              ? `Alternatives for ${currentExercise.pattern}`
              : 'Choose an exercise'}
          </Text>

          <TouchableOpacity
            style={[
              styles.equipmentToggle,
              noEquipmentOnly && styles.equipmentToggleActive,
            ]}
            onPress={() => setNoEquipmentOnly((prev) => !prev)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.equipmentToggleText,
                noEquipmentOnly && styles.equipmentToggleTextActive,
              ]}
            >
              No equipment (bodyweight only)
            </Text>
          </TouchableOpacity>

          <Text style={styles.deviationTitle}>
            Deviating from too many exercises could reduce the effectiveness of
            the overall program.
          </Text>

          {!isPro && (
            <Text style={styles.disclaimer}>
              Swapping an exercise will use one of your free swaps, you get 10
              per month, resetting on the 1st of each month. Upgrade to PRO in
              the account to get unlimited swaps.
            </Text>
          )}

          {isSwapped && originalExercise && (
            <TouchableOpacity
              style={styles.resetButton}
              onPress={handleResetPress}
            >
              <Text style={styles.resetButtonText}>
                Reset to {originalExercise.name}
              </Text>
            </TouchableOpacity>
          )}

          <ScrollView style={styles.alternativesList}>
            {filteredAlternatives.length === 0 && currentExerciseId && (
              <Text style={styles.noAlternatives}>
                No matches found with this filter.
              </Text>
            )}
            {currentExerciseId ? (
              <>
                {bestMatches.length > 0 && (
                  <>
                    <Text style={styles.sectionTitle}>Best matches (100%)</Text>
                    {bestMatches.map((a) => (
                      <SwapModalAlternativeRow
                        key={a.exercise.id}
                        name={a.exercise.name}
                        equipment={a.exercise.equipment}
                        muscle={a.exercise.muscle}
                        matchScore={a.matchScore}
                        onPress={() => handleSelect(a.exercise.id)}
                      />
                    ))}
                  </>
                )}

                {otherMatches.length > 0 && (
                  <>
                    <Text style={styles.sectionTitle}>Other options (50%)</Text>
                    <Text style={styles.sectionHelperText}>
                      These keep the muscle group but may use a different
                      movement pattern.
                    </Text>
                    {otherMatches.map((a) => (
                      <SwapModalAlternativeRow
                        key={a.exercise.id}
                        name={a.exercise.name}
                        equipment={a.exercise.equipment}
                        muscle={a.exercise.muscle}
                        matchScore={a.matchScore}
                        onPress={() => handleSelect(a.exercise.id)}
                      />
                    ))}
                  </>
                )}
              </>
            ) : (
              allExercisesForEmptySlot.map((exercise) => (
                <SwapModalAlternativeRow
                  key={exercise.id}
                  name={exercise.name}
                  equipment={exercise.equipment}
                  muscle={exercise.muscle}
                  onPress={() => handleSelect(exercise.id)}
                />
              ))
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
