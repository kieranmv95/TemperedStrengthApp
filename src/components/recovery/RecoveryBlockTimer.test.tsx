import { RecoveryBlockTimer } from '@/src/components/recovery/RecoveryBlockTimer';
import {
  gymTimerHapticPhaseChange,
  playGymTimerBeep,
} from '@/src/services/gymTimerFeedback';
import type { RecoveryDose } from '@/src/types/recovery';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';

jest.mock('@/src/services/gymTimerFeedback', () => ({
  playGymTimerBeep: jest.fn(() => Promise.resolve()),
  gymTimerHapticPhaseChange: jest.fn(() => Promise.resolve()),
}));

const durationDose: RecoveryDose = { kind: 'duration', seconds: 1 };
const bilateralDose: RecoveryDose = {
  kind: 'duration_bilateral',
  secondsPerSide: 1,
};

describe('RecoveryBlockTimer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-01-01T00:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('keeps the screen awake only while the countdown is running', async () => {
    await render(<RecoveryBlockTimer dose={durationDose} />);

    expect(activateKeepAwakeAsync).not.toHaveBeenCalled();

    await fireEvent.press(screen.getByRole('button', { name: 'Start timer' }));

    expect(activateKeepAwakeAsync).toHaveBeenCalledWith('recovery-timer');
    expect(
      screen.getByRole('button', { name: 'Stop timer' })
    ).toBeOnTheScreen();

    await fireEvent.press(screen.getByRole('button', { name: 'Stop timer' }));

    expect(deactivateKeepAwake).toHaveBeenCalledWith('recovery-timer');
    expect(
      screen.getByRole('button', { name: 'Start timer' })
    ).toBeOnTheScreen();
  });

  it('releases the screen and plays the finish tone when time is up', async () => {
    await render(<RecoveryBlockTimer dose={durationDose} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Start timer' }));

    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    expect(screen.getByText("Time's up")).toBeOnTheScreen();
    expect(playGymTimerBeep).toHaveBeenCalledWith('finish', false);
    expect(gymTimerHapticPhaseChange).toHaveBeenCalledTimes(1);
    expect(deactivateKeepAwake).toHaveBeenCalledWith('recovery-timer');
  });

  it('cues the next side, then the finish tone, for a bilateral hold', async () => {
    await render(<RecoveryBlockTimer dose={bilateralDose} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Start timer' }));

    expect(screen.getByText('Left')).toBeOnTheScreen();

    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    expect(screen.getByText('Right')).toBeOnTheScreen();
    expect(playGymTimerBeep).toHaveBeenCalledWith('work', false);
    expect(deactivateKeepAwake).not.toHaveBeenCalled();

    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    expect(screen.getByText("Time's up")).toBeOnTheScreen();
    expect(playGymTimerBeep).toHaveBeenCalledWith('finish', false);
    expect(deactivateKeepAwake).toHaveBeenCalledWith('recovery-timer');
  });

  it('releases the screen when the timer unmounts mid-countdown', async () => {
    const view = await render(<RecoveryBlockTimer dose={durationDose} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Start timer' }));

    await act(async () => {
      view.unmount();
    });

    expect(deactivateKeepAwake).toHaveBeenCalledWith('recovery-timer');
  });
});
