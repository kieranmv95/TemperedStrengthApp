import RevenueCatUI from 'react-native-purchases-ui';
import { Alert, ActivityIndicator, StyleSheet, View } from 'react-native';
import { useSubscription } from '@/hooks/use-subscription';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';

export default function PaywallScreen() {
  const { isPro, refresh } = useSubscription();
  const [isPresenting, setIsPresenting] = useState(false);

  // Present the paywall from RevenueCat dashboard when screen mounts
  useEffect(() => {
    // Don't present if user is already Pro
    if (isPro) {
      router.back();
      return;
    }

    const presentPaywall = async () => {
      try {
        setIsPresenting(true);
        
        // Present the paywall created in RevenueCat dashboard
        const result = await RevenueCatUI.presentPaywall({
          displayCloseButton: true,
        });

        // Refresh subscription status after paywall closes
        await refresh();

        // Handle the result
        if (result === RevenueCatUI.PAYWALL_RESULT.PURCHASED) {
          Alert.alert(
            'Welcome to Pro!',
            'You now have access to all Pro features.',
            [{ text: 'OK' }]
          );
        } else if (result === RevenueCatUI.PAYWALL_RESULT.CANCELLED) {
          // User cancelled, no action needed
        } else if (result === RevenueCatUI.PAYWALL_RESULT.NOT_PRESENTED) {
          // Paywall wasn't presented (e.g., no internet, no offerings)
          Alert.alert(
            'Unable to Load Paywall',
            'Please check your internet connection and try again.',
            [{ text: 'OK' }]
          );
        }
      } catch (error) {
        console.error('Error presenting paywall:', error);
        Alert.alert(
          'Paywall Unavailable',
          'Paywalls require a development or production build. They are not available in Expo Go. Please build the app to test paywall functionality.',
          [{ text: 'OK' }]
        );
      } finally {
        setIsPresenting(false);
        // Close this screen after paywall is dismissed
        router.back();
      }
    };

    presentPaywall();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Show loading indicator while presenting paywall
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#00E676" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

