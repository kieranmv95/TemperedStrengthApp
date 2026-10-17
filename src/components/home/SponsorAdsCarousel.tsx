import { SponsorAdCard } from '@/src/components/home/SponsorAdCard';
import { color, radius, space } from '@/src/constants/tokens';
import { posthogEventsNames } from '@/src/services/posthogEvents';
import type { HomeSponsorAd } from '@/src/services/sanitySponsorAds';
import { usePostHog } from 'posthog-react-native';
import React, { useCallback, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  useWindowDimensions,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';

type SponsorAdsCarouselProps = {
  ads: HomeSponsorAd[];
  onPressCta: (ad: HomeSponsorAd) => void;
};

const PAGE_GUTTER = space.md;
const CARD_GAP = space.sm;
/** How much of the next card shows, so it's clear the row scrolls. */
const NEXT_CARD_PEEK = space.xxl;
const DOT_SIZE = 6;
const ACTIVE_DOT_WIDTH = 16;

function hostFromUrl(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return '';
  }
}

function CarouselSeparator() {
  return <View style={styles.separator} />;
}

/** Swipeable partner ads. No auto-advance; page dots show position. */
export function SponsorAdsCarousel({
  ads,
  onPressCta,
}: SponsorAdsCarouselProps) {
  const posthog = usePostHog();
  const { width: windowWidth } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);
  const hasMultiple = ads.length > 1;
  const cardWidth =
    windowWidth - PAGE_GUTTER * 2 - (hasMultiple ? NEXT_CARD_PEEK : 0);
  const snapInterval = cardWidth + CARD_GAP;

  const handlePressCta = useCallback(
    (ad: HomeSponsorAd) => {
      posthog.capture(posthogEventsNames.home.sponsorCtaPressed, {
        sponsor_ad_id: ad.id,
        sponsor_layout: ad.layout,
        affiliate_host: hostFromUrl(ad.affiliateUrl),
      });
      onPressCta(ad);
    },
    [onPressCta, posthog]
  );

  const onMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const index = Math.round(offsetX / snapInterval);
      setActiveIndex(Math.max(0, Math.min(index, ads.length - 1)));
    },
    [ads.length, snapInterval]
  );

  const renderItem = useCallback(
    ({ item }: { item: HomeSponsorAd }) => (
      <SponsorAdCard ad={item} width={cardWidth} onPressCta={handlePressCta} />
    ),
    [cardWidth, handlePressCta]
  );

  if (ads.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={ads}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={CarouselSeparator}
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={snapInterval}
        snapToAlignment="start"
        disableIntervalMomentum
        onMomentumScrollEnd={onMomentumScrollEnd}
        style={styles.list}
        contentContainerStyle={styles.listContent}
      />
      {hasMultiple ? (
        <View
          style={styles.dots}
          accessible
          accessibilityLabel={`Ad ${activeIndex + 1} of ${ads.length}`}
        >
          {ads.map((ad, index) => (
            <View
              key={ad.id}
              style={[styles.dot, index === activeIndex && styles.dotActive]}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: space.sm,
  },
  list: {
    marginHorizontal: -PAGE_GUTTER,
  },
  listContent: {
    paddingHorizontal: PAGE_GUTTER,
  },
  separator: {
    width: CARD_GAP,
  },
  dots: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    gap: space.xxs,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: radius.pill,
    backgroundColor: color.textTertiary,
  },
  dotActive: {
    width: ACTIVE_DOT_WIDTH,
    backgroundColor: color.gold,
  },
});
