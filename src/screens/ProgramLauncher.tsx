import { useSubscription } from '@/src/hooks/use-subscription';
import { useOnboardingProfile } from '@/src/hooks/useOnboardingProfile';
import { increment } from '@/src/services/metricService';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getEffectiveBottomInset } from '@/src/utils/platform';
import { FilterChip, StandardLayout } from '../components/ds';
import {
  color,
  elevation,
  radius,
  space,
  typography,
} from '../constants/tokens';
import type { Program } from '../types/program';
import { programs } from '../utils/program';
import { sortProgramsByRecommendation } from '../utils/programRecommendation';
import {
  type ProgramDaySplitKey,
  getProgramAnchorWeekdayKey,
  isProgramAnchorDate,
  nearestProgramAnchorOnOrAfter,
  normalizeToLocalMidnight,
} from '../utils/programStartWeekday';
import {
  jsDayToSplitKey,
  nearestDateOnOrAfterAllowingWeekdays,
  patternWithRequiredStartDay,
  sessionsPerWeekFromProgram,
  sortPatternByCalendarOrder,
} from '../utils/programWeekPattern';
import {
  clearProgramData,
  clearProgramWorkoutWeekdays,
  setActiveProgramId,
  setProgramStartDate,
  setProgramWorkoutWeekdays,
  setTrainingMaxes,
} from '../utils/storage';
import type { TrainingMaxesStore } from '../types/trainingMaxes';
import { TrainingMaxModal } from '../components/TrainingMaxModal';
import {
  CALENDAR_DAY_KEYS,
  sentenceCaseLabel,
  weekKeysStartingFrom,
} from './programLauncherConstants';
import { ProgramLauncherDatePickerModal } from './ProgramLauncherDatePickerModal';
import { ProgramLauncherDetailsModal } from './ProgramLauncherDetailsModal';
import { ProgramLauncherProgramCard } from './ProgramLauncherProgramCard';
import { ProgramLauncherWeekdayModal } from './ProgramLauncherWeekdayModal';

type ProgramLauncherProps = {
  onProgramSelected: () => void;
  resetExistingProgramData?: boolean;
  onClose?: () => void;
};

function programsLabel(count: number): string {
  return `${count} program${count === 1 ? '' : 's'}`;
}

type FilterRowProps = {
  title: string;
  children: React.ReactNode;
};

function FilterRow({ title, children }: FilterRowProps) {
  return (
    <View style={styles.filtersRow}>
      <Text style={styles.filtersLabel} accessibilityRole="header">
        {title}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.pillsScrollContent}
      >
        {children}
      </ScrollView>
    </View>
  );
}

