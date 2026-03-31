import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  InputAccessoryView,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { DaySelector } from '../components/DaySelector';
import { ExerciseCard } from '../components/ExerciseCard';
import { SessionSummaryModal } from '../components/SessionSummaryModal';
import { SessionTimer } from '../components/SessionTimer';
import { SwapModal } from '../components/SwapModal';
import { BorderRadius, Colors, FontSize, Spacing } from '../constants/theme';
import { useTimerNotification } from '../hooks/useTimerNotification';
import type {
  Exercise as ProgramExercise,
  Warmup,
  Workout,
} from '../types/program';
import type {
  ActiveSession,
  CompletedSession,
  RestTimerState,
} from '../types/storage';
import { getProgramById } from '../utils/program';
import type { ProgramDaySplitKey } from '../utils/programStartWeekday';
import {
  getWorkoutForDaySinceStart,
  listTrainingDayDeltasForProgram,
} from '../utils/programWeekPattern';
import {
  clearActiveSession,
  clearCompletedSession,
  clearFutureWorkoutData,
  clearRestTimer,
  getActiveSession,
  getActiveProgramId,
  getCompletedSession,
  getExerciseSwapsForDay,
  getProgramStartDate,
  getProgramWorkoutWeekdays,
  getRestTimer,
  getWorkoutLogsForDay,
  getWorkoutNotes,
  saveActiveSession,
  saveCompletedSession,
  saveRestTimer,
  saveWorkoutNotes,
  setProgramStartDate,
} from '../utils/storage';
import { ProgramStartingInXScreen } from './ProgramStartingInXScreen';
import { RestDayScreen } from './RestDayScreen';

const INTENSITY_LEVELS: {
  range: [number, number];
  label: string;
  feel: string;
}[] = [
  {
    range: [1, 2],
    label: 'Very Light',
    feel: 'Minimal effort. Recovery-level work. You should feel refreshed, not fatigued.',
  },
  {
    range: [3, 4],
    label: 'Light',
    feel: 'Easy effort. Good for technique practice and building volume without heavy strain.',
  },
  {
    range: [5, 6],
    label: 'Moderate',
    feel: 'Noticeable effort. Challenging but sustainable. You could hold a short conversation.',
  },
  {
    range: [7, 8],
    label: 'Hard',
    feel: 'Demanding effort. Requires real focus and grit. Expect to feel spent by the end.',
  },
  {
    range: [9, 10],
    label: 'Very Hard',
    feel: 'Near-maximal effort. Highly taxing on the body and nervous system. Full recovery is essential.',
  },
];

const getIntensityLevel = (intensity: number) => {
  return (
    INTENSITY_LEVELS.find(
      (l) => intensity >= l.range[0] && intensity <= l.range[1]
    ) ?? INTENSITY_LEVELS[2]
  );
};

const formatSessionDuration = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
};

type ExerciseSlot = {
  type: 'exercise';
  exerciseId: number | null;
  programExercise: ProgramExercise | null;
};

type WarmupSlot = {
  type: 'warmup';
  warmup: Warmup;
};

type WorkoutSlot = ExerciseSlot | WarmupSlot;

type WorkoutScreenProps = {
  onProgramReset?: () => void;
};

