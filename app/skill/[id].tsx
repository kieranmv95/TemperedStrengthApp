import { SkillArticles } from '@/src/components/skills/SkillArticles';
import { SkillCues } from '@/src/components/skills/SkillCues';
import { SkillLockedTeaser } from '@/src/components/skills/SkillLockedTeaser';
import { SkillMobilityFlows } from '@/src/components/skills/SkillMobilityFlows';
import { SkillProRequiredBanner } from '@/src/components/skills/SkillProRequiredBanner';
import { SkillSectionHeader } from '@/src/components/skills/SkillSectionHeader';
import { SkillTipsCarousel } from '@/src/components/skills/SkillTipsCarousel';
import { SkillVideos } from '@/src/components/skills/SkillVideos';
import { SkillWorkouts } from '@/src/components/skills/SkillWorkouts';
import { StandardLayout } from '@/src/components/StandardLayout';
import { Colors, FontSize, Spacing } from '@/src/constants/theme';
import { useRoles } from '@/src/hooks/useRoles';
import { useSkill } from '@/src/hooks/useSkills';
import type { Skill } from '@/src/types/skills';
import { asStringId } from '@/src/utils/routeParams';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

const COACH_ROLE = 'coach';

type SkillDetailSection = {
  key: string;
  title: string;
  subtitle?: string;
  resourceLabel: string;
  count: number;
};

function pluralize(count: number, singular: string, plural: string): string {
  return count === 1 ? singular : plural;
}

function getSkillDetailSections(
  skill: Skill,
  isLocked: boolean
): SkillDetailSection[] {
  const sections: SkillDetailSection[] = [
    {
      key: 'videos',
      title: 'Videos',
      subtitle: isLocked ? undefined : 'Tap a video to open and watch.',
      resourceLabel: pluralize(skill.videoCount, 'video', 'videos'),
      count: skill.videoCount,
    },
    {
      key: 'tips',
      title: 'Tips',
      resourceLabel: pluralize(skill.tipCount, 'tip', 'tips'),
      count: skill.tipCount,
    },
    {
      key: 'cues',
      title: 'Cues',
      subtitle: isLocked ? undefined : 'Tap a cue to view it fullscreen.',
      resourceLabel: pluralize(skill.cueCount, 'cue', 'cues'),
      count: skill.cueCount,
    },
    {
      key: 'articles',
      title: 'Articles',
      resourceLabel: pluralize(skill.articleCount, 'article', 'articles'),
      count: skill.articleCount,
    },
    {
      key: 'mobility',
      title: 'Mobility Flows',
      resourceLabel: pluralize(
        skill.recoveryFlowCount,
        'mobility flow',
        'mobility flows'
      ),
      count: skill.recoveryFlowCount,
    },
    {
      key: 'workouts',
      title: 'Workouts',
      resourceLabel: pluralize(skill.workoutCount, 'workout', 'workouts'),
      count: skill.workoutCount,
    },
  ];

  return sections.filter((section) => section.count > 0);
}

function renderSectionBody(skill: Skill, sectionKey: string) {
  if (sectionKey === 'videos' && skill.videoIds) {
    return <SkillVideos videos={skill.videoIds} />;
  }
  if (sectionKey === 'tips' && skill.tips) {
    return <SkillTipsCarousel tips={skill.tips} />;
  }
  if (sectionKey === 'cues' && skill.cues) {
    return <SkillCues cues={skill.cues} />;
  }
  if (sectionKey === 'articles' && skill.articleSlugs) {
    return <SkillArticles articleSlugs={skill.articleSlugs} />;
  }
  if (sectionKey === 'mobility' && skill.recoveryFlowIds) {
    return <SkillMobilityFlows recoveryFlowIds={skill.recoveryFlowIds} />;
  }
  if (sectionKey === 'workouts' && skill.workoutsIds) {
    return <SkillWorkouts workoutsIds={skill.workoutsIds} />;
  }
  return null;
}

function renderSkillSections(
  skill: Skill,
  sections: SkillDetailSection[],
  isLocked: boolean
) {
  return (
    <View style={styles.sections}>
      {sections.map((section) => {
        return (
          <View key={section.key} style={styles.section}>
            <SkillSectionHeader
              title={section.title}
              subtitle={section.subtitle}
            />
            {isLocked ? (
              <SkillLockedTeaser
                count={section.count}
                resourceLabel={section.resourceLabel}
              />
            ) : (
              renderSectionBody(skill, section.key)
            )}
          </View>
        );
      })}
    </View>
  );
}

export default function SkillDetailScreen() {
  const { id: idParam } = useLocalSearchParams<{ id?: string }>();
  const skillId = asStringId(idParam);
  const { roles, isPro, isLoading: accessLoading } = useRoles();
  const { skill, isLoading: skillLoading } = useSkill(skillId);

  const hasAccess = isPro || roles.includes(COACH_ROLE);
  const isLocked = !accessLoading && !hasAccess;

  const sections = useMemo(
    () => (skill ? getSkillDetailSections(skill, isLocked) : []),
    [skill, isLocked]
  );

  if (!skillId) {
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

  if (skillLoading) {
    return (
      <StandardLayout
        title="Skill"
        onBackPress={() => router.back()}
        disableScroll
      >
        <StandardLayout.Body>
          <View style={styles.emptyState}>
            <ActivityIndicator color={Colors.accent} />
          </View>
        </StandardLayout.Body>
      </StandardLayout>
    );
  }

  if (!skill) {
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
    <StandardLayout title={skill.name} onBackPress={() => router.back()}>
      <StandardLayout.Body>
        <View style={styles.body}>
          <Text style={styles.description}>{skill.description}</Text>
          {isLocked ? <SkillProRequiredBanner /> : null}
          {renderSkillSections(skill, sections, isLocked)}
        </View>
      </StandardLayout.Body>
    </StandardLayout>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: Spacing.xl,
  },
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
  description: {
    color: Colors.textPlaceholder,
    fontSize: FontSize.lg,
    lineHeight: 22,
  },
});
