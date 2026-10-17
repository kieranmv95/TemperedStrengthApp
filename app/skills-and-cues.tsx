import { SkillCard } from '@/src/components/skills/SkillCard';
import { Skeleton, StandardLayout } from '@/src/components/ds';
import {
  color,
  MIN_TARGET_SIZE,
  radius,
  space,
  typography,
} from '@/src/constants/tokens';
import { useSkills } from '@/src/hooks/useSkills';
import type { SkillSummary } from '@/src/types/skills';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const SKILL_CARD_PLACEHOLDER_HEIGHT = 136;

export default function SkillsAndCuesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const { skills, isLoading } = useSkills();

  const filteredSkills = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return skills;
    }

    return skills.filter((skill) => {
      return (
        skill.name.toLowerCase().includes(query) ||
        skill.description.toLowerCase().includes(query)
      );
    });
  }, [searchQuery, skills]);

  const handleSkillPress = (skill: SkillSummary) => {
    router.push({
      pathname: '/skill/[id]',
      params: { id: skill.id },
    });
  };

  return (
    <StandardLayout
      title="Skills & Cues"
      subtitle="Pro resources to nail complex skills."
      onBackPress={() => router.back()}
      disableScroll
    >
      <StandardLayout.Filters>
        <View style={styles.search}>
          <Ionicons name="search" size={18} color={color.textSecondary} />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search skills"
            placeholderTextColor={color.textTertiary}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            accessibilityLabel="Search skills"
          />
          {searchQuery.length > 0 ? (
            <Pressable
              onPress={() => setSearchQuery('')}
              style={styles.clearSearch}
              accessibilityRole="button"
              accessibilityLabel="Clear search"
            >
              <Ionicons
                name="close-circle"
                size={20}
                color={color.textSecondary}
              />
            </Pressable>
          ) : null}
        </View>
      </StandardLayout.Filters>
      <StandardLayout.Body>
        {isLoading ? (
          <View style={styles.loadingState}>
            <Skeleton
              width="100%"
              height={SKILL_CARD_PLACEHOLDER_HEIGHT}
              radius="md"
              accessibilityLabel="Loading skills"
            />
            <Skeleton
              width="100%"
              height={SKILL_CARD_PLACEHOLDER_HEIGHT}
              radius="md"
            />
            <Skeleton
              width="100%"
              height={SKILL_CARD_PLACEHOLDER_HEIGHT}
              radius="md"
            />
          </View>
        ) : (
          <FlatList
            data={filteredSkills}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <SkillCard skill={item} onPress={handleSkillPress} />
            )}
            contentContainerStyle={styles.listContent}
            style={styles.list}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Ionicons
                  name="search-outline"
                  size={48}
                  color={color.textTertiary}
                />
                <Text style={styles.emptyTitle} accessibilityRole="header">
                  No skills found
                </Text>
                <Text style={styles.emptyDescription}>
                  {searchQuery.trim().length > 0
                    ? 'Try a different search term.'
                    : 'Skills will appear here once published in Sanity.'}
                </Text>
              </View>
            }
          />
        )}
      </StandardLayout.Body>
    </StandardLayout>
  );
}

const styles = StyleSheet.create({
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    minHeight: MIN_TARGET_SIZE + space.xxs,
    paddingLeft: space.sm,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: color.borderStrong,
    backgroundColor: color.surface2,
  },
  searchInput: {
    ...typography.body,
    flex: 1,
    color: color.textPrimary,
    paddingVertical: space.xs,
  },
  clearSearch: {
    width: MIN_TARGET_SIZE,
    height: MIN_TARGET_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingTop: space.md,
    paddingBottom: space.xxl,
    gap: space.sm,
    flexGrow: 1,
  },
  loadingState: {
    paddingTop: space.md,
    gap: space.sm,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.xxl,
    paddingTop: space.xxl,
    gap: space.xs,
  },
  emptyTitle: {
    ...typography.title2,
    color: color.textPrimary,
    textAlign: 'center',
  },
  emptyDescription: {
    ...typography.callout,
    color: color.textSecondary,
    textAlign: 'center',
  },
});
