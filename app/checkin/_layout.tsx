import { Stack } from 'expo-router';
import React from 'react';

export default function CheckinLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="choose-active" />
    </Stack>
  );
}
