import {
  FilterChip,
  IOS_KEYBOARD_DONE_ACCESSORY_ID,
  IosKeyboardDoneAccessory,
  PressableCard,
  Skeleton,
  StandardLayout,
} from '@/src/components/ds';
import { ExerciseVideoPlayButton } from '@/src/components/exercise/ExerciseVideoPlayButton';
import { PbModalDateTimeField } from '@/src/components/PbModalDateTimeField';
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
import type { RepMax } from '@/src/types/personalBests';
import {
  formatRepMaxLabel,
  getCurrentBestForTier,
  getLatestEntryForTier,
  REP_MAX_ORDER,
} from '@/src/utils/personalBests';
import { asStringId } from '@/src/utils/routeParams';
import {
  getPersonalBestsForExercise,
  savePersonalBest,
} from '@/src/utils/storage';
import {
  formatWeightFromKg,
  parseUserWeightInputToKg,
} from '@/src/utils/weightUnits';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  Keyboard,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const TIER_SKELETON_HEIGHT = 88;
const TIER_SKELETON_COUNT = 3;

type TierValueProps = {
  label?: string;
  weightText: string;
  dateText: string;
  isBest: boolean;
};

function TierValue({ label, weightText, dateText, isBest }: TierValueProps) {
  return (
    <View style={styles.tierHolder}>
      {label ? <Text style={styles.tierSubLabel}>{label}</Text> : null}
      <Text style={[styles.tierWeight, isBest && styles.tierWeightBest]}>
        {weightText}
      </Text>
      <Text style={styles.tierDate}>{dateText}</Text>
    </View>
  );
}

