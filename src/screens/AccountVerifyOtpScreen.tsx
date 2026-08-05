import { AppSafeAreaView } from '@/src/components/AppSafeAreaView';
import { Colors, FontSize, Spacing } from '@/src/constants/theme';
import {
  AccountRestoreEmptyError,
  useSyncManager,
  type AccountIntent,
} from '@/src/hooks/sync-manager-context';
import {
  clearOtpLastSentAt,
  getOtpLastSentAt,
  getOtpResendCooldownRemainingSeconds,
} from '@/src/sync/accountStorage';
import { SyncPayloadTooLargeError } from '@/src/sync/syncEngine';
import { router, useLocalSearchParams, type Href } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  AppState,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export function AccountVerifyOtpScreen() {
  const params = useLocalSearchParams<{
    email?: string;
    intent?: string;
    returnTo?: string;
  }>();
  const email = params.email ?? '';
  const intent: AccountIntent =
    params.intent === 'restore' ? 'restore' : 'create';
  const returnTo = params.returnTo ?? '/';
  const { sendOtp, verifyOtp } = useSyncManager();
  const [code, setCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [sentAt, setSentAt] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    let cancelled = false;
    void getOtpLastSentAt(email).then((storedSentAt) => {
      if (cancelled) return;
      setSentAt(storedSentAt ?? Date.now());
      setNow(Date.now());
    });
    return () => {
      cancelled = true;
    };
  }, [email]);

  const cooldown = useMemo(
    () => getOtpResendCooldownRemainingSeconds(sentAt, now),
    [sentAt, now]
  );

  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        setNow(Date.now());
      }
    });
    return () => subscription.remove();
  }, []);

  const submit = async () => {
    if (code.trim().length < 6) {
      Alert.alert('Enter your code', 'Enter the code from your email.');
      return;
    }
    setVerifying(true);
    try {
      const result = await verifyOtp(email, code, intent);
      await clearOtpLastSentAt();

      // Default to a clean app root so account stack / stale routes don't linger.
      // Mid-onboarding create still resumes that flow via accountCreated.
      const isOnboardingReturn = returnTo.startsWith('/onboarding');
      let destination: string = '/';
      if (
        !result.restored &&
        intent === 'create' &&
        isOnboardingReturn
      ) {
        const separator = returnTo.includes('?') ? '&' : '?';
        destination = `${returnTo}${separator}accountCreated=1`;
      }

      const successBody = result.restored
        ? 'Your account backup is loaded on this device.'
        : 'Your account is ready. Training data will sync while you stay signed in.';

      Alert.alert(
        'Successfully logged in',
        successBody,
        [
          {
            text: 'OK',
            onPress: () => {
              // Drop account screens from the stack, then land on a fresh root.
              if (router.canDismiss()) {
                router.dismissAll();
              }
              router.replace(destination as Href);
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error('Failed to verify account OTP:', error);
      if (
        error instanceof AccountRestoreEmptyError ||
        error instanceof SyncPayloadTooLargeError
      ) {
        Alert.alert('Backup could not be completed', error.message);
        return;
      }
      Alert.alert(
        'Code not accepted',
        'The code may be invalid or expired. Check it and try again.'
      );
    } finally {
      setVerifying(false);
    }
  };

  const resend = async () => {
    if (cooldown > 0 || resending) return;
    setResending(true);
    try {
      await sendOtp(email, intent);
      const nextSentAt = Date.now();
      setSentAt(nextSentAt);
      setNow(nextSentAt);
      Alert.alert('Code sent', 'Check your email for a new code.');
    } catch (error) {
      console.error('Failed to resend account OTP:', error);
      Alert.alert('Could not resend code', 'Please try again shortly.');
    } finally {
      setResending(false);
    }
  };

  return (
    <AppSafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Check your email</Text>
          <Text style={styles.subtitle}>
            Enter the one-time code sent to {email}.
          </Text>
        </View>

        <TextInput
          value={code}
          onChangeText={(value) =>
            setCode(value.replace(/\D/g, '').slice(0, 8))
          }
          placeholder="00000000"
          placeholderTextColor={Colors.textPlaceholder}
          style={styles.input}
          keyboardType="number-pad"
          autoComplete="one-time-code"
          textContentType="oneTimeCode"
          returnKeyType="done"
          onSubmitEditing={() => void submit()}
          editable={!verifying}
          accessibilityLabel="One-time code"
        />

        <TouchableOpacity
          style={[styles.primaryButton, verifying && styles.disabled]}
          onPress={() => void submit()}
          disabled={verifying}
        >
          <Text style={styles.primaryButtonText}>
            {verifying ? 'Restoring…' : 'Verify code'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => void resend()}
          disabled={sentAt === null || cooldown > 0 || resending}
        >
          <Text style={styles.secondaryButtonText}>
            {cooldown > 0
              ? `Resend code in ${cooldown}s`
              : resending
                ? 'Sending…'
                : 'Resend code'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.back()}
          disabled={verifying}
        >
          <Text style={styles.secondaryButtonText}>Change email</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundScreen,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: Spacing.xxl,
    gap: Spacing.xl,
  },
  header: {
    gap: Spacing.md,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: FontSize.displayXl,
    fontWeight: '700',
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: FontSize.xl,
    lineHeight: 24,
  },
  input: {
    backgroundColor: Colors.backgroundElevated,
    borderColor: Colors.backgroundSubtle,
    borderWidth: 1,
    borderRadius: 16,
    color: Colors.textPrimary,
    fontSize: FontSize.displayLg,
    // Do not set letterSpacing on TextInput — RN can leak it into other
    // inputs elsewhere in the app (e.g. workout search).
    textAlign: 'center',
    padding: Spacing.xl,
  },
  primaryButton: {
    backgroundColor: Colors.accent,
    borderRadius: 16,
    paddingVertical: Spacing.xl,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: Colors.textOnAccent,
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  secondaryButton: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  secondaryButtonText: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
});
