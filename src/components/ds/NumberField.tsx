import {
  color,
  MIN_TARGET_SIZE,
  radius,
  space,
  typography,
} from '@/src/constants/tokens';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export type NumberFieldState = 'default' | 'completed' | 'failed';

type NumberFieldProps = {
  /** Visible label and accessible name, e.g. "Weight (kg)". */
  label: string;
  /** Extra screen-reader context, e.g. "Set 2". Prefixed to the label. */
  accessibilityContext?: string;
  value: string;
  onChangeText: (value: string) => void;
  /** Unit or suggestion shown when empty, e.g. "kg" or "110". Never a fake "0". */
  placeholder?: string;
  /** Starting point for the steppers when the field is empty, e.g. a suggested weight. */
  suggestedValue?: number;
  step?: number;
  min?: number;
  max?: number;
  /** Allows a decimal point (weights); otherwise whole numbers only. */
  allowDecimal?: boolean;
  showSteppers?: boolean;
  /** Hide the visible label when a column header already shows it; the accessible name remains. */
  showLabel?: boolean;
  /** Spoken explanation, e.g. "Rate of perceived exertion, 1 to 10". */
  hint?: string;
  /** Validation message, shown in text and announced. Replaces the hint while shown. */
  error?: string;
  state?: NumberFieldState;
  editable?: boolean;
  inputAccessoryViewID?: string;
};

const REPEAT_DELAY_MS = 400;
const REPEAT_INTERVAL_MS = 90;
const INPUT_MIN_HEIGHT = 48;

function formatNumber(value: number): string {
  return String(Math.round(value * 100) / 100);
}

/**
 * Numeric input with optional −/+ steppers. Long-press a stepper to repeat;
 * each change gives a light haptic tick.
 */
export function NumberField({
  label,
  accessibilityContext,
  value,
  onChangeText,
  placeholder,
  suggestedValue,
  step = 1,
  min = 0,
  max = Number.MAX_SAFE_INTEGER,
  allowDecimal = false,
  showSteppers = false,
  showLabel = true,
  hint,
  error,
  state = 'default',
  editable = true,
  inputAccessoryViewID,
}: NumberFieldProps) {
  const [focused, setFocused] = useState(false);
  const repeatTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const repeatValue = useRef(0);

  const accessibleName = accessibilityContext
    ? `${accessibilityContext} ${label}`
    : label;
  const numericValue = value.trim() === '' ? null : Number(value);
  const baseValue =
    numericValue !== null && Number.isFinite(numericValue)
      ? numericValue
      : (suggestedValue ?? min);
  const canDecrease = editable && baseValue > min;
  const canIncrease = editable && baseValue < max;

  const stopRepeat = () => {
    if (repeatTimer.current) {
      clearTimeout(repeatTimer.current);
      repeatTimer.current = null;
    }
  };

  useEffect(() => stopRepeat, []);

  const applyStep = (direction: 1 | -1) => {
    const next = Math.min(
      max,
      Math.max(min, repeatValue.current + direction * step)
    );
    if (next === repeatValue.current) {
      stopRepeat();
      return;
    }
    repeatValue.current = next;
    void Haptics.selectionAsync();
    onChangeText(formatNumber(next));
  };

  const handleStepPress = (direction: 1 | -1) => {
    repeatValue.current = baseValue;
    applyStep(direction);
  };

  const handleStepLongPress = (direction: 1 | -1) => {
    repeatValue.current = baseValue;
    const tick = () => {
      applyStep(direction);
      repeatTimer.current = setTimeout(tick, REPEAT_INTERVAL_MS);
    };
    repeatTimer.current = setTimeout(tick, 0);
  };

  const handleChangeText = (text: string) => {
    const pattern = allowDecimal ? /[^0-9.]/g : /[^0-9]/g;
    onChangeText(text.replace(',', '.').replace(pattern, ''));
  };

  const borderColor = error
    ? color.danger
    : focused
      ? color.gold
      : state === 'completed'
        ? color.borderSubtle
        : state === 'failed'
          ? color.danger
          : color.borderStrong;

  return (
    <View style={styles.container}>
      {showLabel ? (
        <Text
          style={styles.label}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          {label}
        </Text>
      ) : null}
      <View style={styles.row}>
        {showSteppers ? (
          <Pressable
            onPress={() => handleStepPress(-1)}
            onLongPress={() => handleStepLongPress(-1)}
            onPressOut={stopRepeat}
            delayLongPress={REPEAT_DELAY_MS}
            disabled={!canDecrease}
            style={({ pressed }) => [
              styles.stepper,
              pressed && styles.stepperPressed,
              !canDecrease && styles.stepperDisabled,
            ]}
            accessibilityRole="button"
            accessibilityLabel={`Decrease ${accessibleName}`}
            accessibilityState={{ disabled: !canDecrease }}
          >
            <Ionicons
              name="remove"
              size={22}
              color={canDecrease ? color.textPrimary : color.textDisabled}
            />
          </Pressable>
        ) : null}
        <TextInput
          style={[
            styles.input,
            { borderColor },
            state === 'completed' && styles.inputCompleted,
          ]}
          value={value}
          onChangeText={handleChangeText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          placeholderTextColor={color.textTertiary}
          keyboardType={allowDecimal ? 'decimal-pad' : 'number-pad'}
          returnKeyType="done"
          submitBehavior="blurAndSubmit"
          editable={editable}
          selectTextOnFocus
          inputAccessoryViewID={inputAccessoryViewID}
          accessibilityLabel={accessibleName}
          accessibilityHint={error ?? hint}
          accessibilityState={{ disabled: !editable }}
        />
        {showSteppers ? (
          <Pressable
            onPress={() => handleStepPress(1)}
            onLongPress={() => handleStepLongPress(1)}
            onPressOut={stopRepeat}
            delayLongPress={REPEAT_DELAY_MS}
            disabled={!canIncrease}
            style={({ pressed }) => [
              styles.stepper,
              pressed && styles.stepperPressed,
              !canIncrease && styles.stepperDisabled,
            ]}
            accessibilityRole="button"
            accessibilityLabel={`Increase ${accessibleName}`}
            accessibilityState={{ disabled: !canIncrease }}
          >
            <Ionicons
              name="add"
              size={22}
              color={canIncrease ? color.textPrimary : color.textDisabled}
            />
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <Text style={styles.error} accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: space.xxs,
  },
  label: {
    ...typography.captionStrong,
    color: color.textSecondary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
  },
  input: {
    ...typography.numericMedium,
    flex: 1,
    minWidth: 0,
    minHeight: INPUT_MIN_HEIGHT,
    paddingHorizontal: space.xs,
    paddingVertical: space.xxs,
    borderRadius: radius.sm,
    borderWidth: 1,
    backgroundColor: color.surface2,
    color: color.textPrimary,
    textAlign: 'center',
  },
  inputCompleted: {
    color: color.textSecondary,
  },
  stepper: {
    width: MIN_TARGET_SIZE,
    height: MIN_TARGET_SIZE,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: color.borderStrong,
    backgroundColor: color.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperPressed: {
    backgroundColor: color.surface3,
  },
  stepperDisabled: {
    borderColor: color.surface3,
  },
  error: {
    ...typography.caption,
    color: color.danger,
  },
});
