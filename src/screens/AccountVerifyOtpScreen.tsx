import { AppSafeAreaView } from '@/src/components/AppSafeAreaView';
import { Colors, FontSize, Spacing } from '@/src/constants/theme';
import {
  AccountRestoreEmptyError,
  useSyncManager,
  type AccountIntent,
} from '@/src/hooks/sync-manager-context';
import { SyncPayloadTooLargeError } from '@/src/sync/syncEngine';
import { router, useLocalSearchParams, type Href } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const RESEND_COOLDOWN_SECONDS = 60;

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
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const submit = async () => {
    if (code.trim().length < 6) {
      Alert.alert('Enter your code', 'Enter the code from your email.');
      return;
    }
    setVerifying(true);
    try {
      const result = await verifyOtp(email, code, intent);
      const destination = result.restored
        ? '/'
        : intent === 'create'
          ? `${returnTo}${returnTo.includes('?') ? '&' : '?'}accountCreated=1`
          : returnTo;
      router.replace(destination as Href);
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
      setCooldown(RESEND_COOLDOWN_SECONDS);
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
          disabled={cooldown > 0 || resending}
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
