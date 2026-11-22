import { BottomSheet, NumberField } from '@/src/components/ds';
import {
  isValidRestingHr,
  isValidZoneAge,
  MAX_RESTING_HR,
  MAX_ZONE_AGE,
  MIN_RESTING_HR,
  MIN_ZONE_AGE,
} from '@/src/utils/heartRateZones';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { zoneScreenStyles as styles } from './zoneScreenStyles';

export type ZoneSettingsSheetValues = {
  age: number;
  /** `null` when the field is left blank. */
  restingHr: number | null;
};

type ZoneSettingsSheetProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (values: ZoneSettingsSheetValues) => Promise<void>;
  initialAge: number | null;
  /** Prefill from Health date of birth when no age is saved yet. */
  suggestedAge: number | null;
  healthServiceName: string;
  initialRestingHr: number | null;
  /** Opened from the Advanced toggle: a resting HR is needed to save. */
  restingHrRequired: boolean;
};

type ZoneSettingsFormProps = Omit<ZoneSettingsSheetProps, 'visible'>;

function toFieldValue(value: number | null): string {
  return value === null ? '' : String(value);
}

/** Remounted each time the sheet opens so fields reset to saved values. */
function ZoneSettingsForm({
  onClose,
  onSave,
  initialAge,
  suggestedAge,
  healthServiceName,
  initialRestingHr,
  restingHrRequired,
}: ZoneSettingsFormProps) {
  const prefilledFromHealth = initialAge === null && suggestedAge !== null;
  const [ageText, setAgeText] = useState(
    toFieldValue(initialAge ?? suggestedAge)
  );
  const [restingHrText, setRestingHrText] = useState(
    toFieldValue(initialRestingHr)
  );
  const [showErrors, setShowErrors] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const age = ageText.trim() === '' ? null : Number(ageText);
  const restingHr = restingHrText.trim() === '' ? null : Number(restingHrText);
  const ageError =
    age === null || !isValidZoneAge(age)
      ? `Enter an age from ${MIN_ZONE_AGE} to ${MAX_ZONE_AGE}`
      : undefined;
  const restingHrError =
    restingHr === null
      ? restingHrRequired
        ? 'Advanced zones need your resting heart rate'
        : undefined
      : !isValidRestingHr(restingHr)
        ? `Enter a resting heart rate from ${MIN_RESTING_HR} to ${MAX_RESTING_HR}`
        : undefined;

  const handleSave = async () => {
    if (ageError || restingHrError || age === null) {
      setShowErrors(true);
      return;
    }
    setIsSaving(true);
    setSaveError(null);
    try {
      await onSave({ age, restingHr });
      onClose();
    } catch (error) {
      console.error('Error saving zone settings:', error);
      setSaveError('Could not save your zones. Try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <View style={styles.sheetFields}>
        <NumberField
          label="How old are you?"
          value={ageText}
          onChangeText={setAgeText}
          placeholder="Age"
          min={MIN_ZONE_AGE}
          max={MAX_ZONE_AGE}
          suggestedValue={30}
          showSteppers
          error={showErrors ? ageError : undefined}
        />
        {prefilledFromHealth ? (
          <Text style={styles.caption}>From {healthServiceName}</Text>
        ) : null}
        <NumberField
          label="Resting heart rate (bpm)"
          value={restingHrText}
          onChangeText={setRestingHrText}
          placeholder={restingHrRequired ? 'bpm' : 'Optional'}
          min={MIN_RESTING_HR}
          max={MAX_RESTING_HR}
          suggestedValue={60}
          showSteppers
          error={showErrors ? restingHrError : undefined}
        />
        <Text style={styles.caption}>
          Count your pulse for 60 seconds just after waking, before you get up.
          {restingHrRequired
            ? ''
            : ' Leave it blank to use basic zones based on age only.'}
        </Text>
      </View>
      {saveError ? <Text style={styles.errorText}>{saveError}</Text> : null}
      <Pressable
        style={({ pressed }) => [
          styles.btnPrimary,
          pressed && !isSaving && styles.btnPrimaryPressed,
          isSaving && styles.btnPrimaryDisabled,
        ]}
        onPress={() => {
          void handleSave();
        }}
        disabled={isSaving}
        accessibilityRole="button"
        accessibilityLabel="Save zones"
        accessibilityState={{ disabled: isSaving, busy: isSaving }}
      >
        <Text
          style={[
            styles.btnPrimaryText,
            isSaving && styles.btnPrimaryTextDisabled,
          ]}
        >
          {isSaving ? 'Saving…' : 'Save zones'}
        </Text>
      </Pressable>
    </>
  );
}

/** Edit age and manual resting heart rate. */
export function ZoneSettingsSheet({
  visible,
  ...formProps
}: ZoneSettingsSheetProps) {
  const [formKey, setFormKey] = useState(0);
  const [wasVisible, setWasVisible] = useState(visible);

  if (visible !== wasVisible) {
    setWasVisible(visible);
    if (visible) {
      setFormKey((key) => key + 1);
    }
  }

  return (
    <BottomSheet
      visible={visible}
      onClose={formProps.onClose}
      title={
        formProps.restingHrRequired ? 'Add resting heart rate' : 'Your zones'
      }
    >
      <ZoneSettingsForm key={formKey} {...formProps} />
    </BottomSheet>
  );
}
