import { mockReduceMotion } from '@/jest/mockReduceMotion';
import { BottomSheet } from '@/src/components/ds/BottomSheet';
import { motion } from '@/src/constants/tokens';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import React, { type ComponentRef } from 'react';
import { AccessibilityInfo, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const SAFE_AREA_METRICS = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

type SheetProps = Partial<React.ComponentProps<typeof BottomSheet>>;

function sheet(props: SheetProps) {
  return (
    <SafeAreaProvider initialMetrics={SAFE_AREA_METRICS}>
      <BottomSheet
        visible
        onClose={jest.fn()}
        title="Filters"
        footer={<Text>Show 168</Text>}
        {...props}
      >
        <Text>Discipline</Text>
      </BottomSheet>
    </SafeAreaProvider>
  );
}

describe('BottomSheet', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockReduceMotion(false);
  });

  it('renders nothing while hidden', async () => {
    await render(sheet({ visible: false }));

    expect(screen.queryByText('Discipline')).not.toBeOnTheScreen();
  });

  it('shows a header title, content and a pinned footer', async () => {
    await render(sheet({}));

    expect(screen.getByRole('header', { name: 'Filters' })).toBeOnTheScreen();
    expect(screen.getByText('Discipline')).toBeOnTheScreen();
    expect(screen.getByText('Show 168')).toBeOnTheScreen();
  });

  it('closes from the close button and the scrim, with one close control for screen readers', async () => {
    const onClose = jest.fn();
    await render(sheet({ onClose }));

    expect(
      screen.getAllByRole('button', { name: 'Close Filters' })
    ).toHaveLength(1);
    await fireEvent.press(
      screen.getByRole('button', { name: 'Close Filters' })
    );
    await fireEvent.press(
      screen.getByTestId('bottom-sheet-scrim', { includeHiddenElements: true })
    );

    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it('moves screen-reader focus to the title when shown', async () => {
    const focus = jest.spyOn(AccessibilityInfo, 'sendAccessibilityEvent');
    await render(sheet({}));

    await fireEvent(screen.getByTestId('bottom-sheet-modal'), 'show');

    expect(focus).toHaveBeenCalledWith(expect.anything(), 'focus');
  });

  it('returns focus to the trigger after closing', async () => {
    jest.useFakeTimers();
    const focus = jest.spyOn(AccessibilityInfo, 'sendAccessibilityEvent');
    const triggerRef = React.createRef<ComponentRef<typeof View>>();
    const { rerender } = await render(
      <>
        <View ref={triggerRef} />
        {sheet({ returnFocusRef: triggerRef })}
      </>
    );
    await act(async () => {});

    await rerender(
      <>
        <View ref={triggerRef} />
        {sheet({ visible: false, returnFocusRef: triggerRef })}
      </>
    );
    await act(async () => {
      jest.advanceTimersByTime(motion.duration.base);
    });

    expect(screen.queryByText('Discipline')).not.toBeOnTheScreen();
    expect(focus).toHaveBeenCalledWith(triggerRef.current, 'focus');
    jest.useRealTimers();
  });
});
