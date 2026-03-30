import { StandaloneWorkoutLogPanel } from '@/src/components/StandaloneWorkoutLogPanel';
import type { SingleWorkout } from '@/src/types/workouts';
import {
  deleteStandaloneWorkoutLogEntry,
  getStandaloneWorkoutLogsForWorkout,
  upsertStandaloneWorkoutLogEntry,
} from '@/src/utils/storage';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Alert } from 'react-native';

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  return { Ionicons: () => React.createElement(React.Fragment) };
});

jest.mock('@react-native-community/datetimepicker', () => 'DateTimePicker');

jest.mock('@/src/utils/storage', () => ({
  getStandaloneWorkoutLogsForWorkout: jest.fn(),
  upsertStandaloneWorkoutLogEntry: jest.fn(),
  deleteStandaloneWorkoutLogEntry: jest.fn(),
}));

const mockGet = getStandaloneWorkoutLogsForWorkout as jest.MockedFunction<
  typeof getStandaloneWorkoutLogsForWorkout
>;
const mockUpsert = upsertStandaloneWorkoutLogEntry as jest.MockedFunction<
  typeof upsertStandaloneWorkoutLogEntry
>;

const sampleWorkout: SingleWorkout = {
  id: 'f_test_panel',
  title: 'Test workout',
  description: 'Desc',
  category: 'WOD',
  difficulty: 'Beginner',
  estimatedTime: 15,
  tags: [],
  isPremium: false,
  logSchema: { kind: 'notes_only', placeholder: 'Notes' },
  blocks: [{ name: 'Main', movements: ['Move'] }],
};

describe('StandaloneWorkoutLogPanel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGet.mockResolvedValue([]);
  });

  it('loads logs for the workout id and shows empty state', async () => {
    const { getByText } = render(
      <StandaloneWorkoutLogPanel workout={sampleWorkout} />
    );

    await waitFor(() => {
      expect(mockGet).toHaveBeenCalledWith('f_test_panel');
    });

    expect(
      getByText('No logs yet. Use the button above to add one.')
    ).toBeTruthy();
    expect(getByText('Log result')).toBeTruthy();
  });

  it('opens the log modal when Log result is pressed', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

    const { getByText } = render(
      <StandaloneWorkoutLogPanel workout={sampleWorkout} />
    );

    await waitFor(() => expect(mockGet).toHaveBeenCalled());

    fireEvent.press(getByText('Log result'));

    await waitFor(() => {
      expect(getByText('When you did this')).toBeTruthy();
    });

    alertSpy.mockRestore();
  });

  it('calls upsert when saving a valid notes-only log', async () => {
    mockUpsert.mockResolvedValue(undefined);

    const { getByText, getByPlaceholderText } = render(
      <StandaloneWorkoutLogPanel workout={sampleWorkout} />
    );

    await waitFor(() => expect(mockGet).toHaveBeenCalled());

    fireEvent.press(getByText('Log result'));

    await waitFor(() => expect(getByText('Notes')).toBeTruthy());

    const notesField = getByPlaceholderText('Notes');
    fireEvent.changeText(notesField, 'Session felt solid');

    fireEvent.press(getByText('Save'));

    await waitFor(() => {
      expect(mockUpsert).toHaveBeenCalled();
    });

    const call = mockUpsert.mock.calls[0][0];
    expect(call.workoutId).toBe('f_test_panel');
    expect(call.payload).toEqual({
      kind: 'notes_only',
      text: 'Session felt solid',
    });
  });
});
