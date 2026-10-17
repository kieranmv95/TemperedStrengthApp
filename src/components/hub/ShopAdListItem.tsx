import { LoadingImage, PressableCard } from '@/src/components/ds';
import { shopAdListItemStyles as styles } from '@/src/components/hub/shopAdListItemStyles';
import { color } from '@/src/constants/tokens';
import {
  sponsorAdDisplayTitle,
  sponsorAdThumbnailUrl,
  type HomeSponsorAd,
} from '@/src/services/sanitySponsorAds';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

type ShopAdListItemProps = {
  ad: HomeSponsorAd;
  onPress: (ad: HomeSponsorAd) => void;
};

/**
 * Partner tile in the dark theme. The CMS background colour is used only as a
 * narrow accent edge; text uses tokens so contrast always passes.
 */
export function ShopAdListItem({ ad, onPress }: ShopAdListItemProps) {
  const thumbnailUrl = sponsorAdThumbnailUrl(ad);
  const displayTitle = sponsorAdDisplayTitle(ad);
  const hasTitle = ad.title.length > 0;

  return (
    <PressableCard
      variant="promo"
      accentColor={ad.bgColor}
      onPress={() => onPress(ad)}
      showChevron={false}
      fill
      accessibilityLabel={
        hasTitle ? `${displayTitle}, partner offer` : 'Partner offer'
      }
      accessibilityHint="Opens offer details"
    >
      <View style={styles.content}>
        <Text style={styles.overline}>Partner</Text>
        {thumbnailUrl ? (
          <View style={styles.imagePanel}>
            <LoadingImage
              source={{ uri: thumbnailUrl }}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
        ) : (
          <View style={styles.iconWell}>
            <Ionicons
              name="pricetag-outline"
              size={20}
              color={color.textSecondary}
            />
          </View>
        )}
        {hasTitle ? <Text style={styles.title}>{displayTitle}</Text> : null}
      </View>
    </PressableCard>
  );
}
