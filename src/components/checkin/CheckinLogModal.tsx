import { checkinStyles as styles } from '@/src/components/checkin/checkinStyles';
import { Colors } from '@/src/constants/theme';
import type { CatalogueBehaviour } from '@/src/types/checkin';
import { modalSheetBottomPadding } from '@/src/utils/platform';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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

export function CheckinLogModal({
  visible,
  behaviour,
  dateLabel,
  value,
  saving,
  onClose,
  onSave,
}: CheckinLogModalProps) {
  const insets = useSafeAreaInsets();
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
  const sheetPaddingBottom = modalSheetBottomPadding(insets.bottom);

  const renderBooleanBody = () => (
    <View style={styles.booleanRow}>
      {[
        { label: 'Yes', optionValue: true },
        { label: 'No', optionValue: false },
      ].map((option) => {
        const isActive = value === option.optionValue;
        return (
          <TouchableOpacity
            key={option.label}
            style={[
              styles.booleanButton,
              isActive && styles.booleanButtonActive,
            ]}
            onPress={() => onSave(option.optionValue)}
            disabled={saving}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={option.label}
          >
            <Text
              style={[
                styles.booleanButtonText,
                isActive && styles.booleanButtonTextActive,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const renderScaleBody = () => {
    const selected =
      pendingScale ?? (typeof value === 'number' ? value : null);
    const endpointLabel =
      selected !== null
        ? scaleEndpointLabel(selected, behaviour.scaleLabels)
        : null;

    return (
      <View style={styles.scaleSection}>
        <Text style={styles.scaleSelectedNumber}>
          {selected !== null ? selected : '—'}
        </Text>
        <Text style={styles.scaleSelectedLabel}>
          {endpointLabel ?? (selected !== null ? 'Selected' : 'Tap a number')}
        </Text>

        <View style={styles.scaleTrack}>
          {SCALE_VALUES.map((scaleValue) => {
            const isActive = selected === scaleValue;
            return (
              <TouchableOpacity
                key={scaleValue}
                style={[styles.scaleDot, isActive && styles.scaleDotActive]}
                onPress={() => setPendingScale(scaleValue)}
                disabled={saving}
                accessibilityRole="button"
                accessibilityState={{ selected: isActive }}
                accessibilityLabel={`${scaleValue}${
                  behaviour.scaleLabels &&
                  scaleEndpointLabel(scaleValue, behaviour.scaleLabels)
                    ? `, ${scaleEndpointLabel(scaleValue, behaviour.scaleLabels)}`
                    : ''
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
              </TouchableOpacity>
            );
          })}
        </View>

        {behaviour.scaleLabels ? (
          <View style={styles.scaleLabelRow}>
            <Text style={styles.scaleLabel}>{behaviour.scaleLabels.low}</Text>
            <Text style={styles.scaleLabel}>{behaviour.scaleLabels.high}</Text>
          </View>
        ) : null}

        <TouchableOpacity
          style={[
            styles.modalPrimaryButton,
            (saving || selected === null) && styles.modalPrimaryButtonDisabled,
          ]}
          onPress={() => {
            if (selected !== null) {
              onSave(selected);
            }
          }}
          disabled={saving || selected === null}
          accessibilityRole="button"
          accessibilityLabel={`Save ${behaviour.label}`}
        >
          <Text style={styles.modalPrimaryButtonText}>
            {saving ? 'Saving…' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderChoiceBody = () => (
    <View style={styles.optionRow}>
      {(behaviour.options ?? []).map((option) => {
        const isActive = value === option;
        return (
          <TouchableOpacity
            key={option}
            style={[styles.optionChip, isActive && styles.optionChipActive]}
            onPress={() => onSave(option)}
            disabled={saving}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
          >
            <Text
              style={[
                styles.optionChipText,
                isActive && styles.optionChipTextActive,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const renderQuantityBody = () => {
    const canDecrease = quantity - quantityStep >= 0;
    const canIncrease = quantity + quantityStep <= quantityMax;
    return (
      <View style={styles.section}>
        <View style={styles.stepperRow}>
          <TouchableOpacity
            style={[
              styles.stepperButton,
              !canDecrease && styles.stepperButtonDisabled,
            ]}
            onPress={() => setQuantity(quantity - quantityStep)}
            disabled={!canDecrease}
            accessibilityRole="button"
            accessibilityLabel={`Decrease by ${quantityStep}`}
          >
            <Ionicons name="remove" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.stepperValueBlock}>
            <Text style={styles.stepperValue}>{quantity}</Text>
            {behaviour.unit ? (
              <Text style={styles.stepperUnit}>{behaviour.unit}</Text>
            ) : null}
          </View>
          <TouchableOpacity
            style={[
              styles.stepperButton,
              !canIncrease && styles.stepperButtonDisabled,
            ]}
            onPress={() => setQuantity(quantity + quantityStep)}
            disabled={!canIncrease}
            accessibilityRole="button"
            accessibilityLabel={`Increase by ${quantityStep}`}
          >
            <Ionicons name="add" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[
            styles.modalPrimaryButton,
            saving && styles.modalPrimaryButtonDisabled,
          ]}
          onPress={() => onSave(quantity)}
          disabled={saving}
          accessibilityRole="button"
          accessibilityLabel={`Save ${behaviour.label}`}
        >
          <Text style={styles.modalPrimaryButtonText}>
            {saving ? 'Saving…' : 'Save'}
          </Text>
        </TouchableOpacity>
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
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Pressable
          style={styles.modalDismissArea}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Dismiss"
        />
        <View
          style={[styles.modalContent, { paddingBottom: sheetPaddingBottom }]}
        >
          <View style={styles.modalGrabber} />
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderText}>
              <Text style={styles.modalTitle}>{behaviour.label}</Text>
              <Text style={styles.modalSubtitle}>
                {behaviour.description
                  ? `${dateLabel} · ${behaviour.description}`
                  : dateLabel}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Close"
            >
              <Ionicons name="close" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {renderBody()}
        </View>
      </View>
    </Modal>
  );
}
