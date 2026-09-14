import { checkinStyles as styles } from '@/src/components/checkin/checkinStyles';
import { Colors } from '@/src/constants/theme';
import type { CatalogueBehaviour } from '@/src/types/checkin';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';

const SCALE_VALUES = [1, 2, 3, 4, 5];

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

  useEffect(() => {
    if (!visible || behaviour?.responseType !== 'quantity') {
      return;
    }
    setQuantity(typeof value === 'number' ? value : 0);
  }, [visible, behaviour, value]);

  if (!behaviour) {
    return null;
  }

  const quantityStep = behaviour.quantityStep ?? 1;
  const quantityMax = behaviour.quantityMax ?? Number.MAX_SAFE_INTEGER;

  const renderBooleanBody = () => (
    <View style={styles.optionRow}>
      {[
        { label: 'Did it', optionValue: true },
        { label: 'Didn’t', optionValue: false },
      ].map((option) => {
        const isActive = value === option.optionValue;
        return (
          <TouchableOpacity
            key={option.label}
            style={[styles.optionChip, isActive && styles.optionChipActive]}
            onPress={() => onSave(option.optionValue)}
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
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const renderScaleBody = () => (
    <View style={styles.section}>
      <View style={styles.optionRow}>
        {SCALE_VALUES.map((scaleValue) => {
          const isActive = value === scaleValue;
          return (
            <TouchableOpacity
              key={scaleValue}
              style={[styles.optionChip, isActive && styles.optionChipActive]}
              onPress={() => onSave(scaleValue)}
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
                {scaleValue}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {behaviour.scaleLabels ? (
        <View style={styles.scaleLabelRow}>
          <Text style={styles.scaleLabel}>1 — {behaviour.scaleLabels.low}</Text>
          <Text style={styles.scaleLabel}>
            5 — {behaviour.scaleLabels.high}
          </Text>
        </View>
      ) : null}
    </View>
  );

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
        <View style={styles.modalContent}>
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
