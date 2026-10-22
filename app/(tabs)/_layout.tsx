import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { AppState } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconSymbol, TabBar } from '@/src/components/ds';
import { useSyncManager } from '@/src/hooks/sync-manager-context';
import { applyDailyStreakCheckIn } from '@/src/services/streakService';
import { getEffectiveBottomInset } from '@/src/utils/platform';

export default function TabLayout() {
  const { syncNow } = useSyncManager();
  const insets = useSafeAreaInsets();
  const bottomInset = getEffectiveBottomInset(insets.bottom);

  useEffect(() => {
    const run = async () => {
      await syncNow();
      await applyDailyStreakCheckIn();
    };
    void run();
  }, [syncNow]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        void applyDailyStreakCheckIn();
      }
    });
    return () => sub.remove();
  }, []);

  return (
    <Tabs
      safeAreaInsets={{ ...insets, bottom: bottomInset }}
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen
        name="program"
        options={{
          title: 'Program',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol size={size} name="book" color={String(color)} />
          ),
        }}
      />
      <Tabs.Screen
        name="workouts"
        options={{
          title: 'Workouts',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol size={size} name="dumbbell" color={String(color)} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol size={size} name="house" color={String(color)} />
          ),
        }}
      />
      <Tabs.Screen
        name="hub"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol size={size} name="globe" color={String(color)} />
          ),
        }}
      />
      <Tabs.Screen
        name="records"
        options={{
          title: 'You',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol size={size} name="person" color={String(color)} />
          ),
        }}
      />
    </Tabs>
  );
}