export default function ExercisePersonalBestsScreen() {
  const { unit: weightUnit } = useWeightUnit();
  const largeText = useLargeText();
  const { exerciseId: idParam } = useLocalSearchParams();
  const idStr = asStringId(idParam);
  const exerciseId = idStr ? parseInt(idStr, 10) : NaN;

  const exercise = useMemo(() => {
    if (!Number.isFinite(exerciseId)) return undefined;
    return getExerciseById(exerciseId);
  }, [exerciseId]);

  const lowerWeightIsBetter = exercise?.lowerWeightIsBetter === true;

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
    const wKg = parseUserWeightInputToKg(weightInput, weightUnit);
    if (wKg === null || !Number.isFinite(wKg) || wKg <= 0) {
      Alert.alert('Invalid weight', 'Enter a weight greater than zero.');
      return;
    }
    if (!Number.isFinite(exerciseId)) return;
    setSaving(true);
    try {
      const { isPR, tiersWithNewRows } = await savePersonalBest(
        exerciseId,
        selectedTier,
        wKg,
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
  }, [exerciseId, selectedTier, weightInput, weightUnit, logDate, loadPbs]);

  if (!Number.isFinite(exerciseId) || !exercise) {
    return (
      <StandardLayout title="Exercise" onBackPress={() => router.back()}>
        <StandardLayout.Body>
          <Text style={styles.emptyTitle}>Exercise not found</Text>
        </StandardLayout.Body>
      </StandardLayout>
    );
  }

  const exerciseMeta = `${exercise.muscle} · ${exercise.equipment}`;

  if (exercise.logging_type === 'time') {
    return (
      <StandardLayout
        title={exercise.name}
        subtitle={exerciseMeta}
        onBackPress={() => router.back()}
      >
        <StandardLayout.Body>
          <View style={styles.body}>
            <ExerciseVideoPlayButton
              exerciseId={exercise.id}
              variant="banner"
            />
            <Text style={styles.emptyDescription}>
              Personal bests for rep maxes apply to rep-based exercises only.
            </Text>
          </View>
        </StandardLayout.Body>
      </StandardLayout>
    );
  }

  return (
    <StandardLayout
      title={exercise.name}
      subtitle={exerciseMeta}
      onBackPress={() => router.back()}
    >
      <StandardLayout.Body>
        <View style={styles.body}>
          <ExerciseVideoPlayButton exerciseId={exercise.id} variant="banner" />

          <Pressable
            style={({ pressed }) => [
              styles.logButton,
              pressed && styles.logButtonPressed,
            ]}
            onPress={openLog}
            accessibilityRole="button"
            accessibilityLabel="Log lift"
          >
            <Ionicons name="add" size={22} color={color.onGold} />
            <Text style={styles.logButtonText}>Log lift</Text>
          </Pressable>

          {loading || pbs === null ? (
            <View style={styles.tierList}>
              {Array.from({ length: TIER_SKELETON_COUNT }, (_, index) => (
                <Skeleton
                  key={index}
                  width="100%"
                  height={TIER_SKELETON_HEIGHT}
                  radius="md"
                  accessibilityLabel={
                    index === 0 ? 'Loading personal bests' : undefined
                  }
                />
              ))}
            </View>
          ) : (
            <View style={styles.tierList}>
              {REP_MAX_ORDER.map((tier) => {
                const best = getCurrentBestForTier(
                  pbs,
                  tier,
                  lowerWeightIsBetter
                );
                const latest = getLatestEntryForTier(pbs, tier);
                const count = pbs[tier]?.length ?? 0;
                const showLatest =
                  latest &&
                  best &&
                  (latest.weight !== best.weight ||
                    latest.achievedAt !== best.achievedAt);
                const tierLabel = formatRepMaxLabel(tier);
                const countLabel = `${count} ${count === 1 ? 'entry' : 'entries'}`;
                const bestWeight = best
                  ? formatWeightFromKg(best.weight, weightUnit)
                  : null;
                const bestDate = best
                  ? new Date(best.achievedAt).toLocaleDateString()
                  : null;
                const latestWeight = latest
                  ? formatWeightFromKg(latest.weight, weightUnit)
                  : null;
                const latestDate = latest
                  ? new Date(latest.achievedAt).toLocaleDateString()
                  : null;
                const accessibilityParts = [tierLabel];
                if (best) {
                  accessibilityParts.push(`best ${bestWeight} on ${bestDate}`);
                } else {
                  accessibilityParts.push('not set');
                }
                if (showLatest && latest) {
                  accessibilityParts.push(
                    `latest ${latestWeight} on ${latestDate}`
                  );
                }
                if (count > 0) {
                  accessibilityParts.push(countLabel);
                }
                return (
                  <PressableCard
                    key={tier}
                    onPress={() =>
                      router.push(`/records/${exerciseId}/${tier}`)
                    }
                    accessibilityLabel={accessibilityParts.join(', ')}
                    accessibilityHint="Opens rep max history"
                  >
                    <View
                      style={[
                        styles.tierRow,
                        largeText && styles.tierRowStacked,
                      ]}
                    >
                      <View style={styles.tierRowLeft}>
                        <Text style={styles.tierLabel}>{tierLabel}</Text>
                        {count > 0 ? (
                          <Text style={styles.tierCount}>{countLabel}</Text>
                        ) : null}
                      </View>
                      {best && bestWeight && bestDate ? (
                        <View style={styles.tierValues}>
                          <TierValue
                            label={showLatest ? 'Best' : undefined}
                            weightText={bestWeight}
                            dateText={bestDate}
                            isBest
                          />
                          {showLatest && latestWeight && latestDate ? (
                            <TierValue
                              label="Latest"
                              weightText={latestWeight}
                              dateText={latestDate}
                              isBest={false}
                            />
                          ) : null}
                        </View>
                      ) : (
                        <Text style={styles.tierEmpty}>Not set</Text>
                      )}
                    </View>
                  </PressableCard>
                );
              })}
            </View>
          )}
        </View>
      </StandardLayout.Body>

      <Modal
        visible={logModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => {
          Keyboard.dismiss();
          setLogModalVisible(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[styles.modalCard, elevation.overlay]}
            accessibilityViewIsModal
            onAccessibilityEscape={() => {
              Keyboard.dismiss();
              setLogModalVisible(false);
            }}
          >
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalContent}
            >
              <Text style={styles.modalTitle} accessibilityRole="header">
                Log lift
              </Text>
              <View style={styles.modalField}>
                <Text
                  style={styles.modalLabel}
                  accessibilityElementsHidden
                  importantForAccessibility="no-hide-descendants"
                >
                  Rep max
                </Text>
                <View style={styles.tierChips}>
                  {REP_MAX_ORDER.map((tier) => (
                    <FilterChip
                      key={tier}
                      label={formatRepMaxLabel(tier)}
                      selected={selectedTier === tier}
                      onPress={() => setSelectedTier(tier)}
                      accessibilityLabel={`Rep max ${formatRepMaxLabel(tier)}`}
                    />
                  ))}
                </View>
              </View>
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
                  value={weightInput}
                  onChangeText={setWeightInput}
                  keyboardType="decimal-pad"
                  inputAccessoryViewID={IOS_KEYBOARD_DONE_ACCESSORY_ID}
                  onSubmitEditing={() => Keyboard.dismiss()}
                  placeholder={weightUnit}
                  placeholderTextColor={color.textTertiary}
                  accessibilityLabel={`Weight in ${weightUnit}`}
                />
              </View>
              <PbModalDateTimeField value={logDate} onChange={setLogDate} />
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
                    setLogModalVisible(false);
                  }}
                  disabled={saving}
                  accessibilityRole="button"
                  accessibilityLabel="Cancel"
                  accessibilityState={{ disabled: saving }}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={({ pressed }) => [
                    styles.modalButton,
                    styles.modalSave,
                    pressed && styles.modalSavePressed,
                    saving && styles.modalButtonBusy,
                  ]}
                  onPress={handleSaveLog}
                  disabled={saving}
                  accessibilityRole="button"
                  accessibilityLabel={saving ? 'Saving' : 'Save lift'}
                  accessibilityState={{ disabled: saving, busy: saving }}
                >
                  <Text style={styles.modalSaveText}>
                    {saving ? 'Saving…' : 'Save'}
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
  body: {
    gap: space.md,
  },
  emptyTitle: {
    ...typography.headline,
    color: color.textPrimary,
    textAlign: 'center',
    marginTop: space.xxl,
  },
  emptyDescription: {
    ...typography.callout,
    color: color.textSecondary,
    textAlign: 'center',
  },
  logButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.xs,
    minHeight: MIN_TARGET_SIZE,
    paddingHorizontal: space.lg,
    borderRadius: radius.pill,
    backgroundColor: color.gold,
  },
  logButtonPressed: {
    backgroundColor: color.goldStrong,
  },
  logButtonText: {
    ...typography.calloutStrong,
    color: color.onGold,
  },
  tierList: {
    gap: space.sm,
  },
  tierRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  /** Large text: the values drop below the rep max label. */
  tierRowStacked: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  tierRowLeft: {
    flex: 1,
    minWidth: 0,
    gap: space.xxs,
  },
  tierLabel: {
    ...typography.headline,
    color: color.textPrimary,
  },
  tierCount: {
    ...typography.caption,
    color: color.textSecondary,
  },
  tierValues: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.xs,
  },
  tierHolder: {
    alignItems: 'center',
    paddingVertical: space.xs,
    paddingHorizontal: space.sm,
    borderRadius: radius.sm,
    backgroundColor: color.surface2,
  },
  tierSubLabel: {
    ...typography.captionStrong,
    color: color.textSecondary,
  },
  tierWeight: {
    ...typography.numericMedium,
    color: color.textPrimary,
  },
  tierWeightBest: {
    color: color.gold,
  },
  tierDate: {
    ...typography.caption,
    fontVariant: ['tabular-nums'],
    color: color.textTertiary,
  },
  tierEmpty: {
    ...typography.callout,
    color: color.textTertiary,
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
  modalField: {
    gap: space.xxs,
  },
  modalLabel: {
    ...typography.captionStrong,
    color: color.textSecondary,
  },
  tierChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.xs,
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
