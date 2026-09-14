import { SmallChevron } from '@/src/components/ds';
import { settingsScreenStyles } from '@/src/components/settings/settingsScreenStyles';
import { StandardLayout } from '@/src/components/StandardLayout';
import { Colors } from '@/src/constants/theme';
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
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

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

  const adherenceLine = (supplement: Supplement): string => {
    const { taken, expected } = computeSupplementAdherence({
      startDate: addLocalDays(today, -(ADHERENCE_WINDOW_DAYS - 1)),
      endDate: today,
      supplement,
      logs,
    });
    if (expected < 1) {
      return 'No doses due in the last 30 days';
    }
    const percentage = Math.round((taken / expected) * 100);
    return `Adherence ${taken}/${expected} doses (${percentage}%) over 30 days`;
  };

  const renderSection = (title: string, items: Supplement[]) => {
    if (items.length < 1) {
      return null;
    }
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.list}>
          {items.map((supplement) => (
            <TouchableOpacity
              key={supplement.id}
              style={styles.supplementCard}
              onPress={() =>
                router.push({
                  pathname: '/checkin/supplements/[id]',
                  params: { id: supplement.id },
                })
              }
              accessibilityRole="button"
              accessibilityLabel={`Edit ${supplement.name}`}
            >
              <View style={styles.supplementTitleRow}>
                <Text style={styles.supplementName}>{supplement.name}</Text>
                <SmallChevron />
              </View>
              <Text style={styles.supplementMeta}>
                {supplement.doseAmount} {supplement.doseUnit} ·{' '}
                {supplement.form}
                {supplement.brand ? ` · ${supplement.brand}` : ''}
              </Text>
              <Text style={styles.supplementMeta}>
                {describeSupplementSchedule(supplement.schedule)}
              </Text>
              {supplement.status === 'active' ? (
                <Text style={styles.supplementAdherence}>
                  {adherenceLine(supplement)}
                </Text>
              ) : null}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const renderCapUpsell = () => (
    <View style={settingsScreenStyles.upgradePrompt}>
      <Text style={settingsScreenStyles.upgradePromptTitle}>
        Free tracks {FREE_SUPPLEMENT_CAP} active supplement
      </Text>
      <Text style={settingsScreenStyles.upgradePromptBody}>
        Pause the one you are tracking to swap it out, or upgrade to Pro to
        track as many as you like.
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
      title="Supplements"
      subtitle="What you take, when you take it, and whether you did."
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

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleAdd}
              accessibilityRole="button"
              accessibilityLabel="Add a supplement"
            >
              <Text style={styles.primaryButtonText}>Add a supplement</Text>
            </TouchableOpacity>

            {showCapUpsell ? renderCapUpsell() : null}

            {supplements.length < 1 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>No supplements yet</Text>
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
