import { checkinStyles as styles } from '@/src/components/checkin/checkinStyles';
import { BottomSheet, FilterChip } from '@/src/components/ds';
import { color } from '@/src/constants/tokens';
import type { CatalogueBehaviour } from '@/src/types/checkin';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

const SCALE_VALUES = [1, 2, 3, 4, 5] as const;

type CheckinLogModalProps = {
  visible: boolean;
  behaviour: CatalogueBehaviour | null;
  /** Human readable date the value is saved against, e.g. "Today". */
  dateLabel: string;
  value: boolean | number | string | undefined;
  saving: boolean;
  onClose: () => void;
  onSave: (value: boolean | number | string) => void;
};

function scaleEndpointLabel(
  scaleValue: number,
  labels: { low: string; high: string } | undefined
): string | null {
  if (!labels) {
    return null;
  }
  if (scaleValue === 1) return labels.low;
  if (scaleValue === 5) return labels.high;
  return null;
}

type SaveButtonProps = {
  label: string;
  saving: boolean;
  disabled: boolean;
  onPress: () => void;
};

function SaveButton({ label, saving, disabled, onPress }: SaveButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.primaryButton,
        pressed && !disabled && styles.primaryButtonPressed,
        disabled && styles.primaryButtonDisabled,
      ]}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={`Save ${label}`}
      accessibilityState={{ disabled, busy: saving }}
    >
      <Text
        style={[
          styles.primaryButtonText,
          disabled && styles.primaryButtonTextDisabled,
        ]}
      >
        {saving ? 'Saving…' : 'Save'}
      </Text>
    </Pressable>
  );
}

