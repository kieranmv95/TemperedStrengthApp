import { ArticleMarkdownContent } from '@/src/components/brief/ArticleMarkdownContent';
import { articleScreenStyles as styles } from '@/src/components/brief/articleScreenStyles';
import { Colors } from '@/src/constants/theme';
import { fetchArticleBySlug } from '@/src/services/briefApiService';
import { increment } from '@/src/services/metricService';
import type { Article } from '@/src/types/brief';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ArticleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
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
    }, [id])
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerBackButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.errorContainer}>
          <ActivityIndicator size="large" color={Colors.accent} />
        </View>
      </SafeAreaView>
    );
  }

  if (isOffline || !article) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerBackButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="wifi-outline" size={64} color={Colors.backgroundSubtle} />
          <Text style={styles.errorText}>
            {isOffline
              ? 'No connection — article unavailable'
              : 'Article not found'}
          </Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const articleUrl = `https://www.temperedstrength.com/articles/${id}`;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBackButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {article.category}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Image source={{ uri: article.image }} style={styles.heroImage} />

        <View style={styles.metaContainer}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{article.category}</Text>
          </View>
          <View style={styles.readTime}>
            <Ionicons name="time-outline" size={14} color={Colors.textMuted} />
            <Text style={styles.readTimeText}>{article.readTime} min read</Text>
          </View>
        </View>

        <Text style={styles.title}>{article.title}</Text>
        <Text style={styles.subtitle}>{article.subtitle}</Text>

        <TouchableOpacity
          style={styles.readOnWebButton}
          onPress={() => {
            Linking.openURL(articleUrl).catch((error) => {
              console.error('Failed to open article URL:', error);
            });
          }}
        >
          <Ionicons name="globe-outline" size={16} color={Colors.accent} />
          <Text style={styles.readOnWebText}>Read on web</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <View style={styles.articleContent}>
          <ArticleMarkdownContent content={article.content} />
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}
