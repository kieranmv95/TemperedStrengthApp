import { mockReduceMotion } from '@/jest/mockReduceMotion';
import { AnimatedNumber } from '@/src/components/ds/AnimatedNumber';
import { typography } from '@/src/constants/tokens';
import { act, fireEvent, render, screen } from '@testing-library/react-native';

const ROW_HEIGHT = 28;

async function renderNumber(props: Parameters<typeof AnimatedNumber>[0]) {
  const result = await render(<AnimatedNumber {...props} />);
  await act(async () => {});
  await fireEvent(
    screen.getByText('0', { includeHiddenElements: true }),
    'layout',
    { nativeEvent: { layout: { height: ROW_HEIGHT } } }
  );
  return result;
}

describe('AnimatedNumber', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockReduceMotion(false);
  });

  it('is read as one element with the formatted value', async () => {
    await renderNumber({
      value: 12340,
      format: (n) => `${n.toLocaleString('en-GB')} kg`,
      style: typography.numericMedium,
    });

    expect(screen.getByLabelText('12,340 kg')).toBeOnTheScreen();
  });

  it('accepts a custom accessible label', async () => {
    await renderNumber({
      value: 168,
      style: typography.numericSmall,
      accessibilityLabel: 'Show 168 workouts',
    });

    expect(screen.getByLabelText('Show 168 workouts')).toBeOnTheScreen();
  });

  it('keeps non-digit characters static', async () => {
    await renderNumber({
      value: 142.5,
      format: (n) => `${n} kg`,
      style: typography.numericMedium,
    });

    expect(screen.getByText('.', { includeHiddenElements: true })).toBeTruthy();
    expect(screen.getByText('k', { includeHiddenElements: true })).toBeTruthy();
  });
});
