import type { Article } from '@/src/types/brief';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/src/constants/theme';
import React from 'react';
import {
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { articleCardStyles as styles } from './articleCardStyles';

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
                <Ionicons
                  name="time-outline"
                  size={12}
                  color={Colors.textTertiary}
                />
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
                <Ionicons
                  name="time-outline"
                  size={14}
                  color={Colors.textMuted}
                />
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
          <Ionicons
            name="time-outline"
            size={12}
            color={Colors.textPlaceholder}
          />
          <Text style={styles.compactMetaText}>{article.readTime} min</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={Colors.textOnDark} />
    </TouchableOpacity>
  );
}
