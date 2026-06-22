import { SponsorAdCard } from '@/src/components/home/SponsorAdCard';
import {
  SPONSOR_AUTO_SCROLL_MS,
  SPONSOR_CARD_HEIGHT,
  homeScreenStyles as styles,
} from '@/src/components/home/homeScreenStyles';
import { Spacing } from '@/src/constants/theme';
import { posthogEventsNames } from '@/src/services/posthogEvents';
import type { HomeSponsorAd } from '@/src/services/sanitySponsorAds';
import { usePostHog } from 'posthog-react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  useWindowDimensions,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ViewToken,
} from 'react-native';

type SponsorAdsCarouselProps = {
  ads: HomeSponsorAd[];
  onPressCta: (ad: HomeSponsorAd) => void;
};

function hostFromUrl(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return '';
  }
}

export function SponsorAdsCarousel({ ads, onPressCta }: SponsorAdsCarouselProps) {
  const posthog = usePostHog();
  const { width: windowWidth } = useWindowDimensions();
  const cardWidth = windowWidth - Spacing.xxl * 2;
  const listRef = useRef<FlatList<HomeSponsorAd>>(null);
  const activeIndexRef = useRef(0);
  const pausedRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);

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

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const primary = viewableItems.find((item) => item.isViewable);
      if (primary?.index != null && primary.item) {
        const index = primary.index;
        activeIndexRef.current = index;
        setActiveIndex(index);
      }
    }
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 60,
  }).current;

  useEffect(() => {
    if (ads.length <= 1) {
      return;
    }
    const timer = setInterval(() => {
      if (pausedRef.current) {
        return;
      }
      const nextIndex = (activeIndexRef.current + 1) % ads.length;
      listRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      activeIndexRef.current = nextIndex;
      setActiveIndex(nextIndex);
    }, SPONSOR_AUTO_SCROLL_MS);
    return () => clearInterval(timer);
  }, [ads]);

  const onScrollBeginDrag = useCallback(() => {
    pausedRef.current = true;
  }, []);

  const onMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      pausedRef.current = false;
      const offsetX = event.nativeEvent.contentOffset.x;
      const index = Math.round(offsetX / cardWidth);
      const clamped = Math.max(0, Math.min(index, ads.length - 1));
      activeIndexRef.current = clamped;
      setActiveIndex(clamped);
    },
    [ads, cardWidth]
  );

  const getItemLayout = useCallback(
    (_: ArrayLike<HomeSponsorAd> | null | undefined, index: number) => ({
      length: cardWidth,
      offset: cardWidth * index,
      index,
    }),
    [cardWidth]
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
    <View style={styles.sponsorCarousel}>
      <FlatList
        ref={listRef}
        data={ads}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={cardWidth}
        snapToAlignment="start"
        disableIntervalMomentum
        getItemLayout={getItemLayout}
        onScrollBeginDrag={onScrollBeginDrag}
        onMomentumScrollEnd={onMomentumScrollEnd}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        onScrollToIndexFailed={(info) => {
          listRef.current?.scrollToOffset({
            offset: info.averageItemLength * info.index,
            animated: false,
          });
        }}
        style={{ height: SPONSOR_CARD_HEIGHT }}
      />
    </View>
  );
}
