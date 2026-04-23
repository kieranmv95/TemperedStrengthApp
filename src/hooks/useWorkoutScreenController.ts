import { useTimerNotification } from '@/src/hooks/useTimerNotification';
import { useWeightUnit } from '@/src/hooks/useWeightUnit';
import type {
  ExerciseSlot,
  WorkoutSlot,
} from '@/src/screens/workoutScreenConstants';
import { increment } from '@/src/services/metricService';
import type { Workout } from '@/src/types/program';
import type {
  ActiveSession,
  CompletedSession,
  RestTimerState,
} from '@/src/types/storage';
import { fiveMinuteCooldown, fiveMinuteWarmup } from '@/src/data/programModules';
import { getProgramById } from '@/src/utils/program';
import type { ProgramDaySplitKey } from '@/src/utils/programStartWeekday';
import {
  getWorkoutForDaySinceStart,
  listTrainingDayDeltasForProgram,
} from '@/src/utils/programWeekPattern';
import {
  clearActiveSession,
  clearCompletedSession,
  clearRestTimer,
  getActiveProgramId,
  getActiveSession,
  getCompletedSession,
  getExerciseSwapsForDay,
  getProgramCooldownModuleEnabled,
  getProgramStartDate,
  getProgramWarmupModuleEnabled,
  getProgramWorkoutWeekdays,
  getRestTimer,
  getConditioningLogsForDay,
  setProgramCooldownModuleEnabled,
  setProgramWarmupModuleEnabled,
  getWorkoutLogsForDay,
  getWorkoutNotes,
  saveActiveSession,
  saveCompletedSession,
  saveRestTimer,
  saveWorkoutNotes,
} from '@/src/utils/storage';
import { buildWorkoutExportText } from '@/src/utils/workoutExport';
import { Alert, Keyboard, Platform, Share } from 'react-native';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ScrollView, TextInput } from 'react-native';

