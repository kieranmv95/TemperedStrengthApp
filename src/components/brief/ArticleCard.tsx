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
  variant?: 'compact' | 'horizontal';
  isFavorite?: boolean;
  onToggleFavorite?: (articleId: string) => void;
};

export function ArticleCard({
  article,
  onPress,
  variant = 'compact',
  isFavorite = false,
  onToggleFavorite,
}: ArticleCardProps) {
  const canFavorite = Boolean(onToggleFavorite);
  const handleToggleFavorite = () => {
    onToggleFavorite?.(article.id);
  };

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
          {canFavorite && (
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={handleToggleFavorite}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name={isFavorite ? 'bookmark' : 'bookmark-outline'}
                size={18}
                color={isFavorite ? Colors.accent : Colors.textPlaceholder}
              />
            </TouchableOpacity>
          )}
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
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        {canFavorite && (
          <TouchableOpacity
            onPress={handleToggleFavorite}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={isFavorite ? 'bookmark' : 'bookmark-outline'}
              size={22}
              color={isFavorite ? Colors.accent : Colors.textPlaceholder}
            />
          </TouchableOpacity>
        )}
        <Ionicons name="chevron-forward" size={20} color={Colors.textOnDark} />
      </View>
    </TouchableOpacity>
  );
}
