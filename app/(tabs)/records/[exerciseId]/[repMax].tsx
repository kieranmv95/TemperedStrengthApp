import { ExerciseVideoPlayButton } from '@/src/components/exercise/ExerciseVideoPlayButton';
import { PbModalDateTimeField } from '@/src/components/PbModalDateTimeField';
import {
  ActionChip,
  IOS_KEYBOARD_DONE_ACCESSORY_ID,
  IosKeyboardDoneAccessory,
  Skeleton,
  StandardLayout,
} from '@/src/components/ds';
import {
  color,
  elevation,
  MIN_TARGET_SIZE,
  radius,
  space,
  typography,
} from '@/src/constants/tokens';
import { getExerciseById } from '@/src/data/exercises';
import { useLargeText } from '@/src/hooks/useLargeText';
import { useWeightUnit } from '@/src/hooks/useWeightUnit';
import type { PersonalBestHistoryEntry } from '@/src/types/personalBests';
import { formatRepMaxLabel, parseRepMaxParam } from '@/src/utils/personalBests';
import { asStringId } from '@/src/utils/routeParams';
import {
  appendSingleTierPersonalBest,
  deletePersonalBestEntry,
  getPersonalBestsForExercise,
  updatePersonalBestEntry,
} from '@/src/utils/storage';
import {
  formatWeightFromKg,
  formatWeightValueFromKg,
  parseUserWeightInputToKg,
} from '@/src/utils/weightUnits';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Keyboard,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const ENTRY_SKELETON_HEIGHT = 76;
const ENTRY_SKELETON_COUNT = 3;

