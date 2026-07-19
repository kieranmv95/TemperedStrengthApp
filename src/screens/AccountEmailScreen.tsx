import { AppSafeAreaView } from '@/src/components/AppSafeAreaView';
import { Colors, FontSize, Spacing } from '@/src/constants/theme';
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
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
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
          <Text style={styles.title}>
            {intent === 'restore' ? 'Welcome back' : 'Create your account'}
          </Text>
          <Text style={styles.subtitle}>
            {intent === 'restore'
              ? 'Enter the email linked to your account to restore your data.'
              : 'We’ll email you a one-time code. No password needed.'}
          </Text>
        </View>

        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          placeholderTextColor={Colors.textPlaceholder}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          returnKeyType="send"
          onSubmitEditing={() => void submit()}
          editable={!sending}
          accessibilityLabel="Email address"
        />

        <TouchableOpacity
          style={[styles.primaryButton, sending && styles.disabled]}
          onPress={() => void submit()}
          disabled={sending}
        >
          <Text style={styles.primaryButtonText}>
            {sending ? 'Sending…' : 'Send code'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.back()}
          disabled={sending}
        >
          <Text style={styles.secondaryButtonText}>Back</Text>
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
    fontSize: FontSize.xl,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xl,
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
    paddingVertical: Spacing.md,
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
