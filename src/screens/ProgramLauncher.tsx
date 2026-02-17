import {
  BorderRadius,
  Colors,
  FontSize,
  Spacing,
} from '../constants/theme';
import { useSubscription } from '@/src/hooks/use-subscription';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { getExerciseById } from '../data/exercises';
import type { Program } from '../types/program';
import { programs } from '../utils/program';
import { setActiveProgramId, setProgramStartDate } from '../utils/storage';

type ProgramLauncherProps = {
  onProgramSelected: () => void;
};

export const ProgramLauncher: React.FC<ProgramLauncherProps> = ({
  onProgramSelected,
}) => {
  const { isPro } = useSubscription();
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [showProgramDetails, setShowProgramDetails] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [showWorkoutDaysMoreInfo, setShowWorkoutDaysMoreInfo] = useState(false);

  const handleSelectProgram = (program: Program) => {
    // Allow viewing program details regardless of Pro status
    setSelectedProgram(program);
    setShowProgramDetails(true);
  };

  const handleStartProgram = () => {
    // Double check Pro status before starting (in case entitlement changed)
    if (selectedProgram?.isPro && !isPro) {
      Alert.alert(
        'Pro Required',
        'This program requires Tempered Strength Pro. Please upgrade to continue.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => setShowProgramDetails(false),
          },
          {
            text: 'Upgrade to Pro',
            style: 'default',
            onPress: () => {
              setShowProgramDetails(false);
              router.push('/paywall');
            },
          },
        ]
      );
      return;
    }

    setShowProgramDetails(false);
    setShowDatePicker(true);
  };

  const handleDateChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (date) {
      setStartDate(date);
      if (Platform.OS === 'android') {
        handleConfirmDate(date);
      }
    }
  };

  const handleConfirmDate = async (date: Date) => {
    if (!selectedProgram) return;

    try {
      await setActiveProgramId(selectedProgram.id);
      await setProgramStartDate(date.toISOString());
      setShowDatePicker(false);
      onProgramSelected();
    } catch (error) {
      console.error('Error saving program selection:', error);
    }
  };

  const renderProgramCard = (program: Program, isLocked: boolean) => {
    // Calculate number of weeks from the maximum dayIndex
    const maxDayIndex = Math.max(...program.workouts.map((w) => w.dayIndex));
    const weekCount = Math.ceil((maxDayIndex + 1) / 7);
    // Calculate sessions per week from daysSplit if available
    const sessionsPerWeek = program.daysSplit?.length || 0;

    return (
      <TouchableOpacity
        key={program.id}
        style={[styles.programCard, isLocked && styles.programCardLocked]}
        onPress={() => handleSelectProgram(program)}
        disabled={false} // Always allow press to show upgrade prompt
      >
        <View style={styles.programContent}>
          <View style={styles.programNameRow}>
            <Text
              style={[styles.programName, isLocked && styles.programNameLocked]}
            >
              {program.name}
            </Text>
            {program.isPro && (
              <View style={styles.proBadge}>
                <Text style={styles.proBadgeText}>PRO</Text>
              </View>
            )}
          </View>
          <Text
            style={[
              styles.programDescription,
              isLocked && styles.programDescriptionLocked,
            ]}
          >
            {program.description}
          </Text>
          <Text style={styles.programStats}>
            {program.workouts.length} workouts • {weekCount}{' '}
            {weekCount === 1 ? 'week' : 'weeks'}
            {sessionsPerWeek > 0 && ` • ${sessionsPerWeek} sessions/week`}
            {program.averageSessionDuration &&
              ` • ${program.averageSessionDuration}`}
          </Text>
        </View>
        <Text
          style={[styles.selectArrow, isLocked && styles.selectArrowLocked]}
        >
          →
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Select a Program</Text>
          <Text style={styles.subtitle}>
            Choose your training program to get started
          </Text>
        </View>

        {programs.map((program) =>
          renderProgramCard(program, program.isPro && !isPro)
        )}
      </ScrollView>

      <Modal
        visible={showProgramDetails}
        transparent
        animationType="slide"
        onRequestClose={() => setShowProgramDetails(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.programDetailsModal}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleRow}>
                <Text style={styles.modalTitle}>
                  {selectedProgram?.name || 'Program Details'}
                </Text>
                {selectedProgram?.isPro && (
                  <View style={styles.proBadge}>
                    <Text style={styles.proBadgeText}>PRO</Text>
                  </View>
                )}
              </View>
              <TouchableOpacity
                onPress={() => setShowProgramDetails(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <Text style={styles.programDescription}>
                {selectedProgram?.description}
              </Text>

              <Text style={styles.sectionTitle}>Program Overview</Text>

              <View style={styles.programOverviewContainer}>
                <View style={styles.statsContainer}>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>
                      {selectedProgram?.workouts.length}
                    </Text>
                    <Text style={styles.statLabel}>Workouts</Text>
                  </View>
                  {selectedProgram &&
                    (() => {
                      const maxDayIndex = Math.max(
                        ...selectedProgram.workouts.map((w) => w.dayIndex)
                      );
                      const weekCount = Math.ceil((maxDayIndex + 1) / 7);
                      return (
                        <View style={styles.statItem}>
                          <Text style={styles.statValue}>{weekCount}</Text>
                          <Text style={styles.statLabel}>
                            {weekCount === 1 ? 'Week' : 'Weeks'}
                          </Text>
                        </View>
                      );
                    })()}
                </View>

                {selectedProgram?.averageSessionDuration && (
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>
                      {selectedProgram.averageSessionDuration}
                    </Text>
                    <Text style={styles.statLabel}>Avg Session</Text>
                  </View>
                )}
              </View>

              {selectedProgram?.daysSplit && (
                <View>
                  <View style={styles.workoutDaysTitleRow}>
                    <View>
                      <Text style={styles.workoutTitle}>Workout Days</Text>
                    </View>
                    <View>
                      <TouchableOpacity
                        style={styles.changeDaysButton}
                        onPress={() =>
                          setShowWorkoutDaysMoreInfo(!showWorkoutDaysMoreInfo)
                        }
                      >
                        <Text style={styles.moreInfoButtonText}>
                          Change Days?
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  {showWorkoutDaysMoreInfo && (
                    <Text style={styles.programDescription}>
                      The first session working day will be the first day of the
                      program you select. You can change the session days at any
                      time in the program once started.
                    </Text>
                  )}
                  <View style={styles.daysSplitContainer}>
                    <View
                      style={[
                        styles.dayItem,
                        selectedProgram.daysSplit.includes('mon') &&
                        styles.dayItemSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.dayLabel,
                          selectedProgram.daysSplit.includes('mon') &&
                          styles.dayLabelSelected,
                        ]}
                      >
                        M
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.dayItem,
                        selectedProgram.daysSplit.includes('tue') &&
                        styles.dayItemSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.dayLabel,
                          selectedProgram.daysSplit.includes('tue') &&
                          styles.dayLabelSelected,
                        ]}
                      >
                        T
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.dayItem,
                        selectedProgram.daysSplit.includes('wed') &&
                        styles.dayItemSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.dayLabel,
                          selectedProgram.daysSplit.includes('wed') &&
                          styles.dayLabelSelected,
                        ]}
                      >
                        W
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.dayItem,
                        selectedProgram.daysSplit.includes('thu') &&
                        styles.dayItemSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.dayLabel,
                          selectedProgram.daysSplit.includes('thu') &&
                          styles.dayLabelSelected,
                        ]}
                      >
                        T
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.dayItem,
                        selectedProgram.daysSplit.includes('fri') &&
                        styles.dayItemSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.dayLabel,
                          selectedProgram.daysSplit.includes('fri') &&
                          styles.dayLabelSelected,
                        ]}
                      >
                        F
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.dayItem,
                        selectedProgram.daysSplit.includes('sat') &&
                        styles.dayItemSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.dayLabel,
                          selectedProgram.daysSplit.includes('sat') &&
                          styles.dayLabelSelected,
                        ]}
                      >
                        S
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.dayItem,
                        selectedProgram.daysSplit.includes('sun') &&
                        styles.dayItemSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.dayLabel,
                          selectedProgram.daysSplit.includes('sun') &&
                          styles.dayLabelSelected,
                        ]}
                      >
                        S
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              <Text style={styles.sectionTitle}>Workouts</Text>
              {selectedProgram?.workouts.map((workout, index) => (
                <View key={index} style={styles.workoutItem}>
                  <Text style={styles.workoutLabel}>{workout.label}</Text>
                  {workout.description && (
                    <Text style={styles.workoutDescription}>
                      {workout.description}
                    </Text>
                  )}
                  {(() => {
                    const exerciseIds = workout.exercises
                      .filter((ex) => ex.type === 'exercise')
                      .map((ex) => (ex as { id: number }).id);
                    const exerciseNames = exerciseIds
                      .map((id) => getExerciseById(id)?.name)
                      .filter((name): name is string => name !== undefined);
                    return exerciseNames.length > 0 ? (
                      <Text style={styles.workoutExercisesList}>
                        {exerciseNames.join(', ')}
                      </Text>
                    ) : null;
                  })()}
                  <View style={styles.workoutMeta}>
                    <Text style={styles.workoutExercises}>
                      {workout.exercises.length} exercises
                    </Text>
                    <View style={styles.workoutIntensity}>
                      <Text style={styles.workoutIntensityLabel}>
                        Intensity:
                      </Text>
                      <View style={styles.workoutIntensityBar}>
                        {Array.from({ length: 10 }).map((_, i) => (
                          <View
                            key={i}
                            style={[
                              styles.workoutIntensityDot,
                              i < workout.intensity &&
                              styles.workoutIntensityDotFilled,
                            ]}
                          />
                        ))}
                      </View>
                      <Text style={styles.workoutIntensityValue}>
                        {workout.intensity}/10
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>

            <View style={styles.modalFooter}>
              {selectedProgram?.isPro && !isPro ? (
                <TouchableOpacity
                  style={styles.upgradeProgramButton}
                  onPress={() => {
                    setShowProgramDetails(false);
                    router.push('/paywall');
                  }}
                >
                  <Text style={styles.upgradeProgramButtonText}>
                    Upgrade to Pro to Start
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.startProgramButton}
                  onPress={handleStartProgram}
                >
                  <Text style={styles.startProgramButtonText}>
                    Start Program
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>

      {showDatePicker && (
        <>
          {Platform.OS === 'ios' && (
            <View style={styles.datePickerContainer}>
              <View style={styles.datePickerHeader}>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(false)}
                  style={styles.cancelButton}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.datePickerTitle}>Select Start Date</Text>
                <TouchableOpacity
                  onPress={() => handleConfirmDate(startDate)}
                  style={styles.confirmButton}
                >
                  <Text style={styles.confirmButtonText}>Confirm</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.datePickerWrapper}>
                <DateTimePicker
                  value={startDate}
                  mode="date"
                  display="spinner"
                  onChange={handleDateChange}
                  style={styles.datePicker}
                />
              </View>
            </View>
          )}
          {Platform.OS === 'android' && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundScreen,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing.xxl,
  },
  header: {
    marginBottom: Spacing.section,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: FontSize.displayXXXl,
    fontWeight: '800',
    marginBottom: Spacing.md,
    letterSpacing: -0.5,
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: FontSize.xxl,
    fontWeight: '500',
  },
  programOverviewContainer: {
    marginBottom: Spacing.section,
  },
  workoutDaysTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.xl,
    marginBottom: Spacing.md,
    marginTop: Spacing.md,
  },
  changeDaysButton: {
    padding: Spacing.xxs,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.accent,
  },
  moreInfoButtonText: {
    color: Colors.accent,
    fontSize: FontSize.xs,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  programCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.xxl,
    padding: Spacing.xxxl,
    marginBottom: Spacing.xxl,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  programCardLocked: {
    opacity: 0.7,
    borderColor: Colors.accent,
  },
  programContent: {
    flex: 1,
  },
  programNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
    flexWrap: 'wrap',
  },
  programName: {
    color: Colors.textPrimary,
    fontSize: FontSize.displayLg,
    fontWeight: '700',
  },
  programNameLocked: {
    color: Colors.textMuted,
  },
  programDescription: {
    color: Colors.textSecondary,
    fontSize: FontSize.lg,
    marginBottom: Spacing.md,
    lineHeight: 20,
  },
  programDescriptionLocked: {
    color: Colors.textPlaceholder,
  },
  programStats: {
    color: Colors.accent,
    fontSize: FontSize.md,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  selectArrow: {
    color: Colors.accent,
    fontSize: FontSize.displayXl,
    fontWeight: '600',
    marginLeft: Spacing.xxl,
  },
  selectArrowLocked: {
    color: Colors.textPlaceholder,
  },
  proBadge: {
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  proBadgeText: {
    color: Colors.textBlack,
    fontSize: FontSize.xxs,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  datePickerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.backgroundCard,
    borderTopLeftRadius: BorderRadius.pill,
    borderTopRightRadius: BorderRadius.pill,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    paddingBottom: 40,
    alignItems: 'center',
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.xxl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDefault,
  },
  datePickerTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.displaySm,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  cancelButton: {
    padding: Spacing.md,
  },
  cancelButtonText: {
    color: Colors.textMuted,
    fontSize: FontSize.xxl,
    fontWeight: '600',
  },
  confirmButton: {
    padding: Spacing.md,
  },
  confirmButtonText: {
    color: Colors.accent,
    fontSize: FontSize.xxl,
    fontWeight: '700',
  },
  datePickerWrapper: {
    alignItems: 'center',
    width: '100%',
  },
  datePicker: {
    backgroundColor: Colors.backgroundCard,
    alignSelf: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  programDetailsModal: {
    backgroundColor: Colors.backgroundCard,
    borderTopLeftRadius: BorderRadius.pill,
    borderTopRightRadius: BorderRadius.pill,
    padding: Spacing.section,
    maxHeight: '95%',
    borderWidth: 1,
    borderColor: Colors.borderDefault,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xxxl,
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
    flexWrap: 'wrap',
  },
  modalTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.displayXl,
    fontWeight: '700',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.backgroundElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  daysSplitContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.section,
  },
  dayItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.backgroundElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  dayLabel: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  dayItemSelected: {
    backgroundColor: Colors.accent,
  },
  dayLabelSelected: {
    color: Colors.textBlack,
  },
  closeButtonText: {
    color: Colors.textPrimary,
    fontSize: FontSize.displaySm,
    fontWeight: '600',
  },
  modalContent: {
    maxHeight: 500,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.displaySm,
    fontWeight: '700',
    marginBottom: Spacing.xxl,
    marginTop: Spacing.md,
  },
  workoutTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.displaySm,
    fontWeight: '700',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: Spacing.xxl,
    marginBottom: Spacing.xxl,
  },
  statItem: {
    flex: 1,
    backgroundColor: Colors.backgroundElevated,
    borderRadius: BorderRadius.xxl,
    padding: Spacing.xxl,
    alignItems: 'center',
    minWidth: 100,
  },
  statValue: {
    color: Colors.accent,
    fontSize: FontSize.displayXl,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  statLabel: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  workoutItem: {
    backgroundColor: Colors.backgroundElevated,
    borderRadius: BorderRadius.xxl,
    padding: Spacing.xxl,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  workoutLabel: {
    color: Colors.textPrimary,
    fontSize: FontSize.xxl,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  workoutDescription: {
    color: Colors.textSecondary,
    fontSize: FontSize.lg,
    lineHeight: 20,
    marginBottom: Spacing.xl,
  },
  workoutExercisesList: {
    color: Colors.accent,
    fontSize: FontSize.lg,
    lineHeight: 20,
    marginBottom: Spacing.xl,
    fontStyle: 'italic',
  },
  workoutMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  workoutExercises: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
  },
  workoutIntensity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  workoutIntensityLabel: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  workoutIntensityBar: {
    flexDirection: 'row',
    gap: Spacing.xxs,
    alignItems: 'center',
  },
  workoutIntensityDot: {
    width: 6,
    height: 6,
    borderRadius: BorderRadius.xs,
    backgroundColor: Colors.backgroundSubtle,
  },
  workoutIntensityDotFilled: {
    backgroundColor: Colors.accent,
  },
  workoutIntensityValue: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  modalFooter: {
    marginTop: Spacing.section,
    paddingTop: Spacing.xxl,
    borderTopWidth: 1,
    borderTopColor: Colors.borderDefault,
  },
  startProgramButton: {
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.xxl,
    padding: Spacing.xxl,
    alignItems: 'center',
  },
  startProgramButtonText: {
    color: Colors.textOnAccent,
    fontSize: FontSize.xxl,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  upgradeProgramButton: {
    backgroundColor: 'transparent',
    borderRadius: BorderRadius.xxl,
    padding: Spacing.xxl,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.accent,
  },
  upgradeProgramButtonText: {
    color: Colors.accent,
    fontSize: FontSize.xxl,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
