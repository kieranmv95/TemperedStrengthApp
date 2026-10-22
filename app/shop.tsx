import { FilterChip, Skeleton, StandardLayout } from '@/src/components/ds';
import { ShopAdListItem } from '@/src/components/hub/ShopAdListItem';
import { ShopSponsorAdSheet } from '@/src/components/hub/ShopSponsorAdSheet';
import {
  color,
  MIN_TARGET_SIZE,
  radius,
  space,
  typography,
} from '@/src/constants/tokens';
import { useLargeText } from '@/src/hooks/useLargeText';
import { posthogEventsNames } from '@/src/services/posthogEvents';
import {
  loadAllSponsorAds,
  sponsorAdDisplayTitle,
  sponsorAdShopCategories,
  type HomeSponsorAd,
} from '@/src/services/sanitySponsorAds';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, router } from 'expo-router';
import { usePostHog } from 'posthog-react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SKELETON_TILE_COUNT = 4;
const SKELETON_TILE_HEIGHT = 200;

function productsLabel(count: number): string {
  return `${count} product${count === 1 ? '' : 's'}`;
}

export default function ShopScreen() {
  const posthog = usePostHog();
  const insets = useSafeAreaInsets();
  const largeText = useLargeText();
  const [ads, setAds] = useState<HomeSponsorAd[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedAd, setSelectedAd] = useState<HomeSponsorAd | null>(null);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      void (async () => {
        setIsLoading(true);
        try {
          const data = await loadAllSponsorAds();
          if (cancelled) {
            return;
          }
          setAds(data);
          setIsOffline(false);
        } catch {
          if (cancelled) {
            return;
          }
          setIsOffline(true);
        } finally {
          if (!cancelled) {
            setIsLoading(false);
          }
        }
      })();

      return () => {
        cancelled = true;
      };
    }, [])
  );

  const categories = useMemo(() => sponsorAdShopCategories(ads), [ads]);

  useEffect(() => {
    if (activeCategory !== 'All' && !categories.includes(activeCategory)) {
      setActiveCategory('All');
    }
  }, [activeCategory, categories]);

  const categoryFilters = useMemo(
    () => [
      { key: 'all', label: 'All' },
      ...categories.map((c) => ({ key: c, label: c })),
    ],
    [categories]
  );

  const filteredAds = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return ads.filter((ad) => {
      if (activeCategory !== 'All' && !ad.categories.includes(activeCategory)) {
        return false;
      }
      if (!query) {
        return true;
      }
      const title = sponsorAdDisplayTitle(ad).toLowerCase();
      return (
        title.includes(query) ||
        ad.description.toLowerCase().includes(query) ||
        ad.ctaLabel.toLowerCase().includes(query) ||
        ad.categories.some((category) => category.toLowerCase().includes(query))
      );
    });
  }, [activeCategory, ads, searchQuery]);

  const handlePressAd = useCallback((ad: HomeSponsorAd) => {
    setSelectedAd(ad);
  }, []);

  const handleCloseSheet = useCallback(() => {
    setSelectedAd(null);
  }, []);

  const handlePressCta = useCallback(
    (ad: HomeSponsorAd) => {
      posthog.capture(posthogEventsNames.home.sponsorCtaPressed, {
        sponsor_ad_id: ad.id,
        sponsor_layout: ad.layout,
        source: 'hub_shop_detail',
      });
      const url = ad.affiliateUrl.trim();
      if (url.length === 0) {
        return;
      }
      Linking.openURL(url).catch((error) => {
        console.error('Failed to open sponsor URL:', error);
      });
    },
    [posthog]
  );

  const columns = largeText ? 1 : 2;
  const gridCellStyle = [
    styles.gridCell,
    largeText ? styles.gridCellFull : styles.gridCellHalf,
  ];
  const bottomPadding = { paddingBottom: insets.bottom + space.xl };

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={[styles.grid, styles.listContent]}>
          {Array.from({ length: SKELETON_TILE_COUNT }, (_, index) => (
            <View key={index} style={gridCellStyle}>
              <Skeleton
                width="100%"
                height={SKELETON_TILE_HEIGHT}
                radius="md"
                accessibilityLabel={
                  index === 0 ? 'Loading products' : undefined
                }
              />
            </View>
          ))}
        </View>
      );
    }

    if (isOffline && ads.length === 0) {
      return (
        <View style={styles.centeredState}>
          <Ionicons
            name="cloud-offline-outline"
            size={48}
            color={color.textTertiary}
          />
          <Text style={styles.emptyTitle} accessibilityRole="header">
            Connect to see the shop
          </Text>
          <Text style={styles.emptyDescription}>
            Partner products need a connection to load. Previously viewed items
            may appear when you were last online.
          </Text>
        </View>
      );
    }

    if (filteredAds.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Ionicons
            name="search-outline"
            size={48}
            color={color.textTertiary}
          />
          <Text style={styles.emptyTitle} accessibilityRole="header">
            No products found
          </Text>
          <Text style={styles.emptyDescription}>
            {searchQuery.trim() || activeCategory !== 'All'
              ? 'Try a different search or category.'
              : 'No partner offers are available right now.'}
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        key={`grid-${columns}`}
        data={filteredAds}
        numColumns={columns}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={gridCellStyle}>
            <ShopAdListItem ad={item} onPress={handlePressAd} />
          </View>
        )}
        contentContainerStyle={[styles.listContent, bottomPadding]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <Text style={styles.resultsCount}>
            {productsLabel(filteredAds.length)}
          </Text>
        }
      />
    );
  };

  return (
    <StandardLayout
      title="Shop"
      subtitle="Products we believe in, partnered to bring you the best prices."
      onBackPress={() => router.back()}
      disableScroll
      edgeToEdgeBody
    >
      <StandardLayout.Filters>
        <View style={styles.search}>
          <Ionicons name="search" size={18} color={color.textSecondary} />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search products"
            placeholderTextColor={color.textTertiary}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            accessibilityLabel="Search products"
          />
          {searchQuery.length > 0 ? (
            <Pressable
              onPress={() => setSearchQuery('')}
              style={styles.clearSearch}
              accessibilityRole="button"
              accessibilityLabel="Clear search"
            >
              <Ionicons
                name="close-circle"
                size={20}
                color={color.textSecondary}
              />
            </Pressable>
          ) : null}
        </View>

        {categories.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.chipScroll}
            contentContainerStyle={styles.chipRow}
          >
            {categoryFilters.map((item) => {
              const isAll = item.key === 'all';
              const isActive = isAll
                ? activeCategory === 'All'
                : activeCategory === item.key;
              const count = isAll
                ? ads.length
                : ads.filter((ad) => ad.categories.includes(item.key)).length;

              return (
                <FilterChip
                  key={item.key}
                  onPress={() => setActiveCategory(isAll ? 'All' : item.key)}
                  selected={isActive}
                  label={item.label}
                  count={count}
                  accessibilityLabel={`${item.label}, ${productsLabel(count)}`}
                />
              );
            })}
          </ScrollView>
        ) : null}
      </StandardLayout.Filters>

      <StandardLayout.Body>
        {renderContent()}

        <ShopSponsorAdSheet
          ad={selectedAd}
          visible={selectedAd !== null}
          onClose={handleCloseSheet}
          onPressCta={handlePressCta}
        />
      </StandardLayout.Body>
    </StandardLayout>
  );
}

