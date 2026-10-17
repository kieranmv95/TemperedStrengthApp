import { ActionChip } from '@/src/components/ds';
import {
  color,
  elevation,
  MIN_TARGET_SIZE,
  radius,
  space,
  typography,
} from '@/src/constants/tokens';
import { useToast } from '@/src/hooks/toast-context';
import type { HomeSponsorAd } from '@/src/services/sanitySponsorAds';
import * as Clipboard from 'expo-clipboard';
import { Image } from 'expo-image';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type SponsorAdCardProps = {
  ad: HomeSponsorAd;
  width: number;
  onPressCta: (ad: HomeSponsorAd) => void;
};

const ACCENT_EDGE_WIDTH = 4;
const LOGO_PANEL_HEIGHT = 48;
const LOGO_PANEL_MAX_WIDTH = 168;
const PRODUCT_PANEL_SIZE = 72;

/**
 * Partner placement in the dark theme. The CMS background colour is used only
 * as a narrow accent edge, so text colours are always tokens and pass contrast.
 */
export function SponsorAdCard({ ad, width, onPressCta }: SponsorAdCardProps) {
  const { showToast } = useToast();
  const showTitle =
    ad.title.length > 0 &&
    (ad.layout === 'textHeader' ||
      ad.layout === 'productLeft' ||
      (ad.layout === 'logoHeader' && !ad.logoUrl));

  const handleCopyCode = async () => {
    if (!ad.promoCode) return;
    try {
      await Clipboard.setStringAsync(ad.promoCode);
      showToast({
        message: `Code ${ad.promoCode} copied`,
        icon: 'checkmark-circle',
      });
    } catch (error) {
      console.error('Failed to copy promo code:', error);
    }
  };

  const text = (
    <View style={styles.text}>
      {showTitle ? (
        <Text style={styles.title} numberOfLines={2}>
          {ad.title}
        </Text>
      ) : null}
      <Text style={styles.description} numberOfLines={2}>
        {ad.description}
      </Text>
    </View>
  );

  return (
    <View style={[styles.card, elevation.raised, { width }]}>
      <View
        style={[styles.accentEdge, { backgroundColor: ad.bgColor }]}
        pointerEvents="none"
      />
      <View style={styles.body}>
        <Text style={styles.overline}>Partner</Text>

        {ad.layout === 'logoHeader' && ad.logoUrl ? (
          <View style={styles.logoPanel}>
            <Image
              source={{ uri: ad.logoUrl }}
              style={styles.logo}
              contentFit="contain"
              contentPosition="left center"
              accessibilityLabel={
                ad.title.length > 0 ? ad.title : 'Partner logo'
              }
              accessibilityIgnoresInvertColors
            />
          </View>
        ) : null}

        {ad.layout === 'productLeft' && ad.productUrl ? (
          <View style={styles.productRow}>
            <View style={styles.productPanel}>
              <Image
                source={{ uri: ad.productUrl }}
                style={styles.productImage}
                contentFit="contain"
                accessibilityIgnoresInvertColors
                accessible={false}
              />
            </View>
            {text}
          </View>
        ) : (
          text
        )}

        <View style={styles.actions}>
          <Pressable
            style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
            onPress={() => onPressCta(ad)}
            accessibilityRole="link"
            accessibilityLabel={
              ad.title.length > 0 ? `${ad.ctaLabel}, ${ad.title}` : ad.ctaLabel
            }
          >
            <Text style={styles.ctaText} numberOfLines={1}>
              {ad.ctaLabel}
            </Text>
          </Pressable>
          {ad.promoCode ? (
            <ActionChip
              label={ad.promoCode}
              icon="copy-outline"
              tone="neutral"
              onPress={() => void handleCopyCode()}
              accessibilityLabel={`Copy code ${ad.promoCode}`}
            />
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: color.surface1,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  accentEdge: {
    width: ACCENT_EDGE_WIDTH,
  },
  body: {
    flex: 1,
    padding: space.md,
    gap: space.sm,
  },
  overline: {
    ...typography.overline,
    color: color.textTertiary,
  },
  logoPanel: {
    alignSelf: 'flex-start',
    height: LOGO_PANEL_HEIGHT,
    width: LOGO_PANEL_MAX_WIDTH,
    padding: space.xs,
    borderRadius: radius.sm,
    backgroundColor: color.logoPanel,
  },
  logo: {
    flex: 1,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  productPanel: {
    width: PRODUCT_PANEL_SIZE,
    height: PRODUCT_PANEL_SIZE,
    padding: space.xxs,
    borderRadius: radius.sm,
    backgroundColor: color.logoPanel,
  },
  productImage: {
    flex: 1,
  },
  text: {
    flex: 1,
    gap: space.xxs,
  },
  title: {
    ...typography.headline,
    color: color.textPrimary,
  },
  description: {
    ...typography.callout,
    color: color.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: space.xs,
  },
  cta: {
    minHeight: MIN_TARGET_SIZE,
    justifyContent: 'center',
    paddingHorizontal: space.md,
    borderRadius: radius.pill,
    backgroundColor: color.gold,
  },
  ctaPressed: {
    backgroundColor: color.goldStrong,
  },
  ctaText: {
    ...typography.calloutStrong,
    color: color.onGold,
  },
});
