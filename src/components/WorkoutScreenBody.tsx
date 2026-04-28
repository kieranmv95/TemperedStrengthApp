import { Colors, Spacing } from '@/src/constants/theme';
import { useWeightUnit } from '@/src/hooks/useWeightUnit';
import { ProgramStartingInXScreen } from '@/src/screens/ProgramStartingInXScreen';
import { RestDayScreen } from '@/src/screens/RestDayScreen';
import {
  formatSessionDuration,
  getIntensityLevel,
  type WorkoutSlot,
} from '@/src/screens/workoutScreenConstants';
import { workoutScreenStyles as styles } from '@/src/screens/workoutScreenStyles';
import type { Workout } from '@/src/types/program';
import type { ActiveSession, CompletedSession } from '@/src/types/storage';
import { formatVolumeFromKg } from '@/src/utils/weightUnits';
import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import type { RestTimerStartPayload } from './ExerciseCard';
import { ExerciseCard } from './ExerciseCard';
import { ConditioningWorkoutBody } from './conditioning/ConditioningWorkoutBody';

type WorkoutScreenBodyProps = {
  selectedDayIndex: number | null;
  isRestDay: boolean;
  onProgramReset?: () => void;
  currentWorkout: Workout | null;
  showIntensity?: boolean;
  slots: WorkoutSlot[];
  swapRefreshCounter: number;
  completedSession: CompletedSession | null;
  activeSession: ActiveSession | null;
  notes: string;
  isNotesExpanded: boolean;
  scrollViewRef: React.RefObject<ScrollView | null>;
  notesInputRef: React.RefObject<TextInput | null>;
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
};

export function WorkoutScreenBody({
  selectedDayIndex,
  isRestDay,
  onProgramReset,
  currentWorkout,
  showIntensity = true,
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
}: WorkoutScreenBodyProps) {
  const { unit: weightUnit } = useWeightUnit();
  if (selectedDayIndex !== null && selectedDayIndex < 0) {
    return <ProgramStartingInXScreen daysUntilStart={-selectedDayIndex} />;
  }

  if (isRestDay) {
    return <RestDayScreen onProgramReset={onProgramReset} />;
  }

  if (!currentWorkout) {
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
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Spacing.xxl + tabBarHeight + bottomInset },
        ]}
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
            <Text style={styles.completedSessionTitle}>Session Completed</Text>
            <View style={styles.completedSessionStats}>
              <View style={styles.completedSessionStat}>
                <Text style={styles.completedSessionStatValue}>
                  {formatSessionDuration(
                    completedSession.completedAt - completedSession.startedAt
                  )}
                </Text>
                <Text style={styles.completedSessionStatLabel}>Duration</Text>
              </View>
              {currentWorkout.format !== 'v2' && (
                <>
                  <View style={styles.completedSessionStat}>
                    <Text style={styles.completedSessionStatValue}>
                      {formatVolumeFromKg(
                        completedSession.totalVolume,
                        weightUnit
                      )}
                    </Text>
                    <Text style={styles.completedSessionStatLabel}>Volume</Text>
                  </View>
                  <View style={styles.completedSessionStat}>
                    <Text style={styles.completedSessionStatValue}>
                      {completedSession.setsCompleted}
                    </Text>
                    <Text style={styles.completedSessionStatLabel}>Sets</Text>
                  </View>
                </>
              )}
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

        {showIntensity ? (
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
              onPress={onIntensityInfoPress}
              activeOpacity={0.7}
            >
              <Text style={styles.intensityCtaText}>
                View all intensity levels
              </Text>
            </TouchableOpacity>
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
              return (
                <View key={`warmup-${index}`} style={styles.warmupCard}>
                  <Text style={styles.warmupTitle}>
                    {slot.warmup.title ?? 'Warm-Up'}
                  </Text>
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
              return (
                <ExerciseCard
                  key={`${selectedDayIndex}-${index}-${slot.exerciseId}-${swapRefreshCounter}`}
                  exerciseId={slot.exerciseId}
                  programExercise={slot.programExercise}
                  slotNumber={currentExerciseIndex + 1}
                  dayIndex={selectedDayIndex}
                  slotIndex={currentExerciseIndex}
                  onSwap={() => handleSwapClick(currentExerciseIndex)}
                  onRestStart={handleRestStart}
                  onRestDismiss={handleRestDismiss}
                />
              );
            }
          });
        })()}

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
              onBlur={handleNotesBlur}
              placeholder="Add notes for this workout..."
              placeholderTextColor={Colors.textPlaceholder}
              multiline
              textAlignVertical="top"
            />
          )}
        </View>

        <View style={styles.notesActionsContainer}>
          {onOpenCopyWorkoutNotesModal && selectedDayIndex !== null && (
            <TouchableOpacity
              style={styles.notesAction}
              onPress={onOpenCopyWorkoutNotesModal}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Copy notes from another workout"
            >
              <Text style={styles.notesActionText}>
                Copy notes from another workout
              </Text>
            </TouchableOpacity>
          )}

          {currentWorkout.format !== 'v2' && (
            <TouchableOpacity
              style={styles.notesAction}
              onPress={onExportWorkoutText}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Export workout as text"
            >
              <Text style={styles.notesActionText}>Export workout as text</Text>
            </TouchableOpacity>
          )}
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}
