import { AppSafeAreaView, AppScrollView, Skeleton } from '@/src/components/ds';
import { PartnerDetailBody } from '@/src/components/partners/PartnerDetailBody';
import { partnerDetailStyles as styles } from '@/src/components/partners/partnerDetailStyles';
import { color } from '@/src/constants/tokens';
import {
  buildPartnerMapsUrl,
  fetchAllPartnerListings,
  getCachedPartnerListing,
  openPartnerEmail,
  openPartnerPhone,
} from '@/src/services/partnerApiService';
import { posthogEventsNames } from '@/src/services/posthogEvents';
import type { PartnerKind, PartnerListing } from '@/src/types/partner';
import { partnerFavoriteKey } from '@/src/types/partner';
import { getFavoritePartners, setFavoritePartners } from '@/src/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, router, useLocalSearchParams } from 'expo-router';
import { usePostHog } from 'posthog-react-native';
import React, { useCallback, useRef, useState } from 'react';
import { Linking, Pressable, Text, View } from 'react-native';

function isPartnerKind(value: string | undefined): value is PartnerKind {
  return value === 'gym' || value === 'club' || value === 'coach';
}

type PartnerDetailHeaderProps = {
  /** Omit to hide the save button, e.g. while loading. */
  save?: {
    listingLabel: string;
    isFavorite: boolean;
    onToggle: () => void;
  };
};

function PartnerDetailHeader({ save }: PartnerDetailHeaderProps) {
  return (
    <View style={styles.header}>
      <Pressable
        style={styles.headerButton}
        onPress={() => router.back()}
        accessibilityRole="button"
        accessibilityLabel="Back"
      >
        <Ionicons name="arrow-back" size={24} color={color.textPrimary} />
      </Pressable>
      {save ? (
        <Pressable
          style={styles.headerButton}
          onPress={save.onToggle}
          accessibilityRole="button"
          accessibilityLabel={`Save ${save.listingLabel}`}
          accessibilityState={{ selected: save.isFavorite }}
        >
          <Ionicons
            name={save.isFavorite ? 'bookmark' : 'bookmark-outline'}
            size={24}
            color={save.isFavorite ? color.gold : color.textPrimary}
          />
        </Pressable>
      ) : null}
    </View>
  );
}

export default function PartnerDetailScreen() {
  const { kind, id } = useLocalSearchParams<{ kind: string; id: string }>();
  const posthog = usePostHog();
  const [listing, setListing] = useState<PartnerListing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const favoritesRef = useRef<string[]>([]);
  const persistChainRef = useRef<Promise<void>>(Promise.resolve());

  const loadListing = useCallback(async () => {
    if (!isPartnerKind(kind) || !id) {
      setListing(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    let resolved = getCachedPartnerListing(kind, id);
    if (!resolved) {
      await fetchAllPartnerListings({ force: true });
      resolved = getCachedPartnerListing(kind, id);
    }

    setListing(resolved);
    setIsLoading(false);

    if (resolved) {
      posthog.capture(posthogEventsNames.content.partnerView, {
        partner_kind: resolved.kind,
        partner_id: resolved.id,
        partner_name: resolved.name,
      });
    }
  }, [id, kind, posthog]);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      void (async () => {
        try {
          const favorites = await getFavoritePartners();
          if (cancelled) {
            return;
          }
          favoritesRef.current = favorites;
          if (isPartnerKind(kind) && id) {
            setIsFavorite(favorites.includes(partnerFavoriteKey(kind, id)));
          }
        } catch (error) {
          console.error('Failed to load favorite partners:', error);
        }

        if (!cancelled) {
          await loadListing();
        }
      })();

      return () => {
        cancelled = true;
      };
    }, [id, kind, loadListing])
  );

  const handleToggleFavorite = () => {
    if (!listing) {
      return;
    }

    const key = partnerFavoriteKey(listing.kind, listing.id);
    const prev = favoritesRef.current;
    const isAdd = !prev.includes(key);
    const next = isAdd ? [...prev, key] : prev.filter((item) => item !== key);

    posthog.capture(posthogEventsNames.content.partnerFavourite, {
      partner_kind: listing.kind,
      partner_id: listing.id,
      action: isAdd ? 'add' : 'remove',
    });

    favoritesRef.current = next;
    setIsFavorite(isAdd);

    persistChainRef.current = persistChainRef.current
      .then(() => setFavoritePartners(next))
      .catch((error) => {
        console.error('Failed to persist favorite partners:', error);
      });
  };

  const handleOpenEmail = (email: string) => {
    if (!listing) {
      return;
    }
    posthog.capture(posthogEventsNames.content.partnerLinkPressed, {
      partner_kind: listing.kind,
      partner_id: listing.id,
      link_label: 'Email',
    });
    void openPartnerEmail(email).catch((error) => {
      console.error('Failed to open partner email:', error);
    });
  };

  const handleOpenPhone = (phone: string) => {
    if (!listing) {
      return;
    }
    posthog.capture(posthogEventsNames.content.partnerLinkPressed, {
      partner_kind: listing.kind,
      partner_id: listing.id,
      link_label: 'Phone',
    });
    void openPartnerPhone(phone).catch((error) => {
      console.error('Failed to open partner phone:', error);
    });
  };

  const handleOpenLink = (url: string, label: string) => {
    if (!listing) {
      return;
    }
    posthog.capture(posthogEventsNames.content.partnerLinkPressed, {
      partner_kind: listing.kind,
      partner_id: listing.id,
      link_label: label,
    });
    Linking.openURL(url).catch((error) => {
      console.error('Failed to open partner link:', error);
    });
  };

  const handleOpenInMaps = () => {
    if (!listing) {
      return;
    }
    const url = buildPartnerMapsUrl(listing);
    if (!url) {
      return;
    }
    handleOpenLink(url, 'View on map');
  };

  if (isLoading) {
    return (
      <AppSafeAreaView style={styles.container}>
        <PartnerDetailHeader />
        <View style={styles.loading}>
          <Skeleton
            width="40%"
            height={16}
            accessibilityLabel="Loading listing"
          />
          <Skeleton width="80%" height={32} />
          <Skeleton width="100%" height={160} radius="md" />
          <Skeleton width="100%" height={96} radius="md" />
        </View>
      </AppSafeAreaView>
    );
  }

  if (!listing || !isPartnerKind(kind)) {
    return (
      <AppSafeAreaView style={styles.container}>
        <PartnerDetailHeader />
        <View style={styles.errorContainer}>
          <Ionicons
            name="business-outline"
            size={48}
            color={color.textTertiary}
          />
          <Text style={styles.errorTitle} accessibilityRole="header">
            Listing not found
          </Text>
          <Pressable
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.backButtonPressed,
            ]}
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Text style={styles.backButtonText}>Go back</Text>
          </Pressable>
        </View>
      </AppSafeAreaView>
    );
  }

  return (
    <AppSafeAreaView style={styles.container}>
      <PartnerDetailHeader
        save={{
          listingLabel: listing.name,
          isFavorite,
          onToggle: handleToggleFavorite,
        }}
      />

      <AppScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <PartnerDetailBody
          listing={listing}
          onOpenLink={handleOpenLink}
          onOpenEmail={handleOpenEmail}
          onOpenPhone={handleOpenPhone}
          onOpenInMaps={handleOpenInMaps}
        />
      </AppScrollView>
    </AppSafeAreaView>
  );
}
