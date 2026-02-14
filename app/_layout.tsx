import { SubscriptionProvider } from '@/src/hooks/subscription-context';
import { initializeRevenueCat } from '@/src/services/revenueCatService';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const [isRevenueCatReady, setIsRevenueCatReady] = useState(false);

  useEffect(() => {
    // Initialize RevenueCat when app starts
    initializeRevenueCat()
      .then(() => {
        setIsRevenueCatReady(true);
      })
      .catch((error) => {
        console.error('Failed to initialize RevenueCat:', error);
        // Still allow app to load even if RevenueCat fails
        setIsRevenueCatReady(true);
      });
  }, []);

  // Wait for RevenueCat to initialize before rendering
  // This ensures the SDK is ready before SubscriptionProvider tries to add listeners
  if (!isRevenueCatReady) {
    return null;
  }

  return (
    <ThemeProvider value={DarkTheme}>
      <SubscriptionProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="glossary" options={{ headerShown: false }} />
          <Stack.Screen name="article/[id]" options={{ headerShown: false }} />
          <Stack.Screen
            name="paywall"
            options={{ presentation: 'modal', title: 'Upgrade to Pro' }}
          />
          <Stack.Screen
            name="customer-center"
            options={{ presentation: 'modal', title: 'Subscription' }}
          />
        </Stack>
        <StatusBar style="light" />
      </SubscriptionProvider>
    </ThemeProvider>
  );
}
