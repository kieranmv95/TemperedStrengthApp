import { StandardLayout } from '@/src/components/ds';
import { RecoveryFlowContent } from '@/src/components/recovery/RecoveryFlowContent';
import { workoutDetailStyles as styles } from '@/src/components/workouts/workoutDetailStyles';
import { color } from '@/src/constants/tokens';
import { getRecoveryById } from '@/src/data/recovery';
import { useRoles } from '@/src/hooks/useRoles';
import { posthogEventsNames } from '@/src/services/posthogEvents';
import { asStringId } from '@/src/utils/routeParams';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, router, useLocalSearchParams } from 'expo-router';
import { usePostHog } from 'posthog-react-native';
import React, { useCallback, useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';

const COACH_ROLE = 'coach';
const STATE_ICON_SIZE = 48;

export default function RecoveryDetailScreen() {
  const { id: idParam } = useLocalSearchParams<{ id?: string }>();
  const posthog = usePostHog();
  const recoveryId = asStringId(idParam);
  const recovery = useMemo(() => {
    if (!recoveryId) return undefined;
    return getRecoveryById(recoveryId);
  }, [recoveryId]);

  const { isPro, roles, isLoading: accessLoading } = useRoles();
  const hasAccess = isPro || roles.includes(COACH_ROLE);

  useFocusEffect(
    useCallback(() => {
      if (!recoveryId || !recovery) {
        return;
      }
      posthog.capture(posthogEventsNames.workout.view, {
        workout_name: recovery.title,
        source: 'recovery',
      });
    }, [recoveryId, recovery, posthog])
  );

  const handleLockedPress = () => {
    router.push('/records');
  };

  if (!recoveryId || !recovery) {
    return (
      <StandardLayout
        title="Recovery"
        onBackPress={() => router.back()}
        disableScroll
      >
        <StandardLayout.Body>
          <View style={styles.emptyState}>
            <Ionicons
              name="leaf-outline"
              size={STATE_ICON_SIZE}
              color={color.textTertiary}
            />
            <Text style={styles.emptyTitle} accessibilityRole="header">
              Flow not found
            </Text>
            <Text style={styles.emptyDescription}>
              This recovery flow may have been removed or the link is invalid.
            </Text>
          </View>
        </StandardLayout.Body>
      </StandardLayout>
    );
  }

  const isLocked = recovery.isPremium && !accessLoading && !hasAccess;

  return (
    <StandardLayout
      title={recovery.title}
      onBackPress={() => router.back()}
      disableScroll
      edgeToEdgeBody
    >
      <StandardLayout.Body>
        {isLocked ? (
          <View style={styles.lockedState}>
            <Ionicons
              name="lock-closed"
              size={STATE_ICON_SIZE}
              color={color.textSecondary}
            />
            <Text style={styles.lockedTitle} accessibilityRole="header">
              Pro flow
            </Text>
            <Text style={styles.lockedDescription}>
              Upgrade to Pro to unlock this recovery flow.
            </Text>
            <Pressable
              style={({ pressed }) => [
                styles.lockedCta,
                pressed && styles.lockedCtaPressed,
              ]}
              onPress={handleLockedPress}
              accessibilityRole="button"
              accessibilityLabel="Unlock with Pro"
              accessibilityHint="Opens the You tab"
            >
              <Text style={styles.lockedCtaText}>Unlock with Pro</Text>
              <Ionicons name="chevron-forward" size={18} color={color.onGold} />
            </Pressable>
          </View>
        ) : (
          <RecoveryFlowContent recovery={recovery} />
        )}
      </StandardLayout.Body>
    </StandardLayout>
  );
}
