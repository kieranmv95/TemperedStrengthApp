import { CopyWorkoutNotesModal } from '@/src/components/CopyWorkoutNotesModal';
import { DaySelector } from '@/src/components/DaySelector';
import { IntensityLevelsModal } from '@/src/components/IntensityLevelsModal';
import { MoveSessionModal } from '@/src/components/MoveSessionModal';
import { RestTimer } from '@/src/components/RestTimer';
import { SessionSummaryModal } from '@/src/components/SessionSummaryModal';
import { SessionTimer } from '@/src/components/SessionTimer';
import { SwapModal } from '@/src/components/SwapModal';
import { TrainingMaxesCard } from '@/src/components/TrainingMaxesCard';
import { WorkoutScreenBody } from '@/src/components/WorkoutScreenBody';
import { AppSafeAreaView, Skeleton, StandardLayout } from '@/src/components/ds';
import { color, space, typography } from '@/src/constants/tokens';
import { useSubscription } from '@/src/hooks/use-subscription';
import { useWeightUnit } from '@/src/hooks/useWeightUnit';
import { useWorkoutScreenController } from '@/src/hooks/useWorkoutScreenController';
import { workoutScreenStyles as styles } from '@/src/screens/workoutScreenStyles';
import { cancelTimerFinishedNotifications } from '@/src/services/localNotifications';
import { clearProgramData } from '@/src/utils/storage';
import { router } from 'expo-router';
import { useBottomTabBarHeight } from 'expo-router/tabs';
import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { getEffectiveBottomInset } from '@/src/utils/platform';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const DAY_SELECTOR_SKELETON_HEIGHT = 72;
const TITLE_SKELETON_HEIGHT = 32;
const CARD_SKELETON_HEIGHT = 160;

type WorkoutScreenProps = {
  onProgramReset?: () => void;
};

