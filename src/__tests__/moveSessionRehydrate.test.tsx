import AsyncStorage from '@react-native-async-storage/async-storage';
import { render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';
import { useWorkoutScreenController } from '../hooks/useWorkoutScreenController';

jest.mock('../hooks/useTimerNotification', () => ({
  useTimerNotification: () => ({
    scheduleTimerNotification: jest.fn(),
    cancelTimerNotification: jest.fn(),
  }),
}));

jest.mock('../hooks/useWeightUnit', () => ({
  useWeightUnit: () => ({ unit: 'kg' }),
}));

jest.mock('posthog-react-native', () => ({
  usePostHog: () => ({ capture: jest.fn() }),
}));

jest.mock('@react-navigation/native', () => ({
  useFocusEffect: (cb: () => void) => {
    cb();
  },
}));

function mockThreeDayMiniProgram() {
  return {
    id: 'mini',
    name: 'Mini',
    description: '',
    isPro: false,
    categories: ['strength'],
    difficulty: 'beginner',
    goals: ['stronger'],
    daysSplit: ['mon', 'wed', 'fri'],
    workouts: [
      {
        dayIndex: 0,
        label: 'Push',
        description: '',
        intensity: 5,
        exercises: [],
      },
      {
        dayIndex: 2,
        label: 'Pull',
        description: '',
        intensity: 5,
        exercises: [],
      },
      {
        dayIndex: 4,
        label: 'Legs',
        description: '',
        intensity: 5,
        exercises: [],
      },
    ],
  };
}

jest.mock('../utils/program', () => ({
  getProgramById: (id: string) =>
    id === 'mini' ? mockThreeDayMiniProgram() : undefined,
}));

function Harness() {
  const c = useWorkoutScreenController();
  if (c.loading) return <Text>loading</Text>;
  if (c.isRestDay) return <Text>Rest Day</Text>;
  return <Text>{c.currentWorkout?.label ?? 'no-workout'}</Text>;
}

describe('useWorkoutScreenController (session shifts rehydrate)', () => {
  beforeEach(async () => {
    jest.useFakeTimers();
    await AsyncStorage.clear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('shows a moved session immediately after restart (no extra day tap)', async () => {
    // Program start Tuesday 2 Jan 2024; "today" is Wednesday 3 Jan 2024 (dayDelta = 1).
    // Wednesday is normally a rest day for Tue/Thu/Sat pattern, but we shift Pull (dayDelta 2)
    // into dayDelta 1.
    const startTue = new Date('2024-01-02T00:00:00.000Z');
    const todayWed = new Date('2024-01-03T12:00:00.000Z');
    jest.setSystemTime(todayWed);

    await AsyncStorage.setItem('active_program', 'mini');
    await AsyncStorage.setItem('program_start_date', startTue.toISOString());
    await AsyncStorage.setItem(
      'program_workout_weekdays',
      JSON.stringify(['tue', 'thu', 'sat'])
    );
    await AsyncStorage.setItem(
      'program_session_shifts',
      JSON.stringify({
        0: [
          {
            weekIndex: 0,
            fromDayIndex: 2,
            toDayIndex: 1,
            movedAt: 1,
          },
        ],
      })
    );
    await AsyncStorage.setItem('program_warmup_module_enabled', 'false');
    await AsyncStorage.setItem('program_cooldown_module_enabled', 'false');

    const { getByText } = render(<Harness />);

    await waitFor(() => {
      expect(getByText('Pull')).toBeTruthy();
    });
  });
});

