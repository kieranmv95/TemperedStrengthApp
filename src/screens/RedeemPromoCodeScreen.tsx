import { AppSafeAreaView, AppScrollView } from '@/src/components/AppSafeAreaView';
import { BorderRadius, Colors, FontSize, Spacing } from '@/src/constants/theme';
import { useSubscription } from '@/src/hooks/use-subscription';
import {
  isValidPromoCodeFormat,
  isValidPromoEmail,
  normalizePromoCode,
  redeemPromoCode,
  validatePromoCode,
} from '@/src/services/promoCodeService';
import { buildPromoProGrant } from '@/src/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type RedeemStep = 'code' | 'password' | 'email';

function formatExpiryDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function RedeemPromoCodeScreen() {
  const { applyPromoProGrant } = useSubscription();
  const [step, setStep] = useState<RedeemStep>('code');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [requiresPassword, setRequiresPassword] = useState(false);
  const [daysGranted, setDaysGranted] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContinueCode = async () => {
    Keyboard.dismiss();
    setError(null);

    const normalized = normalizePromoCode(code);
    if (!isValidPromoCodeFormat(normalized)) {
      setError('Enter a valid code (2–32 letters, numbers, - or _).');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await validatePromoCode(normalized);
      if (!result.ok) {
        setError(result.message);
        return;
      }

      setCode(normalized);
      setDaysGranted(result.daysGranted);
      setRequiresPassword(result.requiresPassword);
      setPassword('');
      setStep(result.requiresPassword ? 'password' : 'email');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinuePassword = () => {
    Keyboard.dismiss();
    setError(null);
    if (password.trim().length === 0) {
      setError('Enter the password for this code.');
      return;
    }
    setStep('email');
  };

  const handleRedeem = async () => {
    Keyboard.dismiss();
    setError(null);

    if (!isValidPromoEmail(email)) {
      setError('Enter a valid email.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await redeemPromoCode({
        code,
        email,
        password: requiresPassword ? password : undefined,
      });
      if (!result.ok) {
        if (result.error === 'requires_password') {
          setRequiresPassword(true);
          setStep('password');
        }
        setError(result.message);
        return;
      }

      const grant = buildPromoProGrant({
        code,
        email,
        daysGranted: result.daysGranted,
      });
      await applyPromoProGrant(grant);

      Alert.alert(
        'Pro unlocked',
        `Pro unlocked for ${result.daysGranted} day${result.daysGranted === 1 ? '' : 's'}. Expires ${formatExpiryDate(grant.expiresAt)}.`,
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (redeemError) {
      console.error('Failed to apply promo grant:', redeemError);
      setError('Could not save Pro access on this device. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrimaryPress = () => {
    if (isSubmitting) {
      return;
    }
    if (step === 'code') {
      void handleContinueCode();
      return;
    }
    if (step === 'password') {
      handleContinuePassword();
      return;
    }
    void handleRedeem();
  };

  const primaryLabel =
    step === 'email' ? 'Redeem' : step === 'password' ? 'Continue' : 'Continue';

  return (
    <AppSafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBackButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Redeem Pro code</Text>
        <View style={styles.headerSpacer} />
      </View>

      <AppScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.subtitle}>
          Enter a promo code to unlock Tempered Strength Pro on this device.
        </Text>

        {daysGranted !== null ? (
          <Text style={styles.daysHint}>
            This code grants {daysGranted} day{daysGranted === 1 ? '' : 's'} of
            Pro.
          </Text>
        ) : null}

        {step === 'code' ? (
          <View style={styles.fieldBlock}>
            <Text style={styles.fieldLabel}>Code</Text>
            <TextInput
              style={styles.input}
              value={code}
              onChangeText={(next) => {
                setCode(next.toUpperCase());
                setError(null);
              }}
              placeholder="PROMOCODE"
              placeholderTextColor={Colors.textPlaceholder}
              autoCapitalize="characters"
              autoCorrect={false}
              autoComplete="off"
              returnKeyType="done"
              editable={!isSubmitting}
              onSubmitEditing={handlePrimaryPress}
              accessibilityLabel="Promo code"
              maxLength={32}
            />
          </View>
        ) : null}

        {step === 'password' ? (
          <View style={styles.fieldBlock}>
            <Text style={styles.fieldLabel}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={(next) => {
                setPassword(next);
                setError(null);
              }}
              placeholder="Password"
              placeholderTextColor={Colors.textPlaceholder}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              editable={!isSubmitting}
              onSubmitEditing={handlePrimaryPress}
              accessibilityLabel="Promo code password"
            />
          </View>
        ) : null}

        {step === 'email' ? (
          <View style={styles.fieldBlock}>
            <Text style={styles.fieldLabel}>Email</Text>
            <Text style={styles.fieldHint}>
              Used for redemption records only. This does not create an account.
            </Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={(next) => {
                setEmail(next);
                setError(null);
              }}
              placeholder="you@example.com"
              placeholderTextColor={Colors.textPlaceholder}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              returnKeyType="done"
              editable={!isSubmitting}
              onSubmitEditing={handlePrimaryPress}
              accessibilityLabel="Email for redemption"
            />
          </View>
        ) : null}

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity
          style={[
            styles.primaryButton,
            isSubmitting && styles.primaryButtonDisabled,
          ]}
          onPress={handlePrimaryPress}
          disabled={isSubmitting}
          accessibilityRole="button"
          accessibilityLabel={primaryLabel}
        >
          {isSubmitting ? (
            <ActivityIndicator color={Colors.textOnAccent} />
          ) : (
            <Text style={styles.primaryButtonText}>{primaryLabel}</Text>
          )}
        </TouchableOpacity>

        {step !== 'code' ? (
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => {
              setError(null);
              if (step === 'email' && requiresPassword) {
                setStep('password');
                return;
              }
              setStep('code');
              setRequiresPassword(false);
              setDaysGranted(null);
              setPassword('');
            }}
            disabled={isSubmitting}
            accessibilityRole="button"
            accessibilityLabel="Back to previous step"
          >
            <Text style={styles.secondaryButtonText}>Back</Text>
          </TouchableOpacity>
        ) : null}
      </AppScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundScreen,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.backgroundElevated,
  },
  headerBackButton: {
    padding: Spacing.xs,
  },
  headerTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.displaySm,
    fontWeight: '700',
  },
  headerSpacer: {
    width: 32,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: Spacing.xxl,
    paddingBottom: Spacing.section,
    gap: Spacing.xl,
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    fontWeight: '500',
    lineHeight: 22,
  },
  daysHint: {
    color: Colors.accent,
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  fieldBlock: {
    gap: Spacing.sm,
  },
  fieldLabel: {
    color: Colors.textPrimary,
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  fieldHint: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
    lineHeight: 18,
  },
  input: {
    backgroundColor: Colors.backgroundElevated,
    borderRadius: BorderRadius.xxl,
    borderWidth: 1,
    borderColor: Colors.backgroundSubtle,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    color: Colors.textPrimary,
    fontSize: FontSize.xl,
  },
  errorText: {
    color: Colors.destructive,
    fontSize: FontSize.lg,
    lineHeight: 20,
  },
  primaryButton: {
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.xxl,
    paddingVertical: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: Colors.textOnAccent,
    fontSize: FontSize.xl,
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
});
