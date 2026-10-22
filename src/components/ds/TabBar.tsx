import { TabBarView, type TabBarItem } from '@/src/components/ds/TabBarView';
import {
  BottomTabBarHeightCallbackContext,
  type BottomTabBarProps,
} from 'expo-router/tabs';
import React, { useContext } from 'react';

const ICON_SIZE = 26;

/**
 * Adapter from Expo Router's tab navigator to TabBarView. Pass as
 * `<Tabs tabBar={(props) => <TabBar {...props} />}>`. Mirrors the default
 * bar's press handling (so screens can still listen for tabPress) and reports
 * its height so useBottomTabBarHeight keeps working.
 */
export function TabBar({
  state,
  descriptors,
  emitter,
  navigateToTab,
  insets,
}: BottomTabBarProps) {
  const onHeightChange = useContext(BottomTabBarHeightCallbackContext);
  const routes = state.routes;

  const items: TabBarItem[] = routes.map((route, index) => {
    const { options } = descriptors[route.key];
    const label = options.title ?? route.name;
    return {
      key: route.key,
      label,
      accessibilityLabel:
        options.tabBarAccessibilityLabel ??
        `${label}, tab, ${index + 1} of ${routes.length}`,
      testID: options.tabBarButtonTestID,
      renderIcon: (focused, iconColor) =>
        options.tabBarIcon?.({ focused, color: iconColor, size: ICON_SIZE }),
    };
  });

  const handleTabPress = (index: number) => {
    const route = routes[index];
    const event = emitter.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });
    if (index !== state.index && !event.defaultPrevented) {
      navigateToTab(route.key);
    }
  };

  const handleTabLongPress = (index: number) => {
    emitter.emit({ type: 'tabLongPress', target: routes[index].key });
  };

  return (
    <TabBarView
      items={items}
      activeIndex={state.index}
      onTabPress={handleTabPress}
      onTabLongPress={handleTabLongPress}
      bottomInset={insets.bottom}
      onLayout={(event) => onHeightChange?.(event.nativeEvent.layout.height)}
    />
  );
}
