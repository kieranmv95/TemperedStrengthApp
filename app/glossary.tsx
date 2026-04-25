import { GlossaryItem } from '@/src/components/brief/GlossaryItem';
import {
  BorderRadius,
  Colors,
  FontSize,
  Spacing,
} from '@/src/constants/theme';
import { getGlossaryByCategory, searchGlossary } from '@/src/data/brief';
import { fetchGlossary } from '@/src/services/briefApiService';
import { increment } from '@/src/services/metricService';
import type { GlossaryTerm } from '@/src/types/brief';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type CategoryFilter = 'All' | GlossaryTerm['category'];

const CATEGORY_FILTERS: CategoryFilter[] = [
  'All',
  'Training',
  'Movements',
  'Nutrition',
  'Equipment',
  'General',
];

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
        <View style={styles.centeredState}>
          <ActivityIndicator size="large" color={Colors.accent} />
        </View>
      );
    }

    if (isOffline) {
      return (
        <View style={styles.centeredState}>
          <Ionicons name="wifi-outline" size={64} color={Colors.backgroundSubtle} />
          <Text style={styles.emptyTitle}>Connect to the internet to see this</Text>
          <Text style={styles.emptyDescription}>
            The glossary requires a connection to load.
          </Text>
        </View>
      );
    }

    if (filteredTerms.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Ionicons name="search-outline" size={64} color={Colors.backgroundSubtle} />
          <Text style={styles.emptyTitle}>No Terms Found</Text>
          <Text style={styles.emptyDescription}>
            Try adjusting your search or filter.
          </Text>
        </View>
      );
    }

    return (
      <FlatList
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
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBackButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terminology</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color={Colors.textPlaceholder} />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search terms..."
            placeholderTextColor={Colors.textPlaceholder}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={Colors.textPlaceholder} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category Filters */}
      <View style={styles.filterContainer}>
        <FlatList
          horizontal
          data={CATEGORY_FILTERS}
          keyExtractor={(item) => item || 'All'}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
          renderItem={({ item }) => {
            const isActive = activeCategory === item;
            const count =
              item === 'All'
                ? terms.length
                : terms.filter((t) => t.category === item).length;

            return (
              <TouchableOpacity
                style={[styles.filterTab, isActive && styles.filterTabActive]}
                onPress={() => setActiveCategory(item)}
              >
                <Text
                  style={[
                    styles.filterTabText,
                    isActive && styles.filterTabTextActive,
                  ]}
                >
                  {item || 'All'}
                </Text>
                <Text
                  style={[
                    styles.filterCount,
                    isActive && styles.filterCountActive,
                  ]}
                >
                  {count}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
        <Text style={styles.searchDescription}>
          Tap into the glossary any time, no judgement, just clarity.
        </Text>
      </View>

      {renderContent()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  searchDescription: {
    paddingHorizontal: Spacing.xxl,
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    fontWeight: '500',
    lineHeight: 20,
    marginBottom: Spacing.xl,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundScreen,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDefault,
  },
  headerBackButton: {
    padding: Spacing.xs,
  },
  headerTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.displaySm,
    fontWeight: '700',
  },
  headerSpacer: {
    width: 32,
  },
  searchContainer: {
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.xl,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.xxl,
    paddingHorizontal: 14,
    paddingVertical: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    gap: Spacing.lg,
  },
  searchInput: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: FontSize.xxl,
  },
  filterContainer: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDefault,
  },
  filterList: {
    paddingHorizontal: Spacing.xxl,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.pill,
    backgroundColor: Colors.backgroundCard,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    gap: Spacing.sm,
  },
  filterTabActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  filterTabText: {
    color: Colors.textMuted,
    fontSize: FontSize.base,
    fontWeight: '600',
  },
  filterTabTextActive: {
    color: Colors.textOnAccent,
  },
  filterCount: {
    color: Colors.textPlaceholder,
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  filterCountActive: {
    color: Colors.textOnAccent,
    opacity: 0.7,
  },
  listContent: {
    padding: Spacing.xxl,
  },
  resultsCount: {
    color: Colors.textPlaceholder,
    fontSize: FontSize.base,
    fontWeight: '500',
    marginBottom: Spacing.xl,
  },
  centeredState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 48,
    gap: Spacing.xxl,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 48,
  },
  emptyTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.displayMd,
    fontWeight: '700',
    marginTop: Spacing.xxl,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  emptyDescription: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    textAlign: 'center',
  },
});
