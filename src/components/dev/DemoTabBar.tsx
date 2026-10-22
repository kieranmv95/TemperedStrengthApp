import { IconSymbol, TabBarView } from '@/src/components/ds';
import type { TabBarItem } from '@/src/components/ds/TabBarView';
import { radius } from '@/src/constants/tokens';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

const TABS = [
  { key: 'program', label: 'Program', icon: 'book' },
  { key: 'workouts', label: 'Workouts', icon: 'dumbbell' },
  { key: 'home', label: 'Home', icon: 'house' },
  { key: 'explore', label: 'Explore', icon: 'globe' },
  { key: 'you', label: 'You', icon: 'person' },
] as const;

const ITEMS: TabBarItem[] = TABS.map((tab, index) => ({
  key: tab.key,
  label: tab.label,
  accessibilityLabel: `${tab.label}, tab, ${index + 1} of ${TABS.length}`,
  renderIcon: (_focused, iconColor) => (
    <IconSymbol name={tab.icon} size={26} color={iconColor} />
  ),
}));

/** Dev-only: the tab bar with local state, using the app's tab icons. */
export function DemoTabBar() {
  const [activeIndex, setActiveIndex] = useState(2);

  return (
    <View style={styles.frame}>
      <TabBarView
        items={ITEMS}
        activeIndex={activeIndex}
        onTabPress={setActiveIndex}
        bottomInset={0}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    borderRadius: radius.md,
    overflow: 'hidden',
  },
});
