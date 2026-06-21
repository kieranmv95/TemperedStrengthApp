import { RecoveryFlowContent } from '@/src/components/recovery/RecoveryFlowContent';
import { workoutDetailStyles as styles } from '@/src/components/workouts/workoutDetailStyles';
import { Colors } from '@/src/constants/theme';
import { getRecoveryById } from '@/src/data/recovery';
import { useSubscription } from '@/src/hooks/use-subscription';
import { posthogEventsNames } from '@/src/services/posthogEvents';
import { asStringId } from '@/src/utils/routeParams';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { router, useLocalSearchParams } from 'expo-router';
import { usePostHog } from 'posthog-react-native';
import React, { useCallback, useMemo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RecoveryDetailScreen() {
  const { id: idParam } = useLocalSearchParams<{ id?: string }>();
  const posthog = usePostHog();
  const recoveryId = asStringId(idParam);
  const recovery = useMemo(() => {
    if (!recoveryId) return undefined;
    return getRecoveryById(recoveryId);
  }, [recoveryId]);

  const { isPro } = useSubscription();

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
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={styles.detailHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.detailTitle} numberOfLines={1}>
            Recovery
          </Text>
          <View style={styles.headerRightSpacer} />
        </View>

        <View style={styles.emptyState}>
          <Ionicons name="leaf" size={64} color={Colors.backgroundSubtle} />
          <Text style={styles.emptyTitle}>Flow not found</Text>
          <Text style={styles.emptyDescription}>
            This recovery flow may have been removed or the link is invalid.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const isLocked = recovery.isPremium && !isPro;

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
          {recovery.title}
        </Text>
        <View style={styles.headerRightSpacer} />
      </View>

      {isLocked ? (
        <View style={styles.lockedState}>
          <Ionicons name="lock-closed" size={44} color={Colors.accent} />
          <Text style={styles.lockedTitle}>Pro flow</Text>
          <Text style={styles.lockedDescription}>
            Upgrade to Pro to unlock this recovery flow.
          </Text>
          <TouchableOpacity
            style={styles.lockedCta}
            onPress={handleLockedPress}
          >
            <Text style={styles.lockedCtaText}>Go to Account</Text>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={Colors.textOnAccent}
            />
          </TouchableOpacity>
        </View>
      ) : (
        <RecoveryFlowContent recovery={recovery} />
      )}
    </SafeAreaView>
  );
}
