import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/src/components/haptic-tab';
import { IconSymbol } from '@/src/components/ui/icon-symbol';
import { Colors } from '@/src/constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.tint,
        tabBarInactiveTintColor: Colors.tabIconDefault,
        tabBarStyle: {
          backgroundColor: '#121212',
          borderTopColor: '#2A2A2A',
        },
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Program',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="doc.on.clipboard.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="workouts"
        options={{
          title: 'Workouts',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="dumbbell.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="brief"
        options={{
          title: 'Brief',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="newspaper.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="gearshape.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
