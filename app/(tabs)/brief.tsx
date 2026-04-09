import { ArticleCard } from '@/src/components/brief/ArticleCard';
import { GlossaryItem } from '@/src/components/brief/GlossaryItem';
import { StandardLayout } from '@/src/components/StandardLayout';
import { Colors, FontSize, Spacing } from '@/src/constants/theme';
import {
  articles,
  getFeaturedArticle,
  glossary,
} from '@/src/data/brief';
import { increment } from '@/src/services/metricService';
import type { Article } from '@/src/types/brief';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function BriefScreen() {
  const featuredArticle = getFeaturedArticle();
  const otherArticles = articles.filter((a) => !a.isFeatured);
  const previewGlossary = glossary.slice(0, 3);

  useEffect(() => {
    increment('brief_visits');
  }, []);

  const handleArticlePress = (article: Article) => {
    router.push({
      pathname: '/article/[id]',
      params: { id: article.id },
    });
  };

  const handleSeeAllGlossary = () => {
    router.push('/glossary');
  };

  return (
    <StandardLayout title="Brief" subtitle="Your daily intel for the iron game">
      <StandardLayout.Body>
        {/* FIELD INTEL - Articles Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="document-text" size={18} color={Colors.accent} />
              <Text style={styles.sectionTitle}>FIELD INTEL</Text>
            </View>
          </View>

          {featuredArticle && (
            <ArticleCard
              article={featuredArticle}
              onPress={handleArticlePress}
              variant="hero"
            />
          )}

          {/* More Articles - Horizontal Scroll */}
          <Text style={styles.moreArticlesLabel}>More Articles</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.articlesScrollContainer}
          >
            {otherArticles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                onPress={handleArticlePress}
                variant="horizontal"
              />
            ))}
          </ScrollView>
        </View>

        {/* TERMINOLOGY - Glossary Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="book" size={18} color={Colors.accent} />
              <Text style={styles.sectionTitle}>TERMINOLOGY</Text>
            </View>
            <TouchableOpacity
              style={styles.seeAllButton}
              onPress={handleSeeAllGlossary}
            >
              <Text style={styles.seeAllText}>See All</Text>
              <Ionicons name="chevron-forward" size={16} color={Colors.accent} />
            </TouchableOpacity>
          </View>

          {previewGlossary.map((term) => (
            <GlossaryItem key={term.id} term={term} />
          ))}
        </View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacer} />
      </StandardLayout.Body>
    </StandardLayout>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 32,
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
  sectionTitle: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  seeAllText: {
    color: Colors.accent,
    fontSize: FontSize.base,
    fontWeight: '600',
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
  bottomSpacer: {
    height: 32,
  },
});
