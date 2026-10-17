import {
  ActionChip,
  Badge,
  Collapsible,
  ProgressBar,
  Tag,
} from '@/src/components/ds';
import { color, space } from '@/src/constants/tokens';
import { useMotion } from '@/src/hooks/useMotion';
import { useWeightUnit } from '@/src/hooks/useWeightUnit';
import { ProgramCompletedScreen } from '@/src/screens/ProgramCompletedScreen';
import { ProgramStartingInXScreen } from '@/src/screens/ProgramStartingInXScreen';
import { RestDayScreen } from '@/src/screens/RestDayScreen';
import {
  formatSessionDuration,
  getIntensityLevel,
  type WorkoutSlot,
} from '@/src/screens/workoutScreenConstants';
import { workoutScreenStyles as styles } from '@/src/screens/workoutScreenStyles';
import type { Program, Workout } from '@/src/types/program';
import type {
  ActiveSession,
  CompletedSession,
  ProgramSessionStatus,
} from '@/src/types/storage';
import { formatVolumeFromKg } from '@/src/utils/weightUnits';
import React, {
  useCallback,
  useEffect,
  useState,
  type ComponentRef,
} from 'react';
import {
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import type { RestTimerStartPayload } from './ExerciseCard';
import { ExerciseCard } from './ExerciseCard';
import { ConditioningWorkoutBody } from './conditioning/ConditioningWorkoutBody';
import { YoutubeEmbed } from './exercise/YoutubeEmbed';
import { ProgramSessionStatusControls } from './ProgramSessionStatusControls';

type WorkoutScreenBodyProps = {
  selectedDayIndex: number | null;
  isRestDay: boolean;
  programId?: string | null;
  startDate?: string | null;
  workoutWeekPattern?: Program['daysSplit'] | null;
  onProgramReset?: () => void;
  showProgramCompleted: boolean;
  onViewAllPrograms: () => void | Promise<void>;
  currentWorkout: Workout | null;
  showIntensity?: boolean;
  onMoveSession?: () => void;
  sessionStatus: ProgramSessionStatus | null;
  onMarkSessionCompleted: () => void;
  onSkipSession: () => void;
  slots: WorkoutSlot[];
  swapRefreshCounter: number;
  completedSession: CompletedSession | null;
  activeSession: ActiveSession | null;
  notes: string;
  isNotesExpanded: boolean;
  scrollViewRef: React.RefObject<ComponentRef<typeof ScrollView> | null>;
  notesInputRef: React.RefObject<ComponentRef<typeof TextInput> | null>;
  tabBarHeight: number;
  bottomInset: number;
  onIntensityInfoPress: () => void;
  handleRedoWorkout: () => void | Promise<void>;
  handleSwapClick: (exerciseSlotIndex: number) => void;
  handleRestStart: (payload: RestTimerStartPayload) => void | Promise<void>;
  handleRestDismiss: () => void | Promise<void>;
  handleNotesChange: (text: string) => void;
  handleNotesFocus: () => void;
  handleNotesBlur: () => void;
  toggleNotesExpanded: () => void;
  onOpenCopyWorkoutNotesModal?: () => void;
  onExportWorkoutText: () => void | Promise<void>;
  headerAccessory?: React.ReactNode;
  exerciseCardKeySuffix?: string | number;
};

const DAYS_PER_WEEK = 7;

export function WorkoutScreenBody({
  selectedDayIndex,
  isRestDay,
  programId = null,
  startDate = null,
  workoutWeekPattern = null,
  onProgramReset,
  showProgramCompleted,
  onViewAllPrograms,
  currentWorkout,
  showIntensity = true,
  onMoveSession,
  sessionStatus,
  onMarkSessionCompleted,
  onSkipSession,
  slots,
  swapRefreshCounter,
  completedSession,
  activeSession,
  notes,
  isNotesExpanded,
  scrollViewRef,
  notesInputRef,
  tabBarHeight,
  bottomInset,
  onIntensityInfoPress,
  handleRedoWorkout,
  handleSwapClick,
  handleRestStart,
  handleRestDismiss,
  handleNotesChange,
  handleNotesFocus,
  handleNotesBlur,
  toggleNotesExpanded,
  onOpenCopyWorkoutNotesModal,
  onExportWorkoutText,
  headerAccessory,
  exerciseCardKeySuffix = '',
}: WorkoutScreenBodyProps) {
  const { unit: weightUnit } = useWeightUnit();
  const motionHelpers = useMotion();
  const [scrollEnabled, setScrollEnabled] = useState(true);
  /** Expanded state per day and section, kept for as long as the Program tab is mounted. */
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});
  const contentOpacity = useSharedValue(1);

  const handleSetReorderDragChange = useCallback((dragging: boolean) => {
    setScrollEnabled(!dragging);
  }, []);

  useEffect(() => {
    contentOpacity.set(0);
    contentOpacity.set(motionHelpers.fade(1, 'base'));
  }, [selectedDayIndex, contentOpacity, motionHelpers]);

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.get(),
  }));

  const sectionKey = (name: string) => `${selectedDayIndex ?? 'none'}:${name}`;
  const isSectionExpanded = (name: string) =>
    expandedSections[sectionKey(name)] ?? false;
  const toggleSection = (name: string) => {
    const key = sectionKey(name);
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (showProgramCompleted) {
    return <ProgramCompletedScreen onViewAllPrograms={onViewAllPrograms} />;
  }

  if (selectedDayIndex !== null && selectedDayIndex < 0) {
    return <ProgramStartingInXScreen daysUntilStart={-selectedDayIndex} />;
  }

  if (isRestDay) {
    return (
      <RestDayScreen
        programId={programId}
        selectedDayIndex={selectedDayIndex}
        startDate={startDate}
        workoutWeekPattern={workoutWeekPattern}
        onProgramReset={onProgramReset}
      />
    );
  }

  if (!currentWorkout) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>No workout found</Text>
      </View>
    );
  }

  const weekNumber =
    selectedDayIndex !== null
      ? Math.floor(selectedDayIndex / DAYS_PER_WEEK) + 1
      : null;
  const intensityLevel = getIntensityLevel(currentWorkout.intensity);

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={styles.keyboardAvoidingView}
      keyboardVerticalOffset={0}
    >
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: space.md + tabBarHeight + bottomInset },
        ]}
        keyboardShouldPersistTaps="always"
        scrollEnabled={scrollEnabled}
      >
        <Animated.View style={[styles.sections, contentStyle]}>
          <View style={styles.header}>
            {weekNumber !== null ? <Tag label={`Week ${weekNumber}`} /> : null}
            <Text style={styles.title} accessibilityRole="header">
              {currentWorkout.label}
            </Text>
            {currentWorkout.description ? (
              <Text style={styles.description}>
                {currentWorkout.description}
              </Text>
            ) : null}
          </View>

          {headerAccessory}

          <ProgramSessionStatusControls
            status={sessionStatus}
            expanded={isSectionExpanded('session-actions')}
            onToggle={() => toggleSection('session-actions')}
            onMove={onMoveSession}
            onComplete={onMarkSessionCompleted}
            onSkip={onSkipSession}
          />

          {completedSession && !activeSession ? (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Session completed</Text>
              <View style={styles.statRow}>
                <View style={styles.stat}>
                  <Text style={styles.statValue}>
                    {formatSessionDuration(
                      completedSession.completedAt - completedSession.startedAt
                    )}
                  </Text>
                  <Text style={styles.statLabel}>Duration</Text>
                </View>
                {currentWorkout.format !== 'v2' ? (
                  <>
                    <View style={styles.stat}>
                      <Text style={styles.statValue}>
                        {formatVolumeFromKg(
                          completedSession.totalVolume,
                          weightUnit
                        )}
                      </Text>
                      <Text style={styles.statLabel}>Volume</Text>
                    </View>
                    <View style={styles.stat}>
                      <Text style={styles.statValue}>
                        {completedSession.setsCompleted}
                      </Text>
                      <Text style={styles.statLabel}>Sets</Text>
                    </View>
                  </>
                ) : null}
              </View>
              <ActionChip
                label="Redo workout"
                icon="refresh"
                tone="neutral"
                onPress={() => void handleRedoWorkout()}
              />
            </View>
          ) : null}

          {showIntensity ? (
            <View style={styles.card}>
              <View style={styles.cardTitleRow}>
                <Text style={styles.cardTitle}>Intensity</Text>
                <Text
                  style={styles.intensityValue}
                  accessibilityLabel={`${currentWorkout.intensity} out of 10`}
                >
                  {currentWorkout.intensity}/10
                </Text>
              </View>
              <ProgressBar
                progress={currentWorkout.intensity / 10}
                accessibilityLabel="Intensity"
                accessibilityValueText={`${currentWorkout.intensity} out of 10, ${intensityLevel.label}`}
              />
              <Text style={styles.body}>
                {intensityLevel.label}. {intensityLevel.feel}
              </Text>
              <Pressable
                style={styles.textButton}
                onPress={onIntensityInfoPress}
                accessibilityRole="button"
              >
                <Text style={styles.textButtonLabel}>
                  View all intensity levels
                </Text>
              </Pressable>
            </View>
          ) : null}

          {(() => {
            if (currentWorkout.format === 'v2' && selectedDayIndex !== null) {
              return (
                <ConditioningWorkoutBody
                  dayIndex={selectedDayIndex}
                  blocks={currentWorkout.blocks}
                />
              );
            }

            let exerciseSlotIndex = 0;
            return slots.map((slot, index) => {
              if (slot.type === 'warmup') {
                const warmupTitle = slot.warmup.title ?? 'Warm-up';
                return (
                  <Collapsible
                    key={`warmup-${selectedDayIndex}-${index}`}
                    title={warmupTitle}
                    expanded={isSectionExpanded(`warmup-${index}`)}
                    onToggle={() => toggleSection(`warmup-${index}`)}
                  >
                    {slot.warmup.additionalDescription ? (
                      <Text style={styles.callout}>
                        {slot.warmup.additionalDescription}
                      </Text>
                    ) : null}
                    <View style={styles.list}>
                      {slot.warmup.description.map((item, itemIndex) => (
                        <View key={itemIndex} style={styles.listItem}>
                          <View style={styles.listBullet} />
                          <Text style={styles.listText}>{item}</Text>
                        </View>
                      ))}
                    </View>
                    {slot.warmup.videoUrl ? (
                      <YoutubeEmbed
                        youtubeId={slot.warmup.videoUrl}
                        accessibilityLabel={`Warm-up video for ${warmupTitle}`}
                      />
                    ) : null}
                  </Collapsible>
                );
              }

              const currentExerciseIndex = exerciseSlotIndex;
              exerciseSlotIndex++;
              return (
                <ExerciseCard
                  key={`${selectedDayIndex}-${index}-${slot.exerciseId}-${swapRefreshCounter}-${exerciseCardKeySuffix}`}
                  exerciseId={slot.exerciseId}
                  programExercise={slot.programExercise}
                  slotNumber={currentExerciseIndex + 1}
                  dayIndex={selectedDayIndex}
                  slotIndex={currentExerciseIndex}
                  onSwap={() => handleSwapClick(currentExerciseIndex)}
                  onRestStart={handleRestStart}
                  onRestDismiss={handleRestDismiss}
                  onSetReorderDragChange={handleSetReorderDragChange}
                />
              );
            });
          })()}

          <Collapsible
            title="Notes"
            expanded={isNotesExpanded}
            onToggle={toggleNotesExpanded}
            accessibilityLabel={
              notes.length > 0 && !isNotesExpanded
                ? 'Notes, has notes'
                : 'Notes'
            }
            accessory={
              notes.length > 0 && !isNotesExpanded ? (
                <Badge label="Has notes" tone="neutral" />
              ) : null
            }
          >
            <TextInput
              ref={notesInputRef}
              style={styles.notesInput}
              value={notes}
              onChangeText={handleNotesChange}
              onFocus={handleNotesFocus}
              onBlur={handleNotesBlur}
              placeholder="Add notes for this workout…"
              placeholderTextColor={color.textTertiary}
              multiline
              textAlignVertical="top"
              accessibilityLabel="Workout notes"
            />
          </Collapsible>

          {(onOpenCopyWorkoutNotesModal && selectedDayIndex !== null) ||
          currentWorkout.format !== 'v2' ? (
            <View style={styles.notesActions}>
              {onOpenCopyWorkoutNotesModal && selectedDayIndex !== null ? (
                <ActionChip
                  label="Copy notes from another workout"
                  icon="copy-outline"
                  tone="neutral"
                  onPress={onOpenCopyWorkoutNotesModal}
                />
              ) : null}
              {currentWorkout.format !== 'v2' ? (
                <ActionChip
                  label="Export workout as text"
                  icon="share-outline"
                  tone="neutral"
                  onPress={() => void onExportWorkoutText()}
                />
              ) : null}
            </View>
          ) : null}
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
