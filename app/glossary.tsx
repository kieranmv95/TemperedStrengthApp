import { GlossaryItem } from '@/src/components/brief/GlossaryItem';
import {
  color,
  MIN_TARGET_SIZE,
  radius,
  space,
  typography,
} from '@/src/constants/tokens';
import { getGlossaryByCategory, searchGlossary } from '@/src/data/brief';
import { fetchGlossary } from '@/src/services/briefApiService';
import { increment } from '@/src/services/metricService';
import type { GlossaryTerm } from '@/src/types/brief';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, router } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  AppFlatList,
  FilterChip,
  Skeleton,
  StandardLayout,
} from '@/src/components/ds';

type CategoryFilter = 'All' | GlossaryTerm['category'];

const CATEGORY_FILTERS: CategoryFilter[] = [
  'All',
  'Training',
  'Movements',
  'Nutrition',
  'Equipment',
  'General',
];

const TERM_PLACEHOLDER_HEIGHT = 56;
const TERM_PLACEHOLDER_COUNT = 6;

export default function GlossaryScreen() {
  const [terms, setTerms] = useState<GlossaryTerm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('All');

  useEffect(() => {
    increment('terminology_views');
  }, []);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      (async () => {
        setIsLoading(true);
        try {
          const data = await fetchGlossary();
          if (cancelled) return;
          setTerms(data);
          setIsOffline(false);
        } catch {
          if (cancelled) return;
          setIsOffline(true);
        } finally {
          if (!cancelled) setIsLoading(false);
        }
      })();

      return () => {
        cancelled = true;
      };
    }, [])
  );

  const filteredTerms = useMemo(() => {
    let results = searchQuery ? searchGlossary(terms, searchQuery) : terms;

    if (activeCategory !== 'All') {
      results = getGlossaryByCategory(results, activeCategory);
    }

    return [...results].sort((a, b) => a.term.localeCompare(b.term));
  }, [searchQuery, activeCategory, terms]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingState}>
          {Array.from({ length: TERM_PLACEHOLDER_COUNT }, (_, index) => (
            <Skeleton
              key={index}
              width="100%"
              height={TERM_PLACEHOLDER_HEIGHT}
              radius="md"
              accessibilityLabel={index === 0 ? 'Loading terms' : undefined}
            />
          ))}
        </View>
      );
    }

    if (isOffline) {
      return (
        <View style={styles.centeredState}>
          <Ionicons
            name="cloud-offline-outline"
            size={48}
            color={color.textTertiary}
          />
          <Text style={styles.emptyTitle} accessibilityRole="header">
            Connect to the internet to see this
          </Text>
          <Text style={styles.emptyDescription}>
            The glossary requires a connection to load.
          </Text>
        </View>
      );
    }

    if (filteredTerms.length === 0) {
      return (
        <View style={styles.centeredState}>
          <Ionicons
            name="search-outline"
            size={48}
            color={color.textTertiary}
          />
          <Text style={styles.emptyTitle} accessibilityRole="header">
            No terms found
          </Text>
          <Text style={styles.emptyDescription}>
            Try adjusting your search or filter.
          </Text>
        </View>
      );
    }

    return (
      <AppFlatList
        data={filteredTerms}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <GlossaryItem term={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Text style={styles.resultsCount}>
            {filteredTerms.length}{' '}
            {filteredTerms.length === 1 ? 'term' : 'terms'}
          </Text>
        }
      />
    );
  };

  return (
    <StandardLayout
      title="Glossary"
      subtitle="Tap into the glossary any time. No judgement, just clarity."
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
            placeholder="Search terms"
            placeholderTextColor={color.textTertiary}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            accessibilityLabel="Search terms"
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
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipScroll}
          contentContainerStyle={styles.chipRow}
        >
          {CATEGORY_FILTERS.map((item) => {
            const normalizedCategory = item ?? 'All';
            const count =
              normalizedCategory === 'All'
                ? terms.length
                : terms.filter((t) => t.category === normalizedCategory).length;

            return (
              <FilterChip
                key={normalizedCategory}
                label={normalizedCategory}
                selected={activeCategory === normalizedCategory}
                onPress={() => setActiveCategory(normalizedCategory)}
                count={count}
                accessibilityLabel={`${normalizedCategory}, ${count} ${
                  count === 1 ? 'term' : 'terms'
                }`}
              />
            );
          })}
        </ScrollView>
      </StandardLayout.Filters>
      <StandardLayout.Body>{renderContent()}</StandardLayout.Body>
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
  chipScroll: {
    marginHorizontal: -space.md,
    flexGrow: 0,
  },
  chipRow: {
    gap: space.xs,
    paddingHorizontal: space.md,
    paddingVertical: space.xxs,
  },
  listContent: {
    paddingTop: space.md,
    paddingBottom: space.xxl,
  },
  resultsCount: {
    ...typography.caption,
    fontVariant: ['tabular-nums'],
    color: color.textTertiary,
    marginBottom: space.sm,
  },
  loadingState: {
    paddingTop: space.md,
    gap: space.sm,
  },
  centeredState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.xxl,
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
