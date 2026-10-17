import { color } from '@/src/constants/tokens';
import type { ArticleListItem } from '@/src/types/brief';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  AccessibilityInfo,
  Pressable,
  StyleProp,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { LoadingImage, PressableCard } from '../ds';
import { articleCardStyles as styles } from './articleCardStyles';

type ArticleCardProps = {
  article: ArticleListItem;
  onPress: (article: ArticleListItem) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (slug: string) => void;
  style?: StyleProp<ViewStyle>;
};

export function ArticleCard({
  article,
  onPress,
  isFavorite = false,
  onToggleFavorite,
  style,
}: ArticleCardProps) {
  const canFavorite = Boolean(onToggleFavorite);

  const handleToggleFavorite = () => {
    AccessibilityInfo.announceForAccessibility(
      isFavorite ? 'Removed from saved articles' : 'Saved article'
    );
    onToggleFavorite?.(article.slug);
  };

  return (
    <View style={[styles.card, style]}>
      <PressableCard
        onPress={() => onPress(article)}
        accessibilityLabel={`${article.title}, ${article.category}, ${article.readTime} minute read`}
        showChevron={!canFavorite}
      >
        <View style={[styles.row, canFavorite && styles.rowWithFavourite]}>
          <LoadingImage
            source={{ uri: article.image }}
            style={styles.compactImage}
          />
          <View style={styles.compactContent}>
            <Text style={styles.compactCategory}>{article.category}</Text>
            <Text style={styles.compactTitle}>{article.title}</Text>
            <View style={styles.compactMeta}>
              <Ionicons
                name="time-outline"
                size={14}
                color={color.textSecondary}
              />
              <Text style={styles.compactMetaText}>{article.readTime} min</Text>
            </View>
          </View>
        </View>
      </PressableCard>
      {canFavorite ? (
        <Pressable
          onPress={handleToggleFavorite}
          style={styles.favouriteButton}
          accessibilityRole="button"
          accessibilityLabel={`Save ${article.title}`}
          accessibilityState={{ selected: isFavorite }}
        >
          <Ionicons
            name={isFavorite ? 'bookmark' : 'bookmark-outline'}
            size={22}
            color={isFavorite ? color.gold : color.textSecondary}
          />
        </Pressable>
      ) : null}
    </View>
  );
}
