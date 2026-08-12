import { SkillCard } from '@/src/components/skills/SkillCard';
import { StandardLayout } from '@/src/components/StandardLayout';
import { BorderRadius, Colors, FontSize, Spacing } from '@/src/constants/theme';
import { useSkills } from '@/src/hooks/useSkills';
import type { SkillSummary } from '@/src/types/skills';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

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
      subtitle="Pro resources to nail down them complex skills."
      onBackPress={() => router.back()}
      disableScroll
    >
      <StandardLayout.Filters>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color={Colors.textPlaceholder} />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search exercises..."
            placeholderTextColor={Colors.textPlaceholder}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            accessibilityLabel="Search exercises"
          />
          {searchQuery.length > 0 ? (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              accessibilityRole="button"
              accessibilityLabel="Clear search"
            >
              <Ionicons
                name="close-circle"
                size={20}
                color={Colors.textPlaceholder}
              />
            </TouchableOpacity>
          ) : null}
        </View>
      </StandardLayout.Filters>
      <StandardLayout.Body>
        {isLoading ? (
          <View style={styles.loadingState}>
            <ActivityIndicator color={Colors.accent} />
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
                  size={64}
                  color={Colors.backgroundSubtle}
                />
                <Text style={styles.emptyTitle}>No skills found</Text>
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
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.xxl,
    paddingHorizontal: 14,
    paddingVertical: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.backgroundElevated,
    gap: Spacing.lg,
  },
  searchInput: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: FontSize.xxl,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.section,
    gap: Spacing.md,
    flexGrow: 1,
  },
  loadingState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Spacing.section,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.section,
    gap: Spacing.lg,
    paddingTop: Spacing.section,
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
