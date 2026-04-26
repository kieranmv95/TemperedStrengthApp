import { DaySelector } from '@/src/components/DaySelector';
import { IntensityLevelsModal } from '@/src/components/IntensityLevelsModal';
import { RestTimer } from '@/src/components/RestTimer';
import { SessionSummaryModal } from '@/src/components/SessionSummaryModal';
import { SessionTimer } from '@/src/components/SessionTimer';
import { CopyWorkoutNotesModal } from '@/src/components/CopyWorkoutNotesModal';
import { SwapModal } from '@/src/components/SwapModal';
import { WorkoutScreenBody } from '@/src/components/WorkoutScreenBody';
import { useSubscription } from '@/src/hooks/use-subscription';
import { useWeightUnit } from '@/src/hooks/useWeightUnit';
import { useWorkoutScreenController } from '@/src/hooks/useWorkoutScreenController';
import { workoutScreenStyles as styles } from '@/src/screens/workoutScreenStyles';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { router } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { StandardLayout } from '../components/StandardLayout';

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

  if (c.loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isLockedProProgram =
    !!c.program?.isPro && !subscriptionLoading && !isPro;
  if (isLockedProProgram) {
    return (
      <StandardLayout title="PRO Required">
        <StandardLayout.Body>
          <Text style={styles.loadingText}>
            Your Subscription ended part way through your program. Please renew
            your subscription to continue.
          </Text>
          <Text style={styles.loadingText}>
            Alternatively, you can start a new FREE program by ending your
            current program in your account.
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/settings')}
            activeOpacity={0.7}
            style={styles.startSessionButton}
          >
            <Text style={styles.startSessionButtonText}>
              Manage subscription
            </Text>
          </TouchableOpacity>
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
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {c.startDate && c.dayIndex !== null && (
        <DaySelector
          startDate={c.startDate}
          workoutDayIndices={c.workoutDayIndices}
          currentDayIndex={c.selectedDayIndex ?? c.dayIndex}
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

      {!c.isRestDay &&
        !c.loading &&
        !c.activeSession &&
        !c.completedSession &&
        c.currentWorkout && (
          <View style={styles.startSessionButtonContainer}>
            <TouchableOpacity
              style={styles.startSessionButton}
              onPress={c.handleStartSession}
              activeOpacity={0.7}
            >
              <Text style={styles.startSessionButtonText}>Start Session</Text>
            </TouchableOpacity>
          </View>
        )}

      <WorkoutScreenBody
        selectedDayIndex={c.selectedDayIndex}
        isRestDay={c.isRestDay}
        onProgramReset={onProgramReset}
        currentWorkout={c.currentWorkout}
        slots={c.slots}
        swapRefreshCounter={c.swapRefreshCounter}
        completedSession={c.completedSession}
        activeSession={c.activeSession}
        notes={c.notes}
        isNotesExpanded={c.isNotesExpanded}
        scrollViewRef={c.scrollViewRef}
        notesInputRef={c.notesInputRef}
        tabBarHeight={tabBarHeight}
        bottomInset={insets.bottom}
        onIntensityInfoPress={() => c.setIntensityModalVisible(true)}
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
        onClose={c.closeSwapModal}
        onClearData={c.onSwapClearData}
      />

      <IntensityLevelsModal
        visible={c.intensityModalVisible}
        currentIntensity={c.currentWorkout?.intensity}
        onClose={() => c.setIntensityModalVisible(false)}
      />

      <SessionSummaryModal
        visible={c.sessionSummary !== null}
        duration={c.sessionSummary?.duration ?? 0}
        totalVolume={c.sessionSummary?.totalVolume ?? 0}
        setsCompleted={c.sessionSummary?.setsCompleted ?? 0}
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

      {c.notesActive && c.keyboardHeight > 0 && (
        <View
          style={[
            styles.keyboardDoneBar,
            { bottom: c.keyboardHeight - tabBarHeight },
          ]}
        >
          <View style={styles.keyboardDoneBarSpacer} />
          <TouchableOpacity
            style={styles.keyboardDoneBtn}
            onPress={c.handleNotesDone}
          >
            <Text style={styles.keyboardDoneText}>Done</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};
