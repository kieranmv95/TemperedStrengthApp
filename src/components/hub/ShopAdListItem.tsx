import { shopAdListItemStyles as styles } from '@/src/components/hub/shopAdListItemStyles';
import {
  sponsorAdDisplayTitle,
  sponsorAdThumbnailUrl,
  type HomeSponsorAd,
} from '@/src/services/sanitySponsorAds';
import { Image } from 'expo-image';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

type ShopAdListItemProps = {
  ad: HomeSponsorAd;
  onPress: (ad: HomeSponsorAd) => void;
};

export function ShopAdListItem({ ad, onPress }: ShopAdListItemProps) {
  const thumbnailUrl = sponsorAdThumbnailUrl(ad);
  const displayTitle = sponsorAdDisplayTitle(ad);

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: ad.bgColor, borderColor: ad.titleColor },
      ]}
      onPress={() => onPress(ad)}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={`${displayTitle}, view partner details`}
      accessibilityHint="Opens offer details"
    >
      <Text
        style={[styles.title, { color: ad.titleColor }]}
        numberOfLines={1}
      >
        {displayTitle}
      </Text>
      <View style={[styles.thumbWrap, { backgroundColor: ad.bgColor }]}>
        <Image
          source={thumbnailUrl ? { uri: thumbnailUrl } : undefined}
          style={styles.image}
          contentFit="contain"
          contentPosition="center"
          accessibilityIgnoresInvertColors
        />
      </View>
    </TouchableOpacity>
  );
}
