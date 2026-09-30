import {
  IOS_KEYBOARD_DONE_ACCESSORY_ID,
  IosKeyboardDoneAccessory,
} from '@/src/components/forms/IosKeyboardDoneAccessory';
import { settingsScreenStyles } from '@/src/components/settings/settingsScreenStyles';
import { StandardLayout } from '@/src/components/StandardLayout';
import { Colors } from '@/src/constants/theme';
import { SUPPLEMENT_SEEDS } from '@/src/data/checkin/supplementSeeds';
import { newCheckinId } from '@/src/db/domains/checkin/types';
import { useSubscription } from '@/src/hooks/use-subscription';
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
  ActivityIndicator,
  Alert,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
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
          placeholderTextColor={Colors.textPlaceholder}
          autoCorrect={false}
          inputAccessoryViewID={IOS_KEYBOARD_DONE_ACCESSORY_ID}
        />
        {matches.map((seed) => (
          <TouchableOpacity
            key={seed.name}
            style={styles.seedRow}
            onPress={() => applySeed(seed)}
            accessibilityRole="button"
            accessibilityLabel={`Use ${seed.name}`}
          >
            <Text style={styles.seedName}>{seed.name}</Text>
            <Text style={styles.seedDose}>
              {seed.doseAmount} {seed.doseUnit}
            </Text>
          </TouchableOpacity>
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
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.numberStepperRow}>
        <TouchableOpacity
          style={styles.numberStepperButton}
          onPress={() => onChange(Math.max(minimum, value - 1))}
          disabled={value <= minimum}
          accessibilityRole="button"
          accessibilityLabel={`Decrease ${label}`}
        >
          <Ionicons name="remove" size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.numberStepperValue}>{value}</Text>
        <TouchableOpacity
          style={styles.numberStepperButton}
          onPress={() => onChange(value + 1)}
          accessibilityRole="button"
          accessibilityLabel={`Increase ${label}`}
        >
          <Ionicons name="add" size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderScheduleDetails = () => {
    if (scheduleType === 'specific_days') {
      return (
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Days of the week</Text>
          <View style={styles.chipRow}>
            {ISO_WEEKDAYS.map((day) => {
              const isActive = daysOfWeek.includes(day.value);
              return (
                <TouchableOpacity
                  key={day.value}
                  style={[styles.chip, isActive && styles.chipActive]}
                  onPress={() => toggleWeekday(day.value)}
                  accessibilityRole="checkbox"
                  accessibilityLabel={day.label}
                  accessibilityState={{ checked: isActive }}
                >
                  <Text
                    style={[styles.chipText, isActive && styles.chipTextActive]}
                  >
                    {day.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
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
        <View style={styles.inlineFieldRow}>
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
    <View style={settingsScreenStyles.upgradePrompt}>
      <Text style={settingsScreenStyles.upgradePromptTitle}>
        Free tracks {FREE_SUPPLEMENT_CAP} active supplement
      </Text>
      <Text style={settingsScreenStyles.upgradePromptBody}>
        Save this one as paused, or upgrade to Pro to keep more than one active
        at a time.
      </Text>
      <TouchableOpacity
        onPress={() => router.push('/paywall')}
        accessibilityRole="button"
        accessibilityLabel="Upgrade to Pro"
      >
        <Text style={settingsScreenStyles.upgradePromptCta}>
          Upgrade to Pro
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <StandardLayout
      title={isEditing ? 'Edit supplement' : 'Add supplement'}
      onBackPress={() => router.back()}
    >
      <StandardLayout.Body>
        {loading || subscriptionLoading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color={Colors.accent} />
          </View>
        ) : (
          <View style={styles.page}>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            {showCapUpsell ? renderCapUpsell() : null}

            {!isEditing ? renderSeedPicker() : null}

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Name</Text>
              <TextInput
                style={styles.textInput}
                value={name}
                onChangeText={setName}
                placeholder="Creatine monohydrate"
                placeholderTextColor={Colors.textPlaceholder}
                inputAccessoryViewID={IOS_KEYBOARD_DONE_ACCESSORY_ID}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Brand (optional)</Text>
              <TextInput
                style={styles.textInput}
                value={brand}
                onChangeText={setBrand}
                placeholder="Any brand"
                placeholderTextColor={Colors.textPlaceholder}
                inputAccessoryViewID={IOS_KEYBOARD_DONE_ACCESSORY_ID}
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
                {FORMS.map((option) => {
                  const isActive = form === option;
                  return (
                    <TouchableOpacity
                      key={option}
                      style={[styles.chip, isActive && styles.chipActive]}
                      onPress={() => setForm(option)}
                      accessibilityRole="radio"
                      accessibilityLabel={option}
                      accessibilityState={{ selected: isActive }}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          isActive && styles.chipTextActive,
                        ]}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Dose</Text>
              <TextInput
                style={styles.textInput}
                value={doseAmountText}
                onChangeText={setDoseAmountText}
                keyboardType="decimal-pad"
                placeholder="5"
                placeholderTextColor={Colors.textPlaceholder}
                inputAccessoryViewID={IOS_KEYBOARD_DONE_ACCESSORY_ID}
              />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                style={styles.chipScroll}
                contentContainerStyle={styles.chipScrollContent}
              >
                {DOSE_UNITS.map((option) => {
                  const isActive = doseUnit === option;
                  return (
                    <TouchableOpacity
                      key={option}
                      style={[styles.chip, isActive && styles.chipActive]}
                      onPress={() => setDoseUnit(option)}
                      accessibilityRole="radio"
                      accessibilityLabel={option}
                      accessibilityState={{ selected: isActive }}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          isActive && styles.chipTextActive,
                        ]}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
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
                {SCHEDULE_TYPES.map((option) => {
                  const isActive = scheduleType === option;
                  return (
                    <TouchableOpacity
                      key={option}
                      style={[styles.chip, isActive && styles.chipActive]}
                      onPress={() => setScheduleType(option)}
                      accessibilityRole="radio"
                      accessibilityLabel={SCHEDULE_TYPE_LABELS[option]}
                      accessibilityState={{ selected: isActive }}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          isActive && styles.chipTextActive,
                        ]}
                      >
                        {SCHEDULE_TYPE_LABELS[option]}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {renderScheduleDetails()}

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Times of day</Text>
              {times.map((time) => (
                <View key={time} style={styles.timeRow}>
                  <Text style={styles.timeText}>{time}</Text>
                  <TouchableOpacity
                    onPress={() =>
                      setTimes(times.filter((item) => item !== time))
                    }
                    accessibilityRole="button"
                    accessibilityLabel={`Remove ${time}`}
                  >
                    <Ionicons
                      name="close-circle"
                      size={22}
                      color={Colors.textMuted}
                    />
                  </TouchableOpacity>
                </View>
              ))}
              <View style={styles.addTimeRow}>
                <TextInput
                  style={[styles.textInput, styles.addTimeInput]}
                  value={newTime}
                  onChangeText={setNewTime}
                  placeholder="20:00"
                  placeholderTextColor={Colors.textPlaceholder}
                  keyboardType="numbers-and-punctuation"
                  inputAccessoryViewID={IOS_KEYBOARD_DONE_ACCESSORY_ID}
                />
                <TouchableOpacity
                  style={styles.numberStepperButton}
                  onPress={handleAddTime}
                  accessibilityRole="button"
                  accessibilityLabel="Add time"
                >
                  <Ionicons name="add" size={20} color={Colors.textPrimary} />
                </TouchableOpacity>
              </View>
              <Text style={styles.fieldHint}>
                24-hour times, e.g. 08:00 and 20:00.
              </Text>
            </View>

            <View style={styles.inlineFieldRow}>
              <View style={styles.inlineField}>
                <Text style={styles.fieldLabel}>Start date</Text>
                <TextInput
                  style={styles.textInput}
                  value={startDate}
                  onChangeText={setStartDate}
                  placeholder="2026-09-14"
                  placeholderTextColor={Colors.textPlaceholder}
                  autoCorrect={false}
                  inputAccessoryViewID={IOS_KEYBOARD_DONE_ACCESSORY_ID}
                />
              </View>
              <View style={styles.inlineField}>
                <Text style={styles.fieldLabel}>End date</Text>
                <TextInput
                  style={styles.textInput}
                  value={endDate}
                  onChangeText={setEndDate}
                  placeholder="Optional"
                  placeholderTextColor={Colors.textPlaceholder}
                  autoCorrect={false}
                  inputAccessoryViewID={IOS_KEYBOARD_DONE_ACCESSORY_ID}
                />
              </View>
            </View>

            <View style={styles.switchRow}>
              <View style={styles.switchRowTextBlock}>
                <Text style={styles.fieldLabel}>Dose reminders</Text>
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
                accessibilityLabel="Dose reminders"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Status</Text>
              <View style={styles.chipRow}>
                {STATUSES.map((option) => {
                  const isActive = status === option;
                  return (
                    <TouchableOpacity
                      key={option}
                      style={[styles.chip, isActive && styles.chipActive]}
                      onPress={() => setStatus(option)}
                      accessibilityRole="radio"
                      accessibilityLabel={STATUS_LABELS[option]}
                      accessibilityState={{ selected: isActive }}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          isActive && styles.chipTextActive,
                        ]}
                      >
                        {STATUS_LABELS[option]}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
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
                placeholderTextColor={Colors.textPlaceholder}
                multiline
                inputAccessoryViewID={IOS_KEYBOARD_DONE_ACCESSORY_ID}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.primaryButton,
                (saving || deleting) && styles.primaryButtonDisabled,
              ]}
              onPress={() => void handleSave()}
              disabled={saving || deleting}
              accessibilityRole="button"
              accessibilityLabel="Save supplement"
            >
              <Text style={styles.primaryButtonText}>
                {saving ? 'Saving…' : 'Save supplement'}
              </Text>
            </TouchableOpacity>

            {isEditing ? (
              <View style={styles.fieldGroup}>
                <TouchableOpacity
                  style={[
                    styles.destructiveButton,
                    (saving || deleting) && styles.primaryButtonDisabled,
                  ]}
                  onPress={handleDeletePress}
                  disabled={saving || deleting}
                  accessibilityRole="button"
                  accessibilityLabel="Delete supplement"
                >
                  <Text style={styles.destructiveButtonText}>
                    {deleting ? 'Deleting…' : 'Delete supplement'}
                  </Text>
                </TouchableOpacity>
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
