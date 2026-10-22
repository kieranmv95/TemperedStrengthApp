import { CheckinListSkeleton } from '@/src/components/checkin/CheckinListSkeleton';
import {
  FilterChip,
  IOS_KEYBOARD_DONE_ACCESSORY_ID,
  IosKeyboardDoneAccessory,
  NumberField,
  StandardLayout,
} from '@/src/components/ds';
import { color } from '@/src/constants/tokens';
import { SUPPLEMENT_SEEDS } from '@/src/data/checkin/supplementSeeds';
import { newCheckinId } from '@/src/db/domains/checkin/types';
import { useSubscription } from '@/src/hooks/use-subscription';
import { useLargeText } from '@/src/hooks/useLargeText';
import { checkinScreenStyles as styles } from '@/src/screens/checkin/checkinScreenStyles';
import {
  ISO_WEEKDAYS,
  SCHEDULE_TYPE_LABELS,
  STATUS_LABELS,
  isValidLocalDate,
  isValidTime,
} from '@/src/screens/checkin/supplementFormatting';
import { formatLocalYMD } from '@/src/services/streakService';
import type {
  Supplement,
  SupplementDoseUnit,
  SupplementForm,
  SupplementSchedule,
  SupplementScheduleType,
  SupplementSeed,
  SupplementStatus,
} from '@/src/types/supplements';
import {
  FREE_SUPPLEMENT_CAP,
  canAddActiveSupplement,
} from '@/src/utils/checkin/caps';
import {
  deleteSupplement,
  getSupplement,
  getSupplements,
  upsertSupplement,
} from '@/src/utils/storage';
import {
  rebuildSupplementReminders,
  requestSupplementReminderPermission,
} from '@/src/services/supplementReminders';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';

const FORMS: SupplementForm[] = [
  'capsule',
  'tablet',
  'powder',
  'liquid',
  'gummy',
  'other',
];

const FORM_LABELS: Record<SupplementForm, string> = {
  capsule: 'Capsule',
  tablet: 'Tablet',
  powder: 'Powder',
  liquid: 'Liquid',
  gummy: 'Gummy',
  other: 'Other',
};

const SWITCH_TRACK_COLORS = { false: color.borderStrong, true: color.gold };

const DOSE_UNITS: SupplementDoseUnit[] = [
  'g',
  'mg',
  'mcg',
  'ml',
  'IU',
  'capsule',
  'tablet',
  'scoop',
  'drop',
];

const SCHEDULE_TYPES: SupplementScheduleType[] = [
  'daily',
  'specific_days',
  'every_n_days',
  'cycle',
  'as_needed',
];

const STATUSES: SupplementStatus[] = ['active', 'paused', 'archived'];

const MAX_SEED_RESULTS = 6;

type CheckinSupplementEditScreenProps = {
  /** Omitted when creating a new supplement. */
  supplementId?: string;
};

