import { shopAdListItemStyles as styles } from '@/src/components/hub/shopAdListItemStyles';
import {
  sponsorAdDisplayTitle,
  sponsorAdThumbnailUrl,
  type HomeSponsorAd,
} from '@/src/services/sanitySponsorAds';
import { Ionicons } from '@expo/vector-icons';
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
  const isLogoThumb = ad.layout === 'logoHeader' && thumbnailUrl !== null;

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: ad.bgColor }]}
      onPress={() => onPress(ad)}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={`${displayTitle}, ${ad.ctaLabel}`}
    >
      {thumbnailUrl ? (
        <View style={[styles.thumbWrap, { backgroundColor: ad.bgColor }]}>
          <Image
            source={{ uri: thumbnailUrl }}
            style={
              isLogoThumb ? styles.thumbImageLogo : styles.thumbImage
            }
            contentFit={isLogoThumb ? 'contain' : 'cover'}
            contentPosition={isLogoThumb ? 'left center' : 'center'}
            accessibilityIgnoresInvertColors
          />
        </View>
      ) : ad.layout === 'textHeader' ? null : (
        <View
          style={[styles.thumbPlaceholder, { backgroundColor: ad.bgColor }]}
        >
          <Ionicons
            name="bag-outline"
            size={28}
            color={ad.titleColor}
            style={{ opacity: 0.5 }}
          />
        </View>
      )}

      <View style={styles.content}>
        <Text style={[styles.title, { color: ad.titleColor }]}>
          {displayTitle}
        </Text>
        <Text style={[styles.description, { color: ad.descriptionColor }]}>
          {ad.description}
        </Text>
      </View>

      <View
        style={[styles.chevronWrap, { borderColor: ad.titleColor }]}
        pointerEvents="none"
      >
        <Ionicons name="chevron-forward" size={20} color={ad.titleColor} />
      </View>
    </TouchableOpacity>
  );
}
