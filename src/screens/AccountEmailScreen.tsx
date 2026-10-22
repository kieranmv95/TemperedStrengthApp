import { AppSafeAreaView } from '@/src/components/ds';
import {
  color,
  MIN_TARGET_SIZE,
  radius,
  space,
  typography,
} from '@/src/constants/tokens';
import {
  type AccountIntent,
  useSyncManager,
} from '@/src/hooks/sync-manager-context';
import { router, useLocalSearchParams, type Href } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

function parseIntent(value: string | string[] | undefined): AccountIntent {
  return value === 'restore' ? 'restore' : 'create';
}

export function AccountEmailScreen() {
  const params = useLocalSearchParams<{
    intent?: string;
    returnTo?: string;
  }>();
  const intent = parseIntent(params.intent);
  const returnTo = params.returnTo ?? '/';
  const { isConfigured, sendOtp } = useSyncManager();
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);

  const submit = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail.includes('@')) {
      Alert.alert(
        'Enter a valid email',
        'Check your email address and try again.'
      );
      return;
    }
    if (!isConfigured) {
      Alert.alert(
        'Account setup unavailable',
        'Supabase environment variables have not been configured for this build.'
      );
      return;
    }
    setSending(true);
    try {
      await sendOtp(normalizedEmail, intent);
      router.push({
        pathname: '/account/verify-otp',
        params: {
          email: normalizedEmail,
          intent,
          returnTo,
        },
      } as unknown as Href);
    } catch (error) {
      console.error('Failed to send account OTP:', error);
      Alert.alert(
        intent === 'restore' ? 'Account not found' : 'Could not send code',
        intent === 'restore'
          ? 'We could not find an account for that email. Check the address or create a new account.'
          : 'Please check your connection and try again.'
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <AppSafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Text style={styles.title} accessibilityRole="header">
            {intent === 'restore' ? 'Welcome back' : 'Create your account'}
          </Text>
          <Text style={styles.subtitle}>
            {intent === 'restore'
              ? 'Enter the email linked to your account to restore your data.'
              : 'We’ll email you a one-time code. No password needed.'}
          </Text>
        </View>

        <View style={styles.field}>
          <Text
            style={styles.fieldLabel}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          >
            Email address
          </Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor={color.textTertiary}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            returnKeyType="send"
            onSubmitEditing={() => void submit()}
            editable={!sending}
            accessibilityLabel="Email address"
            accessibilityState={{ disabled: sending }}
          />
        </View>

        <View style={styles.actions}>
          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.primaryButtonPressed,
              sending && styles.disabled,
            ]}
            onPress={() => void submit()}
            disabled={sending}
            accessibilityRole="button"
            accessibilityLabel={sending ? 'Sending code' : 'Send code'}
            accessibilityState={{ disabled: sending, busy: sending }}
          >
            <Text style={styles.primaryButtonText}>
              {sending ? 'Sending…' : 'Send code'}
            </Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && styles.secondaryButtonPressed,
            ]}
            onPress={() => router.back()}
            disabled={sending}
            accessibilityRole="button"
            accessibilityLabel="Back"
            accessibilityState={{ disabled: sending }}
          >
            <Text style={styles.secondaryButtonText}>Back</Text>
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
    ...typography.body,
    minHeight: MIN_TARGET_SIZE + space.xxs,
    paddingHorizontal: space.sm,
    paddingVertical: space.xs,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: color.borderStrong,
    backgroundColor: color.surface2,
    color: color.textPrimary,
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
  secondaryButtonText: {
    ...typography.calloutStrong,
    color: color.textPrimary,
  },
  disabled: {
    opacity: 0.6,
  },
});
