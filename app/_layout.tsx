import { ExerciseVideoProvider } from '@/src/hooks/exercise-video-context';
import { SubscriptionProvider } from '@/src/hooks/subscription-context';
import { SyncManagerProvider } from '@/src/hooks/sync-manager-context';
import { TogetherWeLiftProvider } from '@/src/hooks/together-we-lift-context';
import { initializeRevenueCat } from '@/src/services/revenueCatService';
import { getOnboarded, runStorageMigrations } from '@/src/utils/storage';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { isRunningInExpoGo } from 'expo';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PostHogProvider } from 'posthog-react-native';
import { useEffect, useState } from 'react';
import { LogBox, Platform } from 'react-native';
import 'react-native-reanimated';

// Expo Go on Android cannot use expo-notifications (SDK 53+). We lazy-load the
// module in localNotifications.ts; suppress the known dev warning if native still logs it.
if (isRunningInExpoGo() && Platform.OS === 'android') {
  LogBox.ignoreLogs([/expo-notifications: Android Push notifications/]);
}

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const [isBootReady, setIsBootReady] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // Run storage migrations before anything reads persisted data and before
      // the sync manager (mounted only once boot is ready) starts mirroring.
      try {
        await runStorageMigrations();
      } catch (error) {
        console.error('Failed to run storage migrations:', error);
      }
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
    <PostHogProvider
      apiKey="phc_qNQGZv7zvPaZr9GwisqwcJfgkVauS9QmVZEC3Dko6Sbj"
      debug={__DEV__}
      options={{
        // If your PostHog project is EU-hosted, this must be "https://eu.i.posthog.com"
        host: 'https://us.i.posthog.com',
        // Make dev verification easier without impacting prod battery/network.
        ...(__DEV__ ? { flushAt: 1, flushInterval: 2_000 } : null),
      }}
    >
      <ThemeProvider value={DarkTheme}>
        <SyncManagerProvider>
          <SubscriptionProvider>
            <TogetherWeLiftProvider>
              <ExerciseVideoProvider>
                <Stack>
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                  <Stack.Screen name="glossary" options={{ headerShown: false }} />
                  <Stack.Screen
                    name="tools/one-rep-max"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="tools/one-rep-max-breakdown"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="tools/creatine"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="tools/water-intake"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen name="shop" options={{ headerShown: false }} />
                  <Stack.Screen name="recovery" options={{ headerShown: false }} />
                  <Stack.Screen
                    name="article/[id]"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="patch-notes"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="account/general"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="account/program"
                    options={{ headerShown: false }}
                  />
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
              </ExerciseVideoProvider>
            </TogetherWeLiftProvider>
          </SubscriptionProvider>
        </SyncManagerProvider>
      </ThemeProvider>
    </PostHogProvider>
  );
}
