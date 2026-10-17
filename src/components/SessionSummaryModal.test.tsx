import { mockReduceMotion } from '@/jest/mockReduceMotion';
import { SessionSummaryModal } from '@/src/components/SessionSummaryModal';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { withTiming } from 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const SAFE_AREA_METRICS = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

async function renderSummary(onDismiss = jest.fn()) {
  await render(
    <GestureHandlerRootView>
      <SafeAreaProvider initialMetrics={SAFE_AREA_METRICS}>
        <SessionSummaryModal
          visible
          duration={(45 * 60 + 12) * 1000}
          totalVolume={12340}
          setsCompleted={18}
          weightUnit="kg"
          onDismiss={onDismiss}
        />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
  await act(async () => {});
  return { onDismiss };
}

describe('SessionSummaryModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('reads each stat with its value and dismisses from Done', async () => {
    mockReduceMotion(false);
    const { onDismiss } = await renderSummary();

    expect(
      screen.getByRole('header', { name: 'Session complete' })
    ).toBeOnTheScreen();
    expect(screen.getByLabelText('Duration, 45m 12s')).toBeOnTheScreen();
    expect(screen.getByLabelText('Sets completed, 18')).toBeOnTheScreen();

    await fireEvent.press(screen.getByRole('button', { name: 'Done' }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('plays the celebration burst once over duration.celebrate', async () => {
    mockReduceMotion(false);
    await renderSummary();

    expect(withTiming).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ duration: 700 })
    );
  });

  it('skips the burst under Reduce Motion', async () => {
    mockReduceMotion(true);
    await renderSummary();

    expect(withTiming).not.toHaveBeenCalledWith(
      1,
      expect.objectContaining({ duration: 700 })
    );
  });
});
