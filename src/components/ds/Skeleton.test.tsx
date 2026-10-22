import { mockReduceMotion } from '@/jest/mockReduceMotion';
import { Skeleton } from '@/src/components/ds/Skeleton';
import { act, render, screen } from '@testing-library/react-native';
import { withRepeat } from 'react-native-reanimated';

describe('Skeleton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('is hidden from assistive tech by default', async () => {
    mockReduceMotion(false);
    await render(<Skeleton width={120} height={16} />);
    await act(async () => {});

    expect(screen.queryByLabelText(/loading/i)).not.toBeOnTheScreen();
  });

  it('announces one busy element when labelled', async () => {
    mockReduceMotion(false);
    await render(
      <Skeleton
        width="100%"
        height={96}
        accessibilityLabel="Loading workouts"
      />
    );
    await act(async () => {});

    expect(screen.getByLabelText('Loading workouts')).toBeBusy();
  });

  it('pulses while motion is allowed', async () => {
    mockReduceMotion(false);
    await render(<Skeleton width={120} height={16} />);
    await act(async () => {});

    expect(withRepeat).toHaveBeenCalled();
  });

  it('shows a static tint under Reduce Motion', async () => {
    mockReduceMotion(true);
    await render(<Skeleton width={120} height={16} />);
    await act(async () => {});

    expect(withRepeat).not.toHaveBeenCalled();
  });
});
