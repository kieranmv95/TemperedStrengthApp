import { BottomSheet, LoadingImage } from '@/src/components/ds';
import { shopSponsorAdSheetStyles as styles } from '@/src/components/hub/shopSponsorAdSheetStyles';
import { color } from '@/src/constants/tokens';
import {
  sponsorAdDetailLogoUrl,
  sponsorAdDisplayTitle,
  type HomeSponsorAd,
} from '@/src/services/sanitySponsorAds';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

type ShopSponsorAdSheetProps = {
  ad: HomeSponsorAd | null;
  visible: boolean;
  onClose: () => void;
  onPressCta: (ad: HomeSponsorAd) => void;
};

type ShopSponsorAdReviewAsideProps = {
  ad: HomeSponsorAd;
};

function ShopSponsorAdReviewAside({ ad }: ShopSponsorAdReviewAsideProps) {
  if (!ad.review) {
    return null;
  }

  return (
    <View
      style={styles.reviewAside}
      accessible
      accessibilityRole="text"
      accessibilityLabel={`Tempered Strength review: ${ad.review}`}
    >
      <View style={styles.reviewHeader}>
        <Ionicons name="ribbon-outline" size={16} color={color.textSecondary} />
        <Text style={styles.reviewLabel}>Our take</Text>
      </View>
      <Text style={styles.reviewText}>{ad.review}</Text>
    </View>
  );
}

/**
 * Partner offer details in the dark theme. The CMS background colour is used
 * only as a narrow accent edge; the logo sits on a contained light panel.
 */
export function ShopSponsorAdSheet({
  ad,
  visible,
  onClose,
  onPressCta,
}: ShopSponsorAdSheetProps) {
  // Keep the last ad on screen while the sheet animates closed.
  const [displayedAd, setDisplayedAd] = useState(ad);
  if (ad !== null && ad !== displayedAd) {
    setDisplayedAd(ad);
  }

  if (!displayedAd) {
    return null;
  }

  const logoUrl = sponsorAdDetailLogoUrl(displayedAd);
  const displayTitle = sponsorAdDisplayTitle(displayedAd);
  const ctaAccessibilityLabel =
    displayedAd.title.length > 0
      ? `${displayedAd.ctaLabel}, ${displayedAd.title}`
      : displayedAd.ctaLabel;

  return (
    <BottomSheet
      visible={visible && ad !== null}
      onClose={onClose}
      title={displayTitle}
      footer={
        <Pressable
          style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
          onPress={() => onPressCta(displayedAd)}
          accessibilityRole="link"
          accessibilityLabel={ctaAccessibilityLabel}
          accessibilityHint="Opens the partner's website"
        >
          <Text style={styles.ctaText}>{displayedAd.ctaLabel}</Text>
        </Pressable>
      }
    >
      <View style={styles.identity}>
        <View
          style={[styles.accentEdge, { backgroundColor: displayedAd.bgColor }]}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        />
        <View style={styles.identityContent}>
          <Text style={styles.overline}>Partner</Text>
          {logoUrl ? (
            <View
              style={[
                styles.logoPanel,
                { backgroundColor: displayedAd.bgColor },
              ]}
            >
              <LoadingImage
                source={{ uri: logoUrl }}
                style={[styles.logo, { backgroundColor: displayedAd.bgColor }]}
                resizeMode="contain"
                accessibilityLabel={`${displayTitle} logo`}
              />
            </View>
          ) : null}
        </View>
      </View>

      <Text style={styles.description}>{displayedAd.description}</Text>

      <ShopSponsorAdReviewAside ad={displayedAd} />
    </BottomSheet>
  );
}
