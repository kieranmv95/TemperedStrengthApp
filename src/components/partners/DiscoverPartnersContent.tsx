import { Pill } from '@/src/components/pill';
import { Colors, FontSize, Spacing } from '@/src/constants/theme';
import type { PartnerListing } from '@/src/types/partner';
import { partnerFavoriteKey } from '@/src/types/partner';
import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PartnerListingCard } from './PartnerListingCard';

type DiscoverTab = 'saved' | 'gym' | 'club' | 'coach';

type DiscoverPartnersContentProps = {
  gymListings: PartnerListing[];
  clubListings: PartnerListing[];
  coachListings: PartnerListing[];
  savedListings: PartnerListing[];
  favoriteKeys: string[];
  onPressListing: (listing: PartnerListing) => void;
  onToggleFavorite: (listing: PartnerListing) => void;
};

export function DiscoverPartnersContent({
  gymListings,
  clubListings,
  coachListings,
  savedListings,
  favoriteKeys,
  onPressListing,
  onToggleFavorite,
}: DiscoverPartnersContentProps) {
  const tabs = useMemo(() => {
    const items: {
      key: DiscoverTab;
      label: string;
      icon?: string;
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

  const activeListings =
    tabs.find((tab) => tab.key === activeTab)?.listings ?? tabs[0]?.listings ?? [];

  const listHeader = (
    <View style={styles.headerContent}>
      <Text style={styles.description}>
        Find local gyms, PT's and coaches near you
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabScrollContent}
      >
        {tabs.map((tab) => (
          <Pill
            key={tab.key}
            onPress={() => setActiveTab(tab.key)}
            isActive={activeTab === tab.key}
            label={tab.label}
            icon={tab.icon}
            count={tab.listings.length}
          />
        ))}
      </ScrollView>
    </View>
  );

  return (
    <FlatList
      data={activeListings}
      keyExtractor={(item) => partnerFavoriteKey(item.kind, item.id)}
      extraData={favoriteKeys}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContent}
      ListHeaderComponent={listHeader}
      renderItem={({ item }) => (
        <PartnerListingCard
          listing={item}
          isFavorite={favoriteKeys.includes(
            partnerFavoriteKey(item.kind, item.id)
          )}
          onPress={onPressListing}
          onToggleFavorite={onToggleFavorite}
        />
      )}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
}

const styles = StyleSheet.create({
  headerContent: {
    gap: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  description: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    lineHeight: 20,
  },
  tabScrollContent: {
    gap: Spacing.md,
  },
  listContent: {
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.section,
  },
  separator: {
    height: Spacing.sm,
  },
});
