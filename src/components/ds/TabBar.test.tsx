import { mockReduceMotion } from '@/jest/mockReduceMotion';
import { TabBar } from '@/src/components/ds/TabBar';
import { TabBarView, type TabBarItem } from '@/src/components/ds/TabBarView';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import * as Haptics from 'expo-haptics';
import {
  BottomTabBarHeightCallbackContext,
  type BottomTabBarProps,
} from 'expo-router/tabs';
import { Text } from 'react-native';
import { withSequence } from 'react-native-reanimated';

const LABELS = ['Program', 'Workouts', 'Home', 'Explore', 'You'];

const ITEMS: TabBarItem[] = LABELS.map((label, index) => ({
  key: label,
  label,
  accessibilityLabel: `${label}, tab, ${index + 1} of ${LABELS.length}`,
  renderIcon: () => <Text>icon</Text>,
}));

function tabBarView(activeIndex: number, onTabPress = jest.fn()) {
  return (
    <TabBarView
      items={ITEMS}
      activeIndex={activeIndex}
      onTabPress={onTabPress}
      bottomInset={34}
    />
  );
}

describe('TabBarView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockReduceMotion(false);
  });

  it('exposes a tablist with the selected tab', async () => {
    await render(tabBarView(2));
    await act(async () => {});

    expect(screen.getByTestId('tab-bar')).toHaveProp(
      'accessibilityRole',
      'tablist'
    );
    expect(screen.getAllByRole('tab')).toHaveLength(5);
    expect(
      screen.getByRole('tab', { name: 'Home, tab, 3 of 5' })
    ).toBeSelected();
    expect(
      screen.getByRole('tab', { name: 'Program, tab, 1 of 5' })
    ).not.toBeSelected();
  });

  it('reports presses with a selection haptic and keeps labels visible', async () => {
    const onTabPress = jest.fn();
    await render(tabBarView(2, onTabPress));
    await act(async () => {});

    await fireEvent.press(
      screen.getByRole('tab', { name: 'Explore, tab, 4 of 5' })
    );

    expect(onTabPress).toHaveBeenCalledWith(3);
    expect(Haptics.selectionAsync).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Explore')).toBeOnTheScreen();
  });

  it('bounces the icon of a newly selected tab', async () => {
    const { rerender } = await render(tabBarView(2));
    await act(async () => {});
    expect(withSequence).not.toHaveBeenCalled();

    await rerender(tabBarView(3));

    expect(withSequence).toHaveBeenCalledTimes(1);
  });

  it('does not bounce under Reduce Motion', async () => {
    mockReduceMotion(true);
    const { rerender } = await render(tabBarView(2));
    await act(async () => {});

    await rerender(tabBarView(3));

    expect(withSequence).not.toHaveBeenCalled();
  });
});

function navigatorProps(index: number, defaultPrevented = false) {
  const emit = jest.fn(() => ({ defaultPrevented }));
  const navigateToTab = jest.fn();
  const routes = LABELS.map((label) => ({ key: `${label}-key`, name: label }));
  const descriptors = Object.fromEntries(
    routes.map((route) => [
      route.key,
      {
        options: {
          title: route.name,
          tabBarIcon: () => <Text>icon</Text>,
        },
      },
    ])
  );
  const props = {
    state: { index, routes },
    descriptors,
    emitter: { emit },
    navigateToTab,
    insets: { top: 0, right: 0, bottom: 34, left: 0 },
  } as unknown as BottomTabBarProps;
  return { props, emit, navigateToTab };
}

describe('TabBar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockReduceMotion(false);
  });

  it('emits tabPress and navigates to an unfocused tab', async () => {
    const { props, emit, navigateToTab } = navigatorProps(2);
    await render(<TabBar {...props} />);
    await act(async () => {});

    await fireEvent.press(
      screen.getByRole('tab', { name: 'Workouts, tab, 2 of 5' })
    );

    expect(emit).toHaveBeenCalledWith({
      type: 'tabPress',
      target: 'Workouts-key',
      canPreventDefault: true,
    });
    expect(navigateToTab).toHaveBeenCalledWith('Workouts-key');
  });

  it('only emits tabPress when the focused tab is pressed again', async () => {
    const { props, emit, navigateToTab } = navigatorProps(2);
    await render(<TabBar {...props} />);
    await act(async () => {});

    await fireEvent.press(
      screen.getByRole('tab', { name: 'Home, tab, 3 of 5' })
    );

    expect(emit).toHaveBeenCalledTimes(1);
    expect(navigateToTab).not.toHaveBeenCalled();
  });

  it('respects a prevented tabPress', async () => {
    const { props, navigateToTab } = navigatorProps(2, true);
    await render(<TabBar {...props} />);
    await act(async () => {});

    await fireEvent.press(
      screen.getByRole('tab', { name: 'You, tab, 5 of 5' })
    );

    expect(navigateToTab).not.toHaveBeenCalled();
  });

  it('reports its height for useBottomTabBarHeight', async () => {
    const onHeightChange = jest.fn();
    const { props } = navigatorProps(0);
    await render(
      <BottomTabBarHeightCallbackContext.Provider value={onHeightChange}>
        <TabBar {...props} />
      </BottomTabBarHeightCallbackContext.Provider>
    );
    await act(async () => {});

    await fireEvent(screen.getByTestId('tab-bar'), 'layout', {
      nativeEvent: { layout: { width: 390, height: 83 } },
    });

    expect(onHeightChange).toHaveBeenCalledWith(83);
  });
});
