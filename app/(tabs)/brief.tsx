import { ArticleCard } from '@/src/components/brief/ArticleCard';
import { Pill } from '@/src/components/pill';
import { StandardLayout } from '@/src/components/StandardLayout';
import { Colors, FontSize, Spacing } from '@/src/constants/theme';
import {
  articles,
} from '@/src/data/brief';
import { increment } from '@/src/services/metricService';
import type { Article } from '@/src/types/brief';
import { getFavoriteArticles, toggleFavoriteArticle } from '@/src/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function BriefScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] =
    useState<Article['category'] | 'All'>('All');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  useFocusEffect(
    useCallback(() => {
      increment('brief_visits');
      void loadFavorites();
    }, [])
  );

  const loadFavorites = async () => {
    const favs = await getFavoriteArticles();
    setFavorites(favs);
  };

  const handleToggleFavorite = async (articleId: string) => {
    const newStatus = await toggleFavoriteArticle(articleId);
    if (newStatus) {
      setFavorites((prev) => [...prev, articleId]);
    } else {
      setFavorites((prev) => prev.filter((id) => id !== articleId));
    }
  };

  const visibleArticles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return articles.filter((article) => {
      if (showFavoritesOnly && !favorites.includes(article.id)) return false;
      if (activeCategory !== 'All' && article.category !== activeCategory)
        return false;

      if (!query) return true;

      const matchesTitle = article.title.toLowerCase().includes(query);
      const matchesSubtitle = article.subtitle.toLowerCase().includes(query);
      const matchesCategory = article.category.toLowerCase().includes(query);
      return matchesTitle || matchesSubtitle || matchesCategory;
    });
  }, [activeCategory, favorites, searchQuery, showFavoritesOnly]);

  const categories = useMemo(() => {
    const set = new Set<Article['category']>();
    articles.forEach((a) => set.add(a.category));
    return Array.from(set);
  }, []);

  const handleArticlePress = (article: Article) => {
    router.push({
      pathname: '/article/[id]',
      params: { id: article.id, url: article.slug },
    });
  };

  const handleSeeAllGlossary = () => {
    router.push('/glossary');
  };

  return (
    <StandardLayout
      title="Brief"
      subtitle="Your daily intel for the iron game"
      disableScroll
    >
      <StandardLayout.AdvancedFilters>
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={18}
            color={Colors.textPlaceholder}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search articles..."
            placeholderTextColor={Colors.textPlaceholder}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="none"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name="close-circle"
                size={18}
                color={Colors.textPlaceholder}
              />
            </TouchableOpacity>
          )}
        </View>

        <View>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={[
              {
                key: 'favorites',
                label: 'Saved',
                icon: 'bookmark' as const,
              },
              { key: 'all', label: 'All' },
              ...categories.map((c) => ({ key: c, label: c })),
            ]}
            keyExtractor={(item) => item.key}
            contentContainerStyle={styles.filterScrollContent}
            renderItem={({ item }) => {
              const isFavoritesChip = item.key === 'favorites';
              const isAllChip = item.key === 'all';
              const isActive = isFavoritesChip
                ? showFavoritesOnly
                : isAllChip
                  ? activeCategory === 'All' && !showFavoritesOnly
                  : activeCategory === (item.key as Article['category']) &&
                  !showFavoritesOnly;

              const count = isFavoritesChip
                ? favorites.length
                : isAllChip
                  ? articles.length
                  : articles.filter((a) => a.category === item.key).length;

              return (
                <Pill
                  onPress={() => {
                    if (isFavoritesChip) {
                      setShowFavoritesOnly((prev) => !prev);
                      return;
                    }
                    setShowFavoritesOnly(false);
                    setActiveCategory(
                      isAllChip ? 'All' : (item.key as Article['category'])
                    );
                  }}
                  isActive={isActive}
                  label={item.label}
                  icon={item.icon}
                  count={count}
                />
              );
            }}
          />
        </View>
      </StandardLayout.AdvancedFilters>
      <StandardLayout.Body>
        <FlatList
          data={visibleArticles}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <>
              {/* TERMINOLOGY - Glossary Section */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionTitleRow}>
                    <Ionicons name="book" size={18} color={Colors.accent} />
                    <View style={styles.sectionTitleStack}>
                      <Text style={styles.sectionTitle}>TERMINOLOGY</Text>
                      <Text style={styles.sectionSubtitle}>
                        Quick definitions for common training terms
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.ctaButton}
                    onPress={handleSeeAllGlossary}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.ctaButtonText}>See all</Text>
                    <Ionicons
                      name="chevron-forward"
                      size={16}
                      color={Colors.textOnAccent}
                    />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={styles.terminologyCtaCard}
                  onPress={handleSeeAllGlossary}
                  activeOpacity={0.8}
                >
                  <View style={styles.terminologyCtaContent}>
                    <Text style={styles.terminologyCtaTitle}>
                      Browse the glossary
                    </Text>
                    <Text style={styles.terminologyCtaDescription}>
                      Learn the terms we use across training, nutrition, and
                      recovery.
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={Colors.textOnDark}
                  />
                </TouchableOpacity>
              </View>

              {/* FIELD INTEL - Articles Section */}
              <View>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionTitleRow}>
                    <Ionicons
                      name="document-text"
                      size={18}
                      color={Colors.accent}
                    />
                    <View style={styles.sectionTitleStack}>
                      <Text style={styles.sectionTitle}>ARTICLES</Text>
                      <Text style={styles.sectionSubtitle}>
                        Quick definitions for common training terms
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </>
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons
                name={showFavoritesOnly ? 'bookmark-outline' : 'document-text'}
                size={64}
                color={Colors.backgroundSubtle}
              />
              <Text style={styles.emptyTitle}>
                {showFavoritesOnly ? 'No Saved Articles Yet' : 'No Articles Found'}
              </Text>
              <Text style={styles.emptyDescription}>
                {showFavoritesOnly
                  ? 'Tap the bookmark icon on any article to save it here.'
                  : searchQuery.trim()
                    ? 'No articles match your search.'
                    : 'Try selecting a different filter.'}
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <ArticleCard
              article={item}
              onPress={handleArticlePress}
              variant="compact"
              isFavorite={favorites.includes(item.id)}
              onToggleFavorite={handleToggleFavorite}
            />
          )}
          ListFooterComponent={<View style={styles.bottomSpacer} />}
        />
      </StandardLayout.Body>
    </StandardLayout>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    marginTop: Spacing.xl,
    marginBottom: Spacing.xxl,
    paddingHorizontal: Spacing.xl,
    height: 44,
  },
  searchIcon: {
    marginRight: Spacing.md,
  },
  searchInput: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: FontSize.xxl,
    padding: 0,
  },
  filterScrollContent: {
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
  },
  section: {
    marginBottom: Spacing.section,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xxl,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  sectionTitleStack: {
    flex: 1,
    gap: 2,
  },
  sectionTitle: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  sectionSubtitle: {
    color: Colors.textPlaceholder,
    fontSize: FontSize.base,
    fontWeight: '500',
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: 999,
  },
  ctaButtonText: {
    color: Colors.textOnAccent,
    fontSize: FontSize.base,
    fontWeight: '700',
  },
  terminologyCtaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.backgroundCard,
    borderRadius: 16,
    padding: Spacing.xxl,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
  },
  terminologyCtaContent: {
    flex: 1,
    paddingRight: Spacing.xl,
    gap: Spacing.xs,
  },
  terminologyCtaTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.xl,
    fontWeight: '700',
  },
  terminologyCtaDescription: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    lineHeight: 20,
  },
  moreArticlesLabel: {
    color: Colors.textPlaceholder,
    fontSize: FontSize.base,
    fontWeight: '600',
    marginTop: Spacing.xxl,
    marginBottom: Spacing.xl,
  },
  articlesScrollContainer: {
    paddingRight: Spacing.xxl,
    gap: Spacing.xl,
  },
  listContent: {
    paddingVertical: Spacing.xxl,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 48,
    paddingTop: Spacing.xxl,
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
    lineHeight: 20,
    textAlign: 'center',
  },
  bottomSpacer: {
    height: 32,
  },
});
