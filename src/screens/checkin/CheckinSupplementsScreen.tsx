import { CheckinListSkeleton } from '@/src/components/checkin/CheckinListSkeleton';
import {
  PressableCard,
  ProgressBar,
  SectionHeader,
  StandardLayout,
} from '@/src/components/ds';
import { useSubscription } from '@/src/hooks/use-subscription';
import { checkinScreenStyles as styles } from '@/src/screens/checkin/checkinScreenStyles';
import { describeSupplementSchedule } from '@/src/screens/checkin/supplementFormatting';
import { formatLocalYMD } from '@/src/services/streakService';
import type { Supplement, SupplementLog } from '@/src/types/supplements';
import {
  FREE_SUPPLEMENT_CAP,
  canAddActiveSupplement,
} from '@/src/utils/checkin/caps';
import { addLocalDays } from '@/src/utils/checkin/schedule';
import {
  computeSupplementAdherence,
  getSupplementLogsInRange,
  getSupplements,
} from '@/src/utils/storage';
import { useFocusEffect, router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

const ADHERENCE_WINDOW_DAYS = 30;

const DISCLAIMER =
  'Supplement tracking is a log, not medical advice. Check doses with a pharmacist or doctor, especially alongside medication.';

export function CheckinSupplementsScreen() {
  const { isPro, isLoading: subscriptionLoading } = useSubscription();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCapUpsell, setShowCapUpsell] = useState(false);
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [logs, setLogs] = useState<SupplementLog[]>([]);
  const [today, setToday] = useState(() => formatLocalYMD(new Date()));

  const load = useCallback(async () => {
    const localDate = formatLocalYMD(new Date());
    setToday(localDate);
    setError(null);
    try {
      const [nextSupplements, nextLogs] = await Promise.all([
        getSupplements(),
        getSupplementLogsInRange(
          addLocalDays(localDate, -(ADHERENCE_WINDOW_DAYS - 1)),
          localDate
        ),
      ]);
      setSupplements(nextSupplements);
      setLogs(nextLogs);
    } catch (loadError) {
      console.error('Error loading supplements:', loadError);
      setError('Could not load your supplements. Try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  const handleAdd = () => {
    if (!canAddActiveSupplement({ isPro, supplements })) {
      setShowCapUpsell(true);
      return;
    }
    setShowCapUpsell(false);
    router.push('/checkin/supplements/new');
  };

  const adherenceFor = (supplement: Supplement) =>
    computeSupplementAdherence({
      startDate: addLocalDays(today, -(ADHERENCE_WINDOW_DAYS - 1)),
      endDate: today,
      supplement,
      logs,
    });

  const adherenceLine = (taken: number, expected: number): string => {
    if (expected < 1) {
      return 'No doses due in the last 30 days';
    }
    const percentage = Math.round((taken / expected) * 100);
    return `Adherence ${taken}/${expected} doses (${percentage}%) over 30 days`;
  };

  const renderSupplementCard = (supplement: Supplement) => {
    const meta = `${supplement.doseAmount} ${supplement.doseUnit} · ${
      supplement.form
    }${supplement.brand ? ` · ${supplement.brand}` : ''}`;
    const schedule = describeSupplementSchedule(supplement.schedule);
    const adherence =
      supplement.status === 'active' ? adherenceFor(supplement) : null;
    const adherenceText = adherence
      ? adherenceLine(adherence.taken, adherence.expected)
      : null;

    return (
      <PressableCard
        key={supplement.id}
        onPress={() =>
          router.push({
            pathname: '/checkin/supplements/[id]',
            params: { id: supplement.id },
          })
        }
        accessibilityLabel={`Edit ${supplement.name}, ${meta}, ${schedule}${
          adherenceText ? `, ${adherenceText}` : ''
        }`}
      >
        <Text style={styles.supplementTitle}>{supplement.name}</Text>
        <Text style={styles.supplementMeta}>{meta}</Text>
        <Text style={styles.supplementMeta}>{schedule}</Text>
        {adherence && adherenceText ? (
          <View style={styles.supplementAdherence}>
            {adherence.expected > 0 ? (
              <ProgressBar
                progress={adherence.taken / adherence.expected}
                accessibilityLabel={`${supplement.name} adherence`}
                accessibilityValueText={adherenceText}
              />
            ) : null}
            <Text style={styles.supplementAdherenceText}>{adherenceText}</Text>
          </View>
        ) : null}
      </PressableCard>
    );
  };

  const renderSection = (title: string, items: Supplement[]) => {
    if (items.length < 1) {
      return null;
    }
    return (
      <View style={styles.section}>
        <SectionHeader title={title} />
        <View style={styles.list}>{items.map(renderSupplementCard)}</View>
      </View>
    );
  };

  const renderCapUpsell = () => (
    <View style={styles.upsellCard}>
      <Text style={styles.upsellTitle} accessibilityRole="header">
        Free tracks {FREE_SUPPLEMENT_CAP} active supplement
      </Text>
      <Text style={styles.upsellBody}>
        Pause the one you are tracking to swap it out, or upgrade to Pro to
        track as many as you like.
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
      title="Supplements"
      subtitle="What you take, when you take it, and whether you did."
      onBackPress={() => router.back()}
    >
      <StandardLayout.Body>
        {loading || subscriptionLoading ? (
          <CheckinListSkeleton accessibilityLabel="Loading supplements" />
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

            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.primaryButtonPressed,
              ]}
              onPress={handleAdd}
              accessibilityRole="button"
              accessibilityLabel="Add a supplement"
            >
              <Text style={styles.primaryButtonText}>Add a supplement</Text>
            </Pressable>

            {showCapUpsell ? renderCapUpsell() : null}

            {supplements.length < 1 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle} accessibilityRole="header">
                  No supplements yet
                </Text>
                <Text style={styles.emptyBody}>
                  Add what you take and the doses will appear on your daily
                  check-in.
                </Text>
              </View>
            ) : (
              <View style={styles.page}>
                {renderSection(
                  'Active',
                  supplements.filter((item) => item.status === 'active')
                )}
                {renderSection(
                  'Paused',
                  supplements.filter((item) => item.status === 'paused')
                )}
                {renderSection(
                  'Archived',
                  supplements.filter((item) => item.status === 'archived')
                )}
              </View>
            )}

            <Text style={styles.disclaimer}>{DISCLAIMER}</Text>
          </View>
        )}
      </StandardLayout.Body>
    </StandardLayout>
  );
}
