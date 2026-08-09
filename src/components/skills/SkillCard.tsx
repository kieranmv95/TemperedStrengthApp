import { Card, SmallChevron } from '@/src/components/ds';
import { BorderRadius, Colors, FontSize, Spacing } from '@/src/constants/theme';
import type { Skill } from '@/src/types/skills';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

type SkillMetaItem = {
  key: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
};

function pluralize(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

function getSkillMetaItems(skill: Skill): SkillMetaItem[] {
  const items: SkillMetaItem[] = [];

  const articleCount = skill.articleIds?.length ?? 0;
  if (articleCount > 0) {
    items.push({
      key: 'articles',
      icon: 'newspaper-outline',
      label: pluralize(articleCount, 'Article', 'Articles'),
    });
  }

  const videoCount = skill.videoIds?.length ?? 0;
  if (videoCount > 0) {
    items.push({
      key: 'videos',
      icon: 'videocam-outline',
      label: pluralize(videoCount, 'Video', 'Videos'),
    });
  }

  const tipCount = skill.tips?.length ?? 0;
  if (tipCount > 0) {
    items.push({
      key: 'tips',
      icon: 'bulb-outline',
      label: pluralize(tipCount, 'Tip', 'Tips'),
    });
  }

  const mobilityCount = skill.recoveryFlowIds?.length ?? 0;
  if (mobilityCount > 0) {
    items.push({
      key: 'mobility',
      icon: 'body-outline',
      label: pluralize(mobilityCount, 'Mobility Flow', 'Mobility Flows'),
    });
  }

  const cueCount = skill.cues?.length ?? 0;
  if (cueCount > 0) {
    items.push({
      key: 'cues',
      icon: 'list-outline',
      label: pluralize(cueCount, 'Cue', 'Cues'),
    });
  }

  const workoutCount = skill.workoutsIds?.length ?? 0;
  if (workoutCount > 0) {
    items.push({
      key: 'workouts',
      icon: 'barbell-outline',
      label: pluralize(workoutCount, 'Workout', 'Workouts'),
    });
  }

  return items;
}

type SkillCardProps = {
  skill: Skill;
  onPress: (skill: Skill) => void;
};

export function SkillCard({ skill, onPress }: SkillCardProps) {
  const metaItems = getSkillMetaItems(skill);

  return (
    <Card
      onPress={() => onPress(skill)}
      accessibilityLabel={`Open ${skill.name}`}
      style={styles.card}
    >
      <View style={styles.topRow}>
        <View style={styles.thumbnailWrap}>
          <Image
            source={skill.thumbnailPath}
            style={styles.thumbnail}
            resizeMode="cover"
            accessibilityIgnoresInvertColors
          />
        </View>

        <View style={styles.textColumn}>
          <Text style={styles.title} numberOfLines={2}>
            {skill.name}
          </Text>
          <Text style={styles.description} numberOfLines={2}>
            {skill.description}
          </Text>
        </View>

        <SmallChevron />
      </View>

      {metaItems.length > 0 ? (
        <View style={styles.metaRow}>
          {metaItems.map((item) => (
            <View key={item.key} style={styles.metaItem}>
              <Ionicons name={item.icon} size={14} color={Colors.accent} />
              <Text style={styles.metaText}>{item.label}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: Spacing.xl,
    backgroundColor: Colors.backgroundCard,
    borderColor: Colors.accentWashOutline,
    borderWidth: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xl,
  },
  thumbnailWrap: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    backgroundColor: Colors.backgroundElevated,
    flexShrink: 0,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  textColumn: {
    flex: 1,
    minWidth: 0,
    gap: Spacing.xs,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: FontSize.xl,
    fontWeight: '700',
  },
  description: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: Spacing.xl,
    rowGap: Spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  metaText: {
    color: Colors.accent,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
});
