import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  InputAccessoryView,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  BorderRadius,
  Colors,
  FontSize,
  Spacing,
} from '../constants/theme';
import { DaySelector } from '../components/DaySelector';
import { ExerciseCard } from '../components/ExerciseCard';
import { SwapModal } from '../components/SwapModal';
import type {
  Exercise as ProgramExercise,
  Warmup,
  Workout,
} from '../types/program';
import type { RestTimerState } from '../types/storage';
import { getProgramById } from '../utils/program';
import {
  clearFutureWorkoutData,
  clearRestTimer,
  getActiveProgramId,
  getExerciseSwapsForDay,
  getProgramStartDate,
  getRestTimer,
  getWorkoutNotes,
  saveRestTimer,
  saveWorkoutNotes,
  setProgramStartDate,
} from '../utils/storage';
import { RestDayScreen } from './RestDayScreen';

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
  const [nextWorkout, setNextWorkout] = useState<Workout | null>(null);
  const [dayIndex, setDayIndex] = useState<number | null>(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);
  const [startDate, setStartDate] = useState<string | null>(null);
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
  const notesDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const notesInputRef = useRef<TextInput>(null);
  const notesInputAccessoryViewID = 'notesInputAccessory';

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
    async (dayIdx: number, programData?: ReturnType<typeof getProgramById>) => {
      const programToUse = programData || program;
      if (!programToUse) return;

      // Load notes for this day
      const savedNotes = await getWorkoutNotes(dayIdx);
      setNotes(savedNotes);
      setIsNotesExpanded(savedNotes.length > 0);

      // Find workout for the selected day
      const workout = programToUse.workouts.find((w) => w.dayIndex === dayIdx);

      if (workout) {
        setCurrentWorkout(workout);
        setIsRestDay(false);
        await loadExerciseSlots(workout, dayIdx);
      } else {
        setIsRestDay(true);
        // Find next workout
        const next = programToUse.workouts.find((w) => w.dayIndex > dayIdx);
        setNextWorkout(next || null);
        setCurrentWorkout(null);
        setSlots([]);
      }
    },
    [program, loadExerciseSlots]
  );

  const loadWorkoutData = useCallback(async () => {
    try {
      setLoading(true);
      const programId = await getActiveProgramId();
      const savedStartDate = await getProgramStartDate();

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

      const daysSinceStart = calculateDaysSinceStart(savedStartDate);
      setDayIndex(daysSinceStart);
      setSelectedDayIndex(daysSinceStart);

      // Load workout for today - pass programData directly to avoid dependency on program state
      await loadWorkoutForDay(daysSinceStart, loadedProgram);

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
        const newTimer: RestTimerState = {
          dayIndex: payload.dayIndex,
          slotIndex: payload.slotIndex,
          exerciseId: payload.exerciseId,
          restTimeSeconds: payload.restTimeSeconds,
          startedAt: Date.now(),
          status: 'running',
        };
        setRestTimer(newTimer);
        await saveRestTimer(newTimer);
      } catch (error) {
        console.error('Error starting rest timer:', error);
      }
    },
    [restTimer]
  );

  const handleRestDismiss = useCallback(async () => {
    try {
      setRestTimer(null);
      await clearRestTimer();
    } catch (error) {
      console.error('Error clearing rest timer:', error);
    }
  }, [restTimer]);

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

  const handleSkipToNextWorkout = async () => {
    if (!nextWorkout) return;

    const programId = await getActiveProgramId();
    if (!programId) return;

    const program = getProgramById(programId);
    if (!program) return;

    // Update start date to skip to next workout
    const currentStartDate = await getProgramStartDate();
    if (!currentStartDate) return;

    const startDate = new Date(currentStartDate);
    const daysToSkip = nextWorkout.dayIndex - (dayIndex || 0);
    startDate.setDate(startDate.getDate() - daysToSkip);

    await setProgramStartDate(startDate.toISOString());
    await loadWorkoutData();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const workoutDayIndices = program?.workouts.map((w) => w.dayIndex) || [];

  // Render content below the DaySelector based on state
  const renderContent = () => {
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
          keyboardShouldPersistTaps="handled"
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
                <View style={styles.intensityContainer}>
                  <Text style={styles.intensityLabel}>Intensity:</Text>
                  <View style={styles.intensityBar}>
                    {Array.from({ length: 10 }).map((_, i) => (
                      <View
                        key={i}
                        style={[
                          styles.intensityDot,
                          i < currentWorkout.intensity &&
                          styles.intensityDotFilled,
                        ]}
                      />
                    ))}
                  </View>
                  <Text style={styles.intensityValue}>
                    {currentWorkout.intensity}/10
                  </Text>
                </View>
              </View>
            </View>
            {dayIndex !== null &&
              selectedDayIndex !== null &&
              selectedDayIndex !== dayIndex && (
                <TouchableOpacity
                  style={styles.setCurrentDayButton}
                  onPress={handleSetAsCurrentDay}
                >
                  <Text style={styles.setCurrentDayButtonText}>
                    Set as Today&apos;s Session
                  </Text>
                </TouchableOpacity>
              )}
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
                  />
                );
              }
            });
          })()}

          {/* Notes Section */}
          <View style={styles.notesContainer}>
            <TouchableOpacity
              style={styles.notesHeader}
              onPress={() => setIsNotesExpanded(!isNotesExpanded)}
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
        />
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
  intensityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  intensityLabel: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  intensityBar: {
    flexDirection: 'row',
    gap: Spacing.xs,
    alignItems: 'center',
  },
  intensityDot: {
    width: 8,
    height: 8,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.backgroundSubtle,
  },
  intensityDotFilled: {
    backgroundColor: Colors.accent,
  },
  intensityValue: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  setCurrentDayButton: {
    marginTop: Spacing.xxl,
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
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
});