export const WorkoutScreen: React.FC<WorkoutScreenProps> = ({
  onProgramReset,
}) => {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const { isPro, isLoading: subscriptionLoading } = useSubscription();
  const c = useWorkoutScreenController();
  const { unit: weightUnit } = useWeightUnit();
  const [trainingMaxRefresh, setTrainingMaxRefresh] = React.useState(0);
  const requireRmId = c.program?.requireRmId ?? null;

  const handleViewAllPrograms = async () => {
    Alert.alert(
      'End program?',
      'To view all programs, we’ll end your current program and clear its data. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'View all programs',
          style: 'destructive',
          onPress: async () => {
            try {
              await cancelTimerFinishedNotifications();
            } catch (error) {
              console.error('Error cancelling scheduled notifications:', error);
            }

            try {
              await clearProgramData();
              onProgramReset?.();
              router.replace('/');
            } catch (error) {
              console.error('Error ending current program:', error);
              Alert.alert(
                'Error',
                'Failed to end your current program. Please try again.'
              );
            }
          },
        },
      ]
    );
  };

  if (c.loading) {
    return (
      <AppSafeAreaView
        style={styles.container}
        edges={['top', 'left', 'right']}
      >
        <View style={localStyles.loadingSkeletons}>
          <Skeleton
            width="100%"
            height={DAY_SELECTOR_SKELETON_HEIGHT}
            radius="md"
            accessibilityLabel="Loading program"
          />
          <Skeleton width="60%" height={TITLE_SKELETON_HEIGHT} />
          <Skeleton width="100%" height={CARD_SKELETON_HEIGHT} radius="md" />
          <Skeleton width="100%" height={CARD_SKELETON_HEIGHT} radius="md" />
        </View>
      </AppSafeAreaView>
    );
  }

  const isLockedProProgram =
    !!c.program?.isPro && !subscriptionLoading && !isPro;
  if (isLockedProProgram) {
    return (
      <StandardLayout title="Pro required">
        <StandardLayout.Body>
          <View style={localStyles.proRequiredBody}>
            <Text style={localStyles.proRequiredText}>
              Your subscription ended part way through your program. Please
              renew your subscription to continue.
            </Text>
            <Text style={localStyles.proRequiredText}>
              Alternatively, you can start a new free program by ending your
              current program in your account.
            </Text>
            <Pressable
              onPress={() => router.push('/records')}
              style={({ pressed }) => [
                styles.startSessionButton,
                pressed && localStyles.primaryButtonPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Manage subscription"
            >
              <Text style={styles.startSessionButtonText}>
                Manage subscription
              </Text>
            </Pressable>
          </View>
        </StandardLayout.Body>
      </StandardLayout>
    );
  }

  const showRestTimerBar =
    !c.isRestDay &&
    !c.loading &&
    c.restTimer !== null &&
    c.selectedDayIndex !== null &&
    c.restTimer.dayIndex === c.selectedDayIndex;

  return (
    <AppSafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {c.startDate && c.dayIndex !== null && !c.showProgramCompleted && (
        <DaySelector
          startDate={c.startDate}
          workoutDayIndices={c.workoutDayIndices}
          currentDayIndex={c.selectedDayIndex ?? c.dayIndex}
          sessionStatuses={c.sessionStatuses}
          onDaySelect={c.handleDaySelect}
        />
      )}

      {!c.isRestDay && !c.loading && c.activeSession && (
        <SessionTimer
          startedAt={c.activeSession.startedAt}
          onFinish={c.handleFinishSession}
        />
      )}

      {showRestTimerBar && c.restTimer && (
        <RestTimer
          timer={c.restTimer}
          onDismiss={c.handleRestDismiss}
          onComplete={c.handleRestComplete}
          onRestart={c.handleRestRestart}
          onAdjust={c.handleRestAdjust}
        />
      )}

      <WorkoutScreenBody
        selectedDayIndex={c.selectedDayIndex}
        isRestDay={c.isRestDay}
        programId={c.program?.id ?? null}
        startDate={c.startDate}
        workoutWeekPattern={c.workoutWeekPattern}
        onProgramReset={onProgramReset}
        showProgramCompleted={c.showProgramCompleted}
        onViewAllPrograms={handleViewAllPrograms}
        currentWorkout={c.currentWorkout}
        showIntensity={!!c.program?.categories.includes('strength')}
        onMoveSession={
          !c.isRestDay && !c.loading && c.currentWorkout
            ? c.openMoveSessionModal
            : undefined
        }
        sessionStatus={c.sessionStatus}
        onMarkSessionCompleted={c.handleMarkSessionCompleted}
        onSkipSession={c.handleSkipSession}
        slots={c.slots}
        swapRefreshCounter={c.swapRefreshCounter}
        completedSession={c.completedSession}
        activeSession={c.activeSession}
        notes={c.notes}
        isNotesExpanded={c.isNotesExpanded}
        scrollViewRef={c.scrollViewRef}
        notesInputRef={c.notesInputRef}
        tabBarHeight={tabBarHeight}
        bottomInset={getEffectiveBottomInset(insets.bottom)}
        onIntensityInfoPress={() => {
          if (c.program?.categories.includes('strength')) {
            c.setIntensityModalVisible(true);
          }
        }}
        handleRedoWorkout={c.handleRedoWorkout}
        handleSwapClick={c.handleSwapClick}
        handleRestStart={c.handleRestStart}
        handleRestDismiss={c.handleRestDismiss}
        handleNotesChange={c.handleNotesChange}
        handleNotesFocus={c.handleNotesFocus}
        handleNotesBlur={c.handleNotesBlur}
        toggleNotesExpanded={c.toggleNotesExpanded}
        onOpenCopyWorkoutNotesModal={
          c.program != null && c.selectedDayIndex !== null
            ? c.openCopyWorkoutNotesModal
            : undefined
        }
        onExportWorkoutText={c.handleExportWorkoutText}
        exerciseCardKeySuffix={trainingMaxRefresh}
        headerAccessory={
          requireRmId?.length ? (
            <TrainingMaxesCard
              exerciseIds={requireRmId}
              onChanged={() => setTrainingMaxRefresh((n) => n + 1)}
            />
          ) : null
        }
      />

      <SwapModal
        visible={c.swapModalVisible}
        currentExerciseId={
          c.currentSwapSlot !== null
            ? c.getExerciseSlots()[c.currentSwapSlot]?.exerciseId || null
            : null
        }
        originalExerciseId={
          c.currentSwapSlot !== null
            ? c.getExerciseSlots()[c.currentSwapSlot]?.programExercise?.id ||
              null
            : null
        }
        dayIndex={c.selectedDayIndex}
        slotIndex={c.currentSwapSlot !== null ? c.currentSwapSlot : 0}
        programId={c.program?.id ?? null}
        onClose={c.closeSwapModal}
        onClearData={c.onSwapClearData}
      />

      {c.program?.categories.includes('strength') ? (
        <IntensityLevelsModal
          visible={c.intensityModalVisible}
          currentIntensity={c.currentWorkout?.intensity}
          onClose={() => c.setIntensityModalVisible(false)}
        />
      ) : null}

      <SessionSummaryModal
        visible={c.sessionSummary !== null}
        duration={c.sessionSummary?.duration ?? 0}
        totalVolume={c.sessionSummary?.totalVolume ?? 0}
        setsCompleted={c.sessionSummary?.setsCompleted ?? 0}
        showStrengthStats={c.sessionSummary?.showStrengthStats ?? true}
        weightUnit={weightUnit}
        onDismiss={() => c.setSessionSummary(null)}
      />

      <CopyWorkoutNotesModal
        visible={c.copyWorkoutNotesModalVisible}
        onClose={c.closeCopyWorkoutNotesModal}
        program={c.program ?? null}
        startDate={c.startDate}
        workoutWeekPattern={c.workoutWeekPattern}
        selectedDayIndex={c.selectedDayIndex}
        currentNotes={c.notes}
        onApplyNotes={c.handleApplyCopiedWorkoutNotes}
      />

      <MoveSessionModal
        visible={c.moveSessionModalVisible}
        bottomInset={getEffectiveBottomInset(insets.bottom)}
        fromDayIndex={c.moveSessionFromDayIndex}
        options={c.moveSessionOptions}
        selectedToDayIndex={c.moveSessionSelectedToDayIndex}
        onSelectToDayIndex={c.setMoveSessionSelectedToDayIndex}
        onCancel={c.closeMoveSessionModal}
        onConfirm={() => c.confirmMoveSession()}
      />

      {c.isMovingSession && (
        <View style={styles.movingSessionOverlay} pointerEvents="auto">
          <View style={styles.movingSessionOverlayCard}>
            <Text style={styles.movingSessionOverlayText}>Moving session…</Text>
          </View>
        </View>
      )}

      {c.notesActive && c.keyboardHeight > 0 && (
        <View
          style={[
            styles.keyboardDoneBar,
            { bottom: c.keyboardHeight - tabBarHeight },
          ]}
        >
          <View style={styles.keyboardDoneBarSpacer} />
          <Pressable
            style={styles.keyboardDoneBtn}
            onPress={c.handleNotesDone}
            accessibilityRole="button"
            accessibilityLabel="Done editing notes"
          >
            <Text style={styles.keyboardDoneText}>Done</Text>
          </Pressable>
        </View>
      )}
    </AppSafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  loadingSkeletons: {
    flex: 1,
    padding: space.md,
    gap: space.md,
  },
  proRequiredBody: {
    gap: space.sm,
  },
  proRequiredText: {
    ...typography.body,
    color: color.textSecondary,
  },
  primaryButtonPressed: {
    backgroundColor: color.goldStrong,
  },
});
