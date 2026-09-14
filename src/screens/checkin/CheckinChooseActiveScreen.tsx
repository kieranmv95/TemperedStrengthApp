import { StandardLayout } from '@/src/components/StandardLayout';
import { Colors } from '@/src/constants/theme';
import { checkinScreenStyles as styles } from '@/src/screens/checkin/checkinScreenStyles';
import type { CatalogueBehaviour } from '@/src/types/checkin';
import type { Supplement } from '@/src/types/supplements';
import {
  FREE_BEHAVIOUR_CAP,
  FREE_SUPPLEMENT_CAP,
} from '@/src/utils/checkin/caps';
import { getBehaviourCatalogue } from '@/src/utils/checkin/catalogue';
import {
  getSupplements,
  getTrackedBehaviours,
  updateCheckinSettings,
} from '@/src/utils/storage';
import { rebuildSupplementReminders } from '@/src/services/supplementReminders';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

export function CheckinChooseActiveScreen() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [candidates, setCandidates] = useState<CatalogueBehaviour[]>([]);
  const [activeSupplements, setActiveSupplements] = useState<Supplement[]>([]);
  const [selectedBehaviourIds, setSelectedBehaviourIds] = useState<string[]>(
    []
  );
  const [selectedSupplementId, setSelectedSupplementId] = useState<
    string | null
  >(null);

  const load = useCallback(async () => {
    try {
      const [catalogue, tracked, supplements] = await Promise.all([
        getBehaviourCatalogue(),
        getTrackedBehaviours(),
        getSupplements(),
      ]);
      const behavioursById = new Map(
        catalogue.behaviours.map((behaviour) => [behaviour.id, behaviour])
      );
      const nextCandidates: CatalogueBehaviour[] = [];
      for (const item of tracked) {
        const behaviour = behavioursById.get(item.behaviourId);
        if (!behaviour || behaviour.deprecated || behaviour.sensitive) {
          continue;
        }
        nextCandidates.push(behaviour);
      }
      setCandidates(nextCandidates);
      setActiveSupplements(
        supplements.filter((supplement) => supplement.status === 'active')
      );
    } catch (loadError) {
      console.error('Error loading check-in lapse options:', loadError);
      setError('Could not load your behaviours. Try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const toggleBehaviour = (behaviourId: string) => {
    setError(null);
    setSelectedBehaviourIds((current) => {
      if (current.includes(behaviourId)) {
        return current.filter((id) => id !== behaviourId);
      }
      if (current.length >= FREE_BEHAVIOUR_CAP) {
        return current;
      }
      return [...current, behaviourId];
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      // The gate stays "pending" while they are on Free and over the caps; the
      // stored ids are what keeps the chosen few editable.
      await updateCheckinSettings({
        lapsePending: true,
        editableBehaviourIds: selectedBehaviourIds,
        editableSupplementId: selectedSupplementId,
      });
      void rebuildSupplementReminders({ isPro: false });
      router.replace('/checkin');
    } catch (saveError) {
      console.error('Error saving check-in lapse selection:', saveError);
      setError('Could not save your choice. Try again.');
    } finally {
      setSaving(false);
    }
  };

  const canSave = candidates.length < 1 || selectedBehaviourIds.length > 0;

  return (
    <StandardLayout
      title="Keep logging your key habits"
      subtitle="Your Pro behaviours are safe — pick the few you want to keep editing on Free."
    >
      <StandardLayout.Body>
        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color={Colors.accent} />
          </View>
        ) : (
          <View style={styles.page}>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Text style={styles.sectionNote}>
              Everything you have logged stays exactly as it is. The behaviours
              you do not pick become read-only until you upgrade again. Women’s
              health behaviours stay editable either way.
            </Text>

            <View style={styles.section}>
              <View style={styles.categoryHeader}>
                <Text style={styles.categoryTitle}>Behaviours</Text>
                <Text style={styles.selectionCounter}>
                  {selectedBehaviourIds.length} / {FREE_BEHAVIOUR_CAP}
                </Text>
              </View>
              <View style={styles.list}>
                {candidates.map((behaviour) => {
                  const isSelected = selectedBehaviourIds.includes(
                    behaviour.id
                  );
                  return (
                    <TouchableOpacity
                      key={behaviour.id}
                      style={styles.trackedRow}
                      onPress={() => toggleBehaviour(behaviour.id)}
                      accessibilityRole="checkbox"
                      accessibilityLabel={behaviour.label}
                      accessibilityState={{ checked: isSelected }}
                    >
                      <View style={styles.trackedRowTextBlock}>
                        <Text style={styles.trackedRowTitle}>
                          {behaviour.label}
                        </Text>
                      </View>
                      <Ionicons
                        name={isSelected ? 'checkbox' : 'square-outline'}
                        size={24}
                        color={
                          isSelected ? Colors.accent : Colors.backgroundBorder
                        }
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {activeSupplements.length > 0 ? (
              <View style={styles.section}>
                <View style={styles.categoryHeader}>
                  <Text style={styles.categoryTitle}>Supplement</Text>
                  <Text style={styles.selectionCounter}>
                    {selectedSupplementId === null ? 0 : 1} /{' '}
                    {FREE_SUPPLEMENT_CAP}
                  </Text>
                </View>
                <View style={styles.list}>
                  {activeSupplements.map((supplement) => {
                    const isSelected = selectedSupplementId === supplement.id;
                    return (
                      <TouchableOpacity
                        key={supplement.id}
                        style={styles.trackedRow}
                        onPress={() =>
                          setSelectedSupplementId(
                            isSelected ? null : supplement.id
                          )
                        }
                        accessibilityRole="radio"
                        accessibilityLabel={supplement.name}
                        accessibilityState={{ selected: isSelected }}
                      >
                        <View style={styles.trackedRowTextBlock}>
                          <Text style={styles.trackedRowTitle}>
                            {supplement.name}
                          </Text>
                          <Text style={styles.trackedRowMeta}>
                            {supplement.doseAmount} {supplement.doseUnit}
                          </Text>
                        </View>
                        <Ionicons
                          name={
                            isSelected ? 'radio-button-on' : 'radio-button-off'
                          }
                          size={24}
                          color={
                            isSelected ? Colors.accent : Colors.backgroundBorder
                          }
                        />
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            ) : null}

            <TouchableOpacity
              style={[
                styles.primaryButton,
                (!canSave || saving) && styles.primaryButtonDisabled,
              ]}
              onPress={() => void handleSave()}
              disabled={!canSave || saving}
              accessibilityRole="button"
              accessibilityLabel="Save selection"
            >
              <Text style={styles.primaryButtonText}>
                {saving ? 'Saving…' : 'Save and continue'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => router.push('/paywall')}
              accessibilityRole="button"
              accessibilityLabel="Upgrade to Pro"
            >
              <Text style={styles.secondaryButtonText}>
                Upgrade to Pro instead
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </StandardLayout.Body>
    </StandardLayout>
  );
}
