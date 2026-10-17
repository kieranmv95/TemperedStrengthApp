import { AppSafeAreaView, AppScrollView } from '@/src/components/ds';
import {
  color,
  MIN_TARGET_SIZE,
  radius,
  space,
  typography,
} from '@/src/constants/tokens';
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
  Pressable,
  StyleSheet,
  Text,
  TextInput,
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
        <View style={styles.headerRow}>
          <Pressable
            style={styles.headerBackButton}
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Back"
          >
            <Ionicons name="arrow-back" size={24} color={color.textPrimary} />
          </Pressable>
          <Text style={styles.headerTitle} accessibilityRole="header">
            Redeem Pro code
          </Text>
        </View>
        <Text style={styles.subtitle}>
          Enter a promo code to unlock Tempered Strength Pro on this device.
        </Text>
      </View>

      <AppScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {daysGranted !== null ? (
          <Text style={styles.daysHint}>
            This code grants {daysGranted} day{daysGranted === 1 ? '' : 's'} of
            Pro.
          </Text>
        ) : null}

        {step === 'code' ? (
          <View style={styles.fieldBlock}>
            <Text
              style={styles.fieldLabel}
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
            >
              Code
            </Text>
            <TextInput
              style={[styles.input, error ? styles.inputError : null]}
              value={code}
              onChangeText={(next) => {
                setCode(next.toUpperCase());
                setError(null);
              }}
              placeholder="PROMOCODE"
              placeholderTextColor={color.textTertiary}
              autoCapitalize="characters"
              autoCorrect={false}
              autoComplete="off"
              returnKeyType="done"
              editable={!isSubmitting}
              onSubmitEditing={handlePrimaryPress}
              accessibilityLabel="Promo code"
              accessibilityHint={error ?? undefined}
              accessibilityState={{ disabled: isSubmitting }}
              maxLength={32}
            />
          </View>
        ) : null}

        {step === 'password' ? (
          <View style={styles.fieldBlock}>
            <Text
              style={styles.fieldLabel}
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
            >
              Password
            </Text>
            <TextInput
              style={[styles.input, error ? styles.inputError : null]}
              value={password}
              onChangeText={(next) => {
                setPassword(next);
                setError(null);
              }}
              placeholder="Password"
              placeholderTextColor={color.textTertiary}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              editable={!isSubmitting}
              onSubmitEditing={handlePrimaryPress}
              accessibilityLabel="Promo code password"
              accessibilityHint={error ?? undefined}
              accessibilityState={{ disabled: isSubmitting }}
            />
          </View>
        ) : null}

        {step === 'email' ? (
          <View style={styles.fieldBlock}>
            <Text
              style={styles.fieldLabel}
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
            >
              Email
            </Text>
            <Text
              style={styles.fieldHint}
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
            >
              Used for redemption records only. This does not create an account.
            </Text>
            <TextInput
              style={[styles.input, error ? styles.inputError : null]}
              value={email}
              onChangeText={(next) => {
                setEmail(next);
                setError(null);
              }}
              placeholder="you@example.com"
              placeholderTextColor={color.textTertiary}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              returnKeyType="done"
              editable={!isSubmitting}
              onSubmitEditing={handlePrimaryPress}
              accessibilityLabel="Email for redemption"
              accessibilityHint={
                error ??
                'Used for redemption records only. This does not create an account.'
              }
              accessibilityState={{ disabled: isSubmitting }}
            />
          </View>
        ) : null}

        {error ? (
          <View
            style={styles.errorRow}
            accessible
            accessibilityRole="alert"
            accessibilityLiveRegion="polite"
            accessibilityLabel={error}
          >
            <Ionicons name="alert-circle" size={18} color={color.danger} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.actions}>
          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.primaryButtonPressed,
              isSubmitting && styles.primaryButtonDisabled,
            ]}
            onPress={handlePrimaryPress}
            disabled={isSubmitting}
            accessibilityRole="button"
            accessibilityLabel={primaryLabel}
            accessibilityState={{ disabled: isSubmitting, busy: isSubmitting }}
          >
            {isSubmitting ? (
              <ActivityIndicator color={color.onGold} />
            ) : (
              <Text style={styles.primaryButtonText}>{primaryLabel}</Text>
            )}
          </Pressable>

          {step !== 'code' ? (
            <Pressable
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed && styles.secondaryButtonPressed,
              ]}
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
              accessibilityState={{ disabled: isSubmitting }}
            >
              <Text style={styles.secondaryButtonText}>Back</Text>
            </Pressable>
          ) : null}
        </View>
      </AppScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.bg,
  },
  header: {
    paddingHorizontal: space.md,
    paddingTop: space.md,
    paddingBottom: space.sm,
    gap: space.xxs,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xxs,
  },
  headerBackButton: {
    width: MIN_TARGET_SIZE,
    height: MIN_TARGET_SIZE,
    justifyContent: 'center',
    marginLeft: -space.xs,
  },
  headerTitle: {
    ...typography.title1,
    color: color.textPrimary,
    flex: 1,
    minWidth: 0,
  },
  subtitle: {
    ...typography.callout,
    color: color.textSecondary,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: space.md,
    paddingBottom: space.xxl,
    gap: space.lg,
  },
  daysHint: {
    ...typography.calloutStrong,
    fontVariant: ['tabular-nums'],
    color: color.textPrimary,
  },
  fieldBlock: {
    gap: space.xxs,
  },
  fieldLabel: {
    ...typography.captionStrong,
    color: color.textSecondary,
  },
  fieldHint: {
    ...typography.caption,
    color: color.textTertiary,
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
  inputError: {
    borderColor: color.danger,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space.xs,
  },
  errorText: {
    ...typography.callout,
    color: color.danger,
    flex: 1,
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
  primaryButtonDisabled: {
    opacity: 0.6,
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
});
