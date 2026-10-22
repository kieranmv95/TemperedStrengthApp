import { shopAdListItemStyles as styles } from '@/src/components/hub/shopAdListItemStyles';
import {
  sponsorAdDisplayTitle,
  sponsorAdThumbnailUrl,
  type HomeSponsorAd,
} from '@/src/services/sanitySponsorAds';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { Pressable, Text } from 'react-native';

type ShopAdListItemProps = {
  ad: HomeSponsorAd;
  onPress: (ad: HomeSponsorAd) => void;
};

/**
 * Square partner tile in the partner's own brand colours, so logos designed
 * for that background (light or dark) stay legible.
 */
export function ShopAdListItem({ ad, onPress }: ShopAdListItemProps) {
  const thumbnailUrl = sponsorAdThumbnailUrl(ad);
  const displayTitle = sponsorAdDisplayTitle(ad);
  const hasTitle = ad.title.length > 0;

  return (
    <Pressable
      onPress={() => onPress(ad)}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: ad.bgColor, borderColor: ad.titleColor },
        pressed && styles.cardPressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={
        hasTitle ? `${displayTitle}, partner offer` : 'Partner offer'
      }
      accessibilityHint="Opens offer details"
    >
      {hasTitle ? (
        <Text
          style={[styles.title, { color: ad.titleColor }]}
          numberOfLines={1}
        >
          {displayTitle}
        </Text>
      ) : null}
      {thumbnailUrl ? (
        <Image
          source={{ uri: thumbnailUrl }}
          style={styles.image}
          contentFit="contain"
          contentPosition="center"
          transition={150}
          accessibilityIgnoresInvertColors
        />
      ) : (
        <Ionicons name="pricetag-outline" size={32} color={ad.titleColor} />
      )}
    </Pressable>
  );
}
