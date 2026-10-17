import { mockReduceMotion } from '@/jest/mockReduceMotion';
import {
  ToastProvider,
  useToast,
  type ToastOptions,
} from '@/src/hooks/toast-context';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { AccessibilityInfo, Pressable, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const SAFE_AREA_METRICS = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

function Trigger({ options }: { options: ToastOptions }) {
  const { showToast } = useToast();
  return (
    <Pressable onPress={() => showToast(options)} accessibilityRole="button">
      <Text>Trigger</Text>
    </Pressable>
  );
}

async function renderWithToast(options: ToastOptions) {
  await render(
    <SafeAreaProvider initialMetrics={SAFE_AREA_METRICS}>
      <ToastProvider>
        <Trigger options={options} />
      </ToastProvider>
    </SafeAreaProvider>
  );
  await fireEvent.press(screen.getByText('Trigger'));
  await act(async () => {});
}

describe('ToastProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockReduceMotion(false);
    jest
      .spyOn(AccessibilityInfo, 'getRecommendedTimeoutMillis')
      .mockImplementation(async (original) => original);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('shows and announces the message', async () => {
    const announce = jest.spyOn(AccessibilityInfo, 'announceForAccessibility');
    await renderWithToast({ message: 'Code copied' });

    expect(screen.getByText('Code copied')).toBeOnTheScreen();
    expect(announce).toHaveBeenCalledWith('Code copied');
  });

  it('announces that an action is available and runs it', async () => {
    const announce = jest.spyOn(AccessibilityInfo, 'announceForAccessibility');
    const onUndo = jest.fn();
    await renderWithToast({
      message: 'Set logged',
      action: { label: 'Undo', onPress: onUndo },
    });

    expect(announce).toHaveBeenCalledWith('Set logged. Undo available');
    await fireEvent.press(screen.getByRole('button', { name: 'Undo' }));
    await act(async () => {
      jest.runOnlyPendingTimers();
    });

    expect(onUndo).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('Set logged')).not.toBeOnTheScreen();
  });

  it('hides itself after the recommended timeout', async () => {
    await renderWithToast({ message: 'Saved to favourites' });

    await act(async () => {
      jest.advanceTimersByTime(4000);
    });
    await act(async () => {
      jest.runOnlyPendingTimers();
    });

    expect(screen.queryByText('Saved to favourites')).not.toBeOnTheScreen();
  });

  it('uses the OS accessibility timeout when it is longer', async () => {
    jest
      .spyOn(AccessibilityInfo, 'getRecommendedTimeoutMillis')
      .mockResolvedValue(20000);
    await renderWithToast({ message: 'Saved to favourites' });

    await act(async () => {
      jest.advanceTimersByTime(10000);
    });

    expect(screen.getByText('Saved to favourites')).toBeOnTheScreen();
  });
});
