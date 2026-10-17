import { LoadingImage, PressableCard } from '@/src/components/ds';
import { color, radius, space, typography } from '@/src/constants/tokens';
import { useLargeText } from '@/src/hooks/useLargeText';
import type { SkillSummary } from '@/src/types/skills';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const THUMBNAIL_SIZE = 72;

type SkillMetaItem = {
  key: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
};

function pluralize(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

function getSkillMetaItems(skill: SkillSummary): SkillMetaItem[] {
  const items: SkillMetaItem[] = [];

  if (skill.articleCount > 0) {
    items.push({
      key: 'articles',
      icon: 'newspaper-outline',
      label: pluralize(skill.articleCount, 'article', 'articles'),
    });
  }

  if (skill.videoCount > 0) {
    items.push({
      key: 'videos',
      icon: 'videocam-outline',
      label: pluralize(skill.videoCount, 'video', 'videos'),
    });
  }

  if (skill.tipCount > 0) {
    items.push({
      key: 'tips',
      icon: 'bulb-outline',
      label: pluralize(skill.tipCount, 'tip', 'tips'),
    });
  }

  if (skill.recoveryFlowCount > 0) {
    items.push({
      key: 'mobility',
      icon: 'body-outline',
      label: pluralize(
        skill.recoveryFlowCount,
        'mobility flow',
        'mobility flows'
      ),
    });
  }

  if (skill.cueCount > 0) {
    items.push({
      key: 'cues',
      icon: 'list-outline',
      label: pluralize(skill.cueCount, 'cue', 'cues'),
    });
  }

  if (skill.workoutCount > 0) {
    items.push({
      key: 'workouts',
      icon: 'barbell-outline',
      label: pluralize(skill.workoutCount, 'workout', 'workouts'),
    });
  }

  return items;
}

type SkillCardProps = {
  skill: SkillSummary;
  onPress: (skill: SkillSummary) => void;
};

export function SkillCard({ skill, onPress }: SkillCardProps) {
  const largeText = useLargeText();
  const metaItems = getSkillMetaItems(skill);
  const accessibilityLabel = [
    skill.name,
    ...metaItems.map((item) => item.label),
  ].join(', ');

  return (
    <PressableCard
      onPress={() => onPress(skill)}
      accessibilityLabel={accessibilityLabel}
    >
      <View style={styles.content}>
        <View style={largeText ? styles.topRowStacked : styles.topRow}>
          <LoadingImage source={skill.thumbnailPath} style={styles.thumbnail} />

          <View style={styles.textColumn}>
            <Text style={styles.title}>{skill.name}</Text>
            <Text style={styles.description} numberOfLines={2}>
              {skill.description}
            </Text>
          </View>
        </View>

        {metaItems.length > 0 ? (
          <View style={styles.metaRow}>
            {metaItems.map((item) => (
              <View key={item.key} style={styles.metaItem}>
                <Ionicons name={item.icon} size={14} color={color.gold} />
                <Text style={styles.metaText}>{item.label}</Text>
              </View>
            ))}
          </View>
        ) : null}
      </View>
    </PressableCard>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: space.sm,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  topRowStacked: {
    gap: space.sm,
  },
  thumbnail: {
    width: THUMBNAIL_SIZE,
    height: THUMBNAIL_SIZE,
    borderRadius: radius.sm,
  },
  textColumn: {
    flexGrow: 1,
    flexShrink: 1,
    minWidth: 0,
    gap: space.xxs,
  },
  title: {
    ...typography.headline,
    color: color.textPrimary,
  },
  description: {
    ...typography.callout,
    color: color.textSecondary,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: space.sm,
    rowGap: space.xs,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xxs,
  },
  metaText: {
    ...typography.captionStrong,
    fontVariant: ['tabular-nums'],
    color: color.textSecondary,
  },
});
