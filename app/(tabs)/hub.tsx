import { ArticleCard } from '@/src/components/brief/ArticleCard';
import { Card, CuratedSection, SmallChevron } from '@/src/components/ds';
import { TogetherWeLiftBanner } from '@/src/components/hub/TogetherWeLiftBanner';
import { Pill } from '@/src/components/pill';
import { StandardLayout } from '@/src/components/StandardLayout';
import { BorderRadius, Colors, FontSize, Spacing } from '@/src/constants/theme';
import { recoveryData } from '@/src/data/recovery_data';
import { TOOLS } from '@/src/data/tools';
import { useTogetherWeLift } from '@/src/hooks/use-together-we-lift';
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
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

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
          const favs = await getFavoriteArticles();
          if (cancelled) {
            return;
          }
          favoritesRef.current = favs;
          setFavorites(favs);
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

  const handleOpenTool = (route: (typeof TOOLS)[number]['route']) => {
    router.push(route);
  };

  const handleOpenShop = () => {
    router.push('/shop');
  };

  const handleOpenRecovery = () => {
    router.push('/recovery');
  };

  const charityBanner = (
    <View style={styles.charityBannerWrap}>
      <TogetherWeLiftBanner onPress={() => openTogetherWeLift('hub_banner')} />
    </View>
  );

  const renderNetworkOfflineMessage = () => (
    <View style={styles.sectionOffline}>
      <Ionicons name="wifi-outline" size={40} color={Colors.backgroundSubtle} />
      <Text style={styles.sectionOfflineTitle}>No connection</Text>
      <Text style={styles.sectionOfflineDescription}>
        This section needs the internet. Tools above work offline.
      </Text>
    </View>
  );

  const listHeader = (
    <View>
      {charityBanner}
      <View style={styles.section}>
        <View style={styles.subSection}>
          <CuratedSection
            icon="leaf-outline"
            iconSizeOverride={18}
            title="Recovery"
            description={`${recoveryData.length - 1}+ Mobility and stretching flows to help you recover and move better`}
            size="medium"
            theme="gold"
          />

          <Card
            onPress={handleOpenRecovery}
            accessibilityLabel="Browse recovery flows"
            style={styles.recoveryCard}
          >
            <View style={styles.recoveryVisualTile}>
              <Ionicons name="body" size={30} color={Colors.accent} />
            </View>
            <View style={styles.recoveryCtaTextColumn}>
              <Text style={styles.shopEyebrow}>Move &amp; restore</Text>
              <Text style={styles.hubCtaTitle}>Mobility &amp; flows</Text>
              <Text style={styles.hubCtaDescription}>
                {recoveryData.length - 1}+ Mobility and stretching flows to help you recover and move better.
              </Text>
            </View>
            <SmallChevron />
          </Card>
        </View>

        <View style={styles.subSection}>
          <CuratedSection
            icon="calculator-outline"
            iconSizeOverride={18}
            title="Tools"
            description="Calculators and training utilities you can open anywhere"
            size="medium"
            theme="gold"
          />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.toolsScrollContent}
          >
            {TOOLS.map((tool) => (
              <Pill
                key={tool.id}
                variant="card"
                onPress={() => handleOpenTool(tool.route)}
                isActive={false}
                label={tool.pillLabel}
                icon={tool.icon}
              />
            ))}
          </ScrollView>
        </View>

        <View style={styles.subSection}>
          <CuratedSection
            icon="book-outline"
            iconSizeOverride={18}
            title="Terminology"
            description="Quick definitions for common training terms"
            size="medium"
            theme="gold"
          />

          {networkUnavailable ? (
            renderNetworkOfflineMessage()
          ) : (
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
          )}
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

          {networkUnavailable ? (
            renderNetworkOfflineMessage()
          ) : (
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
                  Affiliate offers from brands we trust, codes and links in one
                  place.
                </Text>
              </View>
              <SmallChevron />
            </Card>
          )}
        </View>

        <View style={styles.articlesSection}>
          <CuratedSection
            icon="newspaper-outline"
            iconSizeOverride={18}
            title="Articles"
            description="Your daily intel for the iron game"
            size="medium"
            theme="gold"
          />

          {networkUnavailable ? (
            renderNetworkOfflineMessage()
          ) : articlesLoading ? (
            <View style={styles.articlesLoading}>
              <ActivityIndicator size="large" color={Colors.accent} />
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterScrollContent}
            >
              {[
                {
                  key: 'favorites',
                  label: 'Saved',
                  icon: 'bookmark' as const,
                },
                { key: 'all', label: 'All' },
                ...categories.map((c) => ({ key: c, label: c })),
              ].map((item) => {
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
                    isActive={isActive}
                    label={item.label}
                    icon={item.icon}
                    count={count}
                  />
                );
              })}
            </ScrollView>
          )}
        </View>
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
        networkUnavailable || articlesLoading ? null : (
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
                : 'Try selecting a different filter.'}
            </Text>
          </View>
        )
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

  return (
    <StandardLayout
      title="Hub"
      subtitle="Your daily intel for the iron game"
      disableScroll
    >
      <StandardLayout.Body>{renderBody()}</StandardLayout.Body>
    </StandardLayout>
  );
}

const styles = StyleSheet.create({
  charityBannerWrap: {
    marginBottom: Spacing.section,
  },
  sectionOffline: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.xxl,
    gap: Spacing.md,
  },
  sectionOfflineTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.xl,
    fontWeight: '700',
    textAlign: 'center',
  },
  sectionOfflineDescription: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    lineHeight: 20,
    textAlign: 'center',
  },
  articlesLoading: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  subSection: {
    gap: Spacing.md,
  },
  articlesSection: {
    gap: Spacing.md,
  },
  filterScrollContent: {
    paddingBottom: Spacing.md,
    gap: Spacing.md,
  },
  toolsScrollContent: {
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
  recoveryCard: {
    backgroundColor: Colors.accentWashFill,
    borderColor: Colors.accentWashBorder,
  },
  recoveryVisualTile: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.backgroundElevated,
    borderWidth: 1,
    borderColor: Colors.accentWashOutline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recoveryCtaTextColumn: {
    flex: 1,
    marginLeft: Spacing.xl,
    gap: Spacing.xs,
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
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.md,
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