export const WorkoutScreen: React.FC<WorkoutScreenProps> = ({
  onProgramReset,
}) => {
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
  const notesDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const notesInputRef = useRef<TextInput>(null);
  const notesInputAccessoryViewID = 'notesInputAccessory';

  const programRef = useRef<ReturnType<typeof getProgramById> | null>(null);
  const startDateRef = useRef<string | null>(null);
  const workoutWeekPatternRef = useRef<ProgramDaySplitKey[] | null>(null);

  useEffect(() => {
    programRef.current = program;
    startDateRef.current = startDate;
    workoutWeekPatternRef.current = workoutWeekPattern;
  }, [program, startDate, workoutWeekPattern]);

  const calculateDaysSinceStart = (startDate: string): number => {
    const start = new Date(startDate);
    const today = new Date();

    // Reset time to midnight for accurate day calculation
    start.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffTime = today.getTime() - start.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const loadExerciseSlots = useCallback(
    async (workout: Workout, dayIdx: number) => {
      try {
        const swaps = await getExerciseSwapsForDay(dayIdx);

        // Track exercise slot index separately (warmups don't count for swap indices)
        let exerciseSlotIndex = 0;

        const workoutSlots: WorkoutSlot[] = workout.exercises.map((item) => {
          if (item.type === 'warmup') {
            return {
              type: 'warmup' as const,
              warmup: item,
            };
          } else {
            // It's an exercise
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

      // Load notes and completed session for this day
      const [savedNotes, savedCompletedSession] = await Promise.all([
        getWorkoutNotes(dayIdx),
        getCompletedSession(dayIdx),
      ]);
      setNotes(savedNotes);
      setIsNotesExpanded(savedNotes.length > 0);
      setCompletedSession(savedCompletedSession);

      const startISO =
        startISOOverride !== undefined ? startISOOverride : startDateRef.current;
      const effectivePattern =
        patternOverride !== undefined
          ? patternOverride
          : workoutWeekPatternRef.current;

      const workout =
        startISO !== null
          ? getWorkoutForDaySinceStart(
              programToUse,
              startISO,
              effectivePattern,
              dayIdx
            )
          : (programToUse.workouts.find((w) => w.dayIndex === dayIdx) ?? null);

      if (workout) {
        setCurrentWorkout(workout);
        setIsRestDay(false);
        await loadExerciseSlots(workout, dayIdx);
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
      const programId = await getActiveProgramId();
      const savedStartDate = await getProgramStartDate();
      const savedWeekPattern = await getProgramWorkoutWeekdays();

      if (!programId || !savedStartDate) {
        // No program selected, should show ProgramLauncher
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

      const daysSinceStart = calculateDaysSinceStart(savedStartDate);
      setDayIndex(daysSinceStart);
      setSelectedDayIndex(daysSinceStart);

      // Load workout for today - pass programData directly to avoid dependency on program state
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

      const dayLogs = await getWorkoutLogsForDay(activeSession.dayIndex);
      let totalVolume = 0;
      let setsCompleted = 0;

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

      const completed: CompletedSession = {
        dayIndex: activeSession.dayIndex,
        startedAt: activeSession.startedAt,
        completedAt,
        totalVolume,
        setsCompleted,
      };

      await saveCompletedSession(completed);
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
    // Always allow viewing any day
    setSelectedDayIndex(dayIdx);
    await loadWorkoutForDay(dayIdx);
    // Reset scroll position to top when switching days
    scrollViewRef.current?.scrollTo({ y: 0, animated: false });
  };

  const handleSetAsCurrentDay = async () => {
    if (
      selectedDayIndex === null ||
      dayIndex === null ||
      dayIndex < 0 ||
      selectedDayIndex === dayIndex
    ) {
      return;
    }

    // Show confirmation dialog
    Alert.alert(
      'Set as Current Session?',
      'Setting this workout as the current session will adjust the program start date so this session becomes day 0, and clear any completed days ahead of this date. Are you sure?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: async () => {
            try {
              // Calculate the date that corresponds to the selected day index
              if (startDate) {
                const currentStart = new Date(startDate);
                currentStart.setHours(0, 0, 0, 0);

                // Calculate the date of the selected day index
                const selectedDayDate = new Date();
                selectedDayDate.setDate(
                  selectedDayDate.getDate() - selectedDayIndex
                );
                selectedDayDate.setHours(0, 0, 0, 0);

                // Clear all future workout data (from selected day onwards)
                await clearFutureWorkoutData(selectedDayIndex);

                // Set the start date to the selected day's date so it becomes index 0
                await setProgramStartDate(selectedDayDate.toISOString());
                setStartDate(selectedDayDate.toISOString());

                // Reload workout data
                await loadWorkoutData();
              }
            } catch (error) {
              console.error('Error setting current session:', error);
              Alert.alert(
                'Error',
                'Failed to set current session. Please try again.'
              );
            }
          },
        },
      ]
    );
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
        const startedAt = Date.now();
        const newTimer: RestTimerState = {
          dayIndex: payload.dayIndex,
          slotIndex: payload.slotIndex,
          exerciseId: payload.exerciseId,
          restTimeSeconds: payload.restTimeSeconds,
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
      await cancelTimerNotification();
      setRestTimer(null);
      await clearRestTimer();
    } catch (error) {
      console.error('Error clearing rest timer:', error);
    }
  }, [cancelTimerNotification]);

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
      restTimeSeconds: restTimer.restTimeSeconds,
    });
  }, [restTimer, handleRestStart]);

  // Get only exercise slots for swap modal calculations
  const getExerciseSlots = useCallback(() => {
    return slots.filter(
      (slot): slot is ExerciseSlot => slot.type === 'exercise'
    );
  }, [slots]);

  // Handle notes change with debounced save
  const handleNotesChange = useCallback(
    (text: string) => {
      setNotes(text);

      // Clear existing debounce timer
      if (notesDebounceRef.current) {
        clearTimeout(notesDebounceRef.current);
      }

      // Debounce save to avoid too many writes
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

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (notesDebounceRef.current) {
        clearTimeout(notesDebounceRef.current);
      }
    };
  }, []);

  // Handle notes input focus - scroll to bottom to keep notes visible
  const handleNotesFocus = useCallback(() => {
    // Small delay to let keyboard animation start
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  // Handle done button press - dismiss keyboard
  const handleNotesDone = useCallback(() => {
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

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Render content below the DaySelector based on state
  const renderContent = () => {
    if (selectedDayIndex !== null && selectedDayIndex < 0) {
      return <ProgramStartingInXScreen daysUntilStart={-selectedDayIndex} />;
    }

    if (isRestDay) {
      return <RestDayScreen onProgramReset={onProgramReset} />;
    }

    if (!currentWorkout || slots.length === 0) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>No workout found</Text>
        </View>
      );
    }

    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="always"
        >
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <View style={styles.headerTextContainer}>
                <Text style={styles.title}>{currentWorkout.label}</Text>
                {currentWorkout.description && (
                  <Text style={styles.description}>
                    {currentWorkout.description}
                  </Text>
                )}
              </View>
            </View>
          </View>

          {completedSession && !activeSession && (
            <View style={styles.completedSessionBanner}>
              <Text style={styles.completedSessionTitle}>
                Session Completed
              </Text>
              <View style={styles.completedSessionStats}>
                <View style={styles.completedSessionStat}>
                  <Text style={styles.completedSessionStatValue}>
                    {formatSessionDuration(
                      completedSession.completedAt - completedSession.startedAt
                    )}
                  </Text>
                  <Text style={styles.completedSessionStatLabel}>Duration</Text>
                </View>
                <View style={styles.completedSessionStat}>
                  <Text style={styles.completedSessionStatValue}>
                    {completedSession.totalVolume.toLocaleString()}kg
                  </Text>
                  <Text style={styles.completedSessionStatLabel}>Volume</Text>
                </View>
                <View style={styles.completedSessionStat}>
                  <Text style={styles.completedSessionStatValue}>
                    {completedSession.setsCompleted}
                  </Text>
                  <Text style={styles.completedSessionStatLabel}>Sets</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.redoButton}
                onPress={handleRedoWorkout}
                activeOpacity={0.7}
              >
                <Text style={styles.redoButtonText}>Redo Workout</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.intensityCard}>
            <View style={styles.intensityCardHeader}>
              <Text style={styles.intensityLabel}>Intensity</Text>
              <Text style={styles.intensityValue}>
                {currentWorkout.intensity}/10
              </Text>
            </View>
            <View style={styles.intensityBarTrack}>
              <View
                style={[
                  styles.intensityBarFill,
                  { width: `${currentWorkout.intensity * 10}%` },
                ]}
              />
            </View>
            <Text style={styles.intensityFeel}>
              {getIntensityLevel(currentWorkout.intensity).label}.{' '}
              {getIntensityLevel(currentWorkout.intensity).feel}
            </Text>
            <TouchableOpacity
              style={styles.intensityCta}
              onPress={() => setIntensityModalVisible(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.intensityCtaText}>
                View all intensity levels
              </Text>
            </TouchableOpacity>
          </View>

          {(() => {
            let exerciseSlotIndex = 0;
            return slots.map((slot, index) => {
              if (slot.type === 'warmup') {
                return (
                  <View key={`warmup-${index}`} style={styles.warmupCard}>
                    <Text style={styles.warmupTitle}>Warm-Up</Text>
                    {slot.warmup.additionalDescription && (
                      <Text style={styles.warmupDescription}>
                        {slot.warmup.additionalDescription}
                      </Text>
                    )}
                    <View style={styles.warmupList}>
                      {slot.warmup.description.map((item, itemIndex) => (
                        <View key={itemIndex} style={styles.warmupItem}>
                          <Text style={styles.warmupBullet}>•</Text>
                          <Text style={styles.warmupText}>{item}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                );
              } else {
                const currentExerciseIndex = exerciseSlotIndex;
                exerciseSlotIndex++;
                const restTimerForSlot =
                  restTimer &&
                  restTimer.dayIndex === selectedDayIndex &&
                  restTimer.slotIndex === currentExerciseIndex
                    ? restTimer
                    : null;
                return (
                  <ExerciseCard
                    key={`${selectedDayIndex}-${index}-${slot.exerciseId}-${swapRefreshCounter}`}
                    exerciseId={slot.exerciseId}
                    programExercise={slot.programExercise}
                    slotNumber={currentExerciseIndex + 1}
                    dayIndex={selectedDayIndex}
                    slotIndex={currentExerciseIndex}
                    onSwap={() => handleSwapClick(currentExerciseIndex)}
                    restTimer={restTimerForSlot}
                    onRestStart={handleRestStart}
                    onRestDismiss={handleRestDismiss}
                    onRestComplete={handleRestComplete}
                    onRestRestart={handleRestRestart}
                  />
                );
              }
            });
          })()}

          {/* Notes Section */}
          <View style={styles.notesContainer}>
            <TouchableOpacity
              style={styles.notesHeader}
              onPress={toggleNotesExpanded}
              activeOpacity={0.7}
            >
              <Text style={styles.notesTitle}>Notes</Text>
              <View style={styles.notesHeaderRight}>
                {notes.length > 0 && !isNotesExpanded && (
                  <View style={styles.notesBadge}>
                    <Text style={styles.notesBadgeText}>Has notes</Text>
                  </View>
                )}
                <Text style={styles.notesExpandIcon}>
                  {isNotesExpanded ? '▼' : '▶'}
                </Text>
              </View>
            </TouchableOpacity>
            {isNotesExpanded && (
              <TextInput
                ref={notesInputRef}
                style={styles.notesInput}
                value={notes}
                onChangeText={handleNotesChange}
                onFocus={handleNotesFocus}
                placeholder="Add notes for this workout..."
                placeholderTextColor={Colors.textPlaceholder}
                multiline
                textAlignVertical="top"
                inputAccessoryViewID={
                  Platform.OS === 'ios' ? notesInputAccessoryViewID : undefined
                }
                blurOnSubmit={Platform.OS === 'android'}
                returnKeyType={Platform.OS === 'android' ? 'done' : 'default'}
                onSubmitEditing={() => {
                  notesInputRef.current?.blur();
                  Keyboard.dismiss();
                  setIsNotesExpanded(false);
                }}
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {startDate && dayIndex !== null && (
        <DaySelector
          startDate={startDate}
          workoutDayIndices={workoutDayIndices}
          currentDayIndex={selectedDayIndex ?? dayIndex}
          onDaySelect={handleDaySelect}
          onSetAsToday={
            dayIndex !== null && dayIndex >= 0
              ? handleSetAsCurrentDay
              : undefined
          }
        />
      )}

      {!isRestDay && !loading && activeSession && (
        <SessionTimer
          startedAt={activeSession.startedAt}
          onFinish={handleFinishSession}
        />
      )}

      {!isRestDay &&
        !loading &&
        !activeSession &&
        !completedSession &&
        currentWorkout && (
          <TouchableOpacity
            style={styles.startSessionButton}
            onPress={handleStartSession}
            activeOpacity={0.7}
          >
            <Text style={styles.startSessionButtonText}>Start Session</Text>
          </TouchableOpacity>
        )}

      {renderContent()}

      <SwapModal
        visible={swapModalVisible}
        currentExerciseId={
          currentSwapSlot !== null
            ? getExerciseSlots()[currentSwapSlot]?.exerciseId || null
            : null
        }
        originalExerciseId={
          currentSwapSlot !== null
            ? getExerciseSlots()[currentSwapSlot]?.programExercise?.id || null
            : null
        }
        dayIndex={selectedDayIndex}
        slotIndex={currentSwapSlot !== null ? currentSwapSlot : 0}
        onClose={() => {
          setSwapModalVisible(false);
          setCurrentSwapSlot(null);
        }}
        onClearData={async () => {
          // Reload workout data to refresh the exercise card
          if (selectedDayIndex !== null) {
            await loadWorkoutForDay(selectedDayIndex);
            // Increment refresh counter to force all ExerciseCard components to remount and refresh swap count
            setSwapRefreshCounter((prev) => prev + 1);
          }
        }}
      />

      <Modal
        visible={intensityModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIntensityModalVisible(false)}
      >
        <View style={styles.intensityModalOverlay}>
          <View style={styles.intensityModalContent}>
            <Text style={styles.intensityModalTitle}>Intensity Levels</Text>
            <Text style={styles.intensityModalSubtitle}>
              How each level should feel during your session
            </Text>
            {INTENSITY_LEVELS.map((level) => {
              const isActive =
                currentWorkout &&
                currentWorkout.intensity >= level.range[0] &&
                currentWorkout.intensity <= level.range[1];
              return (
                <View
                  key={level.label}
                  style={[
                    styles.intensityModalRow,
                    isActive && styles.intensityModalRowActive,
                  ]}
                >
                  <View style={styles.intensityModalRowHeader}>
                    <Text style={styles.intensityModalRange}>
                      {level.range[0]}–{level.range[1]}
                    </Text>
                    <Text
                      style={[
                        styles.intensityModalLabel,
                        isActive && styles.intensityModalLabelActive,
                      ]}
                    >
                      {level.label}
                    </Text>
                  </View>
                  <Text style={styles.intensityModalFeel}>{level.feel}</Text>
                </View>
              );
            })}
            <TouchableOpacity
              style={styles.intensityModalClose}
              onPress={() => setIntensityModalVisible(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.intensityModalCloseText}>Got it</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <SessionSummaryModal
        visible={sessionSummary !== null}
        duration={sessionSummary?.duration ?? 0}
        totalVolume={sessionSummary?.totalVolume ?? 0}
        setsCompleted={sessionSummary?.setsCompleted ?? 0}
        onDismiss={() => setSessionSummary(null)}
      />

      {/* Keyboard accessory view for notes input (iOS only) */}
      {Platform.OS === 'ios' && (
        <InputAccessoryView nativeID={notesInputAccessoryViewID}>
          <View style={styles.keyboardAccessory}>
            <View style={styles.keyboardAccessorySpacer} />
            <TouchableOpacity
              style={styles.keyboardDoneButton}
              onPress={handleNotesDone}
            >
              <Text style={styles.keyboardDoneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </InputAccessoryView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundScreen,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing.xxl,
  },
  header: {
    marginBottom: Spacing.section,
    paddingTop: Spacing.xxl,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerTextContainer: {
    flex: 1,
  },
  headerActions: {
    alignItems: 'flex-end',
    gap: Spacing.sm,
  },
  headerBottomActions: {
    marginTop: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: Spacing.sm,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: FontSize.displayXXl,
    fontWeight: '800',
    marginBottom: Spacing.md,
    letterSpacing: -0.5,
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: FontSize.xxl,
    fontWeight: '500',
  },
  description: {
    color: Colors.textSecondary,
    fontSize: FontSize.lg,
    fontWeight: '500',
    marginBottom: Spacing.xl,
    lineHeight: 20,
  },
  intensityCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.xxl,
    padding: Spacing.xxl,
    marginBottom: Spacing.xxl,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
  },
  intensityCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  intensityLabel: {
    color: Colors.accent,
    fontSize: FontSize.xxl,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  intensityValue: {
    color: Colors.textPrimary,
    fontSize: FontSize.displayMd,
    fontWeight: '800',
  },
  intensityBarTrack: {
    height: 6,
    borderRadius: BorderRadius.xs,
    backgroundColor: Colors.backgroundSubtle,
    marginBottom: Spacing.xl,
    overflow: 'hidden',
  },
  intensityBarFill: {
    height: '100%',
    borderRadius: BorderRadius.xs,
    backgroundColor: Colors.accent,
  },
  intensityFeel: {
    color: Colors.textSecondary,
    fontSize: FontSize.lg,
    lineHeight: 20,
    marginBottom: Spacing.xl,
  },
  intensityCta: {
    alignSelf: 'flex-start',
  },
  intensityCtaText: {
    color: Colors.accent,
    fontSize: FontSize.lg,
    fontWeight: '600',
  },
  intensityModalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    padding: Spacing.xxl,
  },
  intensityModalContent: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.xxl,
    padding: Spacing.xxl,
  },
  intensityModalTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.displayLg,
    fontWeight: '800',
    marginBottom: Spacing.xs,
  },
  intensityModalSubtitle: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    marginBottom: Spacing.xxl,
  },
  intensityModalRow: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
  },
  intensityModalRowActive: {
    backgroundColor: Colors.backgroundElevated,
    borderWidth: 1,
    borderColor: Colors.accent,
  },
  intensityModalRowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.xs,
  },
  intensityModalRange: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
    fontWeight: '700',
    minWidth: 30,
  },
  intensityModalLabel: {
    color: Colors.textPrimary,
    fontSize: FontSize.xxl,
    fontWeight: '700',
  },
  intensityModalLabelActive: {
    color: Colors.accent,
  },
  intensityModalFeel: {
    color: Colors.textSecondary,
    fontSize: FontSize.base,
    lineHeight: 18,
    paddingLeft: 38,
  },
  intensityModalClose: {
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.xl,
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  intensityModalCloseText: {
    color: Colors.textOnAccent,
    fontSize: FontSize.xxl,
    fontWeight: '700',
  },
  setCurrentDayButton: {
    marginTop: Spacing.xxl,
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
  },
  setCurrentDayButtonInHeaderActions: {
    // This button now lives in the header action row (below title),
    // so don't keep the old top spacing used for the top-right layout.
    marginTop: 0,
  },
  setCurrentDayButtonText: {
    color: Colors.textOnAccent,
    fontSize: FontSize.lg,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: Colors.textPrimary,
    fontSize: FontSize.xxl,
  },
  warmupCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.xxl,
    padding: Spacing.xxl,
    marginBottom: Spacing.xxl,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
  },
  warmupTitle: {
    color: Colors.accent,
    fontSize: FontSize.xxl,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.md,
  },
  warmupDescription: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    fontStyle: 'italic',
    marginBottom: Spacing.xl,
    lineHeight: 20,
  },
  warmupList: {
    gap: Spacing.md,
  },
  warmupItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  warmupBullet: {
    color: Colors.accent,
    fontSize: FontSize.lg,
    fontWeight: '600',
    marginTop: 1,
  },
  warmupText: {
    color: Colors.textSecondaryAlt,
    fontSize: FontSize.lg,
    lineHeight: 20,
    flex: 1,
  },
  notesContainer: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.xxl,
    marginTop: Spacing.md,
    marginBottom: Spacing.section,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    overflow: 'hidden',
  },
  notesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.xxl,
  },
  notesTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.xxl,
    fontWeight: '700',
  },
  notesHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  notesBadge: {
    backgroundColor: Colors.backgroundSubtle,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  notesBadgeText: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
    fontWeight: '500',
  },
  notesExpandIcon: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
  },
  notesInput: {
    color: Colors.textPrimary,
    fontSize: FontSize.lg,
    lineHeight: 22,
    padding: Spacing.xxl,
    paddingTop: 0,
    minHeight: 100,
  },
  keyboardAccessory: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: Colors.backgroundTertiary,
    borderTopWidth: 0.5,
    borderTopColor: Colors.backgroundDivider,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  keyboardAccessorySpacer: {
    flex: 1,
  },
  keyboardDoneButton: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
  },
  keyboardDoneButtonText: {
    color: Colors.link,
    fontSize: FontSize.xxxl,
    fontWeight: '600',
  },
  startSessionButton: {
    borderWidth: 1,
    borderColor: Colors.accent,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.xl,
    marginHorizontal: Spacing.xxl,
    marginTop: Spacing.xl,
    alignItems: 'center',
  },
  startSessionButtonText: {
    color: Colors.accent,
    fontSize: FontSize.lg,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  completedSessionBanner: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.xxl,
    padding: Spacing.xxl,
    marginBottom: Spacing.xxl,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
  },
  completedSessionTitle: {
    color: Colors.accent,
    fontSize: FontSize.xxl,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.xl,
  },
  completedSessionStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  completedSessionStat: {
    alignItems: 'center',
    flex: 1,
  },
  completedSessionStatValue: {
    color: Colors.textPrimary,
    fontSize: FontSize.displaySm,
    fontWeight: '800',
    marginBottom: Spacing.xxs,
  },
  completedSessionStatLabel: {
    color: Colors.textMuted,
    fontSize: FontSize.sm,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  redoButton: {
    alignSelf: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xxl,
  },
  redoButtonText: {
    color: Colors.textMuted,
    fontSize: FontSize.base,
    fontWeight: '600',
  },
});
