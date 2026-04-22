import { increment } from '@/src/services/metricService';
import type { Exercise as CatalogExercise } from '@/src/types/exercise';
import type { Exercise as ProgramExercise } from '@/src/types/program';
import type {
  ExercisePersonalBestsLedger,
  RepMax,
} from '@/src/types/personalBests';
import type { WeightUnit } from '@/src/utils/storage';
import {
  formatExercisePbSubtitle,
  previewPersonalBestLog,
  repCountToTier,
} from '@/src/utils/personalBests';
import {
  clearLoggedSet,
  getCustomSetCount,
  getLoggedSets,
  getAutoPbDetectionInProgramsEnabled,
  getPersonalBestsForExercise,
  getRemainingSwapCount,
  saveCustomSetCount,
  saveLoggedSet,
  savePersonalBest,
} from '@/src/utils/storage';
import {
  formatWeightValueFromKg,
  parseUserWeightInputToKg,
} from '@/src/utils/weightUnits';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export type ExerciseCardPbPrompt = {
  exerciseId: number;
  setIndex: number;
  primaryTier: RepMax;
  weight: number;
  newRecords: RepMax[];
};

type UseExerciseCardStateArgs = {
  isPro: boolean;
  exerciseId: number | null;
  programExercise: ProgramExercise | null;
  dayIndex: number | null;
  slotIndex: number;
  exerciseLoggingType: CatalogExercise['logging_type'];
  weightUnit: WeightUnit;
};

