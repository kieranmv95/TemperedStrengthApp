import { useSubscription } from '@/src/hooks/use-subscription';
import { getOfferings } from '@/src/services/revenueCatService';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';
import { PURCHASES_ERROR_CODE, PurchasesError } from 'react-native-purchases';
import RevenueCatUI from 'react-native-purchases-ui';

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

        // Check if offerings are available before presenting paywall
        const offerings = await getOfferings();
        if (
          !offerings ||
          !offerings.availablePackages ||
          offerings.availablePackages.length === 0
        ) {
          console.error(
            'No offerings available. Check RevenueCat dashboard configuration.'
          );
          Alert.alert(
            'Paywall Configuration Error',
            'No subscription packages are available. Please ensure:\n\n' +
              '1. Products are configured in RevenueCat dashboard\n' +
              '2. An offering is created and set as current\n' +
              '3. Products match your App Store Connect product IDs\n' +
              "4. Products are in 'Ready to Submit' or 'Approved' state\n\n" +
              'Error Code: Configuration Error (No Offerings)',
            [
              {
                text: 'OK',
                onPress: () => router.back(),
              },
            ]
          );
          return;
        }

        console.log('Presenting paywall with offerings:', offerings.identifier);

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
            [
              {
                text: 'OK',
                onPress: () => router.back(),
              },
            ]
          );
        } else if (result === RevenueCatUI.PAYWALL_RESULT.CANCELLED) {
          // User cancelled, close the screen
          router.back();
        } else if (result === RevenueCatUI.PAYWALL_RESULT.NOT_PRESENTED) {
          // Paywall wasn't presented (e.g., no internet, no offerings)
          Alert.alert(
            'Unable to Load Paywall',
            'The paywall could not be displayed. Please check your internet connection and try again.',
            [
              {
                text: 'OK',
                onPress: () => router.back(),
              },
            ]
          );
        }
      } catch (error) {
        console.error('Error presenting paywall:', error);

        // Extract detailed error information
        let errorMessage =
          'An unknown error occurred while loading the paywall.';
        let errorCode = 'Unknown';
        let errorDetails = '';

        if (error instanceof Error) {
          errorMessage = error.message;
          errorDetails = error.stack || '';
        }

        // Check if it's a RevenueCat error
        const purchasesError = error as PurchasesError;
        if (purchasesError?.code !== undefined) {
          errorCode = `Error ${purchasesError.code}`;

          // Map common error codes to helpful messages
          switch (purchasesError.code) {
            case PURCHASES_ERROR_CODE.CONFIGURATION_ERROR:
              errorMessage =
                'RevenueCat configuration error. Please check:\n\n' +
                '• Products are configured in RevenueCat dashboard\n' +
                '• Product IDs match App Store Connect exactly\n' +
                "• Products are in 'Ready to Submit' or 'Approved' state\n" +
                '• App Store agreements and tax forms are complete\n' +
                '• App Store localizations are added\n\n' +
                `Underlying error: ${purchasesError.message || errorMessage}`;
              break;
            case PURCHASES_ERROR_CODE.NETWORK_ERROR:
              errorMessage =
                'Network error. Please check your internet connection and try again.';
              break;
            case PURCHASES_ERROR_CODE.PURCHASE_NOT_ALLOWED_ERROR:
              errorMessage =
                'Purchases are not allowed on this device. Please check your device settings.';
              break;
            default:
              errorMessage = purchasesError.message || errorMessage;
          }
        }

        // Log full error details for debugging
        console.error('Paywall error details:', {
          code: errorCode,
          message: errorMessage,
          fullError: error,
          details: errorDetails,
        });

        Alert.alert(
          'Paywall Error',
          `${errorMessage}\n\nError Code: ${errorCode}`,
          [
            {
              text: 'OK',
              onPress: () => router.back(),
            },
          ]
        );
      } finally {
        setIsPresenting(false);
      }
    };

    presentPaywall();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Show loading indicator while presenting paywall
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#c9b072" />
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
