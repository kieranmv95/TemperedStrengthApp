import { FilterChip } from '@/src/components/ds';
import { color, radius, space, typography } from '@/src/constants/tokens';
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

const RANK_COLUMN_WIDTH = 32;
const SCORE_COLUMN_MIN_WIDTH = 72;

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

    return sortLiveCompetitionEntries(categoryEntries, competition.metricType);
  }, [activeCategory, competition.entries, competition.metricType]);

  const scoreLabel = getLiveCompetitionScoreLabel(competition.metricType);

  if (categories.length === 0) {
    return <Text style={styles.emptyState}>No leaderboard entries yet.</Text>;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryChips}
      >
        {categories.map((category) => (
          <FilterChip
            key={category}
            label={category}
            selected={category === activeCategory}
            onPress={() => setActiveCategory(category)}
          />
        ))}
      </ScrollView>

      <View
        style={styles.tableHeader}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <Text style={[styles.headerCell, styles.rankColumn]}>#</Text>
        <Text style={[styles.headerCell, styles.nameColumn]}>Name</Text>
        <Text style={[styles.headerCell, styles.scoreColumn]}>
          {scoreLabel}
        </Text>
      </View>

      {rankedEntries.length === 0 ? (
        <Text style={styles.emptyState}>No results for this category yet.</Text>
      ) : (
        <View style={styles.tableBody}>
          {rankedEntries.map((item, index) => {
            const formattedScore = formatLiveCompetitionScore(
              item.score,
              competition.metricType
            );
            return (
              <View
                key={`${item.name}-${item.category}-${item.score}`}
                style={styles.row}
                accessible
                accessibilityLabel={`Rank ${index + 1}, ${item.name}, ${formattedScore}`}
              >
                <Text style={[styles.rankCell, styles.rankColumn]}>
                  {index + 1}
                </Text>
                <Text style={[styles.nameCell, styles.nameColumn]}>
                  {item.name}
                </Text>
                <Text style={[styles.scoreCell, styles.scoreColumn]}>
                  {formattedScore}
                </Text>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: space.sm,
  },
  categoryScroll: {
    marginHorizontal: -space.md,
  },
  categoryChips: {
    gap: space.xs,
    paddingHorizontal: space.md,
    paddingVertical: space.xxs,
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: space.md,
    paddingTop: space.xs,
  },
  headerCell: {
    ...typography.overline,
    color: color.textTertiary,
  },
  rankColumn: {
    width: RANK_COLUMN_WIDTH,
  },
  nameColumn: {
    flex: 1,
    paddingRight: space.sm,
  },
  scoreColumn: {
    minWidth: SCORE_COLUMN_MIN_WIDTH,
    textAlign: 'right',
  },
  tableBody: {
    gap: space.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    backgroundColor: color.surface1,
    borderRadius: radius.md,
  },
  rankCell: {
    ...typography.numericSmall,
    color: color.textSecondary,
  },
  nameCell: {
    ...typography.calloutStrong,
    color: color.textPrimary,
  },
  scoreCell: {
    ...typography.numericSmall,
    color: color.textPrimary,
  },
  emptyState: {
    ...typography.callout,
    color: color.textSecondary,
    textAlign: 'center',
    paddingVertical: space.lg,
  },
});
