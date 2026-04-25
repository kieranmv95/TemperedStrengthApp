import { SubscriptionProvider } from '@/src/hooks/subscription-context';
import { SyncManagerProvider } from '@/src/hooks/sync-manager-context';
import { initializeRevenueCat } from '@/src/services/revenueCatService';
import { getOnboarded } from '@/src/utils/storage';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const [isBootReady, setIsBootReady] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await initializeRevenueCat();
      } catch (error) {
        console.error('Failed to initialize RevenueCat:', error);
      }
      try {
        const done = await getOnboarded();
        if (!cancelled) {
          setNeedsOnboarding(!done);
        }
      } catch (error) {
        console.error('Failed to read onboarding state:', error);
      }
      if (!cancelled) {
        setIsBootReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Once the Stack is mounted and we know the user has not onboarded,
  // push them into the onboarding flow. Using router.replace avoids
  // leaving the tabs in the back-stack.
  useEffect(() => {
    if (isBootReady && needsOnboarding) {
      router.replace('/onboarding');
    }
  }, [isBootReady, needsOnboarding]);

  if (!isBootReady) {
    return null;
  }

  return (
    <ThemeProvider value={DarkTheme}>
      <SyncManagerProvider>
        <SubscriptionProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="glossary" options={{ headerShown: false }} />
              <Stack.Screen name="article/[id]" options={{ headerShown: false }} />
              <Stack.Screen name="patch-notes" options={{ headerShown: false }} />
              <Stack.Screen name="account/general" options={{ headerShown: false }} />
              <Stack.Screen name="account/program" options={{ headerShown: false }} />
              <Stack.Screen
                name="onboarding"
                options={{
                  headerShown: false,
                  gestureEnabled: false,
                  animation: 'fade',
                }}
              />
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
      </SyncManagerProvider>
    </ThemeProvider>
  );
}
