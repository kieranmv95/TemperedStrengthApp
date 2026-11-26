import { Stack } from 'expo-router';
import React from 'react';

export default function ConditioningRecordsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="[activityId]" />
    </Stack>
  );
}
