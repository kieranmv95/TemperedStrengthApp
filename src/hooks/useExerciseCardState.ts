import { increment } from '@/src/services/metricService';
import type { Exercise as ProgramExercise } from '@/src/types/program';
import {
  clearLoggedSet,
  getCustomSetCount,
  getLoggedSets,
  getRemainingSwapCount,
  saveCustomSetCount,
  saveLoggedSet,
} from '@/src/utils/storage';
import { useCallback, useEffect, useRef, useState } from 'react';

type UseExerciseCardStateArgs = {
  isPro: boolean;
  exerciseId: number | null;
  programExercise: ProgramExercise | null;
  dayIndex: number | null;
  slotIndex: number;
};

export function useExerciseCardState({
  isPro,
  exerciseId,
  programExercise,
  dayIndex,
  slotIndex,
}: UseExerciseCardStateArgs) {
  const [weights, setWeights] = useState<string[]>([]);
  const [reps, setReps] = useState<string[]>([]);
  const [setStates, setSetStates] = useState<
    Map<number, 'completed' | 'failed'>
  >(new Map());
  const [loading, setLoading] = useState(false);
  const [remainingSwaps, setRemainingSwaps] = useState<number | null>(null);
  const saveTimersRef = useRef<{
    [key: number]: ReturnType<typeof setTimeout>;
  }>({});

  const defaultNumberOfSets = programExercise?.sets || 1;
  const [numberOfSets, setNumberOfSets] = useState(defaultNumberOfSets);
  const restTimeSeconds = programExercise?.restTimeSeconds;

  const getDefaultRepValue = useCallback((): string => {
    if (
      programExercise?.repRange &&
      !programExercise.hideReps &&
      !programExercise.isAmrap
    ) {
      const [min, max] = programExercise.repRange;
      return (min === max ? min : max).toString();
    }
    return '';
  }, [programExercise]);

  useEffect(() => {
    const loadSwapCount = async () => {
      if (!isPro) {
        try {
          const count = await getRemainingSwapCount();
          setRemainingSwaps(count);
        } catch (error) {
          console.error('Error loading swap count:', error);
          setRemainingSwaps(10);
        }
      } else {
        setRemainingSwaps(null);
      }
    };
    loadSwapCount();
  }, [isPro]);

  useEffect(() => {
    const loadData = async () => {
      if (dayIndex !== null && programExercise) {
        try {
          const customCount = await getCustomSetCount(dayIndex, slotIndex);
          const actualSetCount = customCount ?? defaultNumberOfSets;
          setNumberOfSets(actualSetCount);

          const savedSets = await getLoggedSets(dayIndex, slotIndex);

          const initialWeights: string[] = [];
          const initialReps: string[] = [];
          const initialSetStates: Map<number, 'completed' | 'failed'> =
            new Map();

          const defaultRepValue = getDefaultRepValue();

          for (let i = 0; i < actualSetCount; i++) {
            const savedSet = savedSets[i];
            if (savedSet) {
              initialWeights[i] =
                savedSet.weight === null ? '' : savedSet.weight.toString();
              initialReps[i] = savedSet.reps.toString();
              if (savedSet.state && savedSet.state !== null) {
                const state = savedSet.state;
                if (state === 'completed' || state === 'failed') {
                  initialSetStates.set(i, state);
                }
              }
            } else {
              initialWeights[i] = '';
              initialReps[i] = defaultRepValue;
            }
          }

          setWeights(initialWeights);
          setReps(initialReps);
          setSetStates(initialSetStates);
        } catch (error) {
          console.error('Error loading data:', error);
          const defaultRepValue = getDefaultRepValue();
          setWeights(Array(defaultNumberOfSets).fill(''));
          setReps(Array(defaultNumberOfSets).fill(defaultRepValue));
          setNumberOfSets(defaultNumberOfSets);
        }
      } else {
        const defaultRepValue = getDefaultRepValue();
        setWeights(Array(defaultNumberOfSets).fill(''));
        setReps(Array(defaultNumberOfSets).fill(defaultRepValue));
        setSetStates(new Map());
        setNumberOfSets(defaultNumberOfSets);
      }
    };

    loadData();
  }, [
    programExercise,
    defaultNumberOfSets,
    dayIndex,
    slotIndex,
    exerciseId,
    getDefaultRepValue,
  ]);

  useEffect(() => {
    const timers = saveTimersRef.current;
    return () => {
      Object.values(timers).forEach((timer) => {
        if (timer) clearTimeout(timer);
      });
    };
  }, []);

  const autoSaveSet = async (
    setIndex: number,
    weightStr: string,
    repsStr: string
  ) => {
    if (!exerciseId || dayIndex === null || !repsStr) {
      return;
    }

    const weightNum = weightStr ? parseFloat(weightStr) : null;
    const repsNum = parseInt(repsStr, 10);

    if (weightNum !== null && (isNaN(weightNum) || weightNum < 0)) {
      return;
    }
    if (isNaN(repsNum) || repsNum <= 0) {
      return;
    }

    try {
      const currentState = setStates.get(setIndex);
      await saveLoggedSet(
        dayIndex,
        slotIndex,
        setIndex,
        weightNum,
        repsNum,
        currentState
      );
    } catch (error) {
      console.error('Error auto-saving set:', error);
    }
  };

  const handleWeightChange = (setIndex: number, value: string) => {
    const newWeights = [...weights];
    newWeights[setIndex] = value;
    setWeights(newWeights);

    if (saveTimersRef.current[setIndex]) {
      clearTimeout(saveTimersRef.current[setIndex]);
    }

    saveTimersRef.current[setIndex] = setTimeout(() => {
      autoSaveSet(setIndex, value, reps[setIndex] || '');
    }, 500);
  };

  const handleRepsChange = (setIndex: number, value: string) => {
    const newReps = [...reps];
    newReps[setIndex] = value;
    setReps(newReps);

    if (saveTimersRef.current[setIndex]) {
      clearTimeout(saveTimersRef.current[setIndex]);
    }

    saveTimersRef.current[setIndex] = setTimeout(() => {
      autoSaveSet(setIndex, weights[setIndex] || '', value);
    }, 500);
  };

  const handleToggleSetState = async (setIndex: number) => {
    if (!exerciseId || !reps[setIndex] || dayIndex === null) {
      return;
    }

    const weightNum = weights[setIndex] ? parseFloat(weights[setIndex]) : null;
    const repsNum = parseInt(reps[setIndex], 10);

    if (weightNum !== null && (isNaN(weightNum) || weightNum < 0)) {
      return;
    }
    if (isNaN(repsNum) || repsNum <= 0) {
      return;
    }

    setLoading(true);

    try {
      const currentState = setStates.get(setIndex);
      const newSetStates = new Map(setStates);

      if (currentState === undefined) {
        newSetStates.set(setIndex, 'completed');
        await increment('sets_logged');
        await saveLoggedSet(
          dayIndex,
          slotIndex,
          setIndex,
          weightNum,
          repsNum,
          'completed'
        );
      } else if (currentState === 'completed') {
        newSetStates.set(setIndex, 'failed');
        await saveLoggedSet(
          dayIndex,
          slotIndex,
          setIndex,
          weightNum,
          repsNum,
          'failed'
        );
      } else if (currentState === 'failed') {
        newSetStates.delete(setIndex);
        await saveLoggedSet(
          dayIndex,
          slotIndex,
          setIndex,
          weightNum,
          repsNum,
          null
        );
      }

      setSetStates(newSetStates);
    } catch (error) {
      console.error('Error toggling set state:', error);
    } finally {
      setLoading(false);
    }
  };

  const decrementSets = async () => {
    if (numberOfSets > 1 && dayIndex !== null) {
      const newCount = numberOfSets - 1;
      setNumberOfSets(newCount);
      setWeights((prev) => prev.slice(0, newCount));
      setReps((prev) => prev.slice(0, newCount));

      const newSetStates = new Map(setStates);
      for (let i = newCount; i < numberOfSets; i++) {
        newSetStates.delete(i);
      }
      setSetStates(newSetStates);

      await saveCustomSetCount(dayIndex, slotIndex, newCount);

      try {
        for (let i = newCount; i < numberOfSets; i++) {
          await clearLoggedSet(dayIndex, slotIndex, i);
        }
      } catch (error) {
        console.error('Error clearing removed sets:', error);
      }
    }
  };

  const incrementSets = async () => {
    if (dayIndex !== null) {
      const defaultRepValue = getDefaultRepValue();
      const newCount = numberOfSets + 1;
      setNumberOfSets(newCount);
      setWeights((prev) => [...prev, '']);
      setReps((prev) => [...prev, defaultRepValue]);

      await saveCustomSetCount(dayIndex, slotIndex, newCount);
    }
  };

  return {
    weights,
    reps,
    setStates,
    loading,
    remainingSwaps,
    numberOfSets,
    defaultNumberOfSets,
    restTimeSeconds,
    getDefaultRepValue,
    handleWeightChange,
    handleRepsChange,
    handleToggleSetState,
    decrementSets,
    incrementSets,
  };
}
