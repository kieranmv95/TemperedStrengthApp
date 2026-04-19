import { ArticleCard } from '@/src/components/brief/ArticleCard';
import { Pill } from '@/src/components/pill';
import { StandardLayout } from '@/src/components/StandardLayout';
import { Colors, FontSize, Spacing } from '@/src/constants/theme';
import { fetchArticles } from '@/src/services/briefApiService';
import { increment } from '@/src/services/metricService';
import type { ArticleCategory, ArticleListItem } from '@/src/types/brief';
import { getFavoriteArticles, setFavoriteArticles } from '@/src/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function BriefScreen() {
  const [articles, setArticles] = useState<ArticleListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<ArticleCategory | 'All'>('All');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  // The UI is the source of truth for favorites once mounted. We keep a ref
  // mirror so tap handlers always compute the next list from the latest value
  // without depending on state closure timing.
  const favoritesRef = useRef<string[]>([]);
  // Serialize persistence so rapid toggles write to storage in order and the
  // last write always reflects the latest UI state.
  const persistChainRef = useRef<Promise<void>>(Promise.resolve());

  useFocusEffect(
    useCallback(() => {
      increment('brief_visits');

      let cancelled = false;

      (async () => {
        setIsLoading(true);
        try {
          const [data, favs] = await Promise.all([
            fetchArticles(),
            getFavoriteArticles(),
          ]);
          if (cancelled) return;
          setArticles(data);
          setIsOffline(false);
          favoritesRef.current = favs;
          setFavorites(favs);
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

  const handleToggleFavorite = useCallback((slug: string) => {
    const prev = favoritesRef.current;
    const next = prev.includes(slug)
      ? prev.filter((s) => s !== slug)
      : [...prev, slug];

    favoritesRef.current = next;
    setFavorites(next);

    persistChainRef.current = persistChainRef.current
      .then(() => setFavoriteArticles(next))
      .catch((error) => {
        console.error('Failed to persist favorite articles:', error);
      });
  }, []);

  const visibleArticles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return articles.filter((article) => {
      // Saved is mutually exclusive with category filters in the chip row,
      // so when showing favorites ignore the lingering activeCategory.
      if (showFavoritesOnly) {
        if (!favorites.includes(article.slug)) return false;
      } else if (activeCategory !== 'All' && article.category !== activeCategory) {
        return false;
      }

      if (!query) return true;

      const matchesTitle = article.title.toLowerCase().includes(query);
      const matchesSubtitle = article.subtitle.toLowerCase().includes(query);
      const matchesCategory = article.category.toLowerCase().includes(query);
      return matchesTitle || matchesSubtitle || matchesCategory;
    });
  }, [activeCategory, favorites, searchQuery, showFavoritesOnly, articles]);

  const categories = useMemo(() => {
    const set = new Set<ArticleCategory>();
    articles.forEach((a) => set.add(a.category));
    return Array.from(set);
  }, [articles]);

  const handleArticlePress = (article: ArticleListItem) => {
    router.push({
      pathname: '/article/[id]',
      params: { id: article.slug },
    });
  };

  const handleSeeAllGlossary = () => {
    router.push('/glossary');
  };

  const renderBody = () => {
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
          <Text style={styles.emptyTitle}>No Connection</Text>
          <Text style={styles.emptyDescription}>
            Articles are unavailable offline. Come back when you're connected.
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={visibleArticles}
        keyExtractor={(item) => item.slug}
        extraData={favorites}
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
            isFavorite={favorites.includes(item.slug)}
            onToggleFavorite={handleToggleFavorite}
          />
        )}
        ListFooterComponent={<View style={styles.bottomSpacer} />}
      />
    );
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
                  : activeCategory === (item.key as ArticleCategory) &&
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
                      isAllChip ? 'All' : (item.key as ArticleCategory)
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
      <StandardLayout.Body>{renderBody()}</StandardLayout.Body>
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
  listContent: {
    paddingVertical: Spacing.xxl,
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
