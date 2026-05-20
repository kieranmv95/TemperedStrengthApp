import { shopSponsorAdSheetStyles as styles } from '@/src/components/hub/shopSponsorAdSheetStyles';
import { Spacing } from '@/src/constants/theme';
import {
  sponsorAdDetailLogoUrl,
  sponsorAdDisplayTitle,
  type HomeSponsorAd,
} from '@/src/services/sanitySponsorAds';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
      style={[styles.reviewAside, { borderLeftColor: ad.titleColor }]}
      accessibilityRole="text"
      accessibilityLabel={`Tempered Strength review: ${ad.review}`}
    >
      <View style={styles.reviewHeader}>
        <Ionicons name="ribbon" size={16} color={ad.titleColor} />
        <Text style={[styles.reviewLabel, { color: ad.titleColor }]}>
          Our take
        </Text>
      </View>
      <Text style={[styles.reviewText, { color: ad.descriptionColor }]}>
        {ad.review}
      </Text>
    </View>
  );
}

export function ShopSponsorAdSheet({
  ad,
  visible,
  onClose,
  onPressCta,
}: ShopSponsorAdSheetProps) {
  const insets = useSafeAreaInsets();

  if (!ad) {
    return null;
  }

  const logoUrl = sponsorAdDetailLogoUrl(ad);
  const displayTitle = sponsorAdDisplayTitle(ad);
  const ctaAccessibilityLabel =
    ad.title.length > 0 ? `${ad.ctaLabel}, ${ad.title}` : ad.ctaLabel;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable
          style={styles.backdrop}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close partner details"
        />
        <View
          style={[
            styles.sheet,
            {
              backgroundColor: ad.bgColor,
              paddingBottom: insets.bottom + Spacing.section,
            },
          ]}
        >
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Close"
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="close" size={28} color={ad.titleColor} />
          </TouchableOpacity>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {logoUrl ? (
              <View style={styles.logoWrap}>
                <Image
                  source={{ uri: logoUrl }}
                  style={styles.logo}
                  contentFit="contain"
                  accessibilityLabel={displayTitle}
                  accessibilityIgnoresInvertColors
                />
              </View>
            ) : null}

            <Text style={[styles.description, { color: ad.descriptionColor }]}>
              {ad.description}
            </Text>

            <ShopSponsorAdReviewAside ad={ad} />

            <TouchableOpacity
              style={[styles.cta, { backgroundColor: ad.ctaColor }]}
              onPress={() => onPressCta(ad)}
              accessibilityRole="button"
              accessibilityLabel={ctaAccessibilityLabel}
            >
              <Text style={[styles.ctaText, { color: ad.ctaTextColor }]}>
                {ad.ctaLabel}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
