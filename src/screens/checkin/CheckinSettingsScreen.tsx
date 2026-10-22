import { CheckinListSkeleton } from '@/src/components/checkin/CheckinListSkeleton';
import {
  FilterChip,
  ProgressBar,
  SectionHeader,
  StandardLayout,
} from '@/src/components/ds';
import { color } from '@/src/constants/tokens';
import { useSubscription } from '@/src/hooks/use-subscription';
import { checkinScreenStyles as styles } from '@/src/screens/checkin/checkinScreenStyles';
import type {
  BehaviourCategory,
  CatalogueBehaviour,
  CatalogueCategory,
  TrackedBehaviour,
} from '@/src/types/checkin';
import {
  FREE_BEHAVIOUR_CAP,
  canAddBehaviour,
  countCapBehaviours,
} from '@/src/utils/checkin/caps';
import {
  getBehaviourCatalogue,
  getSelectableBehaviours,
  getVisibleCategories,
} from '@/src/utils/checkin/catalogue';
import {
  getCheckinSettings,
  getTrackedBehaviours,
  setTrackedBehaviours,
} from '@/src/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

export function CheckinSettingsScreen() {
  const { isPro, isLoading: subscriptionLoading } = useSubscription();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCapUpsell, setShowCapUpsell] = useState(false);

  const [tracked, setTracked] = useState<TrackedBehaviour[]>([]);
  const [categories, setCategories] = useState<CatalogueCategory[]>([]);
  const [behaviours, setBehaviours] = useState<CatalogueBehaviour[]>([]);
  /** Every catalogue behaviour, so tracked rows keep their label when a category is hidden. */
  const [labelsById, setLabelsById] = useState<ReadonlyMap<string, string>>(
    new Map()
  );
  const [activeCategory, setActiveCategory] =
    useState<BehaviourCategory | null>(null);

  const load = useCallback(async () => {
    try {
      const settings = await getCheckinSettings();
      const [catalogue, nextCategories, nextBehaviours, nextTracked] =
        await Promise.all([
          getBehaviourCatalogue(),
          getVisibleCategories({
            womensHealthVisible: settings.womensHealthVisible,
          }),
          getSelectableBehaviours({
            womensHealthVisible: settings.womensHealthVisible,
          }),
          getTrackedBehaviours(),
        ]);
      setLabelsById(
        new Map(
          catalogue.behaviours.map((behaviour) => [
            behaviour.id,
            behaviour.label,
          ])
        )
      );
      setCategories(nextCategories);
      setBehaviours(nextBehaviours);
      setTracked(nextTracked);
      setActiveCategory((current) => current ?? nextCategories[0]?.id ?? null);
    } catch (loadError) {
      console.error('Error loading check-in behaviours:', loadError);
      setError('Could not load the behaviour list. Try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const persistOrder = useCallback(async (behaviourIds: string[]) => {
    setSaving(true);
    setError(null);
    try {
      const next = await setTrackedBehaviours(behaviourIds);
      setTracked(next);
    } catch (saveError) {
      console.error('Error saving tracked behaviours:', saveError);
      setError('Could not save your behaviours. Try again.');
      const current = await getTrackedBehaviours();
      setTracked(current);
    } finally {
      setSaving(false);
    }
  }, []);

  const handleToggleBehaviour = (behaviour: CatalogueBehaviour) => {
    const isTracked = tracked.some((item) => item.behaviourId === behaviour.id);
    if (isTracked) {
      void persistOrder(
        tracked
          .filter((item) => item.behaviourId !== behaviour.id)
          .map((item) => item.behaviourId)
      );
      return;
    }
    if (
      !canAddBehaviour({
        isPro,
        tracked,
        behaviourSensitive: behaviour.sensitive,
      })
    ) {
      setShowCapUpsell(true);
      return;
    }
    setShowCapUpsell(false);
    void persistOrder([
      ...tracked.map((item) => item.behaviourId),
      behaviour.id,
    ]);
  };

  const handleMove = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= tracked.length) {
      return;
    }
    const ids = tracked.map((item) => item.behaviourId);
    const moved = ids[index];
    const swapped = ids[target];
    if (moved === undefined || swapped === undefined) {
      return;
    }
    ids[index] = swapped;
    ids[target] = moved;
    void persistOrder(ids);
  };

  const behaviourLabel = (behaviourId: string): string =>
    labelsById.get(behaviourId) ?? behaviourId;

  const renderTrackedSection = () => {
    if (tracked.length < 1) {
      return (
        <Text style={styles.sectionNote}>
          Nothing tracked yet. Pick behaviours below and they will show up here
          in the order you check them off.
        </Text>
      );
    }

    return (
      <View style={styles.list}>
        {tracked.map((item, index) => {
          const isFirst = index === 0;
          const isLast = index === tracked.length - 1;
          const canMoveUp = !isFirst && !saving;
          const canMoveDown = !isLast && !saving;
          return (
            <View key={item.id} style={styles.trackedRow}>
              <View style={styles.trackedRowTextBlock}>
                <Text style={styles.trackedRowTitle}>
                  {behaviourLabel(item.behaviourId)}
                </Text>
              </View>
              <Pressable
                style={({ pressed }) => [
                  styles.reorderButton,
                  pressed && canMoveUp && styles.reorderButtonPressed,
                  isFirst && styles.reorderButtonDisabled,
                ]}
                onPress={() => handleMove(index, -1)}
                disabled={!canMoveUp}
                accessibilityRole="button"
                accessibilityLabel={`Move ${behaviourLabel(item.behaviourId)} up`}
                accessibilityState={{ disabled: !canMoveUp }}
              >
                <Ionicons
                  name="chevron-up"
                  size={18}
                  color={isFirst ? color.textDisabled : color.textPrimary}
                />
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  styles.reorderButton,
                  pressed && canMoveDown && styles.reorderButtonPressed,
                  isLast && styles.reorderButtonDisabled,
                ]}
                onPress={() => handleMove(index, 1)}
                disabled={!canMoveDown}
                accessibilityRole="button"
                accessibilityLabel={`Move ${behaviourLabel(
                  item.behaviourId
                )} down`}
                accessibilityState={{ disabled: !canMoveDown }}
              >
                <Ionicons
                  name="chevron-down"
                  size={18}
                  color={isLast ? color.textDisabled : color.textPrimary}
                />
              </Pressable>
            </View>
          );
        })}
      </View>
    );
  };

  const renderCapUpsell = () => (
    <View style={styles.upsellCard}>
      <Text style={styles.upsellTitle} accessibilityRole="header">
        Free includes {FREE_BEHAVIOUR_CAP} behaviours
      </Text>
      <Text style={styles.upsellBody}>
        Untrack one to swap it out, or upgrade to Pro for unlimited behaviours.
        Women’s health behaviours never count towards the limit.
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

  const renderCategoryBehaviours = () => {
    const visible = behaviours
      .filter((behaviour) => behaviour.category === activeCategory)
      .sort((a, b) => a.sortOrder - b.sortOrder);

    return (
      <View style={styles.list}>
        {visible.map((behaviour) => {
          const isTracked = tracked.some(
            (item) => item.behaviourId === behaviour.id
          );
          return (
            <Pressable
              key={behaviour.id}
              style={({ pressed }) => [
                styles.trackedRow,
                pressed && styles.trackedRowPressed,
              ]}
              onPress={() => handleToggleBehaviour(behaviour)}
              disabled={saving}
              accessibilityRole="checkbox"
              accessibilityLabel={behaviour.label}
              accessibilityHint={behaviour.description}
              accessibilityState={{ checked: isTracked, disabled: saving }}
            >
              <View style={styles.trackedRowTextBlock}>
                <Text style={styles.trackedRowTitle}>{behaviour.label}</Text>
                {behaviour.description ? (
                  <Text style={styles.trackedRowMeta}>
                    {behaviour.description}
                  </Text>
                ) : null}
              </View>
              <Ionicons
                name={isTracked ? 'checkbox' : 'square-outline'}
                size={24}
                color={isTracked ? color.gold : color.borderStrong}
              />
            </Pressable>
          );
        })}
      </View>
    );
  };

  return (
    <StandardLayout
      title="Your behaviours"
      subtitle="Choose what you want to check in on each day."
      onBackPress={() => router.back()}
    >
      <StandardLayout.Body>
        {loading || subscriptionLoading ? (
          <CheckinListSkeleton accessibilityLabel="Loading behaviours" />
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

            {!isPro ? (
              <View style={styles.slotsCard}>
                <View
                  style={styles.slotsRow}
                  accessibilityElementsHidden
                  importantForAccessibility="no-hide-descendants"
                >
                  <Text style={styles.slotsLabel}>Free behaviour slots</Text>
                  <Text style={styles.slotsValue}>
                    {countCapBehaviours(tracked)} / {FREE_BEHAVIOUR_CAP}
                  </Text>
                </View>
                <ProgressBar
                  progress={countCapBehaviours(tracked) / FREE_BEHAVIOUR_CAP}
                  accessibilityLabel="Free behaviour slots"
                  accessibilityValueText={`${countCapBehaviours(
                    tracked
                  )} of ${FREE_BEHAVIOUR_CAP} used`}
                />
              </View>
            ) : null}

            {showCapUpsell ? renderCapUpsell() : null}

            <View style={styles.section}>
              <SectionHeader title="Tracked" />
              {renderTrackedSection()}
            </View>

            <View style={styles.section}>
              <SectionHeader title="Browse" />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.chipScroll}
                contentContainerStyle={styles.chipScrollContent}
              >
                {categories.map((category) => (
                  <FilterChip
                    key={category.id}
                    label={category.label}
                    selected={activeCategory === category.id}
                    onPress={() => setActiveCategory(category.id)}
                  />
                ))}
              </ScrollView>
              {renderCategoryBehaviours()}
            </View>
          </View>
        )}
      </StandardLayout.Body>
    </StandardLayout>
  );
}