export const ProgramLauncher: React.FC<ProgramLauncherProps> = ({
  onProgramSelected,
  resetExistingProgramData = false,
  onClose: _onClose,
}) => {
  const insets = useSafeAreaInsets();
  const { isPro, isLoading: subscriptionLoading } = useSubscription();
  const { profile } = useOnboardingProfile();
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [showProgramDetails, setShowProgramDetails] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showWeekdayPicker, setShowWeekdayPicker] = useState(false);
  const [showTrainingMaxModal, setShowTrainingMaxModal] = useState(false);
  const [pendingStartDate, setPendingStartDate] = useState<Date | null>(null);
  const [startDate, setStartDate] = useState(new Date());
  const [selectedWeekdays, setSelectedWeekdays] = useState<
    ProgramDaySplitKey[]
  >([]);

  type ProgramCategory = Program['categories'][number];
  type ProgramDifficulty = Program['difficulty'];
  type ProgramGoal = Program['goals'][number];

  const [selectedCategory, setSelectedCategory] = useState<
    ProgramCategory | 'all'
  >('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    ProgramDifficulty | 'all'
  >('all');
  const [selectedGoal, setSelectedGoal] = useState<ProgramGoal | 'all'>('all');

  useEffect(() => {
    if (!selectedProgram) return;
    if (selectedProgram.daysSplit?.length) {
      setSelectedWeekdays(
        sortPatternByCalendarOrder([...selectedProgram.daysSplit])
      );
    } else {
      setSelectedWeekdays([getProgramAnchorWeekdayKey(selectedProgram)]);
    }
  }, [selectedProgram]);

  const startDatePickerAllowedWeekdays = useMemo((): ProgramDaySplitKey[] => {
    if (!selectedProgram) {
      return [];
    }
    if (!selectedProgram.daysSplit?.length) {
      return [getProgramAnchorWeekdayKey(selectedProgram)];
    }
    return CALENDAR_DAY_KEYS;
  }, [selectedProgram]);

  const startWeekdayKey = useMemo(
    () => jsDayToSplitKey(normalizeToLocalMidnight(startDate).getDay()),
    [startDate]
  );

  const weekdayOrder = useMemo(
    () => weekKeysStartingFrom(startWeekdayKey),
    [startWeekdayKey]
  );

  const availableCategories = useMemo((): ProgramCategory[] => {
    const set = new Set<ProgramCategory>();
    for (const p of programs) {
      for (const c of p.categories) set.add(c);
    }

    // Keep a stable, intentional order (not runtime-dependent).
    const preferredOrder = (
      [
        'strength',
        'powerlifting',
        'bodybuilding',
        'olympic',
        'conditioning',
        'hyrox',
        'plyometrics',
        'functional',
      ] as const
    ).filter((c): c is ProgramCategory => set.has(c));

    // If any new categories are added later, append them.
    const rest = [...set].filter((c) => !preferredOrder.includes(c)).sort();
    return [...preferredOrder, ...rest];
  }, []);

  const availableDifficulties = useMemo((): ProgramDifficulty[] => {
    const set = new Set<ProgramDifficulty>();
    for (const p of programs) set.add(p.difficulty);
    const order: ProgramDifficulty[] = ['beginner', 'intermediate', 'advanced'];
    return order.filter((d) => set.has(d));
  }, []);

  const availableGoals = useMemo((): ProgramGoal[] => {
    const set = new Set<ProgramGoal>();
    for (const p of programs) {
      for (const g of p.goals) set.add(g);
    }

    // Keep a stable, intentional order (not runtime-dependent).
    const preferredOrder = (
      [
        'cutting',
        'leaner',
        'bulking',
        'hypertrophy',
        'stronger',
        'maintenance',
        'endurance',
        'athletic',
        'mobility',
      ] as const
    ).filter((g): g is ProgramGoal => set.has(g));

    const rest = [...set].filter((g) => !preferredOrder.includes(g)).sort();
    return [...preferredOrder, ...rest];
  }, []);

  const filteredPrograms = useMemo(() => {
    const filtered = programs.filter((p) => {
      if (
        selectedCategory !== 'all' &&
        !p.categories.includes(selectedCategory)
      )
        return false;
      if (selectedDifficulty !== 'all' && p.difficulty !== selectedDifficulty)
        return false;
      if (selectedGoal !== 'all' && !p.goals.includes(selectedGoal))
        return false;
      return true;
    });
    return sortProgramsByRecommendation(filtered, profile);
  }, [selectedCategory, selectedDifficulty, selectedGoal, profile]);

  const categoryCount = useMemo(() => {
    const map = new Map<ProgramCategory, number>();
    for (const p of programs) {
      if (selectedDifficulty !== 'all' && p.difficulty !== selectedDifficulty) {
        continue;
      }
      for (const c of p.categories) {
        map.set(c, (map.get(c) ?? 0) + 1);
      }
    }
    return map;
  }, [selectedDifficulty]);

  const difficultyCount = useMemo(() => {
    const map = new Map<ProgramDifficulty, number>();
    for (const p of programs) {
      if (
        selectedCategory !== 'all' &&
        !p.categories.includes(selectedCategory)
      )
        continue;
      if (selectedGoal !== 'all' && !p.goals.includes(selectedGoal)) continue;
      map.set(p.difficulty, (map.get(p.difficulty) ?? 0) + 1);
    }
    return map;
  }, [selectedCategory, selectedGoal]);

  const goalCount = useMemo(() => {
    const map = new Map<ProgramGoal, number>();
    for (const p of programs) {
      if (
        selectedCategory !== 'all' &&
        !p.categories.includes(selectedCategory)
      )
        continue;
      if (selectedDifficulty !== 'all' && p.difficulty !== selectedDifficulty)
        continue;
      for (const g of p.goals) {
        map.set(g, (map.get(g) ?? 0) + 1);
      }
    }
    return map;
  }, [selectedCategory, selectedDifficulty]);

  useEffect(() => {
    if (!showDatePicker || !selectedProgram) return;
    setStartDate(
      nearestDateOnOrAfterAllowingWeekdays(
        new Date(),
        startDatePickerAllowedWeekdays
      )
    );
  }, [showDatePicker, selectedProgram, startDatePickerAllowedWeekdays]);

  const handleChangeStartDate = (d: Date) => {
    const chosen = normalizeToLocalMidnight(d);
    const todayStart = normalizeToLocalMidnight(new Date());

    if (chosen.getTime() < todayStart.getTime()) {
      Alert.alert(
        'Start in the past?',
        'Selecting a start date in the past means your program will start part way.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Select date',
            style: 'default',
            onPress: () => setStartDate(chosen),
          },
        ]
      );
      return;
    }

    setStartDate(chosen);
  };

  const sessionsRequired = selectedProgram
    ? sessionsPerWeekFromProgram(selectedProgram)
    : 0;

  const weekdaySelectionReady =
    !selectedProgram?.daysSplit?.length ||
    (selectedWeekdays.length === sessionsRequired &&
      new Set(selectedWeekdays).size === sessionsRequired &&
      selectedWeekdays.includes(startWeekdayKey));

  const toggleWeekday = (key: ProgramDaySplitKey) => {
    if (key === startWeekdayKey) {
      return;
    }
    setSelectedWeekdays((prev) => {
      if (prev.includes(key)) {
        return prev.filter((k) => k !== key);
      }
      return [...prev, key];
    });
  };

  const handleSelectProgram = (program: Program) => {
    setSelectedProgram(program);
    setShowProgramDetails(true);
  };

  const handleStartProgram = () => {
    if (subscriptionLoading) {
      return;
    }
    if (selectedProgram?.isPro && !isPro) {
      Alert.alert(
        'Pro required',
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
              router.push('/records');
            },
          },
        ]
      );
      return;
    }

    if (resetExistingProgramData) {
      Alert.alert(
        'Change program',
        'Changing your program will lose all progress on your current program, including your workout logs and exercise swaps.\n\nFinishing a program to completion is the best approach for achieving your fitness goals.\n\nAre you sure you want to change programs?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Change program',
            style: 'destructive',
            onPress: () => {
              setShowProgramDetails(false);
              setShowDatePicker(true);
            },
          },
        ]
      );
      return;
    }

    setShowProgramDetails(false);
    setShowDatePicker(true);
  };

  const commitProgramStart = async (
    program: Program,
    toSave: Date,
    trainingMaxes?: TrainingMaxesStore
  ) => {
    if (resetExistingProgramData) {
      await clearProgramData();
    }
    await setActiveProgramId(program.id);
    await setProgramStartDate(toSave.toISOString());
    if (program.daysSplit?.length) {
      await setProgramWorkoutWeekdays(
        sortPatternByCalendarOrder(selectedWeekdays)
      );
    } else {
      await clearProgramWorkoutWeekdays();
    }
    if (trainingMaxes) {
      await setTrainingMaxes(trainingMaxes);
    }
    await increment('program_starts');
    onProgramSelected();
  };

  const handleConfirmDate = async () => {
    if (!selectedProgram) return;

    const normalized = normalizeToLocalMidnight(startDate);

    if (selectedProgram.daysSplit?.length) {
      const startKey = jsDayToSplitKey(normalized.getDay());
      setStartDate(normalized);
      setSelectedWeekdays(
        patternWithRequiredStartDay(
          selectedProgram.daysSplit,
          startKey,
          sessionsRequired
        )
      );
      setShowDatePicker(false);
      setShowWeekdayPicker(true);
      return;
    }

    const anchor = getProgramAnchorWeekdayKey(selectedProgram);
    const toSave = isProgramAnchorDate(normalized, anchor)
      ? normalized
      : nearestProgramAnchorOnOrAfter(normalized, anchor);

    // Programs that require training maxes gather them before committing, so a
    // program is never left active without the values its loading depends on.
    if (selectedProgram.requireRmId?.length) {
      setPendingStartDate(toSave);
      setShowDatePicker(false);
      setShowTrainingMaxModal(true);
      return;
    }

    try {
      await commitProgramStart(selectedProgram, toSave);
      setShowDatePicker(false);
    } catch (error) {
      console.error('Error saving program selection:', error);
    }
  };

  const handleConfirmWeekdays = async () => {
    if (!selectedProgram?.daysSplit?.length) return;

    const sortedPattern = sortPatternByCalendarOrder(selectedWeekdays);
    if (
      sortedPattern.length !== sessionsRequired ||
      new Set(sortedPattern).size !== sessionsRequired ||
      !sortedPattern.includes(startWeekdayKey)
    ) {
      return;
    }

    const toSave = normalizeToLocalMidnight(startDate);

    if (selectedProgram.requireRmId?.length) {
      setPendingStartDate(toSave);
      setShowWeekdayPicker(false);
      setShowTrainingMaxModal(true);
      return;
    }

    try {
      await commitProgramStart(selectedProgram, toSave);
      setShowWeekdayPicker(false);
    } catch (error) {
      console.error('Error saving program selection:', error);
    }
  };

  const handleConfirmTrainingMaxes = async (values: TrainingMaxesStore) => {
    if (!selectedProgram || !pendingStartDate) return;
    try {
      await commitProgramStart(selectedProgram, pendingStartDate, values);
      setShowTrainingMaxModal(false);
      setPendingStartDate(null);
    } catch (error) {
      console.error('Error saving training maxes at program start:', error);
    }
  };

  const allCategoriesCount =
    selectedDifficulty === 'all'
      ? programs.length
      : programs.filter((p) => p.difficulty === selectedDifficulty).length;
  const allDifficultiesCount =
    selectedCategory === 'all'
      ? programs.length
      : programs.filter((p) => p.categories.includes(selectedCategory)).length;
  const allGoalsCount =
    selectedCategory === 'all' && selectedDifficulty === 'all'
      ? programs.length
      : programs.filter((p) => {
          if (
            selectedCategory !== 'all' &&
            !p.categories.includes(selectedCategory)
          )
            return false;
          if (
            selectedDifficulty !== 'all' &&
            p.difficulty !== selectedDifficulty
          )
            return false;
          return true;
        }).length;

  return (
    <StandardLayout
      title="Programs"
      subtitle="Choose your training program to get started"
    >
      <StandardLayout.AdvancedFilters>
        <View style={styles.filtersWrap}>
          <FilterRow title="Category">
            <FilterChip
              label="All"
              selected={selectedCategory === 'all'}
              onPress={() => setSelectedCategory('all')}
              count={allCategoriesCount}
              accessibilityLabel={`All categories, ${programsLabel(allCategoriesCount)}`}
            />
            {availableCategories.map((category) => {
              const count = categoryCount.get(category) ?? 0;
              const label = sentenceCaseLabel(category);
              return (
                <FilterChip
                  key={category}
                  label={label}
                  selected={selectedCategory === category}
                  onPress={() => setSelectedCategory(category)}
                  count={count}
                  accessibilityLabel={`${label}, ${programsLabel(count)}`}
                />
              );
            })}
          </FilterRow>

          <FilterRow title="Difficulty">
            <FilterChip
              label="All"
              selected={selectedDifficulty === 'all'}
              onPress={() => setSelectedDifficulty('all')}
              count={allDifficultiesCount}
              accessibilityLabel={`All difficulties, ${programsLabel(allDifficultiesCount)}`}
            />
            {availableDifficulties.map((difficulty) => {
              const count = difficultyCount.get(difficulty) ?? 0;
              const label = sentenceCaseLabel(difficulty);
              return (
                <FilterChip
                  key={difficulty}
                  label={label}
                  selected={selectedDifficulty === difficulty}
                  onPress={() => setSelectedDifficulty(difficulty)}
                  count={count}
                  accessibilityLabel={`${label}, ${programsLabel(count)}`}
                />
              );
            })}
          </FilterRow>

          <FilterRow title="Goals">
            <FilterChip
              label="All"
              selected={selectedGoal === 'all'}
              onPress={() => setSelectedGoal('all')}
              count={allGoalsCount}
              accessibilityLabel={`All goals, ${programsLabel(allGoalsCount)}`}
            />
            {availableGoals.map((goal) => {
              const count = goalCount.get(goal) ?? 0;
              const label = sentenceCaseLabel(goal);
              return (
                <FilterChip
                  key={goal}
                  label={label}
                  selected={selectedGoal === goal}
                  onPress={() => setSelectedGoal(goal)}
                  count={count}
                  accessibilityLabel={`${label}, ${programsLabel(count)}`}
                />
              );
            })}
          </FilterRow>
        </View>
      </StandardLayout.AdvancedFilters>
      <StandardLayout.Body>
        <View style={styles.programList}>
          <View style={styles.infoStrip} accessible>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color={color.textSecondary}
            />
            <Text style={styles.infoText}>
              Programs are structured training blocks (1–4 months). You’ll
              follow one at a time, with full access to all workouts throughout.
            </Text>
          </View>
          {filteredPrograms.map(({ program, isRecommended }) => (
            <ProgramLauncherProgramCard
              key={program.id}
              program={program}
              isLocked={program.isPro && !subscriptionLoading && !isPro}
              isRecommended={isRecommended}
              onSelect={handleSelectProgram}
            />
          ))}
        </View>

        <ProgramLauncherDetailsModal
          visible={showProgramDetails}
          onClose={() => setShowProgramDetails(false)}
          selectedProgram={selectedProgram}
          isPro={subscriptionLoading || isPro}
          onStartProgram={handleStartProgram}
          onUpgradePress={() => {
            setShowProgramDetails(false);
            router.push('/records');
          }}
          bottomInset={getEffectiveBottomInset(insets.bottom)}
        />

        <ProgramLauncherDatePickerModal
          visible={showDatePicker}
          onClose={() => setShowDatePicker(false)}
          startDate={startDate}
          onChangeStartDate={handleChangeStartDate}
          selectedProgram={selectedProgram}
          startDatePickerAllowedWeekdays={startDatePickerAllowedWeekdays}
          confirmLabel={selectedProgram?.daysSplit?.length ? 'Next' : 'Confirm'}
          onConfirm={handleConfirmDate}
          bottomInset={getEffectiveBottomInset(insets.bottom)}
        />

        <ProgramLauncherWeekdayModal
          visible={showWeekdayPicker}
          onClose={() => setShowWeekdayPicker(false)}
          onBack={() => {
            setShowWeekdayPicker(false);
            setShowDatePicker(true);
          }}
          sessionsRequired={sessionsRequired}
          selectedWeekdays={selectedWeekdays}
          weekdayOrder={weekdayOrder}
          lockedWeekday={startWeekdayKey}
          weekdaySelectionReady={weekdaySelectionReady}
          onToggleWeekday={toggleWeekday}
          onConfirm={handleConfirmWeekdays}
          bottomInset={getEffectiveBottomInset(insets.bottom)}
        />

        {selectedProgram?.requireRmId?.length ? (
          <TrainingMaxModal
            visible={showTrainingMaxModal}
            exerciseIds={selectedProgram.requireRmId}
            mode="start"
            onClose={() => {
              setShowTrainingMaxModal(false);
              setPendingStartDate(null);
            }}
            onConfirm={handleConfirmTrainingMaxes}
            bottomInset={getEffectiveBottomInset(insets.bottom)}
          />
        ) : null}
      </StandardLayout.Body>
    </StandardLayout>
  );
};

const styles = StyleSheet.create({
  filtersWrap: {
    marginTop: space.xs,
    gap: space.sm,
  },
  filtersRow: {
    gap: space.xxs,
  },
  filtersLabel: {
    ...typography.captionStrong,
    color: color.textSecondary,
  },
  pillsScrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    paddingVertical: space.xxs,
    paddingRight: space.md,
  },
  programList: {
    gap: space.sm,
  },
  infoStrip: {
    ...elevation.raised,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space.xs,
    padding: space.md,
    borderRadius: radius.md,
    backgroundColor: color.surface1,
  },
  infoText: {
    ...typography.callout,
    color: color.textSecondary,
    flex: 1,
  },
});
