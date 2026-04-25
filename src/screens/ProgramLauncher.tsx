import { useOnboardingProfile } from '@/src/hooks/useOnboardingProfile';
import { useSubscription } from '@/src/hooks/use-subscription';
import { increment } from '@/src/services/metricService';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Pill } from '../components/pill';
import { StandardLayout } from '../components/StandardLayout';
import { Colors, FontSize, Spacing } from '../constants/theme';
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
  firstSessionWeekdayForPattern,
  nearestDateOnOrAfterAllowingWeekdays,
  sessionsPerWeekFromProgram,
  sortPatternByCalendarOrder,
} from '../utils/programWeekPattern';
import {
  clearProgramData,
  clearProgramWorkoutWeekdays,
  setActiveProgramId,
  setProgramStartDate,
  setProgramWorkoutWeekdays,
} from '../utils/storage';
import { ProgramLauncherDatePickerModal } from './ProgramLauncherDatePickerModal';
import { ProgramLauncherDetailsModal } from './ProgramLauncherDetailsModal';
import { ProgramLauncherProgramCard } from './ProgramLauncherProgramCard';

type ProgramLauncherProps = {
  onProgramSelected: () => void;
  resetExistingProgramData?: boolean;
  onClose?: () => void;
};

export const ProgramLauncher: React.FC<ProgramLauncherProps> = ({
  onProgramSelected,
  resetExistingProgramData = false,
  onClose: _onClose,
}) => {
  const insets = useSafeAreaInsets();
  const { isPro } = useSubscription();
  const { profile } = useOnboardingProfile();
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [showProgramDetails, setShowProgramDetails] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
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
    if (selectedWeekdays.length === 0) {
      return [getProgramAnchorWeekdayKey(selectedProgram)];
    }
    return [firstSessionWeekdayForPattern(selectedWeekdays)];
  }, [selectedProgram, selectedWeekdays]);

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
    const order: ProgramDifficulty[] = [
      'beginner',
      'intermediate',
      'advanced',
    ];
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
      if (selectedCategory !== 'all' && !p.categories.includes(selectedCategory))
        return false;
      if (selectedDifficulty !== 'all' && p.difficulty !== selectedDifficulty)
        return false;
      if (selectedGoal !== 'all' && !p.goals.includes(selectedGoal)) return false;
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
      if (selectedCategory !== 'all' && !p.categories.includes(selectedCategory))
        continue;
      if (selectedGoal !== 'all' && !p.goals.includes(selectedGoal)) continue;
      map.set(p.difficulty, (map.get(p.difficulty) ?? 0) + 1);
    }
    return map;
  }, [selectedCategory, selectedGoal]);

  const goalCount = useMemo(() => {
    const map = new Map<ProgramGoal, number>();
    for (const p of programs) {
      if (selectedCategory !== 'all' && !p.categories.includes(selectedCategory))
        continue;
      if (selectedDifficulty !== 'all' && p.difficulty !== selectedDifficulty)
        continue;
      for (const g of p.goals) {
        map.set(g, (map.get(g) ?? 0) + 1);
      }
    }
    return map;
  }, [selectedCategory, selectedDifficulty]);

  const titleCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

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
            text: 'Select Date',
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
      new Set(selectedWeekdays).size === sessionsRequired);

  const startBlockedByWeekdays =
    !!selectedProgram?.daysSplit?.length && !weekdaySelectionReady;

  const toggleWeekday = (key: ProgramDaySplitKey) => {
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
              router.push('/settings');
            },
          },
        ]
      );
      return;
    }

    if (resetExistingProgramData) {
      Alert.alert(
        'Change Program',
        'Changing your program will lose all progress on your current program, including your workout logs and exercise swaps.\n\nFinishing a program to completion is the best approach for achieving your fitness goals.\n\nAre you sure you want to change programs?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Change Program',
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

  const handleConfirmDate = async () => {
    if (!selectedProgram) return;

    let toSave: Date;

    if (selectedProgram.daysSplit?.length) {
      const sortedPattern = sortPatternByCalendarOrder(selectedWeekdays);
      if (
        sortedPattern.length !== sessionsRequired ||
        new Set(sortedPattern).size !== sessionsRequired
      ) {
        return;
      }
      const startWeekday = firstSessionWeekdayForPattern(sortedPattern);
      const normalized = normalizeToLocalMidnight(startDate);
      toSave = nearestDateOnOrAfterAllowingWeekdays(normalized, [startWeekday]);
    } else {
      const anchor = getProgramAnchorWeekdayKey(selectedProgram);
      const normalized = normalizeToLocalMidnight(startDate);
      toSave = isProgramAnchorDate(normalized, anchor)
        ? normalized
        : nearestProgramAnchorOnOrAfter(normalized, anchor);
    }

    try {
      if (resetExistingProgramData) {
        await clearProgramData();
      }
      await setActiveProgramId(selectedProgram.id);
      await setProgramStartDate(toSave.toISOString());
      if (selectedProgram.daysSplit?.length) {
        await setProgramWorkoutWeekdays(
          sortPatternByCalendarOrder(selectedWeekdays)
        );
      } else {
        await clearProgramWorkoutWeekdays();
      }
      await increment('program_starts');
      setShowDatePicker(false);
      onProgramSelected();
    } catch (error) {
      console.error('Error saving program selection:', error);
    }
  };

  return (
    <StandardLayout
      title="Programs"
      subtitle="Choose your training program to get started"
    >
      <StandardLayout.AdvancedFilters>
        <View style={styles.filtersWrap}>
          <View style={styles.filtersRow}>
            <Text style={styles.filtersLabel}>Category</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.pillsScrollContent}
            >
              <Pill
                label="All"
                isActive={selectedCategory === 'all'}
                onPress={() => setSelectedCategory('all')}
                count={
                  selectedDifficulty === 'all'
                    ? programs.length
                    : programs.filter((p) => p.difficulty === selectedDifficulty)
                      .length
                }
              />
              {availableCategories.map((category) => {
                const count = categoryCount.get(category) ?? 0;
                return (
                  <Pill
                    key={category}
                    label={category}
                    isActive={selectedCategory === category}
                    onPress={() => setSelectedCategory(category)}
                    count={count}
                  />
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.filtersRow}>
            <Text style={styles.filtersLabel}>Difficulty</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.pillsScrollContent}
            >
              <Pill
                label="All"
                isActive={selectedDifficulty === 'all'}
                onPress={() => setSelectedDifficulty('all')}
                count={
                  selectedCategory === 'all'
                    ? programs.length
                    : programs.filter((p) =>
                      p.categories.includes(selectedCategory)
                    ).length
                }
              />
              {availableDifficulties.map((difficulty) => (
                <Pill
                  key={difficulty}
                  label={titleCase(difficulty)}
                  isActive={selectedDifficulty === difficulty}
                  onPress={() => setSelectedDifficulty(difficulty)}
                  count={difficultyCount.get(difficulty) ?? 0}
                />
              ))}
            </ScrollView>
          </View>

          <View style={styles.filtersRow}>
            <Text style={styles.filtersLabel}>Goals</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.pillsScrollContent}
            >
              <Pill
                label="All"
                isActive={selectedGoal === 'all'}
                onPress={() => setSelectedGoal('all')}
                count={
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
                    }).length
                }
              />
              {availableGoals.map((goal) => {
                const count = goalCount.get(goal) ?? 0;
                return (
                  <Pill
                    key={goal}
                    label={titleCase(goal)}
                    isActive={selectedGoal === goal}
                    onPress={() => setSelectedGoal(goal)}
                    count={count}
                  />
                );
              })}
            </ScrollView>
          </View>
        </View>
      </StandardLayout.AdvancedFilters>
      <StandardLayout.Body>
        {filteredPrograms.map(({ program, isRecommended }) => (
          <ProgramLauncherProgramCard
            key={program.id}
            program={program}
            isLocked={program.isPro && !isPro}
            isRecommended={isRecommended}
            onSelect={handleSelectProgram}
          />
        ))}

        <ProgramLauncherDetailsModal
          visible={showProgramDetails}
          onClose={() => setShowProgramDetails(false)}
          selectedProgram={selectedProgram}
          isPro={isPro}
          selectedWeekdays={selectedWeekdays}
          onToggleWeekday={toggleWeekday}
          sessionsRequired={sessionsRequired}
          weekdaySelectionReady={weekdaySelectionReady}
          startBlockedByWeekdays={startBlockedByWeekdays}
          onStartProgram={handleStartProgram}
          onUpgradePress={() => {
            setShowProgramDetails(false);
            router.push('/settings');
          }}
          bottomInset={insets.bottom}
        />

        <ProgramLauncherDatePickerModal
          visible={showDatePicker}
          onClose={() => setShowDatePicker(false)}
          startDate={startDate}
          onChangeStartDate={handleChangeStartDate}
          selectedProgram={selectedProgram}
          startDatePickerAllowedWeekdays={startDatePickerAllowedWeekdays}
          onConfirm={handleConfirmDate}
          bottomInset={insets.bottom}
        />
      </StandardLayout.Body>
    </StandardLayout>
  );
};

const styles = StyleSheet.create({
  filtersWrap: {
    marginTop: Spacing.xxl,
    gap: Spacing.xl,
  },
  filtersRow: {
    gap: Spacing.md,
  },
  filtersLabel: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  pillsScrollContent: {
    paddingRight: Spacing.xxl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  pillsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
});
