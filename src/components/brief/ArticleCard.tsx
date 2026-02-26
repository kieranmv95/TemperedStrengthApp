import type { Article } from '@/src/types/brief';
import { Ionicons } from '@expo/vector-icons';
import {
  BorderRadius,
  Colors,
  FontSize,
  Spacing,
} from '../../constants/theme';
import React from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type ArticleCardProps = {
  article: Article;
  onPress: (article: Article) => void;
  variant?: 'hero' | 'compact' | 'horizontal';
};

export function ArticleCard({
  article,
  onPress,
  variant = 'compact',
}: ArticleCardProps) {
  if (variant === 'horizontal') {
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
              <Text style={styles.horizontalCategoryText}>
                {article.category}
              </Text>
            </View>
            <View style={styles.horizontalContent}>
              <Text style={styles.horizontalTitle} numberOfLines={2}>
                {article.title}
              </Text>
              <View style={styles.horizontalMeta}>
                <Ionicons name="time-outline" size={12} color={Colors.textTertiary} />
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

  if (variant === 'hero') {
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
                <Ionicons name="star" size={12} color={Colors.textOnAccent} />
                <Text style={styles.featuredBadgeText}>Featured</Text>
              </View>
            </View>
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>{article.title}</Text>
              <Text style={styles.heroSubtitle}>{article.subtitle}</Text>
              <View style={styles.heroMeta}>
                <Ionicons name="time-outline" size={14} color={Colors.textMuted} />
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
          <Ionicons name="time-outline" size={12} color={Colors.textPlaceholder} />
          <Text style={styles.compactMetaText}>{article.readTime} min</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={Colors.textOnDark} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Hero Card Styles
  heroCard: {
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    marginBottom: Spacing.xxl,
  },
  heroImage: {
    height: 240,
    justifyContent: 'flex-end',
  },
  heroImageStyle: {
    borderRadius: BorderRadius.full,
  },
  heroOverlay: {
    flex: 1,
    backgroundColor: Colors.overlayLight,
    padding: Spacing.xxl,
    justifyContent: 'space-between',
  },
  heroBadgeRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  categoryBadge: {
    backgroundColor: Colors.accentOverlay,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  categoryBadgeText: {
    color: Colors.textOnAccent,
    fontSize: FontSize.sm,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  featuredBadgeText: {
    color: Colors.textOnAccent,
    fontSize: FontSize.sm,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  heroContent: {
    gap: Spacing.md,
  },
  heroTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.displayLg,
    fontWeight: '800',
    lineHeight: 28,
  },
  heroSubtitle: {
    color: Colors.textSecondary,
    fontSize: FontSize.lg,
    lineHeight: 20,
  },
  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  heroMetaText: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
    fontWeight: '500',
  },

  // Compact Card Styles
  compactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.xxl,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
  },
  compactImage: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.backgroundElevated,
  },
  compactContent: {
    flex: 1,
    marginLeft: Spacing.xl,
    gap: Spacing.xs,
  },
  compactCategoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactCategory: {
    color: Colors.accent,
    fontSize: FontSize.sm,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  compactTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.xl,
    fontWeight: '600',
    lineHeight: 20,
  },
  compactMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  compactMetaText: {
    color: Colors.textPlaceholder,
    fontSize: FontSize.md,
  },

  // Horizontal Card Styles (for scrollable list)
  horizontalCard: {
    width: 200,
    borderRadius: BorderRadius.xxl,
    overflow: 'hidden',
  },
  horizontalImage: {
    height: 150,
    justifyContent: 'flex-end',
  },
  horizontalImageStyle: {
    borderRadius: BorderRadius.xxl,
  },
  horizontalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlayLighter,
    padding: Spacing.xl,
    justifyContent: 'space-between',
  },
  horizontalCategoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.accentOverlay,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xxs,
    borderRadius: BorderRadius.sm,
  },
  horizontalCategoryText: {
    color: Colors.textOnAccent,
    fontSize: FontSize.xxs,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  horizontalContent: {
    gap: Spacing.xs,
  },
  horizontalTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.lg,
    fontWeight: '700',
    lineHeight: 18,
  },
  horizontalMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  horizontalMetaText: {
    color: Colors.textTertiary,
    fontSize: FontSize.sm,
    fontWeight: '500',
  },
});
