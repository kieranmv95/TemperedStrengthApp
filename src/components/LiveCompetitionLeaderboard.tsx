import { Pill } from '@/src/components/pill';
import { BorderRadius, Colors, FontSize, Spacing } from '@/src/constants/theme';
import type { LiveCompetition } from '@/src/types/live-competition';
import {
  formatLiveCompetitionScore,
  getLiveCompetitionCategories,
  getLiveCompetitionScoreLabel,
  resolveLiveCompetitionActiveCategory,
  sortLiveCompetitionEntries,
} from '@/src/utils/liveCompetition';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

type LiveCompetitionLeaderboardProps = {
  competition: LiveCompetition;
};

export function LiveCompetitionLeaderboard({
  competition,
}: LiveCompetitionLeaderboardProps) {
  const categories = useMemo(
    () => getLiveCompetitionCategories(competition.entries),
    [competition.entries]
  );
  const [activeCategory, setActiveCategory] = useState(
    () => categories[0] ?? ''
  );

  useEffect(() => {
    setActiveCategory((current) =>
      resolveLiveCompetitionActiveCategory(categories, current)
    );
  }, [categories]);

  const rankedEntries = useMemo(() => {
    const categoryEntries = competition.entries.filter(
      (entry) => entry.category === activeCategory
    );

    return sortLiveCompetitionEntries(categoryEntries, competition.orderBy);
  }, [activeCategory, competition.entries, competition.orderBy]);

  const scoreLabel = getLiveCompetitionScoreLabel(competition.orderBy);

  if (categories.length === 0) {
    return (
      <Text style={styles.emptyState}>No leaderboard entries yet.</Text>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryPills}
      >
        {categories.map((category) => (
          <Pill
            key={category}
            label={category}
            isActive={category === activeCategory}
            onPress={() => setActiveCategory(category)}
          />
        ))}
      </ScrollView>

      <View style={styles.tableHeader}>
        <Text style={[styles.headerCell, styles.rankHeader]}>#</Text>
        <Text style={[styles.headerCell, styles.nameHeader]}>Name</Text>
        <Text style={[styles.headerCell, styles.scoreHeader]}>{scoreLabel}</Text>
      </View>

      {rankedEntries.length === 0 ? (
        <Text style={styles.emptyState}>
          No results for this category yet.
        </Text>
      ) : (
        <View style={styles.tableBody}>
          {rankedEntries.map((item, index) => (
            <View key={`${item.name}-${item.category}-${item.score}`}>
              {index > 0 ? <View style={styles.rowSeparator} /> : null}
              <View style={styles.row}>
                <Text style={[styles.cell, styles.rankCell]}>{index + 1}</Text>
                <Text style={[styles.cell, styles.nameCell]} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={[styles.cell, styles.scoreCell]}>
                  {formatLiveCompetitionScore(item.score, competition.orderBy)}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.lg,
  },
  categoryPills: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingRight: Spacing.section,
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.backgroundElevated,
  },
  headerCell: {
    color: Colors.textMuted,
    fontSize: FontSize.sm,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  rankHeader: {
    width: 32,
  },
  nameHeader: {
    flex: 1,
  },
  scoreHeader: {
    minWidth: 72,
    textAlign: 'right',
  },
  tableBody: {
    gap: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.md,
  },
  rowSeparator: {
    height: Spacing.sm,
  },
  cell: {
    color: Colors.textPrimary,
    fontSize: FontSize.lg,
  },
  rankCell: {
    width: 32,
    color: Colors.textMuted,
    fontWeight: '700',
  },
  nameCell: {
    flex: 1,
    fontWeight: '600',
    paddingRight: Spacing.md,
  },
  scoreCell: {
    minWidth: 72,
    textAlign: 'right',
    fontWeight: '700',
    color: Colors.accent,
  },
  emptyState: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    lineHeight: 24,
    textAlign: 'center',
    paddingVertical: Spacing.xl,
  },
});
