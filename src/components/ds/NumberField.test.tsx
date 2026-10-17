import { NumberField } from '@/src/components/ds/NumberField';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import * as Haptics from 'expo-haptics';

type Props = Parameters<typeof NumberField>[0];

async function renderField(props: Partial<Props> = {}) {
  const onChangeText = jest.fn();
  await render(
    <NumberField
      label="Weight (kg)"
      accessibilityContext="Set 2"
      value=""
      onChangeText={onChangeText}
      placeholder="kg"
      allowDecimal
      showSteppers
      step={2.5}
      {...props}
    />
  );
  return { onChangeText };
}

describe('NumberField', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('labels the input for screen readers with set context', async () => {
    await renderField();

    const input = screen.getByLabelText('Set 2 Weight (kg)');
    expect(input).toHaveProp('keyboardType', 'decimal-pad');
    expect(
      screen.getByRole('button', { name: 'Increase Set 2 Weight (kg)' })
    ).toBeOnTheScreen();
  });

  it('shows a unit placeholder rather than a fake zero', async () => {
    await renderField();

    expect(screen.getByLabelText('Set 2 Weight (kg)')).toHaveProp(
      'placeholder',
      'kg'
    );
    expect(screen.getByLabelText('Set 2 Weight (kg)')).toHaveProp('value', '');
  });

  it('steps from the suggested value when empty, with a haptic tick', async () => {
    const { onChangeText } = await renderField({ suggestedValue: 110 });

    await fireEvent.press(
      screen.getByRole('button', { name: 'Increase Set 2 Weight (kg)' })
    );

    expect(onChangeText).toHaveBeenCalledWith('112.5');
    expect(Haptics.selectionAsync).toHaveBeenCalledTimes(1);
  });

  it('disables decrease at the minimum', async () => {
    await renderField({ value: '0' });

    expect(
      screen.getByRole('button', { name: 'Decrease Set 2 Weight (kg)' })
    ).toBeDisabled();
  });

  it('repeats while a stepper is long-pressed', async () => {
    jest.useFakeTimers();
    const { onChangeText } = await renderField({ value: '100' });
    const increase = screen.getByRole('button', {
      name: 'Increase Set 2 Weight (kg)',
    });

    await fireEvent(increase, 'longPress');
    await act(async () => {
      jest.advanceTimersByTime(200);
    });
    await fireEvent(increase, 'pressOut');
    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    expect(onChangeText.mock.calls.map(([value]) => value)).toEqual([
      '102.5',
      '105',
      '107.5',
    ]);
    jest.useRealTimers();
  });

  it('strips non-numeric input and accepts a comma decimal', async () => {
    const { onChangeText } = await renderField();

    await fireEvent.changeText(
      screen.getByLabelText('Set 2 Weight (kg)'),
      '82,5kg'
    );

    expect(onChangeText).toHaveBeenCalledWith('82.5');
  });

  it('describes validation errors in text', async () => {
    await renderField({ error: 'Enter a weight of 500 kg or less' });

    expect(
      screen.getByText('Enter a weight of 500 kg or less')
    ).toBeOnTheScreen();
    expect(screen.getByLabelText('Set 2 Weight (kg)')).toHaveProp(
      'accessibilityHint',
      'Enter a weight of 500 kg or less'
    );
  });
});
