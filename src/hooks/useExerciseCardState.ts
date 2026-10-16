import { getExerciseById } from '@/src/data/exercises';
import { increment } from '@/src/services/metricService';
import { posthogEventsNames } from '@/src/services/posthogEvents';
import type { Exercise as CatalogExercise } from '@/src/types/exercise';
import type {
  ExercisePersonalBestsLedger,
  RepMax,
} from '@/src/types/personalBests';
import type { Exercise as ProgramExercise } from '@/src/types/program';
import {
  formatExercisePbSubtitle,
  formatExercisePbSubtitleHeader,
  previewPersonalBestLog,
  repCountToTier,
} from '@/src/utils/personalBests';
import type { WeightUnit } from '@/src/utils/storage';
import type { ReorderLoggedSetPayload } from '@/src/utils/storage';
import {
  clearLoggedSet,
  getAutoPbDetectionInProgramsEnabled,
  getCustomSetCount,
  getLoggedSets,
  getPersonalBestsForExercise,
  getRemainingSwapCount,
  getTrainingMax,
  reorderLoggedSets,
  saveCustomSetCount,
  saveLoggedSet,
  savePersonalBest,
} from '@/src/utils/storage';
import {
  effectiveTrainingMaxKg,
  trainingMaxSetWeightKg,
} from '@/src/utils/trainingMax';
import {
  formatWeightValueFromKg,
  parseUserWeightInputToKg,
} from '@/src/utils/weightUnits';
import { usePostHog } from 'posthog-react-native';
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
  const posthog = usePostHog();
  const [weights, setWeights] = useState<string[]>([]);
  const [reps, setReps] = useState<string[]>([]);
  const [rpes, setRpes] = useState<string[]>([]);
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
  const rpesRef = useRef(rpes);

  setStatesRef.current = setStates;
  weightsRef.current = weights;
  repsRef.current = reps;
  rpesRef.current = rpes;

  const setScheme = programExercise?.setScheme ?? null;
  const defaultNumberOfSets = setScheme?.length ?? programExercise?.sets ?? 1;
  const [numberOfSets, setNumberOfSets] = useState(defaultNumberOfSets);
  const restTimeSeconds = programExercise?.restTimeSeconds;

  // Training max drives per-set target weights for `setScheme` lifts (e.g. 5/3/1).
  const [trainingMaxKg, setTrainingMaxKg] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    const loadTrainingMax = async () => {
      if (!setScheme || !exerciseId) {
        setTrainingMaxKg(null);
        return;
      }
      try {
        const tmId = programExercise?.trainingMaxExerciseId ?? exerciseId;
        const tm = await getTrainingMax(tmId);
        if (!cancelled) {
          setTrainingMaxKg(tm);
        }
      } catch (error) {
        console.error('Error loading training max for card:', error);
        if (!cancelled) {
          setTrainingMaxKg(null);
        }
      }
    };
    loadTrainingMax();
    return () => {
      cancelled = true;
    };
  }, [setScheme, exerciseId, programExercise?.trainingMaxExerciseId]);

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

  // Reps target for a specific set. `setScheme` lifts vary reps per set; every
  // other exercise falls back to the single repRange default.
  const getDefaultRepForSet = useCallback(
    (setIndex: number): string => {
      if (setScheme) {
        const entry = setScheme[setIndex];
        return entry ? entry.reps.toString() : '';
      }
      return getDefaultRepValue();
    },
    [setScheme, getDefaultRepValue]
  );

  // Pre-filled target weight (display string) for a `setScheme` set, computed
  // from the stored training max plus any cycle increment. Empty when the lift
  // is not scheme-driven or the training max has not been entered yet.
  const getPrefilledWeightForSet = useCallback(
    (setIndex: number): string => {
      if (!setScheme || trainingMaxKg === null) {
        return '';
      }
      const entry = setScheme[setIndex];
      if (!entry) {
        return '';
      }
      const effectiveTm = effectiveTrainingMaxKg(
        trainingMaxKg,
        programExercise?.trainingMaxIncrementLb ?? 0
      );
      const targetKg = trainingMaxSetWeightKg(
        effectiveTm,
        entry.percentOfTrainingMax,
        weightUnit
      );
      return formatWeightValueFromKg(targetKg, weightUnit);
    },
    [
      setScheme,
      trainingMaxKg,
      programExercise?.trainingMaxIncrementLb,
      weightUnit,
    ]
  );

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
          const initialRpes: string[] = [];
          const initialSetStates: Map<number, 'completed' | 'failed'> =
            new Map();

          for (let i = 0; i < actualSetCount; i++) {
            const savedSet = savedSets[i];
            if (savedSet) {
              initialWeights[i] =
                savedSet.weight === null
                  ? ''
                  : formatWeightValueFromKg(savedSet.weight, weightUnit);
              initialReps[i] = savedSet.reps.toString();
              initialRpes[i] =
                typeof savedSet.rpe === 'number' ? String(savedSet.rpe) : '';
              if (savedSet.state && savedSet.state !== null) {
                const state = savedSet.state;
                if (state === 'completed' || state === 'failed') {
                  initialSetStates.set(i, state);
                }
              }
            } else {
              initialWeights[i] = getPrefilledWeightForSet(i);
              initialReps[i] = getDefaultRepForSet(i);
              initialRpes[i] = '';
            }
          }

          setWeights(initialWeights);
          setReps(initialReps);
          setRpes(initialRpes);
          setSetStates(initialSetStates);
        } catch (error) {
          console.error('Error loading data:', error);
          const defaultRepValue = getDefaultRepValue();
          setWeights(Array(defaultNumberOfSets).fill(''));
          setReps(Array(defaultNumberOfSets).fill(defaultRepValue));
          setRpes(Array(defaultNumberOfSets).fill(''));
          setNumberOfSets(defaultNumberOfSets);
        }
      } else {
        setWeights(
          Array.from({ length: defaultNumberOfSets }, (_, i) =>
            getPrefilledWeightForSet(i)
          )
        );
        setReps(
          Array.from({ length: defaultNumberOfSets }, (_, i) =>
            getDefaultRepForSet(i)
          )
        );
        setRpes(Array(defaultNumberOfSets).fill(''));
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
    getDefaultRepForSet,
    getPrefilledWeightForSet,
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
    if (pbPrompt) {
      posthog.capture(posthogEventsNames.pb.modalDismissed, {
        exercise_id: String(pbPrompt.exerciseId),
      });
    }
    setPbPrompt(null);
  }, [pbPrompt, posthog]);

  const confirmPbPrompt = useCallback(async () => {
    if (!pbPrompt) {
      return;
    }
    const exId = pbPrompt.exerciseId;
    posthog.capture(posthogEventsNames.pb.modalAccepted, {
      exercise_id: String(exId),
    });
    try {
      await savePersonalBest(
        pbPrompt.exerciseId,
        pbPrompt.primaryTier,
        pbPrompt.weight
      );
      const ex = getExerciseById(exId);
      posthog.capture(posthogEventsNames.pb.logged, {
        exercise_id: String(exId),
        exercise_name: ex?.name ?? 'unknown',
        value: pbPrompt.weight,
      });
      setPbPrompt(null);
      await loadPbLedger();
    } catch (error) {
      console.error('Error saving personal best:', error);
    }
  }, [pbPrompt, loadPbLedger, posthog]);

  const exercisePbSubtitle = useMemo(
    () => formatExercisePbSubtitle(pbLedger ?? undefined, weightUnit),
    [pbLedger, weightUnit]
  );

  const exercisePbSubtitleHeader = useMemo(
    () => formatExercisePbSubtitleHeader(pbLedger ?? undefined, weightUnit),
    [pbLedger, weightUnit]
  );

  /** null = clear; undefined = invalid / incomplete — preserve existing on save. */
  const parseRpeInput = (value: string): number | null | undefined => {
    const trimmed = value.trim();
    if (trimmed === '') {
      return null;
    }
    if (!/^\d{1,2}$/.test(trimmed)) {
      return undefined;
    }
    const n = parseInt(trimmed, 10);
    if (!Number.isInteger(n) || n < 1 || n > 10) {
      return undefined;
    }
    return n;
  };

  const autoSaveSet = async (
    setIndex: number,
    weightStr: string,
    repsStr: string,
    rpeStr?: string
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
      const currentState = setStatesRef.current.get(setIndex);
      const parsedRpe = parseRpeInput(
        rpeStr ?? rpesRef.current[setIndex] ?? ''
      );
      await saveLoggedSet(
        dayIndex,
        slotIndex,
        setIndex,
        weightKg,
        repsNum,
        currentState,
        parsedRpe
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
      autoSaveSet(
        setIndex,
        value,
        repsRef.current[setIndex] || '',
        rpesRef.current[setIndex] || ''
      );
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
      autoSaveSet(
        setIndex,
        weightsRef.current[setIndex] || '',
        value,
        rpesRef.current[setIndex] || ''
      );
    }, 500);
  };

  const handleRpeChange = (setIndex: number, value: string) => {
    const newRpes = [...rpes];
    newRpes[setIndex] = value;
    setRpes(newRpes);

    if (saveTimersRef.current[setIndex]) {
      clearTimeout(saveTimersRef.current[setIndex]);
    }

    saveTimersRef.current[setIndex] = setTimeout(() => {
      autoSaveSet(
        setIndex,
        weightsRef.current[setIndex] || '',
        repsRef.current[setIndex] || '',
        value
      );
    }, 500);
  };

  const handleToggleSetState = async (
    setIndex: number
  ): Promise<'completed' | 'failed' | undefined> => {
    if (!exerciseId || !reps[setIndex] || dayIndex === null) {
      return undefined;
    }

    const weightKg = parseUserWeightInputToKg(
      weights[setIndex] ?? '',
      weightUnit
    );
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

      const parsedRpe = parseRpeInput(rpesRef.current[setIndex] ?? '');

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
          'completed',
          parsedRpe
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
          'failed',
          parsedRpe
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
          null,
          parsedRpe
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
      setRpes((prev) => prev.slice(0, newCount));

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
      const newSetIndex = numberOfSets;
      const newCount = numberOfSets + 1;
      setNumberOfSets(newCount);
      setWeights((prev) => [...prev, getPrefilledWeightForSet(newSetIndex)]);
      setReps((prev) => [...prev, getDefaultRepForSet(newSetIndex)]);
      setRpes((prev) => [...prev, '']);

      await saveCustomSetCount(dayIndex, slotIndex, newCount);
    }
  };

  const flushPendingSaves = async () => {
    const pendingIndexes = Object.keys(saveTimersRef.current).map((key) =>
      Number(key)
    );
    for (const setIndex of pendingIndexes) {
      const timer = saveTimersRef.current[setIndex];
      if (timer) {
        clearTimeout(timer);
      }
      delete saveTimersRef.current[setIndex];
      await autoSaveSet(
        setIndex,
        weightsRef.current[setIndex] || '',
        repsRef.current[setIndex] || '',
        rpesRef.current[setIndex] || ''
      );
    }
  };

  const handleReorderSets = async (fromIndex: number, toIndex: number) => {
    if (
      dayIndex === null ||
      fromIndex === toIndex ||
      fromIndex < 0 ||
      toIndex < 0 ||
      fromIndex >= numberOfSets ||
      toIndex >= numberOfSets
    ) {
      return;
    }

    await flushPendingSaves();

    const moveItem = <T,>(items: T[]): T[] => {
      const next = [...items];
      const [item] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, item);
      return next;
    };

    const nextWeights = moveItem(weightsRef.current);
    const nextReps = moveItem(repsRef.current);
    const nextRpes = moveItem(rpesRef.current);
    const stateList = Array.from(
      { length: numberOfSets },
      (_, i) => setStatesRef.current.get(i)
    );
    const nextStateList = moveItem(stateList);
    const nextSetStates = new Map<number, 'completed' | 'failed'>();
    nextStateList.forEach((state, i) => {
      if (state === 'completed' || state === 'failed') {
        nextSetStates.set(i, state);
      }
    });

    setWeights(nextWeights);
    setReps(nextReps);
    setRpes(nextRpes);
    setSetStates(nextSetStates);

    const ordered: ReorderLoggedSetPayload[] = [];
    for (let i = 0; i < numberOfSets; i++) {
      const repsNum = parseInt(nextReps[i] || '', 10);
      const hasReps = !isNaN(repsNum) && repsNum > 0;
      const weightKg = parseUserWeightInputToKg(
        nextWeights[i] || '',
        weightUnit
      );
      const parsedRpe = parseRpeInput(nextRpes[i] || '');
      const state = nextSetStates.get(i) ?? null;
      ordered.push({
        weight:
          weightKg !== null && Number.isFinite(weightKg) && weightKg >= 0
            ? weightKg
            : null,
        reps: hasReps ? repsNum : null,
        state,
        rpe: parsedRpe === undefined ? null : parsedRpe,
      });
    }

    try {
      await reorderLoggedSets(dayIndex, slotIndex, ordered);
    } catch (error) {
      console.error('Error reordering sets:', error);
    }
  };

  return {
    weights,
    reps,
    rpes,
    setStates,
    loading,
    remainingSwaps,
    numberOfSets,
    defaultNumberOfSets,
    restTimeSeconds,
    getDefaultRepValue,
    handleWeightChange,
    handleRepsChange,
    handleRpeChange,
    handleToggleSetState,
    handleReorderSets,
    decrementSets,
    incrementSets,
    pbPrompt,
    dismissPbPrompt,
    confirmPbPrompt,
    exercisePbSubtitle,
    exercisePbSubtitleHeader,
  };
}
