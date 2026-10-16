import { act, render, screen } from '@testing-library/react-native';
import React from 'react';
import { RestTimer } from '../components/RestTimer';

jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

describe('RestTimer', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('counts down using timestamps and triggers completion', async () => {
    const startTime = new Date('2025-01-01T00:00:00Z');
    jest.setSystemTime(startTime);

    const onComplete = jest.fn();
    await act(async () => {
      await render(
        <RestTimer
          timer={{
            dayIndex: 1,
            slotIndex: 2,
            exerciseId: 10,
            restTimeSeconds: 5,
            startedAt: startTime.getTime(),
            status: 'running',
          }}
          onDismiss={jest.fn()}
          onComplete={onComplete}
          onRestart={jest.fn()}
          onAdjust={jest.fn()}
        />
      );
    });

    expect(screen.getByText('Rest: 00:05')).toBeTruthy();

    await act(async () => {
      jest.advanceTimersByTime(4000);
    });

    expect(screen.getByText('Rest: 00:01')).toBeTruthy();
    expect(onComplete).not.toHaveBeenCalled();

    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('shows completed state when status is completed', async () => {
    await act(async () => {
      await render(
        <RestTimer
          timer={{
            dayIndex: 2,
            slotIndex: 1,
            exerciseId: 4,
            restTimeSeconds: 30,
            startedAt: Date.now(),
            status: 'completed',
            completedAt: Date.now(),
          }}
          onDismiss={jest.fn()}
          onComplete={jest.fn()}
          onRestart={jest.fn()}
          onAdjust={jest.fn()}
        />
      );
    });

    expect(screen.getByText('Rest Complete')).toBeTruthy();
    expect(screen.getByTestId('rest-timer-dismiss')).toBeTruthy();
  });
});
