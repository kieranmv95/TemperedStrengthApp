import { useSubscription } from '@/src/hooks/use-subscription';
import { increment } from '@/src/services/metricService';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StandardLayout } from '../components/StandardLayout';
import type { Program } from '../types/program';
import { programs } from '../utils/program';
import {
  type ProgramDaySplitKey,
  getProgramAnchorWeekdayKey,
  isProgramAnchorDate,
  nearestProgramAnchorOnOrAfter,
  normalizeToLocalMidnight,
} from '../utils/programStartWeekday';
import {
  clampStartDateToPatternAndToday,
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
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [showProgramDetails, setShowProgramDetails] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [selectedWeekdays, setSelectedWeekdays] = useState<
    ProgramDaySplitKey[]
  >([]);

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

  useEffect(() => {
    if (!showDatePicker || !selectedProgram) return;
    setStartDate(
      nearestDateOnOrAfterAllowingWeekdays(
        new Date(),
        startDatePickerAllowedWeekdays
      )
    );
  }, [showDatePicker, selectedProgram, startDatePickerAllowedWeekdays]);

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

    const today = new Date();
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
      toSave = clampStartDateToPatternAndToday(startDate, today, [
        startWeekday,
      ]);
    } else {
      const anchor = getProgramAnchorWeekdayKey(selectedProgram);
      const normalized = normalizeToLocalMidnight(startDate);
      toSave = isProgramAnchorDate(normalized, anchor)
        ? normalized
        : nearestProgramAnchorOnOrAfter(normalized, anchor);

      const todayStart = normalizeToLocalMidnight(today);
      if (toSave.getTime() < todayStart.getTime()) {
        toSave = nearestProgramAnchorOnOrAfter(todayStart, anchor);
      }
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
      <StandardLayout.Body>
        {programs.map((program) => (
          <ProgramLauncherProgramCard
            key={program.id}
            program={program}
            isLocked={program.isPro && !isPro}
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
          onChangeStartDate={setStartDate}
          selectedProgram={selectedProgram}
          startDatePickerAllowedWeekdays={startDatePickerAllowedWeekdays}
          onConfirm={handleConfirmDate}
          bottomInset={insets.bottom}
        />
      </StandardLayout.Body>
    </StandardLayout>
  );
};
