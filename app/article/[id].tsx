import { ArticleMarkdownContent } from '@/src/components/brief/ArticleMarkdownContent';
import {
  ARTICLE_HERO_HEIGHT,
  articleScreenStyles as styles,
} from '@/src/components/brief/articleScreenStyles';
import { color } from '@/src/constants/tokens';
import { posthogEventsNames } from '@/src/services/posthogEvents';
import { fetchArticleBySlug } from '@/src/services/briefApiService';
import { increment } from '@/src/services/metricService';
import type { Article } from '@/src/types/brief';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, router, useLocalSearchParams } from 'expo-router';
import { usePostHog } from 'posthog-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { Linking, Pressable, Text, View } from 'react-native';
import {
  AppSafeAreaView,
  AppScrollView,
  LoadingImage,
  Skeleton,
  Tag,
} from '@/src/components/ds';

const TITLE_PLACEHOLDER_HEIGHT = 64;
const PARAGRAPH_PLACEHOLDER_HEIGHT = 96;

function ArticleBackHeader() {
  return (
    <View style={styles.header}>
      <Pressable
        style={styles.headerBackButton}
        onPress={() => router.back()}
        accessibilityRole="button"
        accessibilityLabel="Back"
      >
        <Ionicons name="arrow-back" size={24} color={color.textPrimary} />
      </Pressable>
    </View>
  );
}

export default function ArticleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const posthog = usePostHog();
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    increment('articles_read');
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!id) return;

      let cancelled = false;

      (async () => {
        setIsLoading(true);
        try {
          const data = await fetchArticleBySlug(id);
          if (cancelled) return;
          setArticle(data);
          if (data) {
            posthog.capture(posthogEventsNames.content.articleView, {
              article_id: data.id,
              article_title: data.title,
            });
          }
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
    }, [id, posthog])
  );

  if (isLoading) {
    return (
      <AppSafeAreaView style={styles.container}>
        <ArticleBackHeader />
        <View style={styles.loadingContent}>
          <Skeleton
            width="100%"
            height={ARTICLE_HERO_HEIGHT}
            radius="md"
            accessibilityLabel="Loading article"
          />
          <Skeleton width="100%" height={TITLE_PLACEHOLDER_HEIGHT} />
          <Skeleton width="100%" height={PARAGRAPH_PLACEHOLDER_HEIGHT} />
        </View>
      </AppSafeAreaView>
    );
  }

  if (isOffline || !article) {
    return (
      <AppSafeAreaView style={styles.container}>
        <ArticleBackHeader />
        <View style={styles.errorContainer}>
          <Ionicons
            name={isOffline ? 'cloud-offline-outline' : 'document-text-outline'}
            size={48}
            color={color.textTertiary}
          />
          <Text style={styles.errorText} accessibilityRole="header">
            {isOffline
              ? 'No connection — article unavailable'
              : 'Article not found'}
          </Text>
          <Pressable
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.backButtonPressed,
            ]}
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Text style={styles.backButtonText}>Go back</Text>
          </Pressable>
        </View>
      </AppSafeAreaView>
    );
  }

  const articleUrl = `https://www.temperedstrength.com/articles/${id}`;

  return (
    <AppSafeAreaView style={styles.container}>
      <ArticleBackHeader />

      <AppScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <LoadingImage
          source={{ uri: article.image }}
          style={styles.heroImage}
        />

        <View style={styles.metaContainer}>
          <Tag label={article.category} />
          <View style={styles.readTime}>
            <Ionicons
              name="time-outline"
              size={14}
              color={color.textSecondary}
            />
            <Text style={styles.readTimeText}>{article.readTime} min read</Text>
          </View>
        </View>

        <Text style={styles.title} accessibilityRole="header">
          {article.title}
        </Text>
        <Text style={styles.subtitle}>{article.subtitle}</Text>

        <Pressable
          style={({ pressed }) => [
            styles.readOnWebButton,
            pressed && styles.readOnWebButtonPressed,
          ]}
          onPress={() => {
            Linking.openURL(articleUrl).catch((error) => {
              console.error('Failed to open article URL:', error);
            });
          }}
          accessibilityRole="link"
          accessibilityLabel="Read on web"
          accessibilityHint="Opens the article in your browser"
        >
          <Ionicons name="globe-outline" size={16} color={color.textPrimary} />
          <Text style={styles.readOnWebText}>Read on web</Text>
        </Pressable>

        <View style={styles.divider} />

        <View style={styles.articleContent}>
          <ArticleMarkdownContent content={article.content} />
        </View>
      </AppScrollView>
    </AppSafeAreaView>
  );
}
