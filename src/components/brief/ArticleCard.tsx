import type { Article } from "@/src/types/brief";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ArticleCardProps {
  article: Article;
  onPress: (article: Article) => void;
  variant?: "hero" | "compact" | "horizontal";
}

export function ArticleCard({
  article,
  onPress,
  variant = "compact",
}: ArticleCardProps) {
  if (variant === "horizontal") {
    return (
      <TouchableOpacity
        style={styles.horizontalCard}
        onPress={() => onPress(article)}
        activeOpacity={0.8}
      >
        <ImageBackground
          source={{ uri: article.image }}
          style={styles.horizontalImage}
          imageStyle={styles.horizontalImageStyle}
        >
          <View style={styles.horizontalOverlay}>
            <View style={styles.horizontalCategoryBadge}>
              <Text style={styles.horizontalCategoryText}>{article.category}</Text>
            </View>
            <View style={styles.horizontalContent}>
              <Text style={styles.horizontalTitle} numberOfLines={2}>
                {article.title}
              </Text>
              <View style={styles.horizontalMeta}>
                <Ionicons name="time-outline" size={12} color="#999" />
                <Text style={styles.horizontalMetaText}>
                  {article.readTime} min
                </Text>
              </View>
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  }

  if (variant === "hero") {
    return (
      <TouchableOpacity
        style={styles.heroCard}
        onPress={() => onPress(article)}
        activeOpacity={0.8}
      >
        <ImageBackground
          source={{ uri: article.image }}
          style={styles.heroImage}
          imageStyle={styles.heroImageStyle}
        >
          <View style={styles.heroOverlay}>
            <View style={styles.heroBadgeRow}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>{article.category}</Text>
              </View>
              <View style={styles.featuredBadge}>
                <Ionicons name="star" size={12} color="#121212" />
                <Text style={styles.featuredBadgeText}>Featured</Text>
              </View>
            </View>
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>{article.title}</Text>
              <Text style={styles.heroSubtitle}>{article.subtitle}</Text>
              <View style={styles.heroMeta}>
                <Ionicons name="time-outline" size={14} color="#888" />
                <Text style={styles.heroMetaText}>
                  {article.readTime} min read
                </Text>
              </View>
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={styles.compactCard}
      onPress={() => onPress(article)}
      activeOpacity={0.7}
    >
      <Image source={{ uri: article.image }} style={styles.compactImage} />
      <View style={styles.compactContent}>
        <View style={styles.compactCategoryRow}>
          <Text style={styles.compactCategory}>{article.category}</Text>
        </View>
        <Text style={styles.compactTitle} numberOfLines={2}>
          {article.title}
        </Text>
        <View style={styles.compactMeta}>
          <Ionicons name="time-outline" size={12} color="#666" />
          <Text style={styles.compactMetaText}>{article.readTime} min</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#444" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Hero Card Styles
  heroCard: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
  },
  heroImage: {
    height: 240,
    justifyContent: "flex-end",
  },
  heroImageStyle: {
    borderRadius: 16,
  },
  heroOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 16,
    justifyContent: "space-between",
  },
  heroBadgeRow: {
    flexDirection: "row",
    gap: 8,
  },
  categoryBadge: {
    backgroundColor: "rgba(201, 176, 114, 0.9)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  categoryBadgeText: {
    color: "#121212",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  featuredBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#c9b072",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  featuredBadgeText: {
    color: "#121212",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  heroContent: {
    gap: 8,
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
    lineHeight: 28,
  },
  heroSubtitle: {
    color: "#CCC",
    fontSize: 14,
    lineHeight: 20,
  },
  heroMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  heroMetaText: {
    color: "#888",
    fontSize: 12,
    fontWeight: "500",
  },

  // Compact Card Styles
  compactCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  compactImage: {
    width: 72,
    height: 72,
    borderRadius: 8,
    backgroundColor: "#2A2A2A",
  },
  compactContent: {
    flex: 1,
    marginLeft: 12,
    gap: 4,
  },
  compactCategoryRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  compactCategory: {
    color: "#c9b072",
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  compactTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 20,
  },
  compactMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  compactMetaText: {
    color: "#666",
    fontSize: 12,
  },

  // Horizontal Card Styles (for scrollable list)
  horizontalCard: {
    width: 200,
    borderRadius: 12,
    overflow: "hidden",
  },
  horizontalImage: {
    height: 150,
    justifyContent: "flex-end",
  },
  horizontalImageStyle: {
    borderRadius: 12,
  },
  horizontalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    padding: 12,
    justifyContent: "space-between",
  },
  horizontalCategoryBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(201, 176, 114, 0.9)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  horizontalCategoryText: {
    color: "#121212",
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  horizontalContent: {
    gap: 4,
  },
  horizontalTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 18,
  },
  horizontalMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  horizontalMetaText: {
    color: "#999",
    fontSize: 11,
    fontWeight: "500",
  },
});

