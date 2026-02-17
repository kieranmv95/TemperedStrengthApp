import { ArticleCard } from '@/src/components/brief/ArticleCard';
import { GlossaryItem } from '@/src/components/brief/GlossaryItem';
import { PlaylistCard } from '@/src/components/brief/PlaylistCard';
import { Colors, FontSize, Spacing } from '@/src/constants/theme';
import {
  articles,
  getFeaturedArticle,
  glossary,
  playlists,
} from '@/src/data/brief';
import type { Article } from '@/src/types/brief';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function BriefScreen() {
  const featuredArticle = getFeaturedArticle();
  const otherArticles = articles.filter((a) => !a.isFeatured);
  const previewGlossary = glossary.slice(0, 3);

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
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Brief</Text>
          <Text style={styles.subtitle}>
            Your daily intel for the iron game
          </Text>
        </View>

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

        {/* THE SOUNDBOARD - Playlists Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="musical-notes" size={18} color={Colors.accent} />
              <Text style={styles.sectionTitle}>THE SOUNDBOARD</Text>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.playlistsContainer}
          >
            {playlists.map((playlist) => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundScreen,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.xxl,
  },
  header: {
    paddingTop: Spacing.section,
    paddingBottom: Spacing.section,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: FontSize.displayXXXl,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    color: Colors.textPlaceholder,
    fontSize: FontSize.lg,
    fontWeight: '500',
  },
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
  playlistsContainer: {
    paddingRight: Spacing.xxl,
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