export function useExerciseCardState({
  isPro,
  exerciseId,
  programExercise,
  dayIndex,
  slotIndex,
  exerciseLoggingType,
  weightUnit,
}: UseExerciseCardStateArgs) {
  const [weights, setWeights] = useState<string[]>([]);
  const [reps, setReps] = useState<string[]>([]);
  const [setStates, setSetStates] = useState<
    Map<number, 'completed' | 'failed'>
  >(new Map());
  const [loading, setLoading] = useState(false);
  const [remainingSwaps, setRemainingSwaps] = useState<number | null>(null);
  const [pbPrompt, setPbPrompt] = useState<ExerciseCardPbPrompt | null>(null);
  const [pbLedger, setPbLedger] = useState<ExercisePersonalBestsLedger | null>(
    null
  );
  const saveTimersRef = useRef<{
    [key: number]: ReturnType<typeof setTimeout>;
  }>({});
  const pbDebounceRef = useRef<{
    [key: number]: ReturnType<typeof setTimeout>;
  }>({});
  const setStatesRef = useRef(setStates);
  const weightsRef = useRef(weights);
  const repsRef = useRef(reps);

  setStatesRef.current = setStates;
  weightsRef.current = weights;
  repsRef.current = reps;

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

  const loadPbLedger = useCallback(async () => {
    if (!exerciseId || exerciseLoggingType !== 'reps_and_weight') {
      setPbLedger(null);
      return;
    }
    try {
      const ledger = await getPersonalBestsForExercise(exerciseId);
      setPbLedger(ledger);
    } catch (error) {
      console.error('Error loading personal bests for card:', error);
      setPbLedger({});
    }
  }, [exerciseId, exerciseLoggingType]);

  useEffect(() => {
    loadPbLedger();
  }, [loadPbLedger]);

  useEffect(() => {
    setPbPrompt(null);
    Object.values(pbDebounceRef.current).forEach((t) => {
      if (t) clearTimeout(t);
    });
    pbDebounceRef.current = {};
  }, [exerciseId, dayIndex, slotIndex]);

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
                savedSet.weight === null
                  ? ''
                  : formatWeightValueFromKg(savedSet.weight, weightUnit);
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
    weightUnit,
  ]);

  useEffect(() => {
    const timers = saveTimersRef.current;
    return () => {
      Object.values(timers).forEach((timer) => {
        if (timer) clearTimeout(timer);
      });
    };
  }, []);

  useEffect(() => {
    return () => {
      Object.values(pbDebounceRef.current).forEach((timer) => {
        if (timer) clearTimeout(timer);
      });
    };
  }, []);

  const clearPbDebounce = useCallback((setIndex: number) => {
    const t = pbDebounceRef.current[setIndex];
    if (t) clearTimeout(t);
    delete pbDebounceRef.current[setIndex];
  }, []);

  const schedulePbCheck = useCallback(
    (setIndex: number, weight: number, repsNum: number) => {
      if (!exerciseId || exerciseLoggingType !== 'reps_and_weight') {
        return;
      }
      clearPbDebounce(setIndex);
      pbDebounceRef.current[setIndex] = setTimeout(async () => {
        if (dayIndex !== null) {
          const enabled = await getAutoPbDetectionInProgramsEnabled();
          if (!enabled) {
            return;
          }
        }
        if (setStatesRef.current.get(setIndex) !== 'completed') {
          return;
        }
        const wStr = weightsRef.current[setIndex] ?? '';
        const rStr = repsRef.current[setIndex] ?? '';
        const w = wStr ? parseFloat(wStr) : null;
        const r = parseInt(rStr, 10);
        if (w === null || isNaN(w) || w <= 0 || isNaN(r) || r <= 0) {
          return;
        }
        if (w !== weight || r !== repsNum) {
          return;
        }
        const tier = repCountToTier(r);
        if (!tier || !exerciseId) {
          return;
        }
        try {
          const current = await getPersonalBestsForExercise(exerciseId);
          const { isPR, newRecords } = previewPersonalBestLog(current, tier, w);
          if (!isPR || newRecords.length === 0) {
            return;
          }
          setPbPrompt({
            exerciseId,
            setIndex,
            primaryTier: tier,
            weight: w,
            newRecords,
          });
        } catch (error) {
          console.error('Error checking personal best:', error);
        }
      }, 250);
    },
    [exerciseId, exerciseLoggingType, clearPbDebounce, dayIndex]
  );

  const dismissPbPrompt = useCallback(() => {
    setPbPrompt(null);
  }, []);

  const confirmPbPrompt = useCallback(async () => {
    if (!pbPrompt) {
      return;
    }
    try {
      await savePersonalBest(
        pbPrompt.exerciseId,
        pbPrompt.primaryTier,
        pbPrompt.weight
      );
      setPbPrompt(null);
      await loadPbLedger();
    } catch (error) {
      console.error('Error saving personal best:', error);
    }
  }, [pbPrompt, loadPbLedger]);

  const exercisePbSubtitle = useMemo(
    () => formatExercisePbSubtitle(pbLedger ?? undefined, weightUnit),
    [pbLedger, weightUnit]
  );

  const autoSaveSet = async (
    setIndex: number,
    weightStr: string,
    repsStr: string
  ) => {
    if (!exerciseId || dayIndex === null || !repsStr) {
      return;
    }

    const weightKg = parseUserWeightInputToKg(weightStr, weightUnit);
    const repsNum = parseInt(repsStr, 10);

    if (weightKg !== null && (!Number.isFinite(weightKg) || weightKg < 0)) {
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
        weightKg,
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

  const handleToggleSetState = async (
    setIndex: number
  ): Promise<'completed' | 'failed' | undefined> => {
    if (!exerciseId || !reps[setIndex] || dayIndex === null) {
      return undefined;
    }

    const weightKg = parseUserWeightInputToKg(weights[setIndex] ?? '', weightUnit);
    const repsNum = parseInt(reps[setIndex], 10);

    if (weightKg !== null && (!Number.isFinite(weightKg) || weightKg < 0)) {
      return undefined;
    }
    if (isNaN(repsNum) || repsNum <= 0) {
      return undefined;
    }

    setLoading(true);
    let nextState: 'completed' | 'failed' | undefined = undefined;

    try {
      const currentState = setStates.get(setIndex);
      const newSetStates = new Map(setStates);

      if (currentState === undefined) {
        newSetStates.set(setIndex, 'completed');
        nextState = 'completed';
        await increment('sets_logged');
        await saveLoggedSet(
          dayIndex,
          slotIndex,
          setIndex,
          weightKg,
          repsNum,
          'completed'
        );
        if (
          exerciseLoggingType === 'reps_and_weight' &&
          weightKg !== null &&
          Number.isFinite(weightKg) &&
          weightKg > 0
        ) {
          schedulePbCheck(setIndex, weightKg, repsNum);
        }
      } else if (currentState === 'completed') {
        clearPbDebounce(setIndex);
        newSetStates.set(setIndex, 'failed');
        nextState = 'failed';
        await saveLoggedSet(
          dayIndex,
          slotIndex,
          setIndex,
          weightKg,
          repsNum,
          'failed'
        );
      } else if (currentState === 'failed') {
        clearPbDebounce(setIndex);
        newSetStates.delete(setIndex);
        nextState = undefined;
        await saveLoggedSet(
          dayIndex,
          slotIndex,
          setIndex,
          weightKg,
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

    return nextState;
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
        clearPbDebounce(i);
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
    pbPrompt,
    dismissPbPrompt,
    confirmPbPrompt,
    exercisePbSubtitle,
  };
}