export function CheckinLogModal({
  visible,
  behaviour,
  dateLabel,
  value,
  saving,
  onClose,
  onSave,
}: CheckinLogModalProps) {
  const [quantity, setQuantity] = useState(0);
  const [pendingScale, setPendingScale] = useState<number | null>(null);

  useEffect(() => {
    if (!visible || !behaviour) {
      return;
    }
    if (behaviour.responseType === 'quantity') {
      setQuantity(typeof value === 'number' ? value : 0);
    }
    if (behaviour.responseType === 'scale_1_5') {
      setPendingScale(typeof value === 'number' ? value : null);
    }
  }, [visible, behaviour, value]);

  if (!behaviour) {
    return null;
  }

  const quantityStep = behaviour.quantityStep ?? 1;
  const quantityMax = behaviour.quantityMax ?? Number.MAX_SAFE_INTEGER;

  const renderBooleanBody = () => (
    <View style={styles.booleanRow}>
      {[
        { label: 'Yes', optionValue: true },
        { label: 'No', optionValue: false },
      ].map((option) => {
        const isActive = value === option.optionValue;
        return (
          <Pressable
            key={option.label}
            style={({ pressed }) => [
              styles.booleanButton,
              pressed && !isActive && styles.booleanButtonPressed,
              isActive && styles.booleanButtonActive,
            ]}
            onPress={() => onSave(option.optionValue)}
            disabled={saving}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive, disabled: saving }}
            accessibilityLabel={option.label}
          >
            {isActive ? (
              <Ionicons name="checkmark" size={20} color={color.gold} />
            ) : null}
            <Text
              style={[
                styles.booleanButtonText,
                isActive && styles.booleanButtonTextActive,
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );

  const renderScaleBody = () => {
    const selected = pendingScale ?? (typeof value === 'number' ? value : null);
    const endpointLabel =
      selected !== null
        ? scaleEndpointLabel(selected, behaviour.scaleLabels)
        : null;
    const selectedCaption =
      endpointLabel ?? (selected !== null ? 'Selected' : 'Tap a number');

    return (
      <View style={styles.scaleSection}>
        <View
          style={styles.scaleSelected}
          accessible
          accessibilityLabel={
            selected !== null
              ? `${selected} out of 5 selected${
                  endpointLabel ? `, ${endpointLabel}` : ''
                }`
              : 'Nothing selected, tap a number'
          }
          accessibilityLiveRegion="polite"
        >
          <Text style={styles.scaleSelectedNumber}>
            {selected !== null ? selected : '—'}
          </Text>
          <Text style={styles.scaleSelectedLabel}>{selectedCaption}</Text>
        </View>

        <View style={styles.scaleTrack}>
          {SCALE_VALUES.map((scaleValue) => {
            const isActive = selected === scaleValue;
            const scaleLabel = scaleEndpointLabel(
              scaleValue,
              behaviour.scaleLabels
            );
            return (
              <Pressable
                key={scaleValue}
                style={({ pressed }) => [
                  styles.scaleDot,
                  pressed && !isActive && styles.scaleDotPressed,
                  isActive && styles.scaleDotActive,
                ]}
                onPress={() => setPendingScale(scaleValue)}
                disabled={saving}
                accessibilityRole="button"
                accessibilityState={{ selected: isActive, disabled: saving }}
                accessibilityLabel={`${scaleValue}${
                  scaleLabel ? `, ${scaleLabel}` : ''
                }`}
              >
                <Text
                  style={[
                    styles.scaleDotText,
                    isActive && styles.scaleDotTextActive,
                  ]}
                >
                  {scaleValue}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {behaviour.scaleLabels ? (
          <View
            style={styles.scaleLabelRow}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          >
            <Text style={styles.scaleLabel}>{behaviour.scaleLabels.low}</Text>
            <Text style={styles.scaleLabel}>{behaviour.scaleLabels.high}</Text>
          </View>
        ) : null}

        <SaveButton
          label={behaviour.label}
          saving={saving}
          disabled={saving || selected === null}
          onPress={() => {
            if (selected !== null) {
              onSave(selected);
            }
          }}
        />
      </View>
    );
  };

  const renderChoiceBody = () => (
    <View style={styles.optionRow}>
      {(behaviour.options ?? []).map((option) => (
        <FilterChip
          key={option}
          label={option}
          selected={value === option}
          onPress={() => onSave(option)}
          disabled={saving}
        />
      ))}
    </View>
  );

  const renderQuantityBody = () => {
    const canDecrease = quantity - quantityStep >= 0;
    const canIncrease = quantity + quantityStep <= quantityMax;
    return (
      <View style={styles.section}>
        <View style={styles.stepperRow}>
          <Pressable
            style={({ pressed }) => [
              styles.stepperButton,
              pressed && canDecrease && styles.stepperButtonPressed,
              !canDecrease && styles.stepperButtonDisabled,
            ]}
            onPress={() => setQuantity(quantity - quantityStep)}
            disabled={!canDecrease}
            accessibilityRole="button"
            accessibilityLabel={`Decrease by ${quantityStep}`}
            accessibilityState={{ disabled: !canDecrease }}
          >
            <Ionicons
              name="remove"
              size={22}
              color={canDecrease ? color.textPrimary : color.textDisabled}
            />
          </Pressable>
          <View
            style={styles.stepperValueBlock}
            accessible
            accessibilityLabel={
              behaviour.unit ? `${quantity} ${behaviour.unit}` : `${quantity}`
            }
            accessibilityLiveRegion="polite"
          >
            <Text style={styles.stepperValue}>{quantity}</Text>
            {behaviour.unit ? (
              <Text style={styles.stepperUnit}>{behaviour.unit}</Text>
            ) : null}
          </View>
          <Pressable
            style={({ pressed }) => [
              styles.stepperButton,
              pressed && canIncrease && styles.stepperButtonPressed,
              !canIncrease && styles.stepperButtonDisabled,
            ]}
            onPress={() => setQuantity(quantity + quantityStep)}
            disabled={!canIncrease}
            accessibilityRole="button"
            accessibilityLabel={`Increase by ${quantityStep}`}
            accessibilityState={{ disabled: !canIncrease }}
          >
            <Ionicons
              name="add"
              size={22}
              color={canIncrease ? color.textPrimary : color.textDisabled}
            />
          </Pressable>
        </View>
        <SaveButton
          label={behaviour.label}
          saving={saving}
          disabled={saving}
          onPress={() => onSave(quantity)}
        />
      </View>
    );
  };

  const renderBody = () => {
    switch (behaviour.responseType) {
      case 'boolean':
        return renderBooleanBody();
      case 'scale_1_5':
        return renderScaleBody();
      case 'choice':
        return renderChoiceBody();
      case 'quantity':
        return renderQuantityBody();
      default:
        return null;
    }
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} title={behaviour.label}>
      <Text style={styles.modalSubtitle}>
        {behaviour.description
          ? `${dateLabel} · ${behaviour.description}`
          : dateLabel}
      </Text>
      {renderBody()}
    </BottomSheet>
  );
}
