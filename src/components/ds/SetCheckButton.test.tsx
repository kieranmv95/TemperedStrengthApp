import { mockReduceMotion } from '@/jest/mockReduceMotion';
import {
  SetCheckButton,
  type SetCheckState,
} from '@/src/components/ds/SetCheckButton';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import * as Haptics from 'expo-haptics';

function renderButton(state: SetCheckState, onPress = jest.fn()) {
  return (
    <SetCheckButton
      state={state}
      onPress={onPress}
      accessibilityLabel="Set 2"
      disabledHint="Enter reps to log this set"
    />
  );
}

describe('SetCheckButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockReduceMotion(false);
  });

  it('is an unchecked checkbox until logged', async () => {
    const onPress = jest.fn();
    await render(renderButton('pending', onPress));
    await act(async () => {});

    const checkbox = screen.getByRole('checkbox', {
      name: 'Set 2, not logged',
    });
    expect(checkbox).not.toBeChecked();
    await fireEvent.press(checkbox);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('gives a success haptic only when the set becomes completed', async () => {
    const { rerender } = await render(renderButton('pending'));
    await act(async () => {});
    expect(Haptics.notificationAsync).not.toHaveBeenCalled();

    await rerender(renderButton('completed'));

    expect(
      screen.getByRole('checkbox', { name: 'Set 2, completed' })
    ).toBeChecked();
    expect(Haptics.notificationAsync).toHaveBeenCalledWith(
      Haptics.NotificationFeedbackType.Success
    );
  });

  it('does not buzz for sets that were already logged', async () => {
    await render(renderButton('completed'));
    await act(async () => {});

    expect(Haptics.notificationAsync).not.toHaveBeenCalled();
  });

  it('describes a failed set in text, not just colour', async () => {
    await render(renderButton('failed'));
    await act(async () => {});

    expect(
      screen.getByRole('checkbox', { name: 'Set 2, failed' })
    ).not.toBeChecked();
  });

  it('explains why it is disabled', async () => {
    await render(
      <SetCheckButton
        state="pending"
        onPress={jest.fn()}
        accessibilityLabel="Set 2"
        disabled
        disabledHint="Enter reps to log this set"
      />
    );
    await act(async () => {});

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeDisabled();
    expect(checkbox).toHaveProp(
      'accessibilityHint',
      'Enter reps to log this set'
    );
  });
});
