import { SkillSectionHeader } from '@/src/components/skills/SkillSectionHeader';
import { SkillTipsCarousel } from '@/src/components/skills/SkillTipsCarousel';
import { StandardLayout } from '@/src/components/StandardLayout';
import { Colors, FontSize, Spacing } from '@/src/constants/theme';
import { getSkillById } from '@/src/data/skills';
import type { Skill } from '@/src/types/skills';
import { asStringId } from '@/src/utils/routeParams';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type SkillDetailSection = {
  key: string;
  title: string;
  count: number;
};

function getSkillDetailSections(skill: Skill): SkillDetailSection[] {
  const sections: SkillDetailSection[] = [
    {
      key: 'videos',
      title: 'Videos',
      count: skill.videoIds?.length ?? 0,
    },
    {
      key: 'tips',
      title: 'Tips',
      count: skill.tips?.length ?? 0,
    },
    {
      key: 'cues',
      title: 'Cues',
      count: skill.cues?.length ?? 0,
    },
    {
      key: 'articles',
      title: 'Articles',
      count: skill.articleIds?.length ?? 0,
    },
    {
      key: 'mobility',
      title: 'Mobility Flows',
      count: skill.recoveryFlowIds?.length ?? 0,
    },
    {
      key: 'workouts',
      title: 'Workouts',
      count: skill.workoutsIds?.length ?? 0,
    },
  ];

  return sections.filter((section) => section.count > 0);
}

export default function SkillDetailScreen() {
  const { id: idParam } = useLocalSearchParams<{ id?: string }>();
  const skillId = asStringId(idParam);
  const skill = useMemo(() => {
    if (!skillId) {
      return undefined;
    }
    return getSkillById(skillId);
  }, [skillId]);

  const sections = useMemo(
    () => (skill ? getSkillDetailSections(skill) : []),
    [skill]
  );

  if (!skillId || !skill) {
    return (
      <StandardLayout
        title="Skill"
        onBackPress={() => router.back()}
        disableScroll
      >
        <StandardLayout.Body>
          <View style={styles.emptyState}>
            <Ionicons
              name="barbell-outline"
              size={64}
              color={Colors.backgroundSubtle}
            />
            <Text style={styles.emptyTitle}>Skill not found</Text>
            <Text style={styles.emptyDescription}>
              This skill may have been removed or the link is invalid.
            </Text>
          </View>
        </StandardLayout.Body>
      </StandardLayout>
    );
  }

  return (
    <StandardLayout
      title={skill.name}
      subtitle={skill.description}
      onBackPress={() => router.back()}
    >
      <StandardLayout.Body>
        <View style={styles.sections}>
          {sections.map((section) => {
            if (section.count === 0) {
              return null;
            }
            return (
              <View key={section.key} style={styles.section}>
                <SkillSectionHeader
                  title={section.title}
                />
                {section.key === 'tips' && skill.tips ? (
                  <SkillTipsCarousel tips={skill.tips} />
                ) : null}
              </View>
            )
          })}
        </View>
      </StandardLayout.Body>
    </StandardLayout>
  );
}

const styles = StyleSheet.create({
  sections: {
    gap: Spacing.section,
    paddingBottom: Spacing.section,
  },
  section: {
    gap: Spacing.xl,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.section,
    gap: Spacing.lg,
  },
  emptyTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.displaySm,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptyDescription: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    lineHeight: 22,
    textAlign: 'center',
  },
});
