import {
  color,
  MIN_TARGET_SIZE,
  radius,
  space,
  typography,
} from '@/src/constants/tokens';
import { useMotion } from '@/src/hooks/useMotion';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useRef } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

export type TabBarItem = {
  key: string;
  label: string;
  accessibilityLabel: string;
  renderIcon: (focused: boolean, iconColor: string) => React.ReactNode;
  testID?: string;
};

type TabBarViewProps = {
  items: TabBarItem[];
  activeIndex: number;
  onTabPress: (index: number) => void;
  onTabLongPress?: (index: number) => void;
  bottomInset: number;
  onLayout?: (event: LayoutChangeEvent) => void;
};

const INDICATOR_WIDTH = 56;
const INDICATOR_HEIGHT = 32;
const ICON_BOUNCE_PEAK = 1.12;

type TabBarButtonProps = {
  item: TabBarItem;
  index: number;
  focused: boolean;
  onPress: (index: number) => void;
  onLongPress?: (index: number) => void;
};

function TabBarButton({
  item,
  index,
  focused,
  onPress,
  onLongPress,
}: TabBarButtonProps) {
  const motionHelpers = useMotion();
  const scale = useSharedValue(1);
  const wasFocused = useRef(focused);

  useEffect(() => {
    if (focused && !wasFocused.current) {
      scale.set(motionHelpers.bounce(ICON_BOUNCE_PEAK));
    }
    wasFocused.current = focused;
  }, [focused, scale, motionHelpers]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.get() }],
  }));

  const handlePress = () => {
    void Haptics.selectionAsync();
    onPress(index);
  };

  return (
    <Pressable
      onPress={handlePress}
      onLongPress={onLongPress ? () => onLongPress(index) : undefined}
      style={styles.tab}
      accessibilityRole="tab"
      accessibilityLabel={item.accessibilityLabel}
      accessibilityState={{ selected: focused }}
      testID={item.testID}
    >
      <Animated.View style={[styles.icon, iconStyle]}>
        {item.renderIcon(focused, focused ? color.gold : color.textSecondary)}
      </Animated.View>
      <Text
        style={[styles.label, focused ? styles.labelFocused : null]}
        numberOfLines={2}
      >
        {item.label}
      </Text>
    </Pressable>
  );
}

/**
 * Bottom tab bar: the active tab gets a gold icon and a gold-tint pill that
 * slides between tabs. Labels are always visible. See TabBar for the
 * navigator adapter.
 */
export function TabBarView({
  items,
  activeIndex,
  onTabPress,
  onTabLongPress,
  bottomInset,
  onLayout,
}: TabBarViewProps) {
  const motionHelpers = useMotion();
  const tabWidth = useSharedValue(0);
  const indicatorIndex = useSharedValue(activeIndex);

  useEffect(() => {
    indicatorIndex.set(motionHelpers.spring(activeIndex, 'gentle'));
  }, [activeIndex, indicatorIndex, motionHelpers]);

  const indicatorStyle = useAnimatedStyle(() => ({
    opacity: tabWidth.get() > 0 ? 1 : 0,
    transform: [
      {
        translateX:
          indicatorIndex.get() * tabWidth.get() +
          (tabWidth.get() - INDICATOR_WIDTH) / 2,
      },
    ],
  }));

  const handleLayout = (event: LayoutChangeEvent) => {
    tabWidth.set(event.nativeEvent.layout.width / Math.max(1, items.length));
    onLayout?.(event);
  };

  return (
    <View
      style={[styles.bar, { paddingBottom: bottomInset }]}
      onLayout={handleLayout}
      accessibilityRole="tablist"
      testID="tab-bar"
    >
      <Animated.View
        style={[styles.indicator, indicatorStyle]}
        pointerEvents="none"
      />
      {items.map((item, index) => (
        <TabBarButton
          key={item.key}
          item={item}
          index={index}
          focused={index === activeIndex}
          onPress={onTabPress}
          onLongPress={onTabLongPress}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: color.bg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: color.borderSubtle,
  },
  indicator: {
    position: 'absolute',
    top: space.xxs,
    left: 0,
    width: INDICATOR_WIDTH,
    height: INDICATOR_HEIGHT,
    borderRadius: radius.pill,
    backgroundColor: color.goldTint,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    minHeight: MIN_TARGET_SIZE,
    paddingTop: space.xs,
    paddingBottom: space.xxs,
    gap: space.xxs,
  },
  icon: {
    height: INDICATOR_HEIGHT - space.xs,
    justifyContent: 'center',
  },
  label: {
    ...typography.captionStrong,
    color: color.textSecondary,
    textAlign: 'center',
  },
  labelFocused: {
    color: color.textPrimary,
  },
});
