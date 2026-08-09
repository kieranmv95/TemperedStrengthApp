import { StandardLayout } from '@/src/components/StandardLayout';
import { Colors, FontSize, Spacing } from '@/src/constants/theme';
import { getSkillById } from '@/src/data/skills';
import { asStringId } from '@/src/utils/routeParams';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function SkillDetailScreen() {
  const { id: idParam } = useLocalSearchParams<{ id?: string }>();
  const skillId = asStringId(idParam);
  const skill = useMemo(() => {
    if (!skillId) {
      return undefined;
    }
    return getSkillById(skillId);
  }, [skillId]);

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
      onBackPress={() => router.back()}
      disableScroll
    >
      <StandardLayout.Body>
        <View style={styles.body} />
      </StandardLayout.Body>
    </StandardLayout>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
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