export default function RepMaxHistoryScreen() {
  const { unit: weightUnit } = useWeightUnit();
  const largeText = useLargeText();
  const { exerciseId: idParam, repMax: repParam } = useLocalSearchParams<{
    exerciseId: string | string[];
    repMax: string | string[];
  }>();
  const idStr = asStringId(idParam);
  const repStr = asStringId(repParam);
  const exerciseId = idStr ? parseInt(idStr, 10) : NaN;
  const tier = parseRepMaxParam(repStr ?? undefined);

  const exercise = useMemo(() => {
    if (!Number.isFinite(exerciseId)) return undefined;
    return getExerciseById(exerciseId);
  }, [exerciseId]);

  const [ledger, setLedger] = useState<Awaited<
    ReturnType<typeof getPersonalBestsForExercise>
  > | null>(null);
  const [loading, setLoading] = useState(true);

  const [addVisible, setAddVisible] = useState(false);
  const [addWeight, setAddWeight] = useState('');
  const [addDate, setAddDate] = useState(() => new Date());
  const [addSaving, setAddSaving] = useState(false);

  const [editEntry, setEditEntry] = useState<PersonalBestHistoryEntry | null>(
    null
  );
  const [editWeight, setEditWeight] = useState('');
  const [editDate, setEditDate] = useState(new Date());
  const [editSaving, setEditSaving] = useState(false);
  const load = useCallback(async () => {
    if (!Number.isFinite(exerciseId)) return;
    setLoading(true);
    try {
      const next = await getPersonalBestsForExercise(exerciseId);
      setLedger(next);
    } catch (error) {
      console.error('Error loading PB ledger:', error);
      setLedger({});
    } finally {
      setLoading(false);
    }
  }, [exerciseId]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const entries = useMemo(() => {
    if (!tier || !ledger) return [];
    const rows = ledger[tier] ?? [];
    return [...rows].sort(
      (a, b) =>
        new Date(b.achievedAt).getTime() - new Date(a.achievedAt).getTime()
    );
  }, [ledger, tier]);

  const openEdit = useCallback(
    (e: PersonalBestHistoryEntry) => {
      setEditEntry(e);
      setEditWeight(formatWeightValueFromKg(e.weight, weightUnit));
      setEditDate(new Date(e.achievedAt));
    },
    [weightUnit]
  );

  const closeEdit = useCallback(() => {
    setEditEntry(null);
  }, []);

  const openAdd = useCallback(() => {
    setAddWeight('');
    setAddDate(new Date());
    setAddVisible(true);
  }, []);

  const saveEdit = useCallback(async () => {
    if (!editEntry || !tier || !Number.isFinite(exerciseId)) return;
    const wKg = parseUserWeightInputToKg(editWeight, weightUnit);
    if (wKg === null || !Number.isFinite(wKg) || wKg <= 0) {
      Alert.alert('Invalid weight', 'Enter a weight greater than zero.');
      return;
    }
    setEditSaving(true);
    try {
      await updatePersonalBestEntry(exerciseId, tier, editEntry.id, {
        weight: wKg,
        achievedAt: editDate.toISOString(),
      });
      closeEdit();
      await load();
    } catch (error) {
      console.error('Error updating PB entry:', error);
      Alert.alert('Error', 'Could not update entry.');
    } finally {
      setEditSaving(false);
    }
  }, [
    editEntry,
    tier,
    exerciseId,
    editWeight,
    weightUnit,
    editDate,
    load,
    closeEdit,
  ]);

  const confirmDelete = useCallback(
    (e: PersonalBestHistoryEntry) => {
      if (!tier || !Number.isFinite(exerciseId)) return;
      Alert.alert(
        'Delete entry',
        `Remove ${formatWeightFromKg(e.weight, weightUnit)} on ${new Date(e.achievedAt).toLocaleString()}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              try {
                await deletePersonalBestEntry(exerciseId, tier, e.id);
                await load();
              } catch (error) {
                console.error('Error deleting PB entry:', error);
                Alert.alert('Error', 'Could not delete entry.');
              }
            },
          },
        ]
      );
    },
    [exerciseId, tier, load, weightUnit]
  );

  const saveAdd = useCallback(async () => {
    if (!tier || !Number.isFinite(exerciseId)) return;
    const wKg = parseUserWeightInputToKg(addWeight, weightUnit);
    if (wKg === null || !Number.isFinite(wKg) || wKg <= 0) {
      Alert.alert('Invalid weight', 'Enter a weight greater than zero.');
      return;
    }
    setAddSaving(true);
    try {
      const { isPR } = await appendSingleTierPersonalBest(
        exerciseId,
        tier,
        wKg,
        addDate.toISOString()
      );
      if (isPR) {
        Keyboard.dismiss();
        setAddVisible(false);
        Alert.alert(
          'New personal best',
          'Saved and updated lower rep maxes where applicable.'
        );
      } else {
        Keyboard.dismiss();
        setAddVisible(false);
        Alert.alert('Lift logged', 'Saved to history.');
      }
      setAddWeight('');
      await load();
    } catch (error) {
      console.error('Error adding PB entry:', error);
      Alert.alert('Error', 'Could not save entry.');
    } finally {
      setAddSaving(false);
    }
  }, [tier, exerciseId, addWeight, weightUnit, addDate, load]);

  if (!Number.isFinite(exerciseId) || !exercise || tier === null) {
    return (
      <StandardLayout title="History" onBackPress={() => router.back()}>
        <StandardLayout.Body>
          <Text style={styles.emptyDescription}>
            Invalid exercise or rep max.
          </Text>
        </StandardLayout.Body>
      </StandardLayout>
    );
  }

  if (exercise.logging_type === 'time') {
    return (
      <StandardLayout title={exercise.name} onBackPress={() => router.back()}>
        <StandardLayout.Body>
          <Text style={styles.emptyDescription}>
            Personal bests apply to rep-based exercises only.
          </Text>
        </StandardLayout.Body>
      </StandardLayout>
    );
  }

  const tierLabel = formatRepMaxLabel(tier);

  return (
    <StandardLayout
      title={`${tierLabel} ${exercise.name}`}
      disableScroll
      onBackPress={() => router.back()}
      headerActions={
        <ActionChip
          label="Add entry"
          icon="add"
          tone="gold"
          onPress={openAdd}
          accessibilityLabel="Add personal best"
        />
      }
    >
      <StandardLayout.Body>
        {loading || ledger === null ? (
          <View style={styles.skeletons}>
            {Array.from({ length: ENTRY_SKELETON_COUNT }, (_, index) => (
              <Skeleton
                key={index}
                width="100%"
                height={ENTRY_SKELETON_HEIGHT}
                radius="md"
                accessibilityLabel={index === 0 ? 'Loading history' : undefined}
              />
            ))}
          </View>
        ) : (
          <FlatList
            data={entries}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <ExerciseVideoPlayButton
                exerciseId={exercise.id}
                variant="banner"
              />
            }
            ListEmptyComponent={
              <Text style={styles.emptyList}>
                No history yet. Tap Add entry to log a lift for this rep max.
              </Text>
            }
            renderItem={({ item }) => {
              const weightText = formatWeightFromKg(item.weight, weightUnit);
              const dateText = new Date(item.achievedAt).toLocaleString();
              return (
                <View
                  style={[styles.entryCard, largeText && styles.entryStacked]}
                >
                  <View
                    style={styles.rowMain}
                    accessible
                    accessibilityLabel={`${weightText}, ${dateText}`}
                  >
                    <Text style={styles.rowWeight}>{weightText}</Text>
                    <Text style={styles.rowDate}>{dateText}</Text>
                  </View>
                  <View style={styles.rowActions}>
                    <Pressable
                      style={({ pressed }) => [
                        styles.rowAction,
                        pressed && styles.rowActionPressed,
                      ]}
                      onPress={() => openEdit(item)}
                      accessibilityRole="button"
                      accessibilityLabel={`Edit entry, ${weightText} on ${dateText}`}
                    >
                      <Ionicons
                        name="pencil"
                        size={18}
                        color={color.textPrimary}
                      />
                      <Text style={styles.rowActionText}>Edit</Text>
                    </Pressable>
                    <Pressable
                      style={({ pressed }) => [
                        styles.rowAction,
                        pressed && styles.rowActionDangerPressed,
                      ]}
                      onPress={() => confirmDelete(item)}
                      accessibilityRole="button"
                      accessibilityLabel={`Delete entry, ${weightText} on ${dateText}`}
                      accessibilityHint="Asks to confirm before deleting"
                    >
                      <Ionicons
                        name="trash-outline"
                        size={18}
                        color={color.danger}
                      />
                      <Text style={[styles.rowActionText, styles.dangerText]}>
                        Delete
                      </Text>
                    </Pressable>
                  </View>
                </View>
              );
            }}
          />
        )}
      </StandardLayout.Body>

      <Modal
        visible={addVisible}
        transparent
        animationType="fade"
        onRequestClose={() => {
          Keyboard.dismiss();
          setAddVisible(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[styles.modalCard, elevation.overlay]}
            accessibilityViewIsModal
            onAccessibilityEscape={() => {
              Keyboard.dismiss();
              setAddVisible(false);
            }}
          >
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalContent}
            >
              <Text style={styles.modalTitle} accessibilityRole="header">
                New {tierLabel}
              </Text>
              <Text style={styles.modalHint}>
                {exercise.lowerWeightIsBetter
                  ? 'Every save is added to history. If this is a personal best for this rep max, lower rep maxes update too when a lighter assistance beats them.'
                  : 'Every save is added to history. If this is a personal best for this rep max, lower rep maxes update too when the weight beats them.'}
              </Text>
              <View style={styles.modalField}>
                <Text
                  style={styles.modalLabel}
                  accessibilityElementsHidden
                  importantForAccessibility="no-hide-descendants"
                >
                  Weight ({weightUnit})
                </Text>
                <TextInput
                  style={styles.weightInput}
                  value={addWeight}
                  onChangeText={setAddWeight}
                  keyboardType="decimal-pad"
                  inputAccessoryViewID={IOS_KEYBOARD_DONE_ACCESSORY_ID}
                  onSubmitEditing={() => Keyboard.dismiss()}
                  placeholder={weightUnit}
                  placeholderTextColor={color.textTertiary}
                  accessibilityLabel={`Weight in ${weightUnit}`}
                />
              </View>
              <PbModalDateTimeField value={addDate} onChange={setAddDate} />
              <IosKeyboardDoneAccessory />
              <View style={styles.modalActions}>
                <Pressable
                  style={({ pressed }) => [
                    styles.modalButton,
                    styles.modalCancel,
                    pressed && styles.modalCancelPressed,
                  ]}
                  onPress={() => {
                    Keyboard.dismiss();
                    setAddVisible(false);
                  }}
                  disabled={addSaving}
                  accessibilityRole="button"
                  accessibilityLabel="Cancel"
                  accessibilityState={{ disabled: addSaving }}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={({ pressed }) => [
                    styles.modalButton,
                    styles.modalSave,
                    pressed && styles.modalSavePressed,
                    addSaving && styles.modalButtonBusy,
                  ]}
                  onPress={saveAdd}
                  disabled={addSaving}
                  accessibilityRole="button"
                  accessibilityLabel={addSaving ? 'Saving' : 'Save entry'}
                  accessibilityState={{ disabled: addSaving, busy: addSaving }}
                >
                  <Text style={styles.modalSaveText}>
                    {addSaving ? 'Saving…' : 'Save'}
                  </Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        visible={editEntry !== null}
        transparent
        animationType="fade"
        onRequestClose={() => {
          Keyboard.dismiss();
          closeEdit();
        }}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[styles.modalCard, elevation.overlay]}
            accessibilityViewIsModal
            onAccessibilityEscape={() => {
              Keyboard.dismiss();
              closeEdit();
            }}
          >
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalContent}
            >
              <Text style={styles.modalTitle} accessibilityRole="header">
                Edit entry
              </Text>
              <View style={styles.modalField}>
                <Text
                  style={styles.modalLabel}
                  accessibilityElementsHidden
                  importantForAccessibility="no-hide-descendants"
                >
                  Weight ({weightUnit})
                </Text>
                <TextInput
                  style={styles.weightInput}
                  value={editWeight}
                  onChangeText={setEditWeight}
                  keyboardType="decimal-pad"
                  inputAccessoryViewID={IOS_KEYBOARD_DONE_ACCESSORY_ID}
                  onSubmitEditing={() => Keyboard.dismiss()}
                  placeholder={weightUnit}
                  placeholderTextColor={color.textTertiary}
                  accessibilityLabel={`Weight in ${weightUnit}`}
                />
              </View>
              <PbModalDateTimeField value={editDate} onChange={setEditDate} />
              <IosKeyboardDoneAccessory />
              <View style={styles.modalActions}>
                <Pressable
                  style={({ pressed }) => [
                    styles.modalButton,
                    styles.modalCancel,
                    pressed && styles.modalCancelPressed,
                  ]}
                  onPress={() => {
                    Keyboard.dismiss();
                    closeEdit();
                  }}
                  disabled={editSaving}
                  accessibilityRole="button"
                  accessibilityLabel="Cancel"
                  accessibilityState={{ disabled: editSaving }}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={({ pressed }) => [
                    styles.modalButton,
                    styles.modalSave,
                    pressed && styles.modalSavePressed,
                    editSaving && styles.modalButtonBusy,
                  ]}
                  onPress={saveEdit}
                  disabled={editSaving}
                  accessibilityRole="button"
                  accessibilityLabel={editSaving ? 'Saving' : 'Save changes'}
                  accessibilityState={{
                    disabled: editSaving,
                    busy: editSaving,
                  }}
                >
                  <Text style={styles.modalSaveText}>
                    {editSaving ? 'Saving…' : 'Save'}
                  </Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </StandardLayout>
  );
}

const styles = StyleSheet.create({
  emptyDescription: {
    ...typography.callout,
    color: color.textSecondary,
    textAlign: 'center',
    marginTop: space.xxl,
  },
  skeletons: {
    gap: space.sm,
    paddingTop: space.xs,
  },
  listContent: {
    paddingTop: space.xs,
    paddingBottom: space.xxl,
    gap: space.sm,
    flexGrow: 1,
  },
  emptyList: {
    ...typography.callout,
    color: color.textTertiary,
    textAlign: 'center',
    marginTop: space.xxl,
  },
  entryCard: {
    ...elevation.raised,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    padding: space.md,
    borderRadius: radius.md,
    backgroundColor: color.surface1,
  },
  /** Large text: the actions drop below the weight and date. */
  entryStacked: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  rowMain: {
    flex: 1,
    minWidth: 0,
    gap: space.xxs,
  },
  rowWeight: {
    ...typography.numericMedium,
    color: color.textPrimary,
  },
  rowDate: {
    ...typography.caption,
    fontVariant: ['tabular-nums'],
    color: color.textSecondary,
  },
  rowActions: {
    flexDirection: 'row',
    gap: space.xxs,
  },
  rowAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xxs,
    minHeight: MIN_TARGET_SIZE,
    paddingHorizontal: space.sm,
    borderRadius: radius.pill,
  },
  rowActionPressed: {
    backgroundColor: color.surface2,
  },
  rowActionDangerPressed: {
    backgroundColor: color.dangerTint,
  },
  rowActionText: {
    ...typography.calloutStrong,
    color: color.textPrimary,
  },
  dangerText: {
    color: color.danger,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: color.scrim,
    justifyContent: 'center',
    paddingHorizontal: space.md,
  },
  modalCard: {
    backgroundColor: color.surface1,
    borderRadius: radius.lg,
    padding: space.xl,
    maxHeight: '90%',
  },
  modalContent: {
    gap: space.md,
  },
  modalTitle: {
    ...typography.title2,
    color: color.textPrimary,
  },
  modalHint: {
    ...typography.callout,
    color: color.textSecondary,
  },
  modalField: {
    gap: space.xxs,
  },
  modalLabel: {
    ...typography.captionStrong,
    color: color.textSecondary,
  },
  weightInput: {
    ...typography.numericMedium,
    minHeight: MIN_TARGET_SIZE + space.xxs,
    paddingHorizontal: space.sm,
    paddingVertical: space.xs,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: color.borderStrong,
    backgroundColor: color.surface2,
    color: color.textPrimary,
  },
  modalActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.xs,
    marginTop: space.xs,
  },
  modalButton: {
    flexGrow: 1,
    flexBasis: 120,
    minHeight: MIN_TARGET_SIZE,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonBusy: {
    opacity: 0.6,
  },
  modalCancel: {
    borderWidth: 1,
    borderColor: color.borderStrong,
  },
  modalCancelPressed: {
    backgroundColor: color.surface3,
  },
  modalCancelText: {
    ...typography.calloutStrong,
    color: color.textPrimary,
  },
  modalSave: {
    backgroundColor: color.gold,
  },
  modalSavePressed: {
    backgroundColor: color.goldStrong,
  },
  modalSaveText: {
    ...typography.calloutStrong,
    color: color.onGold,
  },
});
