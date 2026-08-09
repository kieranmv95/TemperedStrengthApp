import { StandardLayout } from '@/src/components/StandardLayout';
import { BorderRadius, Colors, FontSize, Spacing } from '@/src/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function SkillsAndCuesScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <StandardLayout
      title="Skills & Cues"
      subtitle="Resources to nail down them complex skills."
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
        <View style={styles.emptyState}>
          <Ionicons
            name="barbell-outline"
            size={64}
            color={Colors.backgroundSubtle}
          />
          <Text style={styles.emptyTitle}>Skills coming soon</Text>
          <Text style={styles.emptyDescription}>
            Skill cards and resources will appear here in a follow-up update.
          </Text>
        </View>
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
