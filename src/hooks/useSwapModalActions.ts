import { increment } from '@/src/services/metricService';
import {
  clearExerciseSwap,
  clearLoggedSetsForSlot,
  getRemainingSwapCount,
  hasLoggedSets,
  incrementSwapCount,
  saveExerciseSwap,
} from '@/src/utils/storage';
import { router } from 'expo-router';
import { Alert } from 'react-native';
import { useCallback } from 'react';

type UseSwapModalActionsArgs = {
  isPro: boolean;
  dayIndex: number | null;
  slotIndex: number;
  originalExerciseId: number | null;
  onClose: () => void;
  onClearData?: () => void;
};

export function useSwapModalActions({
  isPro,
  dayIndex,
  slotIndex,
  originalExerciseId,
  onClose,
  onClearData,
}: UseSwapModalActionsArgs) {
  const handleSelect = useCallback(
    async (exerciseId: number) => {
      if (!isPro && dayIndex !== null && originalExerciseId !== null) {
        if (exerciseId !== originalExerciseId) {
          const remainingSwaps = await getRemainingSwapCount();
          if (remainingSwaps <= 0) {
            Alert.alert(
              'Upgrade to Pro',
              'Unlimited swaps is part of a Pro membership. Free users get 10 swaps per month, resetting on the 1st of each month. You can reset a exercise back to the original exercise at any time for free.',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Upgrade to Pro',
                  style: 'default',
                  onPress: () => {
                    onClose();
                    router.push('/settings');
                  },
                },
              ]
            );
            return;
          }
        }
      }

      if (dayIndex !== null) {
        const hasLogged = await hasLoggedSets(dayIndex, slotIndex);

        if (hasLogged) {
          Alert.alert(
            'Clear Workout Data?',
            'Swapping the exercise will clear all logged sets for this exercise. This cannot be undone.',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'Clear and Swap',
                style: 'destructive',
                onPress: async () => {
                  try {
                    await clearLoggedSetsForSlot(dayIndex, slotIndex);
                    await increment('exercises_swapped');
                    if (dayIndex !== null) {
                      await saveExerciseSwap(dayIndex, slotIndex, exerciseId);
                      if (
                        !isPro &&
                        originalExerciseId !== null &&
                        exerciseId !== originalExerciseId
                      ) {
                        await incrementSwapCount();
                      }
                    }
                    if (onClearData) {
                      await onClearData();
                    }
                    onClose();
                  } catch (error) {
                    console.error('Error clearing logged sets:', error);
                    Alert.alert(
                      'Error',
                      'Failed to clear workout data. Please try again.'
                    );
                  }
                },
              },
            ]
          );
          return;
        }
      }

      if (dayIndex !== null) {
        await saveExerciseSwap(dayIndex, slotIndex, exerciseId);
        if (
          !isPro &&
          originalExerciseId !== null &&
          exerciseId !== originalExerciseId
        ) {
          await increment('exercises_swapped');
          await incrementSwapCount();
        }
      }
      if (onClearData) {
        await onClearData();
      }
      onClose();
    },
    [isPro, dayIndex, slotIndex, originalExerciseId, onClose, onClearData]
  );

  const handleResetPress = useCallback(async () => {
    if (dayIndex !== null) {
      const hasLogged = await hasLoggedSets(dayIndex, slotIndex);

      if (hasLogged) {
        Alert.alert(
          'Clear Workout Data?',
          'Resetting to the original exercise will clear all logged sets for this exercise. This cannot be undone.',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Clear and Reset',
              style: 'destructive',
              onPress: async () => {
                try {
                  await clearLoggedSetsForSlot(dayIndex, slotIndex);
                  await clearExerciseSwap(dayIndex, slotIndex);
                  if (onClearData) {
                    onClearData();
                  }
                  onClose();
                } catch (error) {
                  console.error('Error clearing logged sets and swap:', error);
                  Alert.alert(
                    'Error',
                    'Failed to clear workout data. Please try again.'
                  );
                }
              },
            },
          ]
        );
        return;
      }
    }

    if (dayIndex !== null) {
      try {
        await clearExerciseSwap(dayIndex, slotIndex);
        if (onClearData) {
          await onClearData();
        }
        onClose();
      } catch (error) {
        console.error('Error clearing swap:', error);
        Alert.alert('Error', 'Failed to reset exercise. Please try again.');
      }
    }
  }, [dayIndex, slotIndex, onClearData, onClose]);

  return { handleSelect, handleResetPress };
}
