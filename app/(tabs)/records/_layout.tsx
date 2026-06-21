import { Stack } from 'expo-router';
import React from 'react';

export default function RecordsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="account" />
      <Stack.Screen name="personal-bests" />
      <Stack.Screen name="trophies" />
      <Stack.Screen name="[exerciseId]" />
    </Stack>
  );
}
