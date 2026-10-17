import { mockReduceMotion } from '@/jest/mockReduceMotion';
import { ProgressBar } from '@/src/components/ds/ProgressBar';
import { ProgressRing } from '@/src/components/ds/ProgressRing';
import { motion } from '@/src/constants/tokens';
import { act, render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import { withTiming } from 'react-native-reanimated';

describe('ProgressBar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockReduceMotion(false);
  });

  it('exposes a progressbar with a spoken value', async () => {
    await render(
      <ProgressBar
        progress={6 / 16}
        accessibilityLabel="Program progress"
        accessibilityValueText="6 of 16 sessions complete"
      />
    );
    await act(async () => {});

    expect(
      screen.getByRole('progressbar', { name: 'Program progress' })
    ).toHaveAccessibilityValue({
      min: 0,
      max: 100,
      now: 38,
      text: '6 of 16 sessions complete',
    });
  });

  it('animates the fill to the new value over duration.slow', async () => {
    await render(
      <ProgressBar
        progress={0.5}
        accessibilityLabel="Program progress"
        accessibilityValueText="Half complete"
      />
    );
    await act(async () => {});

    expect(withTiming).toHaveBeenCalledWith(
      0.5,
      expect.objectContaining({ duration: motion.duration.slow })
    );
  });

  it('clamps out-of-range values', async () => {
    await render(
      <ProgressBar
        progress={1.4}
        accessibilityLabel="Program progress"
        accessibilityValueText="Complete"
      />
    );
    await act(async () => {});

    expect(screen.getByRole('progressbar')).toHaveAccessibilityValue({
      now: 100,
    });
  });
});

describe('ProgressRing', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockReduceMotion(false);
  });

  it('reads the value text instead of the centred content', async () => {
    await render(
      <ProgressRing
        progress={0.25}
        size={96}
        accessibilityLabel="Rest timer"
        accessibilityValueText="45 seconds remaining"
      >
        <Text>0:45</Text>
      </ProgressRing>
    );
    await act(async () => {});

    expect(
      screen.getByRole('progressbar', { name: 'Rest timer' })
    ).toHaveAccessibilityValue({ now: 25, text: '45 seconds remaining' });
    expect(screen.queryByText('0:45')).not.toBeOnTheScreen();
  });
});
