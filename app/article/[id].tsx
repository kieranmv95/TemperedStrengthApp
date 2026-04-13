import { ArticleMarkdownContent } from '@/src/components/brief/ArticleMarkdownContent';
import { articleScreenStyles as styles } from '@/src/components/brief/articleScreenStyles';
import { Colors } from '@/src/constants/theme';
import { getArticleById } from '@/src/data/brief';
import { increment } from '@/src/services/metricService';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import {
  Image,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function normalizeUrl(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

export default function ArticleScreen() {
  const { id, url } = useLocalSearchParams<{ id: string; url?: string }>();
  const article = id ? getArticleById(id) : undefined;
  const articleUrl = normalizeUrl(url ?? 'https://www.test.com');

  useEffect(() => {
    increment('articles_read');
  }, []);

  if (!article) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Article not found</Text>
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
