import { Colors } from '@/src/constants/theme';
import type { ArticleListItem } from '@/src/types/brief';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Card, SmallChevron } from '../ds';
import { articleCardStyles as styles } from './articleCardStyles';

type ArticleCardProps = {
  article: ArticleListItem;
  onPress: (article: ArticleListItem) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (slug: string) => void;
};

export function ArticleCard({
  article,
  onPress,
  isFavorite = false,
  onToggleFavorite,
}: ArticleCardProps) {
  const canFavorite = Boolean(onToggleFavorite);
  // The bookmark button sits inside the card's press target. Stop propagation
  // on every touch phase so tapping the bookmark never also opens the article.
  const stopPropagation = (event: { stopPropagation: () => void }) => {
    event.stopPropagation();
  };
  const handleToggleFavorite = (event: { stopPropagation: () => void }) => {
    event.stopPropagation();
    onToggleFavorite?.(article.slug);
  };

  return (
    <Card
      onPress={() => onPress(article)}
      accessibilityLabel="Open article"
      style={styles.card}
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
            onPressIn={stopPropagation}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={isFavorite ? 'bookmark' : 'bookmark-outline'}
              size={22}
              color={isFavorite ? Colors.accent : Colors.textPlaceholder}
            />
          </TouchableOpacity>
        )}
        <SmallChevron />
      </View>
    </Card>
  );
}
