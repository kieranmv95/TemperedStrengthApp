import { Spacing } from '@/src/constants/theme';
import { getEffectiveBottomInset } from '@/src/utils/platform';
import React, { createContext, useContext } from 'react';
import {
  FlatList,
  FlatListProps,
  Platform,
  ScrollView,
  ScrollViewProps,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import {
  SafeAreaView,
  SafeAreaViewProps,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

function includesBottomEdge(edges: SafeAreaViewProps['edges']): boolean {
  if (edges === undefined) {
    return true;
  }
  return Array.isArray(edges) && edges.includes('bottom');
}

const defaultEdges: SafeAreaViewProps['edges'] =
  Platform.OS === 'ios' ? ['top', 'left', 'right'] : undefined;

type AppSafeAreaContextValue = {
  scrollContentPaddingBottom: number;
};

const AppSafeAreaContext = createContext<AppSafeAreaContextValue>({
  scrollContentPaddingBottom: 0,
});

export function AppScrollView({
  contentContainerStyle,
  ...props
}: ScrollViewProps) {
  const { scrollContentPaddingBottom } = useContext(AppSafeAreaContext);

  return (
    <ScrollView
      {...props}
      contentContainerStyle={[
        contentContainerStyle,
        scrollContentPaddingBottom > 0
          ? { paddingBottom: scrollContentPaddingBottom }
          : undefined,
      ]}
      contentInsetAdjustmentBehavior={
        scrollContentPaddingBottom > 0 ? 'never' : 'automatic'
      }
    />
  );
}

export function AppFlatList<ItemT>({
  contentContainerStyle,
  ...props
}: FlatListProps<ItemT>) {
  const { scrollContentPaddingBottom } = useContext(AppSafeAreaContext);

  return (
    <FlatList
      {...props}
      contentContainerStyle={[
        contentContainerStyle,
        scrollContentPaddingBottom > 0
          ? { paddingBottom: scrollContentPaddingBottom }
          : undefined,
      ]}
      contentInsetAdjustmentBehavior={
        scrollContentPaddingBottom > 0 ? 'never' : 'automatic'
      }
    />
  );
}

export function AppSafeAreaView({
  style,
  edges = defaultEdges,
  children,
  ...props
}: SafeAreaViewProps) {
  const insets = useSafeAreaInsets();
  const bottomEdgeIncluded = includesBottomEdge(edges);
  const extraBottom =
    bottomEdgeIncluded && Platform.OS === 'android'
      ? getEffectiveBottomInset(insets.bottom) - insets.bottom
      : 0;
  const extraStyle: StyleProp<ViewStyle> =
    extraBottom > 0 ? { paddingBottom: extraBottom } : undefined;

  const scrollContentPaddingBottom =
    Platform.OS === 'ios' && !bottomEdgeIncluded
      ? insets.bottom + Spacing.section
      : 0;

  return (
    <AppSafeAreaContext.Provider value={{ scrollContentPaddingBottom }}>
      <SafeAreaView
        {...props}
        edges={edges}
        style={[styles.container, style, extraStyle]}
      >
        <View style={styles.content}>{children}</View>
      </SafeAreaView>
    </AppSafeAreaContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
