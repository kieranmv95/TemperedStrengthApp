import { ArticleCard } from "@/src/components/brief/ArticleCard";
import { GlossaryItem } from "@/src/components/brief/GlossaryItem";
import { PlaylistCard } from "@/src/components/brief/PlaylistCard";
import {
  articles,
  getFeaturedArticle,
  glossary,
  playlists,
} from "@/src/data/brief";
import type { Article } from "@/src/types/brief";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function BriefScreen() {
  const featuredArticle = getFeaturedArticle();
  const otherArticles = articles.filter((a) => !a.isFeatured);
  const previewGlossary = glossary.slice(0, 3);

  const handleArticlePress = (article: Article) => {
    router.push({
      pathname: "/article/[id]",
      params: { id: article.id },
    });
  };

  const handleSeeAllGlossary = () => {
    router.push("/glossary");
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
          <Text style={styles.subtitle}>Your daily intel for the iron game</Text>
        </View>

        {/* FIELD INTEL - Articles Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="document-text" size={18} color="#c9b072" />
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
              <Ionicons name="musical-notes" size={18} color="#c9b072" />
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
              <Ionicons name="book" size={18} color="#c9b072" />
              <Text style={styles.sectionTitle}>TERMINOLOGY</Text>
            </View>
            <TouchableOpacity
              style={styles.seeAllButton}
              onPress={handleSeeAllGlossary}
            >
              <Text style={styles.seeAllText}>See All</Text>
              <Ionicons name="chevron-forward" size={16} color="#c9b072" />
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
    backgroundColor: "#121212",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
  },
  header: {
    paddingTop: 24,
    paddingBottom: 24,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    color: "#666",
    fontSize: 14,
    fontWeight: "500",
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionTitle: {
    color: "#888",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  seeAllText: {
    color: "#c9b072",
    fontSize: 13,
    fontWeight: "600",
  },
  playlistsContainer: {
    paddingRight: 16,
  },
  moreArticlesLabel: {
    color: "#666",
    fontSize: 13,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 12,
  },
  articlesScrollContainer: {
    paddingRight: 16,
    gap: 12,
  },
  bottomSpacer: {
    height: 32,
  },
});

