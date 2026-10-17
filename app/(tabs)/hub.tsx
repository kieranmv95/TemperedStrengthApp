import { ArticleCard } from '@/src/components/brief/ArticleCard';
import {
  FilterChip,
  PressableCard,
  SectionHeader,
  Skeleton,
  StandardLayout,
} from '@/src/components/ds';
import { HubPromoRow } from '@/src/components/hub/HubPromoRow';
import { HubToolsSection } from '@/src/components/hub/HubToolsSection';
import { SkillsAndCuesCard } from '@/src/components/hub/SkillsAndCuesCard';
import { TogetherWeLiftBanner } from '@/src/components/hub/TogetherWeLiftBanner';
import { color, space, typography } from '@/src/constants/tokens';
import { type ToolRoute } from '@/src/data/tools';
import { useTogetherWeLift } from '@/src/hooks/use-together-we-lift';
import { fetchArticles } from '@/src/services/briefApiService';
import { increment } from '@/src/services/metricService';
import { posthogEventsNames } from '@/src/services/posthogEvents';
import type { ArticleCategory, ArticleListItem } from '@/src/types/brief';
import { getFavoriteArticles, setFavoriteArticles } from '@/src/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, router } from 'expo-router';
import { usePostHog } from 'posthog-react-native';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function HubScreen() {
  const posthog = usePostHog();
  const { open: openTogetherWeLift } = useTogetherWeLift();
  const [articles, setArticles] = useState<ArticleListItem[]>([]);
  const [articlesLoading, setArticlesLoading] = useState(true);
  const [networkUnavailable, setNetworkUnavailable] = useState(false);
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
        setArticlesLoading(true);
        try {
          const articleFavs = await getFavoriteArticles();
          if (cancelled) {
            return;
          }
          favoritesRef.current = articleFavs;
          setFavorites(articleFavs);
        } catch (error) {
          console.error('Failed to load favorite articles:', error);
        }

        try {
          const data = await fetchArticles();
          if (cancelled) {
            return;
          }
          setArticles(data);
          setNetworkUnavailable(false);
        } catch {
          if (cancelled) {
            return;
          }
          setNetworkUnavailable(true);
        } finally {
          if (!cancelled) {
            setArticlesLoading(false);
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

      return true;
    });
  }, [activeCategory, favorites, showFavoritesOnly, articles]);

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

  const handleOpenTool = (route: ToolRoute) => {
    router.push(route);
  };

  const handleOpenShop = () => {
    router.push('/shop');
  };

  const handleOpenDiscover = () => {
    router.push('/discover');
  };

  const handleOpenSkillsAndCues = () => {
    router.push('/skills-and-cues');
  };

  const charityBanner = (
    <TogetherWeLiftBanner onPress={() => openTogetherWeLift('hub_banner')} />
  );

  const renderNetworkOfflineMessage = (description: string) => (
    <View
      style={[styles.offline, styles.pageGutter]}
      accessible
      accessibilityLabel={`No connection. ${description}`}
    >
      <Ionicons
        name="cloud-offline-outline"
        size={32}
        color={color.textSecondary}
      />
      <Text style={styles.offlineTitle}>No connection</Text>
      <Text style={styles.offlineDescription}>{description}</Text>
    </View>
  );

  const articleFilterItems: {
    key: string;
    label: string;
    icon?: 'bookmark';
  }[] = [
    { key: 'favorites', label: 'Saved', icon: 'bookmark' },
    { key: 'all', label: 'All' },
    ...categories.map((c) => ({ key: c, label: c })),
  ];

  const listHeader = (
    <View style={styles.header}>
      <View style={[styles.group, styles.pageGutter]}>
        <SkillsAndCuesCard onPress={handleOpenSkillsAndCues} />
        <HubPromoRow
          onPressShop={handleOpenShop}
          onPressDiscover={handleOpenDiscover}
          shopUnavailable={networkUnavailable}
        />
      </View>

      <HubToolsSection onOpenTool={handleOpenTool} />

      <View style={[styles.group, styles.pageGutter]}>
        {networkUnavailable ? null : (
          <PressableCard
            onPress={handleSeeAllGlossary}
            accessibilityLabel="Browse the glossary"
            accessibilityHint="Terms we use across training, nutrition and recovery"
          >
            <View style={styles.cardTitleRow}>
              <Ionicons name="book-outline" size={18} color={color.gold} />
              <Text style={styles.cardTitle}>Browse the glossary</Text>
            </View>
            <Text style={styles.cardBody}>
              Learn the terms we use across training, nutrition and recovery.
            </Text>
          </PressableCard>
        )}
        {charityBanner}
      </View>

      <View style={styles.group}>
        <View style={styles.pageGutter}>
          <SectionHeader title="Articles" />
          <Text style={styles.sectionDescription}>
            Your daily intel for the iron game.
          </Text>
        </View>

        {networkUnavailable ? (
          renderNetworkOfflineMessage(
            'Articles need the internet. Tools above work offline.'
          )
        ) : articlesLoading ? (
          <View style={[styles.group, styles.pageGutter]}>
            <Skeleton
              width="100%"
              height={112}
              radius="md"
              accessibilityLabel="Loading articles"
            />
            <Skeleton width="100%" height={112} radius="md" />
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipRow}
          >
            {articleFilterItems.map((item) => {
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
                <FilterChip
                  key={item.key}
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
                  selected={isActive}
                  label={item.label}
                  icon={item.icon}
                  count={count}
                  accessibilityLabel={`${item.label}, ${count} article${
                    count === 1 ? '' : 's'
                  }`}
                />
              );
            })}
          </ScrollView>
        )}
      </View>
    </View>
  );

  const renderBody = () => (
    <FlatList
      data={networkUnavailable || articlesLoading ? [] : visibleArticles}
      keyExtractor={(item) => item.slug}
      extraData={favorites}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContent}
      ListHeaderComponent={listHeader}
      ListEmptyComponent={
        networkUnavailable || articlesLoading ? undefined : (
          <View style={styles.emptyState}>
            <Ionicons
              name={
                showFavoritesOnly ? 'bookmark-outline' : 'document-text-outline'
              }
              size={48}
              color={color.textTertiary}
            />
            <Text style={styles.emptyTitle} accessibilityRole="header">
              {showFavoritesOnly
                ? 'No saved articles yet'
                : 'No articles found'}
            </Text>
            <Text style={styles.emptyDescription}>
              {showFavoritesOnly
                ? 'Tap the bookmark on any article to save it here.'
                : 'Try a different filter.'}
            </Text>
          </View>
        )
      }
      renderItem={({ item }) => (
        <View style={styles.pageGutter}>
          <ArticleCard
            article={item}
            onPress={handleArticlePress}
            isFavorite={favorites.includes(item.slug)}
            onToggleFavorite={handleToggleFavorite}
          />
        </View>
      )}
    />
  );

  return (
    <StandardLayout
      title="Explore"
      subtitle="Tools, products and articles to help you train."
      disableScroll
      edgeToEdgeBody
    >
      <StandardLayout.Body>{renderBody()}</StandardLayout.Body>
    </StandardLayout>
  );
}

const styles = StyleSheet.create({
  pageGutter: {
    paddingHorizontal: space.md,
  },
  listContent: {
    paddingTop: space.md,
    paddingBottom: space.xxl,
  },
  header: {
    gap: space.xl,
    paddingBottom: space.sm,
  },
  group: {
    gap: space.sm,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
  },
  cardTitle: {
    ...typography.headline,
    color: color.textPrimary,
  },
  cardBody: {
    ...typography.callout,
    color: color.textSecondary,
    marginTop: space.xxs,
  },
  sectionDescription: {
    ...typography.callout,
    color: color.textSecondary,
  },
  chipRow: {
    gap: space.xs,
    paddingHorizontal: space.md,
  },
  offline: {
    alignItems: 'center',
    gap: space.xs,
    paddingVertical: space.md,
  },
  offlineTitle: {
    ...typography.headline,
    color: color.textPrimary,
    textAlign: 'center',
  },
  offlineDescription: {
    ...typography.callout,
    color: color.textSecondary,
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    gap: space.xs,
    paddingHorizontal: space.xxl,
    paddingTop: space.md,
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
