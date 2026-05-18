import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { AppState } from 'react-native';

import { HapticTab } from '@/src/components/haptic-tab';
import { IconSymbol } from '@/src/components/ui/icon-symbol';
import { Colors } from '@/src/constants/theme';
import { useSyncManager } from '@/src/hooks/sync-manager-context';
import { applyDailyStreakCheckIn } from '@/src/services/streakService';

export default function TabLayout() {
  const { syncNow } = useSyncManager();

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
        void (async () => {
          await syncNow();
          await applyDailyStreakCheckIn();
        })();
      }
    });
    return () => sub.remove();
  }, [syncNow]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.textPrimary,
        tabBarInactiveTintColor: Colors.tabIconDefault,
        tabBarStyle: {
          backgroundColor: Colors.backgroundScreen,
          borderTopColor: Colors.backgroundElevated,
        },
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="program"
        options={{
          title: 'Program',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="doc.on.clipboard.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="workouts"
        options={{
          title: 'Workouts',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="dumbbell.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="hub"
        options={{
          title: 'Hub',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="square.grid.2x2.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="records"
        options={{
          title: 'Records',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={24} name="trophy.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Account',
          href: null,
        }}
      />
    </Tabs>
  );
}
