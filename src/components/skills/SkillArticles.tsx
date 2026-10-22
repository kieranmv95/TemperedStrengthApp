import { ArticleCard } from '@/src/components/brief/ArticleCard';
import { Skeleton } from '@/src/components/ds';
import { space } from '@/src/constants/tokens';
import { fetchArticles } from '@/src/services/briefApiService';
import { posthogEventsNames } from '@/src/services/posthogEvents';
import type { ArticleListItem } from '@/src/types/brief';
import { getFavoriteArticles, setFavoriteArticles } from '@/src/utils/storage';
import { useFocusEffect, router } from 'expo-router';
import { usePostHog } from 'posthog-react-native';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';

const ARTICLE_CARD_PLACEHOLDER_HEIGHT = 104;

type SkillArticlesProps = {
  articleSlugs: string[];
};

export function SkillArticles({ articleSlugs }: SkillArticlesProps) {
  const posthog = usePostHog();
  const { width: windowWidth } = useWindowDimensions();
  const multiCardWidth = windowWidth * 0.8;
  const [articles, setArticles] = useState<ArticleListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const favoritesRef = useRef<string[]>([]);
  const persistChainRef = useRef<Promise<void>>(Promise.resolve());

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      void (async () => {
        setIsLoading(true);
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
        } catch (error) {
          console.error('Failed to load articles:', error);
          if (!cancelled) {
            setArticles([]);
          }
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

  const resolvedArticles = useMemo(() => {
    const bySlug = new Map(articles.map((article) => [article.slug, article]));
    const matched: ArticleListItem[] = [];
    for (const slug of articleSlugs) {
      const article = bySlug.get(slug);
      if (article) {
        matched.push(article);
      }
    }
    return matched;
  }, [articles, articleSlugs]);

  const handlePress = (article: ArticleListItem) => {
    router.push({
      pathname: '/article/[id]',
      params: { id: article.slug },
    });
  };

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

  if (isLoading) {
    return (
      <Skeleton
        width="100%"
        height={ARTICLE_CARD_PLACEHOLDER_HEIGHT}
        radius="md"
        accessibilityLabel="Loading articles"
      />
    );
  }

  if (resolvedArticles.length === 0) {
    return null;
  }

  if (resolvedArticles.length === 1) {
    const article = resolvedArticles[0];
    return (
      <ArticleCard
        article={article}
        onPress={handlePress}
        isFavorite={favorites.includes(article.slug)}
        onToggleFavorite={handleToggleFavorite}
        style={styles.card}
      />
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scrollBleed}
      contentContainerStyle={styles.list}
    >
      {resolvedArticles.map((article, index) => (
        <View
          key={`${article.slug}-${index}`}
          style={{ width: multiCardWidth }}
        >
          <ArticleCard
            article={article}
            onPress={handlePress}
            isFavorite={favorites.includes(article.slug)}
            onToggleFavorite={handleToggleFavorite}
            style={styles.card}
          />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollBleed: {
    marginHorizontal: -space.md,
  },
  list: {
    gap: space.sm,
    paddingHorizontal: space.md,
  },
  card: {
    marginBottom: 0,
  },
});
