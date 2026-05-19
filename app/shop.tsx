import { ShopAdListItem } from '@/src/components/hub/ShopAdListItem';
import { Pill } from '@/src/components/pill';
import { BorderRadius, Colors, FontSize, Spacing } from '@/src/constants/theme';
import { posthogEventsNames } from '@/src/services/posthogEvents';
import {
  loadAllSponsorAds,
  sponsorAdDisplayTitle,
  sponsorAdShopCategories,
  type HomeSponsorAd,
} from '@/src/services/sanitySponsorAds';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { usePostHog } from 'posthog-react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Linking,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ShopScreen() {
  const posthog = usePostHog();
  const [ads, setAds] = useState<HomeSponsorAd[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  useFocusEffect(
    useCallback(() => {
      posthog.capture(posthogEventsNames.content.shopView);

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
    }, [posthog])
  );

  const categories = useMemo(() => sponsorAdShopCategories(ads), [ads]);

  useEffect(() => {
    if (activeCategory !== 'All' && !categories.includes(activeCategory)) {
      setActiveCategory('All');
    }
  }, [activeCategory, categories]);

  const categoryFilters = useMemo(
    () => [{ key: 'all', label: 'All' }, ...categories.map((c) => ({ key: c, label: c }))],
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

  const handlePressAd = useCallback(
    (ad: HomeSponsorAd) => {
      posthog.capture(posthogEventsNames.home.sponsorCtaPressed, {
        sponsor_ad_id: ad.id,
        sponsor_layout: ad.layout,
        source: 'hub_shop',
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

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.centeredState}>
          <ActivityIndicator size="large" color={Colors.accent} />
        </View>
      );
    }

    if (isOffline && ads.length === 0) {
      return (
        <View style={styles.centeredState}>
          <Ionicons
            name="wifi-outline"
            size={64}
            color={Colors.backgroundSubtle}
          />
          <Text style={styles.emptyTitle}>Connect to see the shop</Text>
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
            size={64}
            color={Colors.backgroundSubtle}
          />
          <Text style={styles.emptyTitle}>No products found</Text>
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
        data={filteredAds}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ShopAdListItem ad={item} onPress={handlePressAd} />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={
          <Text style={styles.resultsCount}>
            {filteredAds.length}{' '}
            {filteredAds.length === 1 ? 'product' : 'products'}
          </Text>
        }
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBackButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shop</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color={Colors.textPlaceholder} />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search products..."
            placeholderTextColor={Colors.textPlaceholder}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 ? (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              accessibilityRole="button"
              accessibilityLabel="Clear search"
            >
              <Ionicons
                name="close-circle"
                size={20}
                color={Colors.textPlaceholder}
              />
            </TouchableOpacity>
          ) : null}
        </View>
        <Text style={styles.searchDescription}>
          Products we believe in, partnered to bring you the best prices.
        </Text>
      </View>

      {categories.length > 0 ? (
        <View style={styles.filterContainer}>
          <FlatList
            horizontal
            data={categoryFilters}
            keyExtractor={(item) => item.key}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterList}
            renderItem={({ item }) => {
              const isAll = item.key === 'all';
              const isActive = isAll
                ? activeCategory === 'All'
                : activeCategory === item.key;
              const count = isAll
                ? ads.length
                : ads.filter((ad) => ad.categories.includes(item.key)).length;

              return (
                <Pill
                  onPress={() =>
                    setActiveCategory(isAll ? 'All' : item.key)
                  }
                  isActive={isActive}
                  label={item.label}
                  count={count}
                />
              );
            }}
          />
        </View>
      ) : null}

      {renderContent()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundScreen,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.backgroundElevated,
  },
  headerBackButton: {
    padding: Spacing.xs,
    marginRight: Spacing.md,
  },
  headerTitle: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: FontSize.displayMd,
    fontWeight: '700',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 32,
  },
  searchContainer: {
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
    gap: Spacing.md,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.xxl,
    borderWidth: 1,
    borderColor: Colors.backgroundElevated,
    paddingHorizontal: Spacing.xl,
    height: 44,
    gap: Spacing.md,
  },
  searchInput: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: FontSize.xxl,
    padding: 0,
  },
  searchDescription: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    fontWeight: '500',
    lineHeight: 20,
    paddingHorizontal: Spacing.xs,
  },
  filterContainer: {
    paddingBottom: Spacing.md,
  },
  filterList: {
    paddingHorizontal: Spacing.xxl,
    gap: Spacing.md,
  },
  listContent: {
    paddingHorizontal: Spacing.xxl,
    paddingBottom: Spacing.section,
  },
  separator: {
    height: Spacing.md,
  },
  resultsCount: {
    color: Colors.textMuted,
    fontSize: FontSize.base,
    fontWeight: '600',
    marginBottom: Spacing.lg,
  },
  centeredState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.section,
    gap: Spacing.xxl,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.section,
    paddingTop: Spacing.section,
    gap: Spacing.md,
  },
  emptyTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.displayMd,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptyDescription: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    lineHeight: 20,
    textAlign: 'center',
  },
});
