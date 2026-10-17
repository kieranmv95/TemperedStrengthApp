import { FilterChip } from '@/src/components/ds';
import { color, space, typography } from '@/src/constants/tokens';
import type { UserCoords } from '@/src/services/discoverLocationService';
import type { PartnerListing } from '@/src/types/partner';
import { partnerFavoriteKey } from '@/src/types/partner';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PartnerListingCard } from './PartnerListingCard';

type DiscoverTab = 'saved' | 'gym' | 'club' | 'coach';

type DiscoverPartnersContentProps = {
  gymListings: PartnerListing[];
  clubListings: PartnerListing[];
  coachListings: PartnerListing[];
  savedListings: PartnerListing[];
  favoriteKeys: string[];
  userCoords?: UserCoords | null;
  onPressListing: (listing: PartnerListing) => void;
  onToggleFavorite: (listing: PartnerListing) => void;
};

function listingsLabel(count: number): string {
  return `${count} listing${count === 1 ? '' : 's'}`;
}

export function DiscoverPartnersContent({
  gymListings,
  clubListings,
  coachListings,
  savedListings,
  favoriteKeys,
  userCoords = null,
  onPressListing,
  onToggleFavorite,
}: DiscoverPartnersContentProps) {
  const insets = useSafeAreaInsets();
  const tabs = useMemo(() => {
    const items: {
      key: DiscoverTab;
      label: string;
      icon?: keyof typeof Ionicons.glyphMap;
      listings: PartnerListing[];
    }[] = [];

    if (savedListings.length > 0) {
      items.push({
        key: 'saved',
        label: 'Saved',
        icon: 'bookmark',
        listings: savedListings,
      });
    }
    if (gymListings.length > 0) {
      items.push({ key: 'gym', label: 'Gyms', listings: gymListings });
    }
    if (clubListings.length > 0) {
      items.push({ key: 'club', label: 'Clubs', listings: clubListings });
    }
    if (coachListings.length > 0) {
      items.push({
        key: 'coach',
        label: 'Coaches',
        listings: coachListings,
      });
    }

    return items;
  }, [coachListings, clubListings, gymListings, savedListings]);

  const [activeTab, setActiveTab] = useState<DiscoverTab>('gym');

  useEffect(() => {
    if (tabs.length === 0) {
      return;
    }
    if (!tabs.some((tab) => tab.key === activeTab)) {
      setActiveTab(tabs[0].key);
    }
  }, [activeTab, tabs]);

  const activeListings = useMemo(
    () =>
      tabs.find((tab) => tab.key === activeTab)?.listings ??
      tabs[0]?.listings ??
      [],
    [activeTab, tabs]
  );

  const listHeader = (
    <View style={styles.headerContent}>
      <Text style={styles.description}>
        Find local gyms, PTs and coaches near you.
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabScroll}
        contentContainerStyle={styles.tabScrollContent}
      >
        {tabs.map((tab) => (
          <FilterChip
            key={tab.key}
            onPress={() => setActiveTab(tab.key)}
            selected={activeTab === tab.key}
            label={tab.label}
            icon={tab.icon}
            count={tab.listings.length}
            accessibilityLabel={`${tab.label}, ${listingsLabel(tab.listings.length)}`}
          />
        ))}
      </ScrollView>
    </View>
  );

  return (
    <FlatList
      data={activeListings}
      keyExtractor={(item) => partnerFavoriteKey(item.kind, item.id)}
      extraData={{ favoriteKeys, userCoords }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.listContent,
        { paddingBottom: insets.bottom + space.xl },
      ]}
      ListHeaderComponent={listHeader}
      renderItem={({ item }) => (
        <PartnerListingCard
          listing={item}
          userCoords={userCoords}
          isFavorite={favoriteKeys.includes(
            partnerFavoriteKey(item.kind, item.id)
          )}
          onPress={onPressListing}
          onToggleFavorite={onToggleFavorite}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  headerContent: {
    gap: space.sm,
    paddingBottom: space.md,
  },
  description: {
    ...typography.callout,
    color: color.textSecondary,
  },
  tabScroll: {
    marginHorizontal: -space.md,
  },
  tabScrollContent: {
    gap: space.xs,
    paddingHorizontal: space.md,
    paddingVertical: space.xxs,
  },
  listContent: {
    paddingHorizontal: space.md,
  },
});
