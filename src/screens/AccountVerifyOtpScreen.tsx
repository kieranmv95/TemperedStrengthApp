import { AppSafeAreaView } from '@/src/components/ds';
import {
  color,
  MIN_TARGET_SIZE,
  radius,
  space,
  typography,
} from '@/src/constants/tokens';
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
  Pressable,
  StyleSheet,
  Text,
  TextInput,
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
  const [now, setNow] = useState(() => Date.now());

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
      if (!result.restored && intent === 'create' && isOnboardingReturn) {
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

  const resendDisabled = sentAt === null || cooldown > 0 || resending;
  const resendLabel =
    cooldown > 0
      ? `Resend code in ${cooldown}s`
      : resending
        ? 'Sending…'
        : 'Resend code';

  return (
    <AppSafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Text style={styles.title} accessibilityRole="header">
            Check your email
          </Text>
          <Text style={styles.subtitle}>
            Enter the one-time code sent to {email}.
          </Text>
        </View>

        <View style={styles.field}>
          <Text
            style={styles.fieldLabel}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          >
            One-time code
          </Text>
          <TextInput
            value={code}
            onChangeText={(value) =>
              setCode(value.replace(/\D/g, '').slice(0, 8))
            }
            placeholder="00000000"
            placeholderTextColor={color.textTertiary}
            style={styles.input}
            keyboardType="number-pad"
            autoComplete="one-time-code"
            textContentType="oneTimeCode"
            returnKeyType="done"
            onSubmitEditing={() => void submit()}
            editable={!verifying}
            accessibilityLabel="One-time code"
            accessibilityState={{ disabled: verifying }}
          />
        </View>

        <View style={styles.actions}>
          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.primaryButtonPressed,
              verifying && styles.disabled,
            ]}
            onPress={() => void submit()}
            disabled={verifying}
            accessibilityRole="button"
            accessibilityLabel={verifying ? 'Restoring' : 'Verify code'}
            accessibilityState={{ disabled: verifying, busy: verifying }}
          >
            <Text style={styles.primaryButtonText}>
              {verifying ? 'Restoring…' : 'Verify code'}
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.secondaryButton,
              resendDisabled && styles.secondaryButtonDisabled,
              pressed && styles.secondaryButtonPressed,
            ]}
            onPress={() => void resend()}
            disabled={resendDisabled}
            accessibilityRole="button"
            accessibilityLabel={resendLabel}
            accessibilityState={{ disabled: resendDisabled, busy: resending }}
          >
            <Text
              style={[
                styles.secondaryButtonText,
                resendDisabled && styles.secondaryButtonTextDisabled,
              ]}
            >
              {resendLabel}
            </Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.textButton,
              pressed && styles.textButtonPressed,
            ]}
            onPress={() => router.back()}
            disabled={verifying}
            accessibilityRole="button"
            accessibilityLabel="Change email"
            accessibilityState={{ disabled: verifying }}
          >
            <Text style={styles.textButtonText}>Change email</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.bg,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: space.md,
    gap: space.xl,
  },
  header: {
    gap: space.xs,
  },
  title: {
    ...typography.title1,
    color: color.textPrimary,
  },
  subtitle: {
    ...typography.body,
    color: color.textSecondary,
  },
  field: {
    gap: space.xxs,
  },
  fieldLabel: {
    ...typography.captionStrong,
    color: color.textSecondary,
  },
  input: {
    ...typography.numericMedium,
    minHeight: MIN_TARGET_SIZE + space.sm,
    paddingHorizontal: space.sm,
    paddingVertical: space.xs,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: color.borderStrong,
    backgroundColor: color.surface2,
    color: color.textPrimary,
    // Do not set letterSpacing on TextInput — RN can leak it into other
    // inputs elsewhere in the app (e.g. workout search).
    textAlign: 'center',
  },
  actions: {
    gap: space.xs,
  },
  primaryButton: {
    minHeight: MIN_TARGET_SIZE,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.lg,
    backgroundColor: color.gold,
  },
  primaryButtonPressed: {
    backgroundColor: color.goldStrong,
  },
  primaryButtonText: {
    ...typography.calloutStrong,
    color: color.onGold,
  },
  secondaryButton: {
    minHeight: MIN_TARGET_SIZE,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.lg,
    borderWidth: 1,
    borderColor: color.borderStrong,
  },
  secondaryButtonPressed: {
    backgroundColor: color.surface3,
  },
  secondaryButtonDisabled: {
    borderColor: color.surface3,
  },
  secondaryButtonText: {
    ...typography.calloutStrong,
    fontVariant: ['tabular-nums'],
    color: color.textPrimary,
  },
  secondaryButtonTextDisabled: {
    color: color.textDisabled,
  },
  textButton: {
    minHeight: MIN_TARGET_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
  },
  textButtonPressed: {
    backgroundColor: color.surface3,
  },
  textButtonText: {
    ...typography.calloutStrong,
    color: color.textSecondary,
  },
  disabled: {
    opacity: 0.6,
  },
});
