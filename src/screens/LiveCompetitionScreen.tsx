import { AppSafeAreaView } from '@/src/components/AppSafeAreaView';
import { LiveCompetitionCard } from '@/src/components/LiveCompetitionCard';
import { LiveCompetitionLeaderboard } from '@/src/components/LiveCompetitionLeaderboard';
import { Colors, FontSize, Spacing } from '@/src/constants/theme';
import type { LiveCompetition } from '@/src/types/live-competition';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type LiveCompetitionScreenProps = {
  competition: LiveCompetition;
  isRefetching: boolean;
  onRefresh: () => void;
};

export function LiveCompetitionScreen({
  competition,
  isRefetching,
  onRefresh,
}: LiveCompetitionScreenProps) {
  return (
    <AppSafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBackButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Competition</Text>
        <TouchableOpacity
          style={styles.headerRefreshButton}
          onPress={onRefresh}
          disabled={isRefetching}
          accessibilityRole="button"
          accessibilityLabel="Refresh leaderboard"
        >
          {isRefetching ? (
            <ActivityIndicator size="small" color={Colors.accent} />
          ) : (
            <Ionicons name="refresh" size={24} color={Colors.accent} />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <LiveCompetitionCard competition={competition}>
          <Text
            style={[
              styles.additionalInfo,
              { color: competition.theme.copyColor },
            ]}
          >
            {competition.additionalInfo}
          </Text>
        </LiveCompetitionCard>
        <LiveCompetitionLeaderboard competition={competition} />
      </ScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundScreen,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.backgroundElevated,
  },
  headerBackButton: {
    padding: Spacing.sm,
    marginLeft: -Spacing.sm,
  },
  headerTitle: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: FontSize.xl,
    fontWeight: '700',
    textAlign: 'center',
    marginHorizontal: Spacing.md,
  },
  headerRefreshButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -Spacing.sm,
  },
  content: {
    paddingHorizontal: Spacing.section,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.section,
    gap: Spacing.xl,
  },
  additionalInfo: {
    fontSize: FontSize.base,
    marginBottom: Spacing.lg,
  },
});