export function CheckinSupplementEditScreen({
  supplementId,
}: CheckinSupplementEditScreenProps) {
  const { isPro, isLoading: subscriptionLoading } = useSubscription();
  const largeText = useLargeText();
  const isEditing = supplementId !== undefined;

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCapUpsell, setShowCapUpsell] = useState(false);

  const [id] = useState(() => supplementId ?? newCheckinId());
  const [createdAt, setCreatedAt] = useState<string | undefined>(undefined);
  const [otherSupplements, setOtherSupplements] = useState<Supplement[]>([]);

  const [seedQuery, setSeedQuery] = useState('');
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [form, setForm] = useState<SupplementForm>('capsule');
  const [doseAmountText, setDoseAmountText] = useState('1');
  const [doseUnit, setDoseUnit] = useState<SupplementDoseUnit>('capsule');
  const [notes, setNotes] = useState('');

  const [scheduleType, setScheduleType] =
    useState<SupplementScheduleType>('daily');
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([1, 3, 5]);
  const [intervalDays, setIntervalDays] = useState(2);
  const [cycleOnDays, setCycleOnDays] = useState(5);
  const [cycleOffDays, setCycleOffDays] = useState(2);
  const [times, setTimes] = useState<string[]>(['08:00']);
  const [newTime, setNewTime] = useState('');
  const [startDate, setStartDate] = useState(() => formatLocalYMD(new Date()));
  const [endDate, setEndDate] = useState('');

  const [remindersEnabled, setRemindersEnabled] = useState(false);
  const [status, setStatus] = useState<SupplementStatus>('active');

  const load = useCallback(async () => {
    try {
      const all = await getSupplements();
      setOtherSupplements(all.filter((item) => item.id !== id));

      if (!isEditing) {
        return;
      }
      const existing = await getSupplement(id);
      if (!existing) {
        setError('That supplement no longer exists.');
        return;
      }
      setCreatedAt(existing.createdAt);
      setName(existing.name);
      setBrand(existing.brand ?? '');
      setForm(existing.form);
      setDoseAmountText(String(existing.doseAmount));
      setDoseUnit(existing.doseUnit);
      setNotes(existing.notes ?? '');
      setScheduleType(existing.schedule.type);
      setDaysOfWeek(existing.schedule.daysOfWeek ?? []);
      setIntervalDays(existing.schedule.intervalDays ?? 2);
      setCycleOnDays(existing.schedule.cycleOnDays ?? 5);
      setCycleOffDays(existing.schedule.cycleOffDays ?? 2);
      setTimes(existing.schedule.times);
      setStartDate(existing.schedule.startDate);
      setEndDate(existing.schedule.endDate ?? '');
      setRemindersEnabled(existing.remindersEnabled);
      setStatus(existing.status);
    } catch (loadError) {
      console.error('Error loading supplement:', loadError);
      setError('Could not load that supplement. Try again.');
    } finally {
      setLoading(false);
    }
  }, [id, isEditing]);

  useEffect(() => {
    void load();
  }, [load]);

  const applySeed = (seed: SupplementSeed) => {
    setName(seed.name);
    setForm(seed.form);
    setDoseAmountText(String(seed.doseAmount));
    setDoseUnit(seed.doseUnit);
    setSeedQuery('');
  };

  const toggleWeekday = (value: number) => {
    setDaysOfWeek((current) =>
      current.includes(value)
        ? current.filter((day) => day !== value)
        : [...current, value].sort((a, b) => a - b)
    );
  };

  const handleAddTime = () => {
    const trimmed = newTime.trim();
    if (!isValidTime(trimmed)) {
      setError('Times need to look like 08:00 (24-hour).');
      return;
    }
    if (times.includes(trimmed)) {
      setNewTime('');
      return;
    }
    setError(null);
    setTimes([...times, trimmed].sort((a, b) => a.localeCompare(b)));
    setNewTime('');
  };

  const buildSchedule = (): SupplementSchedule => {
    const schedule: SupplementSchedule = {
      type: scheduleType,
      times: [...times].sort((a, b) => a.localeCompare(b)),
      startDate: startDate.trim(),
    };
    if (endDate.trim().length > 0) {
      schedule.endDate = endDate.trim();
    }
    if (scheduleType === 'specific_days') {
      schedule.daysOfWeek = [...daysOfWeek].sort((a, b) => a - b);
    }
    if (scheduleType === 'every_n_days') {
      schedule.intervalDays = intervalDays;
    }
    if (scheduleType === 'cycle') {
      schedule.cycleOnDays = cycleOnDays;
      schedule.cycleOffDays = cycleOffDays;
    }
    return schedule;
  };

  const validationError = (): string | null => {
    if (name.trim().length < 1) {
      return 'Give the supplement a name.';
    }
    const doseAmount = Number(doseAmountText);
    if (!Number.isFinite(doseAmount) || doseAmount <= 0) {
      return 'Dose needs to be a number greater than zero.';
    }
    if (scheduleType !== 'as_needed' && times.length < 1) {
      return 'Add at least one time of day.';
    }
    if (scheduleType === 'specific_days' && daysOfWeek.length < 1) {
      return 'Pick at least one day of the week.';
    }
    if (scheduleType === 'every_n_days' && intervalDays < 1) {
      return 'The interval needs to be at least one day.';
    }
    if (scheduleType === 'cycle' && cycleOnDays < 1) {
      return 'A cycle needs at least one day on.';
    }
    if (!isValidLocalDate(startDate)) {
      return 'Start date needs to look like 2026-09-14.';
    }
    if (endDate.trim().length > 0 && !isValidLocalDate(endDate)) {
      return 'End date needs to look like 2026-09-14.';
    }
    if (endDate.trim().length > 0 && endDate.trim() < startDate.trim()) {
      return 'End date cannot be before the start date.';
    }
    return null;
  };

  const handleSave = async () => {
    const message = validationError();
    if (message) {
      setError(message);
      return;
    }
    if (
      status === 'active' &&
      !canAddActiveSupplement({ isPro, supplements: otherSupplements })
    ) {
      setShowCapUpsell(true);
      setError(null);
      return;
    }

    setSaving(true);
    setError(null);
    try {
      let effectiveReminders = remindersEnabled;
      if (remindersEnabled) {
        const granted = await requestSupplementReminderPermission();
        if (!granted) {
          effectiveReminders = false;
          setRemindersEnabled(false);
        }
      }
      await upsertSupplement({
        id,
        name: name.trim(),
        brand: brand.trim().length > 0 ? brand.trim() : undefined,
        form,
        doseAmount: Number(doseAmountText),
        doseUnit,
        notes: notes.trim().length > 0 ? notes.trim() : undefined,
        schedule: buildSchedule(),
        remindersEnabled: effectiveReminders,
        status,
        createdAt,
      });
      void rebuildSupplementReminders({ isPro });
      router.back();
    } catch (saveError) {
      console.error('Error saving supplement:', saveError);
      setError('Could not save that supplement. Try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setError(null);
    try {
      await deleteSupplement(id);
      void rebuildSupplementReminders({ isPro });
      router.back();
    } catch (deleteError) {
      console.error('Error deleting supplement:', deleteError);
      setError('Could not delete that supplement. Try again.');
    } finally {
      setDeleting(false);
    }
  };

  const handleDeletePress = () => {
    Alert.alert(
      'Delete this supplement?',
      'This removes it and its dose history from this device and your backup. It cannot be undone. Archive it instead if you only want to stop tracking it.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            void handleDelete();
          },
        },
      ]
    );
  };

  const renderSeedPicker = () => {
    const query = seedQuery.trim().toLowerCase();
    const matches =
      query.length < 1
        ? []
        : SUPPLEMENT_SEEDS.filter((seed) =>
            seed.name.toLowerCase().includes(query)
          ).slice(0, MAX_SEED_RESULTS);

    return (
      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>Start from a common supplement</Text>
        <TextInput
          style={styles.textInput}
          value={seedQuery}
          onChangeText={setSeedQuery}
          placeholder="Search creatine, magnesium…"
          placeholderTextColor={color.textTertiary}
          autoCorrect={false}
          inputAccessoryViewID={IOS_KEYBOARD_DONE_ACCESSORY_ID}
          accessibilityLabel="Start from a common supplement"
          accessibilityHint="Search, then pick a match to fill in the name and dose"
        />
        {matches.map((seed) => (
          <Pressable
            key={seed.name}
            style={({ pressed }) => [
              styles.seedRow,
              pressed && styles.seedRowPressed,
            ]}
            onPress={() => applySeed(seed)}
            accessibilityRole="button"
            accessibilityLabel={`Use ${seed.name}, ${seed.doseAmount} ${seed.doseUnit}`}
          >
            <Text style={styles.seedName}>{seed.name}</Text>
            <Text style={styles.seedDose}>
              {seed.doseAmount} {seed.doseUnit}
            </Text>
          </Pressable>
        ))}
        <Text style={styles.fieldHint}>
          Or just type your own name and dose below.
        </Text>
      </View>
    );
  };

  const renderNumberStepper = (
    label: string,
    value: number,
    onChange: (next: number) => void,
    minimum: number
  ) => (
    <View style={styles.fieldGroup}>
      <Text
        style={styles.fieldLabel}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        {label}
      </Text>
      <View style={styles.numberStepperRow}>
        <Pressable
          style={({ pressed }) => [
            styles.numberStepperButton,
            pressed && value > minimum && styles.numberStepperButtonPressed,
            value <= minimum && styles.numberStepperButtonDisabled,
          ]}
          onPress={() => onChange(Math.max(minimum, value - 1))}
          disabled={value <= minimum}
          accessibilityRole="button"
          accessibilityLabel={`Decrease ${label}`}
          accessibilityState={{ disabled: value <= minimum }}
        >
          <Ionicons
            name="remove"
            size={20}
            color={value <= minimum ? color.textDisabled : color.textPrimary}
          />
        </Pressable>
        <Text
          style={styles.numberStepperValue}
          accessibilityLabel={`${label}, ${value}`}
          accessibilityLiveRegion="polite"
        >
          {value}
        </Text>
        <Pressable
          style={({ pressed }) => [
            styles.numberStepperButton,
            pressed && styles.numberStepperButtonPressed,
          ]}
          onPress={() => onChange(value + 1)}
          accessibilityRole="button"
          accessibilityLabel={`Increase ${label}`}
        >
          <Ionicons name="add" size={20} color={color.textPrimary} />
        </Pressable>
      </View>
    </View>
  );

  const renderScheduleDetails = () => {
    if (scheduleType === 'specific_days') {
      return (
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Days of the week</Text>
          <View style={styles.chipRow}>
            {ISO_WEEKDAYS.map((day) => (
              <FilterChip
                key={day.value}
                label={day.label}
                selected={daysOfWeek.includes(day.value)}
                onPress={() => toggleWeekday(day.value)}
              />
            ))}
          </View>
        </View>
      );
    }
    if (scheduleType === 'every_n_days') {
      return renderNumberStepper(
        'Repeat every (days)',
        intervalDays,
        setIntervalDays,
        1
      );
    }
    if (scheduleType === 'cycle') {
      return (
        <View
          style={[
            styles.inlineFieldRow,
            largeText && styles.inlineFieldStacked,
          ]}
        >
          <View style={styles.inlineField}>
            {renderNumberStepper('Days on', cycleOnDays, setCycleOnDays, 1)}
          </View>
          <View style={styles.inlineField}>
            {renderNumberStepper('Days off', cycleOffDays, setCycleOffDays, 0)}
          </View>
        </View>
      );
    }
    return null;
  };

  const renderCapUpsell = () => (
    <View style={styles.upsellCard}>
      <Text style={styles.upsellTitle} accessibilityRole="header">
        Free tracks {FREE_SUPPLEMENT_CAP} active supplement
      </Text>
      <Text style={styles.upsellBody}>
        Save this one as paused, or upgrade to Pro to keep more than one active
        at a time.
      </Text>
      <Pressable
        style={({ pressed }) => [
          styles.primaryButton,
          pressed && styles.primaryButtonPressed,
        ]}
        onPress={() => router.push('/paywall')}
        accessibilityRole="button"
        accessibilityLabel="Upgrade to Pro"
      >
        <Text style={styles.primaryButtonText}>Upgrade to Pro</Text>
      </Pressable>
    </View>
  );

  return (
    <StandardLayout
      title={isEditing ? 'Edit supplement' : 'Add supplement'}
      onBackPress={() => router.back()}
    >
      <StandardLayout.Body>
        {loading || subscriptionLoading ? (
          <CheckinListSkeleton accessibilityLabel="Loading supplement" />
        ) : (
          <View style={styles.page}>
            {error ? (
              <Text
                style={styles.errorText}
                accessibilityRole="alert"
                accessibilityLiveRegion="polite"
              >
                {error}
              </Text>
            ) : null}
            {showCapUpsell ? renderCapUpsell() : null}

            {!isEditing ? renderSeedPicker() : null}

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Name</Text>
              <TextInput
                style={styles.textInput}
                value={name}
                onChangeText={setName}
                placeholder="Creatine monohydrate"
                placeholderTextColor={color.textTertiary}
                inputAccessoryViewID={IOS_KEYBOARD_DONE_ACCESSORY_ID}
                accessibilityLabel="Name"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Brand (optional)</Text>
              <TextInput
                style={styles.textInput}
                value={brand}
                onChangeText={setBrand}
                placeholder="Any brand"
                placeholderTextColor={color.textTertiary}
                inputAccessoryViewID={IOS_KEYBOARD_DONE_ACCESSORY_ID}
                accessibilityLabel="Brand, optional"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Form</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                style={styles.chipScroll}
                contentContainerStyle={styles.chipScrollContent}
              >
                {FORMS.map((option) => (
                  <FilterChip
                    key={option}
                    label={FORM_LABELS[option]}
                    selected={form === option}
                    onPress={() => setForm(option)}
                    accessibilityLabel={`Form, ${FORM_LABELS[option]}`}
                  />
                ))}
              </ScrollView>
            </View>

            <View style={styles.fieldGroup}>
              <NumberField
                label="Dose"
                value={doseAmountText}
                onChangeText={setDoseAmountText}
                placeholder="5"
                allowDecimal
                inputAccessoryViewID={IOS_KEYBOARD_DONE_ACCESSORY_ID}
              />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                style={styles.chipScroll}
                contentContainerStyle={styles.chipScrollContent}
              >
                {DOSE_UNITS.map((option) => (
                  <FilterChip
                    key={option}
                    label={option}
                    selected={doseUnit === option}
                    onPress={() => setDoseUnit(option)}
                    accessibilityLabel={`Dose unit, ${option}`}
                  />
                ))}
              </ScrollView>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Schedule</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                style={styles.chipScroll}
                contentContainerStyle={styles.chipScrollContent}
              >
                {SCHEDULE_TYPES.map((option) => (
                  <FilterChip
                    key={option}
                    label={SCHEDULE_TYPE_LABELS[option]}
                    selected={scheduleType === option}
                    onPress={() => setScheduleType(option)}
                    accessibilityLabel={`Schedule, ${SCHEDULE_TYPE_LABELS[option]}`}
                  />
                ))}
              </ScrollView>
            </View>

            {renderScheduleDetails()}

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Times of day</Text>
              {times.map((time) => (
                <View key={time} style={styles.timeRow}>
                  <Text style={styles.timeText}>{time}</Text>
                  <Pressable
                    style={styles.iconButton}
                    onPress={() =>
                      setTimes(times.filter((item) => item !== time))
                    }
                    accessibilityRole="button"
                    accessibilityLabel={`Remove ${time}`}
                  >
                    <Ionicons
                      name="close-circle"
                      size={22}
                      color={color.textSecondary}
                    />
                  </Pressable>
                </View>
              ))}
              <View style={styles.addTimeRow}>
                <TextInput
                  style={[styles.textInput, styles.addTimeInput]}
                  value={newTime}
                  onChangeText={setNewTime}
                  placeholder="20:00"
                  placeholderTextColor={color.textTertiary}
                  keyboardType="numbers-and-punctuation"
                  inputAccessoryViewID={IOS_KEYBOARD_DONE_ACCESSORY_ID}
                  accessibilityLabel="New time of day"
                  accessibilityHint="24-hour time, for example 20:00"
                />
                <Pressable
                  style={({ pressed }) => [
                    styles.numberStepperButton,
                    pressed && styles.numberStepperButtonPressed,
                  ]}
                  onPress={handleAddTime}
                  accessibilityRole="button"
                  accessibilityLabel="Add time"
                >
                  <Ionicons name="add" size={20} color={color.textPrimary} />
                </Pressable>
              </View>
              <Text style={styles.fieldHint}>
                24-hour times, e.g. 08:00 and 20:00.
              </Text>
            </View>

            <View
              style={[
                styles.inlineFieldRow,
                largeText && styles.inlineFieldStacked,
              ]}
            >
              <View style={styles.inlineField}>
                <Text style={styles.fieldLabel}>Start date</Text>
                <TextInput
                  style={styles.textInput}
                  value={startDate}
                  onChangeText={setStartDate}
                  placeholder="2026-09-14"
                  placeholderTextColor={color.textTertiary}
                  autoCorrect={false}
                  inputAccessoryViewID={IOS_KEYBOARD_DONE_ACCESSORY_ID}
                  accessibilityLabel="Start date"
                  accessibilityHint="Year, month and day, for example 2026-09-14"
                />
              </View>
              <View style={styles.inlineField}>
                <Text style={styles.fieldLabel}>End date</Text>
                <TextInput
                  style={styles.textInput}
                  value={endDate}
                  onChangeText={setEndDate}
                  placeholder="Optional"
                  placeholderTextColor={color.textTertiary}
                  autoCorrect={false}
                  inputAccessoryViewID={IOS_KEYBOARD_DONE_ACCESSORY_ID}
                  accessibilityLabel="End date, optional"
                  accessibilityHint="Year, month and day, for example 2026-09-14"
                />
              </View>
            </View>

            <View style={styles.switchRow}>
              <View style={styles.switchRowTextBlock}>
                <Text style={styles.fieldTitle}>Dose reminders</Text>
                <Text style={styles.fieldHint}>
                  Local reminders only. If permission is denied, you can still
                  tick doses manually.
                </Text>
              </View>
              <Switch
                value={remindersEnabled}
                onValueChange={(next) => {
                  if (!next) {
                    setRemindersEnabled(false);
                    return;
                  }
                  void (async () => {
                    const granted = await requestSupplementReminderPermission();
                    setRemindersEnabled(granted);
                  })();
                }}
                trackColor={SWITCH_TRACK_COLORS}
                ios_backgroundColor={color.borderStrong}
                accessibilityLabel="Dose reminders"
                accessibilityHint="Local reminders only. If permission is denied, you can still tick doses manually."
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Status</Text>
              <View style={styles.chipRow}>
                {STATUSES.map((option) => (
                  <FilterChip
                    key={option}
                    label={STATUS_LABELS[option]}
                    selected={status === option}
                    onPress={() => setStatus(option)}
                    accessibilityLabel={`Status, ${STATUS_LABELS[option]}`}
                  />
                ))}
              </View>
              <Text style={styles.fieldHint}>
                Paused and archived supplements stop producing daily doses.
                Archive keeps them in your list. Delete removes them completely.
              </Text>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Notes (optional)</Text>
              <TextInput
                style={[styles.textInput, styles.textInputMultiline]}
                value={notes}
                onChangeText={setNotes}
                placeholder="With food, half a scoop pre-workout…"
                placeholderTextColor={color.textTertiary}
                multiline
                inputAccessoryViewID={IOS_KEYBOARD_DONE_ACCESSORY_ID}
                accessibilityLabel="Notes, optional"
              />
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.primaryButtonPressed,
                (saving || deleting) && styles.primaryButtonDisabled,
              ]}
              onPress={() => void handleSave()}
              disabled={saving || deleting}
              accessibilityRole="button"
              accessibilityLabel="Save supplement"
              accessibilityState={{
                disabled: saving || deleting,
                busy: saving,
              }}
            >
              <Text
                style={[
                  styles.primaryButtonText,
                  (saving || deleting) && styles.primaryButtonTextDisabled,
                ]}
              >
                {saving ? 'Saving…' : 'Save supplement'}
              </Text>
            </Pressable>

            {isEditing ? (
              <View style={styles.fieldGroup}>
                <Pressable
                  style={({ pressed }) => [
                    styles.destructiveButton,
                    pressed && styles.destructiveButtonPressed,
                    (saving || deleting) && styles.destructiveButtonDisabled,
                  ]}
                  onPress={handleDeletePress}
                  disabled={saving || deleting}
                  accessibilityRole="button"
                  accessibilityLabel="Delete supplement"
                  accessibilityState={{
                    disabled: saving || deleting,
                    busy: deleting,
                  }}
                >
                  <Text
                    style={[
                      styles.destructiveButtonText,
                      (saving || deleting) && styles.buttonTextDisabled,
                    ]}
                  >
                    {deleting ? 'Deleting…' : 'Delete supplement'}
                  </Text>
                </Pressable>
                <Text style={styles.fieldHint}>
                  Permanently removes this supplement and its dose history. Use
                  this for anything you do not want kept on this device or in
                  backup.
                </Text>
              </View>
            ) : null}

            <IosKeyboardDoneAccessory />
          </View>
        )}
      </StandardLayout.Body>
    </StandardLayout>
  );
}