const styles = StyleSheet.create({
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    minHeight: MIN_TARGET_SIZE + space.xxs,
    paddingLeft: space.sm,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: color.borderStrong,
    backgroundColor: color.surface2,
  },
  searchInput: {
    ...typography.body,
    flex: 1,
    color: color.textPrimary,
    paddingVertical: space.xs,
  },
  clearSearch: {
    width: MIN_TARGET_SIZE,
    height: MIN_TARGET_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipScroll: {
    marginHorizontal: -space.md,
  },
  chipRow: {
    gap: space.xs,
    paddingHorizontal: space.md,
    paddingVertical: space.xxs,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  listContent: {
    paddingHorizontal: space.md - space.xxs,
    paddingTop: space.xs,
  },
  gridCell: {
    paddingHorizontal: space.xxs,
    paddingBottom: space.xs,
  },
  gridCellHalf: {
    width: '50%',
  },
  gridCellFull: {
    width: '100%',
  },
  resultsCount: {
    ...typography.captionStrong,
    fontVariant: ['tabular-nums'],
    color: color.textSecondary,
    paddingHorizontal: space.xxs,
    marginBottom: space.sm,
  },
  centeredState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.xxl,
    gap: space.xs,
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: space.xxl,
    paddingTop: space.xxl,
    gap: space.xs,
  },
  emptyTitle: {
    ...typography.title2,
    color: color.textPrimary,
    textAlign: 'center',
  },
  emptyDescription: {
    ...typography.callout,
    color: color.textSecondary,
    textAlign: 'center',
  },
});
