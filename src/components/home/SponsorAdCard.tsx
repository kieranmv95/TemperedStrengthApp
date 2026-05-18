import {
  SPONSOR_CARD_HEIGHT,
  homeScreenStyles as styles,
} from '@/src/components/home/homeScreenStyles';
import type { HomeSponsorAd } from '@/src/services/sanitySponsorAds';
import { Image } from 'expo-image';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

type SponsorAdCardProps = {
  ad: HomeSponsorAd;
  width: number;
  onPressCta: (ad: HomeSponsorAd) => void;
};

export function SponsorAdCard({ ad, width, onPressCta }: SponsorAdCardProps) {
  const ctaAccessibilityLabel =
    ad.title.length > 0 ? `${ad.ctaLabel}, ${ad.title}` : ad.ctaLabel;

  const ctaButton = (
    <TouchableOpacity
      style={[styles.sponsorCta, { backgroundColor: ad.ctaColor }]}
      onPress={() => onPressCta(ad)}
      accessibilityRole="button"
      accessibilityLabel={ctaAccessibilityLabel}
    >
      <Text style={[styles.sponsorCtaText, { color: ad.ctaTextColor }]}>
        {ad.ctaLabel}
      </Text>
    </TouchableOpacity>
  );

  const descriptionLines = ad.layout === 'productLeft' ? 4 : 4;

  const description = (
    <Text
      style={[styles.sponsorDescription, { color: ad.descriptionColor }]}
      numberOfLines={descriptionLines}
    >
      {ad.description}
    </Text>
  );

  if (ad.layout === 'productLeft') {
    return (
      <View
        style={[
          styles.sponsorCard,
          styles.sponsorCardProductLeft,
          { width, height: SPONSOR_CARD_HEIGHT, backgroundColor: ad.bgColor },
        ]}
      >
        <View style={styles.sponsorProductRow}>
          {ad.productUrl ? (
            <View style={styles.sponsorProductRail}>
              <Image
                source={{ uri: ad.productUrl }}
                style={styles.sponsorProductImage}
                contentFit="cover"
                accessibilityIgnoresInvertColors
              />
            </View>
          ) : null}
          <View style={styles.sponsorProductContent}>
            <View style={styles.sponsorStackedCopy}>
              {ad.title.length > 0 ? (
                <Text
                  style={[styles.sponsorProductTitle, { color: ad.titleColor }]}
                  numberOfLines={1}
                >
                  {ad.title}
                </Text>
              ) : null}
              {description}
            </View>
            <View style={styles.sponsorStackedSpacer} />
            {ctaButton}
          </View>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.sponsorCard,
        styles.sponsorCardStacked,
        { width, height: SPONSOR_CARD_HEIGHT, backgroundColor: ad.bgColor },
      ]}
    >
      <View style={styles.sponsorStackedCopy}>
        {ad.layout === 'logoHeader' && ad.logoUrl ? (
          <View style={styles.sponsorLogoWrap}>
            <Image
              source={{ uri: ad.logoUrl }}
              style={styles.sponsorLogo}
              contentFit="contain"
              contentPosition="left center"
              accessibilityLabel={ad.title.length > 0 ? ad.title : undefined}
              accessibilityIgnoresInvertColors
            />
          </View>
        ) : null}
        {ad.title.length > 0 &&
          (ad.layout === 'textHeader' ||
            (ad.layout === 'logoHeader' && !ad.logoUrl)) ? (
          <Text
            style={[styles.sponsorTitle, { color: ad.titleColor }]}
            numberOfLines={1}
          >
            {ad.title}
          </Text>
        ) : null}
        {description}
      </View>
      <View style={styles.sponsorStackedSpacer} />
      {ctaButton}
    </View>
  );
}
