import { StandardLayout } from '@/src/components/ds';
import { LiveCompetitionCard } from '@/src/components/LiveCompetitionCard';
import { LiveCompetitionLeaderboard } from '@/src/components/LiveCompetitionLeaderboard';
import {
  color,
  MIN_TARGET_SIZE,
  space,
  typography,
} from '@/src/constants/tokens';
import type { LiveCompetition } from '@/src/types/live-competition';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type LiveCompetitionScreenProps = {
  competition: LiveCompetition;
  isRefetching: boolean;
  onRefresh: () => void;
};

type RefreshButtonProps = {
  isRefetching: boolean;
  onRefresh: () => void;
};

function RefreshButton({ isRefetching, onRefresh }: RefreshButtonProps) {
  return (
    <Pressable
      style={styles.refreshButton}
      onPress={onRefresh}
      disabled={isRefetching}
      accessibilityRole="button"
      accessibilityLabel="Refresh leaderboard"
      accessibilityState={{ disabled: isRefetching, busy: isRefetching }}
    >
      {isRefetching ? (
        <ActivityIndicator size="small" color={color.gold} />
      ) : (
        <Ionicons name="refresh" size={24} color={color.textPrimary} />
      )}
    </Pressable>
  );
}

export function LiveCompetitionScreen({
  competition,
  isRefetching,
  onRefresh,
}: LiveCompetitionScreenProps) {
  return (
    <StandardLayout
      title="Competition"
      onBackPress={() => router.back()}
      titleAccessory={
        <RefreshButton isRefetching={isRefetching} onRefresh={onRefresh} />
      }
    >
      <StandardLayout.Body>
        <View style={styles.content}>
          <LiveCompetitionCard competition={competition}>
            {competition.additionalInfo ? (
              <Text style={styles.additionalInfo}>
                {competition.additionalInfo}
              </Text>
            ) : null}
          </LiveCompetitionCard>
          <LiveCompetitionLeaderboard competition={competition} />
        </View>
      </StandardLayout.Body>
    </StandardLayout>
  );
}

const styles = StyleSheet.create({
  refreshButton: {
    width: MIN_TARGET_SIZE,
    height: MIN_TARGET_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -space.xs,
  },
  content: {
    gap: space.lg,
  },
  additionalInfo: {
    ...typography.callout,
    color: color.textSecondary,
  },
});
