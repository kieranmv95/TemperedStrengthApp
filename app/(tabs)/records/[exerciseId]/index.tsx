import { PbModalDateTimeField } from '@/src/components/PbModalDateTimeField';
import { workoutDetailStyles as styles } from '@/src/components/workouts/workoutDetailStyles';
import { BorderRadius, Colors, FontSize, Spacing } from '@/src/constants/theme';
import { getExerciseById } from '@/src/data/exercises';
import {
  IOS_KEYBOARD_DONE_ACCESSORY_ID,
  IosKeyboardDoneAccessory,
} from '@/src/components/forms/IosKeyboardDoneAccessory';
import type { RepMax } from '@/src/types/personalBests';
import {
  formatRepMaxLabel,
  getCurrentBestForTier,
  getLatestEntryForTier,
  REP_MAX_ORDER,
} from '@/src/utils/personalBests';
import {
  getPersonalBestsForExercise,
  savePersonalBest,
} from '@/src/utils/storage';
import { asStringId } from '@/src/utils/routeParams';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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

export default function ExercisePersonalBestsScreen() {
  const { exerciseId: idParam } = useLocalSearchParams();
  const idStr = asStringId(idParam);
  const exerciseId = idStr ? parseInt(idStr, 10) : NaN;

  const exercise = useMemo(() => {
    if (!Number.isFinite(exerciseId)) return undefined;
    return getExerciseById(exerciseId);
  }, [exerciseId]);

  const [pbs, setPbs] = useState<Awaited<
    ReturnType<typeof getPersonalBestsForExercise>
  > | null>(null);
  const [loading, setLoading] = useState(true);
  const [logModalVisible, setLogModalVisible] = useState(false);
  const [selectedTier, setSelectedTier] = useState<RepMax>(5);
  const [weightInput, setWeightInput] = useState('');
  const [logDate, setLogDate] = useState(() => new Date());
  const [saving, setSaving] = useState(false);
  const loadPbs = useCallback(async () => {
    if (!Number.isFinite(exerciseId)) return;
    setLoading(true);
    try {
      const next = await getPersonalBestsForExercise(exerciseId);
      setPbs(next);
    } catch (error) {
      console.error('Error loading PBs:', error);
      setPbs({});
    } finally {
      setLoading(false);
    }
  }, [exerciseId]);

  useFocusEffect(
    useCallback(() => {
      loadPbs();
    }, [loadPbs])
  );

  const openLog = useCallback(() => {
    setWeightInput('');
    setSelectedTier(5);
    setLogDate(new Date());
    setLogModalVisible(true);
  }, []);

  const handleSaveLog = useCallback(async () => {
    const w = parseFloat(weightInput);
    if (!Number.isFinite(w) || w <= 0) {
      Alert.alert('Invalid weight', 'Enter a weight greater than zero.');
      return;
    }
    if (!Number.isFinite(exerciseId)) return;
    setSaving(true);
    try {
      const { isPR, tiersWithNewRows } = await savePersonalBest(
        exerciseId,
        selectedTier,
        w,
        logDate.toISOString()
      );
      if (tiersWithNewRows.length === 0) {
        Alert.alert('Error', 'Could not save lift.');
      } else if (isPR) {
        const labels = tiersWithNewRows.map(formatRepMaxLabel).join(', ');
        Keyboard.dismiss();
        setLogModalVisible(false);
        Alert.alert('New personal best', `Updated: ${labels}.`);
        await loadPbs();
      } else {
        Keyboard.dismiss();
        Alert.alert(
          'Lift logged',
          `Saved to ${formatRepMaxLabel(selectedTier)} history.`
        );
        setLogModalVisible(false);
        await loadPbs();
      }
    } catch (error) {
      console.error('Error saving PB:', error);
      Alert.alert('Error', 'Could not save personal best.');
    } finally {
      setSaving(false);
    }
  }, [exerciseId, selectedTier, weightInput, logDate, loadPbs]);

  if (!Number.isFinite(exerciseId) || !exercise) {
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
            Exercise
          </Text>
          <View style={styles.headerRightSpacer} />
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Exercise not found</Text>
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
            Personal bests for rep maxes apply to rep-based exercises only.
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
          {exercise.name}
        </Text>
        <View style={styles.headerRightSpacer} />
      </View>

      <ScrollView
        style={styles.detailContent}
        contentContainerStyle={localStyles.scrollContent}
      >
        <Text style={localStyles.meta}>
          {exercise.muscle} · {exercise.equipment}
        </Text>

        <TouchableOpacity style={localStyles.logButton} onPress={openLog}>
          <Text style={localStyles.logButtonText}>Log lift</Text>
          <Ionicons
            name="add-circle-outline"
            size={22}
            color={Colors.textOnAccent}
          />
        </TouchableOpacity>

        {loading || pbs === null ? (
          <ActivityIndicator color={Colors.textMuted} style={localStyles.loader} />
        ) : (
          <View style={localStyles.tierList}>
            {REP_MAX_ORDER.map((tier) => {
              const best = getCurrentBestForTier(pbs, tier);
              const latest = getLatestEntryForTier(pbs, tier);
              const count = pbs[tier]?.length ?? 0;
              const showLatest =
                latest &&
                best &&
                (latest.weight !== best.weight ||
                  latest.achievedAt !== best.achievedAt);
              return (
                <TouchableOpacity
                  key={tier}
                  style={localStyles.tierRow}
                  onPress={() =>
                    router.push(`/records/${exerciseId}/${tier}`)
                  }
                  activeOpacity={0.7}
                >
                  <View style={localStyles.tierRowLeft}>
                    <Text style={localStyles.tierLabel}>
                      {formatRepMaxLabel(tier)}
                    </Text>
                    {count > 0 ? (
                      <Text style={localStyles.tierCount}>
                        {count} {count === 1 ? 'entry' : 'entries'}
                      </Text>
                    ) : null}
                  </View>
                  <View style={localStyles.tierRowRight}>
                    {best ? (
                      <View>
                        {showLatest && latest ? (
                          <>
                            <Text style={localStyles.tierSubLabel}>Best</Text>
                            <Text style={localStyles.tierWeight}>
                              {best.weight} kg
                            </Text>
                            <Text style={localStyles.tierDate}>
                              {new Date(best.achievedAt).toLocaleDateString()}
                            </Text>
                            <Text
                              style={[
                                localStyles.tierSubLabel,
                                localStyles.tierLatestLabel,
                              ]}
                            >
                              Latest
                            </Text>
                            <Text style={localStyles.tierWeight}>
                              {latest.weight} kg
                            </Text>
                            <Text style={localStyles.tierDate}>
                              {new Date(latest.achievedAt).toLocaleDateString()}
                            </Text>
                          </>
                        ) : (
                          <>
                            <Text style={localStyles.tierWeight}>
                              {best.weight} kg
                            </Text>
                            <Text style={localStyles.tierDate}>
                              {new Date(best.achievedAt).toLocaleDateString()}
                            </Text>
                          </>
                        )}
                      </View>
                    ) : (
                      <Text style={localStyles.tierEmpty}>—</Text>
                    )}
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={Colors.textPlaceholder}
                      style={localStyles.tierChevron}
                    />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>

      <Modal
        visible={logModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => {
          Keyboard.dismiss();
          setLogModalVisible(false);
        }}
      >
        <View style={localStyles.modalOverlay}>
          <View style={localStyles.modalCard}>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
            <Text style={localStyles.modalTitle}>Log lift</Text>
            <Text style={localStyles.modalLabel}>Rep max</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={localStyles.tierPills}
            >
              {REP_MAX_ORDER.map((tier) => (
                <TouchableOpacity
                  key={tier}
                  style={[
                    localStyles.tierPill,
                    selectedTier === tier && localStyles.tierPillActive,
                  ]}
                  onPress={() => setSelectedTier(tier)}
                >
                  <Text
                    style={[
                      localStyles.tierPillText,
                      selectedTier === tier && localStyles.tierPillTextActive,
                    ]}
                  >
                    {formatRepMaxLabel(tier)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Text style={localStyles.modalLabel}>Weight (kg)</Text>
            <TextInput
              style={localStyles.weightInput}
              value={weightInput}
              onChangeText={setWeightInput}
              keyboardType="decimal-pad"
              inputAccessoryViewID={
                Platform.OS === 'ios' ? IOS_KEYBOARD_DONE_ACCESSORY_ID : undefined
              }
              onSubmitEditing={() => Keyboard.dismiss()}
              placeholder="0"
              placeholderTextColor={Colors.textPlaceholder}
            />
            <PbModalDateTimeField value={logDate} onChange={setLogDate} />
            <IosKeyboardDoneAccessory />
            <View style={localStyles.modalActions}>
              <TouchableOpacity
                style={localStyles.modalCancel}
                onPress={() => {
                  Keyboard.dismiss();
                  setLogModalVisible(false);
                }}
                disabled={saving}
              >
                <Text style={localStyles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={localStyles.modalSave}
                onPress={handleSaveLog}
                disabled={saving}
              >
                <Text style={localStyles.modalSaveText}>
                  {saving ? 'Saving…' : 'Save'}
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
  scrollContent: {
    padding: Spacing.xxl,
    paddingBottom: Spacing.section,
  },
  meta: {
    color: Colors.textMuted,
    fontSize: FontSize.xxl,
    marginBottom: Spacing.xxl,
  },
  logButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.accent,
    paddingVertical: Spacing.xxl,
    borderRadius: BorderRadius.xxl,
    marginBottom: Spacing.section,
  },
  logButtonText: {
    color: Colors.textOnAccent,
    fontSize: FontSize.xl,
    fontWeight: '700',
  },
  loader: {
    marginTop: Spacing.section,
  },
  tierList: {
    gap: Spacing.xl,
  },
  tierRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.backgroundCard,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    borderRadius: BorderRadius.xxl,
    padding: Spacing.xxl,
  },
  tierRowLeft: {
    flex: 1,
    marginRight: Spacing.md,
  },
  tierRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  tierChevron: {
    marginLeft: Spacing.xs,
  },
  tierLabel: {
    color: Colors.textPrimary,
    fontSize: FontSize.displaySm,
    fontWeight: '700',
  },
  tierCount: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
    marginTop: Spacing.xs,
  },
  tierSubLabel: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
    fontWeight: '600',
    textAlign: 'right',
    marginBottom: Spacing.xs,
  },
  tierLatestLabel: {
    marginTop: Spacing.sm,
  },
  tierWeight: {
    color: Colors.textSecondary,
    fontSize: FontSize.displaySm,
    fontWeight: '600',
    textAlign: 'right',
  },
  tierDate: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
    textAlign: 'right',
    marginTop: Spacing.xs,
  },
  tierEmpty: {
    color: Colors.textPlaceholder,
    fontSize: FontSize.xxl,
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
    marginBottom: Spacing.xxl,
  },
  modalLabel: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    marginBottom: Spacing.sm,
  },
  tierPills: {
    gap: Spacing.sm,
    marginBottom: Spacing.xxl,
  },
  tierPill: {
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md,
    borderRadius: 20,
    backgroundColor: Colors.backgroundElevated,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
  },
  tierPillActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  tierPillText: {
    color: Colors.textSecondary,
    fontSize: FontSize.lg,
    fontWeight: '600',
  },
  tierPillTextActive: {
    color: Colors.textOnAccent,
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
