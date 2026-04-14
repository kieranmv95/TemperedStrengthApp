import { PbModalDateTimeField } from '@/src/components/PbModalDateTimeField';
import {
  IOS_KEYBOARD_DONE_ACCESSORY_ID,
  IosKeyboardDoneAccessory,
} from '@/src/components/forms/IosKeyboardDoneAccessory';
import { workoutDetailStyles as styles } from '@/src/components/workouts/workoutDetailStyles';
import { BorderRadius, Colors, FontSize, Spacing } from '@/src/constants/theme';
import { getExerciseById } from '@/src/data/exercises';
import type { PersonalBestHistoryEntry } from '@/src/types/personalBests';
import {
  formatRepMaxLabel,
  parseRepMaxParam,
} from '@/src/utils/personalBests';
import { asStringId } from '@/src/utils/routeParams';
import {
  appendSingleTierPersonalBest,
  deletePersonalBestEntry,
  getPersonalBestsForExercise,
  updatePersonalBestEntry,
} from '@/src/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Keyboard,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RepMaxHistoryScreen() {
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

  const openEdit = useCallback((e: PersonalBestHistoryEntry) => {
    setEditEntry(e);
    setEditWeight(e.weight.toString());
    setEditDate(new Date(e.achievedAt));
  }, []);

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
    const w = parseFloat(editWeight);
    if (!Number.isFinite(w) || w <= 0) {
      Alert.alert('Invalid weight', 'Enter a weight greater than zero.');
      return;
    }
    setEditSaving(true);
    try {
      await updatePersonalBestEntry(exerciseId, tier, editEntry.id, {
        weight: w,
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
  }, [editEntry, tier, exerciseId, editWeight, editDate, load, closeEdit]);

  const confirmDelete = useCallback(
    (e: PersonalBestHistoryEntry) => {
      if (!tier || !Number.isFinite(exerciseId)) return;
      Alert.alert(
        'Delete entry',
        `Remove ${e.weight} kg on ${new Date(e.achievedAt).toLocaleString()}?`,
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
    [exerciseId, tier, load]
  );

  const saveAdd = useCallback(async () => {
    if (!tier || !Number.isFinite(exerciseId)) return;
    const w = parseFloat(addWeight);
    if (!Number.isFinite(w) || w <= 0) {
      Alert.alert('Invalid weight', 'Enter a weight greater than zero.');
      return;
    }
    setAddSaving(true);
    try {
      const { isPR } = await appendSingleTierPersonalBest(
        exerciseId,
        tier,
        w,
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
  }, [tier, exerciseId, addWeight, addDate, load]);

  if (!Number.isFinite(exerciseId) || !exercise || tier === null) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={styles.detailHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.detailTitle} numberOfLines={1}>
            History
          </Text>
          <View style={styles.headerRightSpacer} />
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyDescription}>Invalid exercise or rep max.</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (exercise.logging_type === 'time') {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={styles.detailHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.detailTitle} numberOfLines={1}>
            {exercise.name}
          </Text>
          <View style={styles.headerRightSpacer} />
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyDescription}>
            Personal bests apply to rep-based exercises only.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.detailHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.detailTitle} numberOfLines={1}>
          {formatRepMaxLabel(tier)} {exercise.name}
        </Text>
        <TouchableOpacity
          style={styles.detailFavoriteButton}
          onPress={openAdd}
          accessibilityLabel="Add personal best"
        >
          <Ionicons name="add" size={28} color={Colors.accent} />
        </TouchableOpacity>
      </View>

      {loading || ledger === null ? (
        <ActivityIndicator
          color={Colors.textMuted}
          style={localStyles.loader}
        />
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id}
          contentContainerStyle={localStyles.listContent}
          ItemSeparatorComponent={() => (
            <View style={localStyles.rowSeparator} />
          )}
          ListEmptyComponent={
            <Text style={localStyles.emptyList}>
              No history yet. Tap + to log a lift for this rep max.
            </Text>
          }
          renderItem={({ item }) => (
            <View style={localStyles.row}>
              <View style={localStyles.rowMain}>
                <Text style={localStyles.rowWeight}>{item.weight} kg</Text>
                <Text style={localStyles.rowDate}>
                  {new Date(item.achievedAt).toLocaleString()}
                </Text>
              </View>
              <View style={localStyles.rowActions}>
                <TouchableOpacity
                  onPress={() => openEdit(item)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  accessibilityLabel="Edit entry"
                >
                  <Ionicons
                    name="pencil"
                    size={22}
                    color={Colors.accent}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => confirmDelete(item)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  accessibilityLabel="Delete entry"
                >
                  <Ionicons
                    name="trash-outline"
                    size={22}
                    color={Colors.destructive}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      <Modal
        visible={addVisible}
        transparent
        animationType="fade"
        onRequestClose={() => {
          Keyboard.dismiss();
          setAddVisible(false);
        }}
      >
        <View style={localStyles.modalOverlay}>
          <View style={localStyles.modalCard}>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
            <Text style={localStyles.modalTitle}>New {formatRepMaxLabel(tier)}</Text>
            <Text style={localStyles.modalHint}>
              Every save is added to history. If this is a personal best for this
              rep max, lower rep maxes update too when the weight beats them.
            </Text>
            <Text style={localStyles.modalLabel}>Weight (kg)</Text>
            <TextInput
              style={localStyles.weightInput}
              value={addWeight}
              onChangeText={setAddWeight}
              keyboardType="decimal-pad"
              inputAccessoryViewID={
                Platform.OS === 'ios' ? IOS_KEYBOARD_DONE_ACCESSORY_ID : undefined
              }
              onSubmitEditing={() => Keyboard.dismiss()}
              placeholder="0"
              placeholderTextColor={Colors.textPlaceholder}
            />
            <PbModalDateTimeField value={addDate} onChange={setAddDate} />
            <IosKeyboardDoneAccessory />
            <View style={localStyles.modalActions}>
              <TouchableOpacity
                style={localStyles.modalCancel}
                onPress={() => {
                  Keyboard.dismiss();
                  setAddVisible(false);
                }}
                disabled={addSaving}
              >
                <Text style={localStyles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={localStyles.modalSave}
                onPress={saveAdd}
                disabled={addSaving}
              >
                <Text style={localStyles.modalSaveText}>
                  {addSaving ? 'Saving…' : 'Save'}
                </Text>
              </TouchableOpacity>
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
        <View style={localStyles.modalOverlay}>
          <View style={localStyles.modalCard}>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
            <Text style={localStyles.modalTitle}>Edit entry</Text>
            <Text style={localStyles.modalLabel}>Weight (kg)</Text>
            <TextInput
              style={localStyles.weightInput}
              value={editWeight}
              onChangeText={setEditWeight}
              keyboardType="decimal-pad"
              inputAccessoryViewID={
                Platform.OS === 'ios' ? IOS_KEYBOARD_DONE_ACCESSORY_ID : undefined
              }
              onSubmitEditing={() => Keyboard.dismiss()}
              placeholder="0"
              placeholderTextColor={Colors.textPlaceholder}
            />
            <PbModalDateTimeField value={editDate} onChange={setEditDate} />
            <IosKeyboardDoneAccessory />
            <View style={localStyles.modalActions}>
              <TouchableOpacity
                style={localStyles.modalCancel}
                onPress={() => {
                  Keyboard.dismiss();
                  closeEdit();
                }}
                disabled={editSaving}
              >
                <Text style={localStyles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={localStyles.modalSave}
                onPress={saveEdit}
                disabled={editSaving}
              >
                <Text style={localStyles.modalSaveText}>
                  {editSaving ? 'Saving…' : 'Save'}
                </Text>
              </TouchableOpacity>
            </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  loader: {
    marginTop: Spacing.section,
  },
  listContent: {
    padding: Spacing.xxl,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.section,
    flexGrow: 1,
  },
  rowSeparator: {
    height: Spacing.xl,
  },
  emptyList: {
    color: Colors.textPlaceholder,
    fontSize: FontSize.lg,
    textAlign: 'center',
    marginTop: Spacing.section,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.backgroundCard,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    borderRadius: BorderRadius.xxl,
    padding: Spacing.xxl,
  },
  rowMain: {
    flex: 1,
  },
  rowWeight: {
    color: Colors.textPrimary,
    fontSize: FontSize.displaySm,
    fontWeight: '700',
  },
  rowDate: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    marginTop: Spacing.xs,
  },
  rowActions: {
    flexDirection: 'row',
    gap: Spacing.xxl,
    marginLeft: Spacing.md,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxl,
  },
  modalCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.xxl,
    padding: Spacing.section,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    maxHeight: '90%',
  },
  modalTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.displayMd,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  modalHint: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
    marginBottom: Spacing.xxl,
    lineHeight: 20,
  },
  modalLabel: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    marginBottom: Spacing.sm,
  },
  weightInput: {
    backgroundColor: Colors.backgroundElevated,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    borderRadius: 8,
    padding: Spacing.xxl,
    color: Colors.textPrimary,
    fontSize: FontSize.xxl,
    marginBottom: Spacing.xxl,
  },
  modalActions: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  modalCancel: {
    flex: 1,
    paddingVertical: Spacing.xxl,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: Colors.backgroundElevated,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
  },
  modalCancelText: {
    color: Colors.textPrimary,
    fontSize: FontSize.lg,
    fontWeight: '600',
  },
  modalSave: {
    flex: 1,
    paddingVertical: Spacing.xxl,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: Colors.accent,
  },
  modalSaveText: {
    color: Colors.textOnAccent,
    fontSize: FontSize.lg,
    fontWeight: '600',
  },
});
