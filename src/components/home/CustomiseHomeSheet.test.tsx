import { mockReduceMotion } from '@/jest/mockReduceMotion';
import { CustomiseHomeSheet } from '@/src/components/home/CustomiseHomeSheet';
import {
  defaultHomeLayout,
  setHomeSectionVisible,
} from '@/src/utils/homeLayout';
import { fireEvent, render } from '@testing-library/react-native';
import { type ComponentProps } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const SAFE_AREA_METRICS = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

function sheet(props: Partial<ComponentProps<typeof CustomiseHomeSheet>>) {
  return (
    <SafeAreaProvider initialMetrics={SAFE_AREA_METRICS}>
      <CustomiseHomeSheet
        visible
        layout={defaultHomeLayout()}
        canHideSections
        onClose={jest.fn()}
        onReorder={jest.fn()}
        onToggleVisible={jest.fn()}
        onUpgrade={jest.fn()}
        {...props}
      />
    </SafeAreaProvider>
  );
}

describe('CustomiseHomeSheet', () => {
  beforeEach(() => {
    mockReduceMotion(false);
  });

  it('reorders for everyone and only lets Pro show or hide sections', async () => {
    const onReorder = jest.fn();
    const onToggleVisible = jest.fn();
    const onUpgrade = jest.fn();
    const view = await render(sheet({ onReorder, onToggleVisible, onUpgrade }));

    expect(
      view.getByRole('header', { name: 'Customise home' })
    ).toBeOnTheScreen();
    expect(
      view.getByText(
        'Drag a handle to reorder. Use the switch to show or hide a section.'
      )
    ).toBeOnTheScreen();
    expect(view.queryByRole('button', { name: 'Upgrade to Pro' })).toBeNull();

    fireEvent(
      view.getByRole('switch', { name: 'Hide Program' }),
      'valueChange',
      false
    );
    expect(onToggleVisible).toHaveBeenCalledWith('program', false);

    fireEvent(
      view.getByRole('button', { name: 'Reorder Program' }),
      'accessibilityAction',
      { nativeEvent: { actionName: 'moveDown' } }
    );
    expect(onReorder).toHaveBeenCalledWith(0, 1);

    expect(
      view
        .getByRole('button', { name: 'Reorder Program' })
        .props.accessibilityActions.map(
          (action: { name: string }) => action.name
        )
    ).toEqual(['moveDown']);
    expect(
      view
        .getByRole('button', { name: 'Reorder Personal bests' })
        .props.accessibilityActions.map(
          (action: { name: string }) => action.name
        )
    ).toEqual(['moveUp']);

    await view.rerender(
      sheet({
        onReorder,
        onToggleVisible,
        onUpgrade,
        canHideSections: false,
        layout: setHomeSectionVisible(defaultHomeLayout(), 'program', false),
      })
    );

    expect(
      view.getByText(/Showing and hiding sections is part of Pro/)
    ).toBeOnTheScreen();
    expect(view.queryByRole('switch', { name: 'Hide Program' })).toBeNull();

    fireEvent.press(
      view.getByRole('button', {
        name: 'Program, shown. Hiding sections is a Pro feature',
      })
    );
    fireEvent.press(view.getByRole('button', { name: 'Upgrade to Pro' }));
    expect(onUpgrade).toHaveBeenCalledTimes(2);
    expect(onToggleVisible).toHaveBeenCalledTimes(1);
  });
});
