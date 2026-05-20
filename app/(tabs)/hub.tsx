import { ArticleCard } from '@/src/components/brief/ArticleCard';
import { Card, CuratedSection, SmallChevron } from '@/src/components/ds';
import { Pill } from '@/src/components/pill';
import { StandardLayout } from '@/src/components/StandardLayout';
import { BorderRadius, Colors, FontSize, Spacing } from '@/src/constants/theme';
import { fetchArticles } from '@/src/services/briefApiService';
import { increment } from '@/src/services/metricService';
import { posthogEventsNames } from '@/src/services/posthogEvents';
import type { ArticleCategory, ArticleListItem } from '@/src/types/brief';
import { getFavoriteArticles, setFavoriteArticles } from '@/src/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { usePostHog } from 'posthog-react-native';
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

export default function HubScreen() {
  const posthog = usePostHog();
  const [articles, setArticles] = useState<ArticleListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<ArticleCategory | 'All'>(
    'All'
  );
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const favoritesRef = useRef<string[]>([]);
  const persistChainRef = useRef<Promise<void>>(Promise.resolve());

  useFocusEffect(
    useCallback(() => {
      increment('brief_visits');

      let cancelled = false;

      void (async () => {
        setIsLoading(true);
        try {
          const [data, favs] = await Promise.all([
            fetchArticles(),
            getFavoriteArticles(),
          ]);
          if (cancelled) {
            return;
          }
          setArticles(data);
          setIsOffline(false);
          favoritesRef.current = favs;
          setFavorites(favs);
        } catch {
          if (cancelled) {
            return;
          }
          setIsOffline(true);
        } finally {
          if (!cancelled) {
            setIsLoading(false);
          }
        }
      })();

      return () => {
        cancelled = true;
      };
    }, [])
  );

  const handleToggleFavorite = useCallback(
    (slug: string) => {
      const prev = favoritesRef.current;
      const isAdd = !prev.includes(slug);
      const next = isAdd ? [...prev, slug] : prev.filter((s) => s !== slug);

      posthog.capture(posthogEventsNames.content.articleFavourite, {
        article_id: slug,
        action: isAdd ? 'add' : 'remove',
      });

      favoritesRef.current = next;
      setFavorites(next);

      persistChainRef.current = persistChainRef.current
        .then(() => setFavoriteArticles(next))
        .catch((error) => {
          console.error('Failed to persist favorite articles:', error);
        });
    },
    [posthog]
  );

  const visibleArticles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return articles.filter((article) => {
      if (showFavoritesOnly) {
        if (!favorites.includes(article.slug)) {
          return false;
        }
      } else if (
        activeCategory !== 'All' &&
        article.category !== activeCategory
      ) {
        return false;
      }

      if (!query) {
        return true;
      }

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

  const handleOpenShop = () => {
    router.push('/shop');
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
          <Ionicons
            name="wifi-outline"
            size={64}
            color={Colors.backgroundSubtle}
          />
          <Text style={styles.emptyTitle}>No Connection</Text>
          <Text style={styles.emptyDescription}>
            Articles are unavailable offline. Come back when you&apos;re
            connected.
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
          <View style={styles.section}>
            <View style={styles.subSection}>
              <CuratedSection
                icon="book-outline"
                iconSizeOverride={18}
                title="Terminology"
                description="Quick definitions for common training terms"
                size="medium"
                theme="gold"
              />

              <Card
                onPress={handleSeeAllGlossary}
                accessibilityLabel="Browse the glossary"
              >
                <View style={styles.hubCtaContent}>
                  <Text style={styles.hubCtaTitle}>Browse the glossary</Text>
                  <Text style={styles.hubCtaDescription}>
                    Learn the terms we use across training, nutrition, and
                    recovery.
                  </Text>
                </View>
              </Card>
            </View>

            <View style={styles.subSection}>
              <CuratedSection
                icon="bag"
                iconSizeOverride={18}
                title="Shop"
                description="Products we at Tempered Strength believe in, at the best prices for you"
                size="medium"
                theme="gold"
              />

              <Card
                onPress={handleOpenShop}
                accessibilityLabel="Browse partner products"
                style={styles.shopCard}
              >
                <View style={styles.shopVisualTile}>
                  <Ionicons name="pricetag" size={30} color={Colors.accent} />
                </View>
                <View style={styles.shopCtaTextColumn}>
                  <Text style={styles.shopEyebrow}>Partner picks</Text>
                  <Text style={styles.hubCtaTitle}>Browse the shop</Text>
                  <Text style={styles.hubCtaDescription}>
                    Affiliate offers from brands we trust, codes and links in
                    one place.
                  </Text>
                </View>
                <SmallChevron />
              </Card>
            </View>

            <CuratedSection
              icon="newspaper-outline"
              iconSizeOverride={18}
              title="Articles"
              description="Your daily intel for the iron game"
              size="medium"
              theme="gold"
            />
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons
              name={showFavoritesOnly ? 'bookmark-outline' : 'document-text'}
              size={64}
              color={Colors.backgroundSubtle}
            />
            <Text style={styles.emptyTitle}>
              {showFavoritesOnly
                ? 'No Saved Articles Yet'
                : 'No Articles Found'}
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
      title="Hub"
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
          {searchQuery.length > 0 ? (
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
          ) : null}
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
  subSection: {
    gap: Spacing.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.backgroundElevated,
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
    gap: Spacing.section,
    marginBottom: Spacing.md,
  },
  hubCtaContent: {
    flex: 1,
    paddingRight: Spacing.xl,
    gap: Spacing.xs,
  },
  shopCard: {
    backgroundColor: Colors.accentWashFill,
    borderColor: Colors.accentWashBorder,
  },
  shopVisualTile: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.backgroundElevated,
    borderWidth: 1,
    borderColor: Colors.accentWashOutline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shopCtaTextColumn: {
    flex: 1,
    marginLeft: Spacing.xl,
    gap: Spacing.xs,
  },
  shopEyebrow: {
    color: Colors.accent,
    fontSize: FontSize.sm,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  hubCtaTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.xl,
    fontWeight: '700',
  },
  hubCtaDescription: {
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
