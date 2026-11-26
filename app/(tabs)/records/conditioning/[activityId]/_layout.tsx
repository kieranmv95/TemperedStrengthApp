import { Stack } from 'expo-router';
import React from 'react';

export default function ConditioningActivityLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[distanceM]" />
    </Stack>
  );
}