function calculateDaysSinceStart(startDateStr: string): number {
  const start = new Date(startDateStr);
  const today = new Date();

  start.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function useWorkoutScreenController() {
  const [slots, setSlots] = useState<WorkoutSlot[]>([]);
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
  const [dayIndex, setDayIndex] = useState<number | null>(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [workoutWeekPattern, setWorkoutWeekPattern] = useState<
    ProgramDaySplitKey[] | null
  >(null);
  const [program, setProgram] = useState<ReturnType<
    typeof getProgramById
  > | null>(null);
  const [isRestDay, setIsRestDay] = useState(false);
  const [loading, setLoading] = useState(true);
  const [swapModalVisible, setSwapModalVisible] = useState(false);
  const [copyWorkoutNotesModalVisible, setCopyWorkoutNotesModalVisible] =
    useState(false);
  const [currentSwapSlot, setCurrentSwapSlot] = useState<number | null>(null);
  const [swapRefreshCounter, setSwapRefreshCounter] = useState(0);
  const [notes, setNotes] = useState<string>('');
  const [isNotesExpanded, setIsNotesExpanded] = useState(false);
  const [restTimer, setRestTimer] = useState<RestTimerState | null>(null);
  const [intensityModalVisible, setIntensityModalVisible] = useState(false);
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(
    null
  );
  const [completedSession, setCompletedSession] =
    useState<CompletedSession | null>(null);
  const [sessionSummary, setSessionSummary] = useState<{
    duration: number;
    totalVolume: number;
    setsCompleted: number;
  } | null>(null);
  const { scheduleTimerNotification, cancelTimerNotification } =
    useTimerNotification();
  const { unit: weightUnit } = useWeightUnit();
  const notesDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const notesInputRef = useRef<TextInput>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [notesActive, setNotesActive] = useState(false);
  const notesBlurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [warmupModuleEnabled, setWarmupModuleEnabled] = useState(false);
  const [cooldownModuleEnabled, setCooldownModuleEnabled] = useState(false);

  const programRef = useRef<ReturnType<typeof getProgramById> | null>(null);
  const startDateRef = useRef<string | null>(null);
  const workoutWeekPatternRef = useRef<ProgramDaySplitKey[] | null>(null);
  const warmupModuleEnabledRef = useRef(false);
  const cooldownModuleEnabledRef = useRef(false);

  useEffect(() => {
    programRef.current = program;
    startDateRef.current = startDate;
    workoutWeekPatternRef.current = workoutWeekPattern;
    warmupModuleEnabledRef.current = warmupModuleEnabled;
    cooldownModuleEnabledRef.current = cooldownModuleEnabled;
  }, [program, startDate, workoutWeekPattern, warmupModuleEnabled, cooldownModuleEnabled]);

  const loadExerciseSlots = useCallback(
    async (
      workout: Workout & { exercises: Workout['exercises'] },
      dayIdx: number,
      options?: { warmupEnabled?: boolean; cooldownEnabled?: boolean }
    ) => {
      try {
        const swaps = await getExerciseSwapsForDay(dayIdx);
        const warmupEnabled =
          options?.warmupEnabled ?? warmupModuleEnabledRef.current;
        const cooldownEnabled =
          options?.cooldownEnabled ?? cooldownModuleEnabledRef.current;

        const exercises = [
          ...(warmupEnabled ? [fiveMinuteWarmup] : []),
          ...workout.exercises,
          ...(cooldownEnabled ? [fiveMinuteCooldown] : []),
        ];

        let exerciseSlotIndex = 0;

        const workoutSlots: WorkoutSlot[] = exercises.map((item) => {
          if (item.type === 'warmup') {
            return {
              type: 'warmup' as const,
              warmup: item,
            };
          } else {
            const currentIndex = exerciseSlotIndex;
            exerciseSlotIndex++;
            const swappedExerciseId = swaps[currentIndex];
            return {
              type: 'exercise' as const,
              exerciseId: swappedExerciseId || item.id,
              programExercise: item,
            };
          }
        });

        setSlots(workoutSlots);
      } catch (error) {
        console.error('Error loading exercise slots:', error);
        setSlots([]);
      }
    },
    []
  );

  const getWorkoutForDayIndex = useCallback(
    (
      programToUse: ReturnType<typeof getProgramById>,
      startISO: string | null,
      effectivePattern: ProgramDaySplitKey[] | null,
      dayIdx: number
    ): Workout | null => {
      return startISO !== null
        ? getWorkoutForDaySinceStart(
            programToUse,
            startISO,
            effectivePattern,
            dayIdx
          )
        : (programToUse.workouts.find((w) => w.dayIndex === dayIdx) ?? null);
    },
    []
  );

  const loadWorkoutForDay = useCallback(
    async (
      dayIdx: number,
      programData?: ReturnType<typeof getProgramById>,
      startISOOverride?: string | null,
      patternOverride?: ProgramDaySplitKey[] | null
    ) => {
      const programToUse = programData ?? programRef.current;
      if (!programToUse) return;

      if (dayIdx < 0) {
        setNotes('');
        setIsNotesExpanded(false);
        setCompletedSession(null);
        setCurrentWorkout(null);
        setSlots([]);
        setIsRestDay(false);
        return;
      }

      const [savedNotes, savedCompletedSession] = await Promise.all([
        getWorkoutNotes(dayIdx),
        getCompletedSession(dayIdx),
      ]);
      setNotes(savedNotes);
      setIsNotesExpanded(savedNotes.length > 0);
      setCompletedSession(savedCompletedSession);

      const startISO =
        startISOOverride !== undefined
          ? startISOOverride
          : startDateRef.current;
      const effectivePattern =
        patternOverride !== undefined
          ? patternOverride
          : workoutWeekPatternRef.current;

      const workout = getWorkoutForDayIndex(
        programToUse,
        startISO,
        effectivePattern,
        dayIdx
      );

      if (workout) {
        setCurrentWorkout(workout);
        setIsRestDay(false);
        if (workout.format !== 'v2') {
          await loadExerciseSlots(workout, dayIdx);
        } else {
          setSlots([]);
        }
      } else {
        setIsRestDay(true);
        setCurrentWorkout(null);
        setSlots([]);
      }
    },
    [loadExerciseSlots]
  );

  const loadWorkoutData = useCallback(async () => {
    try {
      setLoading(true);
      const [
        programId,
        savedStartDate,
        savedWeekPattern,
        savedWarmupEnabled,
        savedCooldownEnabled,
      ] = await Promise.all([
        getActiveProgramId(),
        getProgramStartDate(),
        getProgramWorkoutWeekdays(),
        getProgramWarmupModuleEnabled(),
        getProgramCooldownModuleEnabled(),
      ]);

      if (!programId || !savedStartDate) {
        setLoading(false);
        return;
      }

      const loadedProgram = getProgramById(programId);
      if (!loadedProgram) {
        console.error('Program not found:', programId);
        setLoading(false);
        return;
      }

      setProgram(loadedProgram);
      setStartDate(savedStartDate);
      setWorkoutWeekPattern(
        savedWeekPattern && savedWeekPattern.length > 0
          ? savedWeekPattern
          : null
      );
      setWarmupModuleEnabled(savedWarmupEnabled);
      setCooldownModuleEnabled(savedCooldownEnabled);

      const daysSinceStart = calculateDaysSinceStart(savedStartDate);
      setDayIndex(daysSinceStart);
      setSelectedDayIndex(daysSinceStart);

      await loadWorkoutForDay(
        daysSinceStart,
        loadedProgram,
        savedStartDate,
        savedWeekPattern && savedWeekPattern.length > 0
          ? savedWeekPattern
          : null
      );

      setLoading(false);
    } catch (error) {
      console.error('Error loading workout data:', error);
      setLoading(false);
    }
  }, [loadWorkoutForDay]);

  const toggleWarmupModule = useCallback(async () => {
    const next = !warmupModuleEnabledRef.current;
    setWarmupModuleEnabled(next);
    try {
      await setProgramWarmupModuleEnabled(next);
    } catch (error) {
      // revert on failure
      setWarmupModuleEnabled(!next);
    }
    if (selectedDayIndex !== null) {
      await loadWorkoutForDay(selectedDayIndex);
    }
  }, [loadWorkoutForDay, selectedDayIndex]);

  const toggleCooldownModule = useCallback(async () => {
    const next = !cooldownModuleEnabledRef.current;
    setCooldownModuleEnabled(next);
    try {
      await setProgramCooldownModuleEnabled(next);
    } catch (error) {
      // revert on failure
      setCooldownModuleEnabled(!next);
    }
    if (selectedDayIndex !== null) {
      await loadWorkoutForDay(selectedDayIndex);
    }
  }, [loadWorkoutForDay, selectedDayIndex]);

  useEffect(() => {
    loadWorkoutData();
  }, [loadWorkoutData]);

  const loadRestTimerState = useCallback(async () => {
    try {
      const timer = await getRestTimer();
      if (!timer) {
        setRestTimer(null);
        return;
      }

      const endTime = timer.startedAt + timer.restTimeSeconds * 1000;
      if (timer.status === 'running' && Date.now() >= endTime) {
        const completedTimer: RestTimerState = {
          ...timer,
          status: 'completed',
          completedAt: Date.now(),
        };
        setRestTimer(completedTimer);
        await saveRestTimer(completedTimer);
        return;
      }

      setRestTimer(timer);
    } catch (error) {
      console.error('Error loading rest timer:', error);
      setRestTimer(null);
    }
  }, []);

  useEffect(() => {
    loadRestTimerState();
  }, [loadRestTimerState]);

  const loadActiveSessionState = useCallback(async () => {
    try {
      const session = await getActiveSession();
      setActiveSession(session);
    } catch (error) {
      console.error('Error loading active session:', error);
      setActiveSession(null);
    }
  }, []);

  useEffect(() => {
    loadActiveSessionState();
  }, [loadActiveSessionState]);

  const handleStartSession = useCallback(async () => {
    if (selectedDayIndex === null) return;
    try {
      const session: ActiveSession = {
        dayIndex: selectedDayIndex,
        startedAt: Date.now(),
      };
      await saveActiveSession(session);
      setActiveSession(session);
    } catch (error) {
      console.error('Error starting session:', error);
    }
  }, [selectedDayIndex]);

  const handleFinishSession = useCallback(async () => {
    if (!activeSession) return;

    try {
      const completedAt = Date.now();
      const duration = completedAt - activeSession.startedAt;

      let totalVolume = 0;
      let setsCompleted = 0;

      const programToUse = programRef.current;
      const startISO = startDateRef.current;
      const effectivePattern = workoutWeekPatternRef.current;

      const workoutForSessionDay =
        programToUse != null
          ? getWorkoutForDayIndex(
              programToUse,
              startISO,
              effectivePattern,
              activeSession.dayIndex
            )
          : null;

      if (workoutForSessionDay?.format === 'v2') {
        const completion = await getConditioningLogsForDay(activeSession.dayIndex);
        setsCompleted = Object.values(completion).filter((b) => b.completed).length;
        totalVolume = 0;
      } else {
        const dayLogs = await getWorkoutLogsForDay(activeSession.dayIndex);
        for (const slotSets of Object.values(dayLogs)) {
          for (const set of Object.values(slotSets)) {
            if (set.state === 'completed' || set.state === 'failed') {
              setsCompleted++;
              if (set.weight !== null && set.weight > 0) {
                totalVolume += set.weight * set.reps;
              }
            }
          }
        }
      }

      const completed: CompletedSession = {
        dayIndex: activeSession.dayIndex,
        startedAt: activeSession.startedAt,
        completedAt,
        totalVolume,
        setsCompleted,
      };

      await saveCompletedSession(completed);
      await increment('program_workouts_completed');
      await clearActiveSession();
      setActiveSession(null);
      setCompletedSession(completed);
      setSessionSummary({ duration, totalVolume, setsCompleted });
    } catch (error) {
      console.error('Error finishing session:', error);
    }
  }, [activeSession]);

  const handleRedoWorkout = useCallback(async () => {
    if (selectedDayIndex === null) return;

    Alert.alert(
      'Redo this workout?',
      'This will clear your session record for this day. Your logged sets will remain.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Redo',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearCompletedSession(selectedDayIndex);
              setCompletedSession(null);
            } catch (error) {
              console.error('Error clearing completed session:', error);
            }
          },
        },
      ]
    );
  }, [selectedDayIndex]);

  const handleDaySelect = async (dayIdx: number) => {
    setSelectedDayIndex(dayIdx);
    await loadWorkoutForDay(dayIdx);
    scrollViewRef.current?.scrollTo({ y: 0, animated: false });
  };

  const handleSwapClick = (exerciseSlotIndex: number) => {
    setCurrentSwapSlot(exerciseSlotIndex);
    setSwapModalVisible(true);
  };

  const handleRestStart = useCallback(
    async (payload: {
      dayIndex: number;
      slotIndex: number;
      exerciseId: number | null;
      restTimeSeconds: number;
    }) => {
      if (!payload.restTimeSeconds) return;
      try {
        await increment('rest_timers_started');
        const startedAt = Date.now();
        const newTimer: RestTimerState = {
          dayIndex: payload.dayIndex,
          slotIndex: payload.slotIndex,
          exerciseId: payload.exerciseId,
          restTimeSeconds: payload.restTimeSeconds,
          originalRestTimeSeconds: payload.restTimeSeconds,
          startedAt,
          status: 'running',
        };
        setRestTimer(newTimer);
        await scheduleTimerNotification(payload.restTimeSeconds);
        await saveRestTimer(newTimer);
      } catch (error) {
        console.error('Error starting rest timer:', error);
      }
    },
    [scheduleTimerNotification]
  );

  const handleRestDismiss = useCallback(async () => {
    try {
      if (restTimer && restTimer.status === 'completed') {
        await increment('rest_timers_skipped');
      }
      await cancelTimerNotification();
      setRestTimer(null);
      await clearRestTimer();
    } catch (error) {
      console.error('Error clearing rest timer:', error);
    }
  }, [cancelTimerNotification, restTimer]);

  const handleRestComplete = useCallback(async () => {
    if (!restTimer || restTimer.status === 'completed') return;
    try {
      const completedTimer: RestTimerState = {
        ...restTimer,
        status: 'completed',
        completedAt: Date.now(),
      };
      setRestTimer(completedTimer);
      await saveRestTimer(completedTimer);
    } catch (error) {
      console.error('Error completing rest timer:', error);
    }
  }, [restTimer]);

  const handleRestRestart = useCallback(async () => {
    if (!restTimer) return;
    await handleRestStart({
      dayIndex: restTimer.dayIndex,
      slotIndex: restTimer.slotIndex,
      exerciseId: restTimer.exerciseId,
      restTimeSeconds: restTimer.originalRestTimeSeconds ?? restTimer.restTimeSeconds,
    });
  }, [restTimer, handleRestStart]);

  const handleRestAdjust = useCallback(
    async (deltaSeconds: number) => {
      if (!restTimer || restTimer.status !== 'running') return;

      try {
        const now = Date.now();
        const currentEndTime = restTimer.startedAt + restTimer.restTimeSeconds * 1000;
        const currentRemainingSeconds = Math.max(
          0,
          Math.ceil((currentEndTime - now) / 1000)
        );

        const nextRemainingSeconds = currentRemainingSeconds + deltaSeconds;

        if (nextRemainingSeconds <= 0) {
          await cancelTimerNotification();
          const completedTimer: RestTimerState = {
            ...restTimer,
            status: 'completed',
            completedAt: now,
          };
          setRestTimer(completedTimer);
          await saveRestTimer(completedTimer);
          return;
        }

        const desiredEndTime = now + nextRemainingSeconds * 1000;
        const nextRestTimeSeconds = Math.max(
          1,
          Math.ceil((desiredEndTime - restTimer.startedAt) / 1000)
        );

        const updatedTimer: RestTimerState = {
          ...restTimer,
          restTimeSeconds: nextRestTimeSeconds,
        };

        setRestTimer(updatedTimer);
        await scheduleTimerNotification(nextRemainingSeconds);
        await saveRestTimer(updatedTimer);
      } catch (error) {
        console.error('Error adjusting rest timer:', error);
      }
    },
    [restTimer, cancelTimerNotification, scheduleTimerNotification]
  );

  const getExerciseSlots = useCallback(() => {
    return slots.filter(
      (slot): slot is ExerciseSlot => slot.type === 'exercise'
    );
  }, [slots]);

  const handleNotesChange = useCallback(
    (text: string) => {
      setNotes(text);

      if (notesDebounceRef.current) {
        clearTimeout(notesDebounceRef.current);
      }

      notesDebounceRef.current = setTimeout(async () => {
        if (selectedDayIndex !== null) {
          try {
            await saveWorkoutNotes(selectedDayIndex, text);
          } catch (error) {
            console.error('Error saving notes:', error);
          }
        }
      }, 500);
    },
    [selectedDayIndex]
  );

  const handleApplyCopiedWorkoutNotes = useCallback(
    (text: string) => {
      setIsNotesExpanded(true);
      handleNotesChange(text);
    },
    [handleNotesChange]
  );

  const handleExportWorkoutText = useCallback(async () => {
    if (selectedDayIndex === null || !currentWorkout || slots.length === 0) {
      return;
    }

    try {
      const dayLogs = await getWorkoutLogsForDay(selectedDayIndex);
      const text = buildWorkoutExportText(
        currentWorkout.label,
        slots,
        dayLogs,
        weightUnit
      );

      if (!text) {
        Alert.alert(
          'Nothing to export',
          'Log at least one set to export your workout.'
        );
        return;
      }

      await Share.share({ message: text });
    } catch (error) {
      console.error('Error exporting workout text:', error);
      Alert.alert('Export failed', 'Could not export workout. Please try again.');
    }
  }, [selectedDayIndex, currentWorkout, slots, weightUnit]);

  useEffect(() => {
    return () => {
      if (notesDebounceRef.current) {
        clearTimeout(notesDebounceRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const showSub = Keyboard.addListener(showEvent, (e) =>
      setKeyboardHeight(e.endCoordinates.height)
    );
    const hideSub = Keyboard.addListener(hideEvent, () => setKeyboardHeight(0));
    return () => {
      showSub.remove();
      hideSub.remove();
      if (notesBlurTimer.current) clearTimeout(notesBlurTimer.current);
    };
  }, []);

  const handleNotesFocus = useCallback(() => {
    if (notesBlurTimer.current) clearTimeout(notesBlurTimer.current);
    setNotesActive(true);
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  const handleNotesBlur = useCallback(() => {
    notesBlurTimer.current = setTimeout(() => setNotesActive(false), 200);
  }, []);

  const handleNotesDone = useCallback(() => {
    setNotesActive(false);
    Keyboard.dismiss();
  }, []);

  const toggleNotesExpanded = useCallback(() => {
    setIsNotesExpanded((prev) => {
      const next = !prev;
      if (!next) {
        notesInputRef.current?.blur();
        Keyboard.dismiss();
      }
      return next;
    });
  }, []);

  const workoutDayIndices = useMemo(() => {
    if (!program || !startDate) {
      return [];
    }
    return listTrainingDayDeltasForProgram(
      program,
      startDate,
      workoutWeekPattern
    );
  }, [program, startDate, workoutWeekPattern]);

  const closeSwapModal = useCallback(() => {
    setSwapModalVisible(false);
    setCurrentSwapSlot(null);
  }, []);

  const openCopyWorkoutNotesModal = useCallback(() => {
    setCopyWorkoutNotesModalVisible(true);
  }, []);

  const closeCopyWorkoutNotesModal = useCallback(() => {
    setCopyWorkoutNotesModalVisible(false);
  }, []);

  const onSwapClearData = useCallback(async () => {
    if (selectedDayIndex !== null) {
      await loadWorkoutForDay(selectedDayIndex);
      setSwapRefreshCounter((prev) => prev + 1);
    }
  }, [selectedDayIndex, loadWorkoutForDay]);

  return {
    slots,
    currentWorkout,
    dayIndex,
    selectedDayIndex,
    startDate,
    program,
    isRestDay,
    loading,
    swapModalVisible,
    copyWorkoutNotesModalVisible,
    openCopyWorkoutNotesModal,
    closeCopyWorkoutNotesModal,
    currentSwapSlot,
    swapRefreshCounter,
    notes,
    isNotesExpanded,
    restTimer,
    intensityModalVisible,
    setIntensityModalVisible,
    activeSession,
    completedSession,
    sessionSummary,
    setSessionSummary,
    keyboardHeight,
    notesActive,
    scrollViewRef,
    notesInputRef,
    workoutDayIndices,
    workoutWeekPattern,
    warmupModuleEnabled,
    cooldownModuleEnabled,
    toggleWarmupModule,
    toggleCooldownModule,
    loadWorkoutForDay,
    loadWorkoutData,
    handleStartSession,
    handleFinishSession,
    handleRedoWorkout,
    handleDaySelect,
    handleSwapClick,
    handleRestStart,
    handleRestDismiss,
    handleRestComplete,
    handleRestRestart,
    handleRestAdjust,
    getExerciseSlots,
    handleNotesChange,
    handleApplyCopiedWorkoutNotes,
    handleExportWorkoutText,
    handleNotesFocus,
    handleNotesBlur,
    handleNotesDone,
    toggleNotesExpanded,
    closeSwapModal,
    onSwapClearData,
  };
}
