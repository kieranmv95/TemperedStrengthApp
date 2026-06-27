import { YoutubeEmbed } from '@/src/components/exercise/YoutubeEmbed';
import { PartnerMapPreview } from '@/src/components/partners/PartnerMapPreview';
import { partnerDetailStyles as styles } from '@/src/components/partners/partnerDetailStyles';
import { Pill } from '@/src/components/pill';
import { Colors } from '@/src/constants/theme';
import {
  formatAddressMultiLine,
  formatServiceRadius,
  getPartnerListingCoords,
  isOpenNow,
  orderedOpeningHours,
} from '@/src/services/partnerApiService';
import type { OpeningHours, PartnerKind, PartnerListing } from '@/src/types/partner';
import {
  gymHasVideo,
  gymShowsFocusAreas,
  partnerListingHasAboutContent,
  partnerListingHasVisitContent,
  partnerListingHidesLocation,
  partnerListingOpeningHours,
  partnerVisitTabLabel,
} from '@/src/types/partner';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const KIND_LABELS: Record<PartnerKind, string> = {
  gym: 'Gym',
  club: 'Club',
  coach: 'Coach',
};

type PartnerDetailTab = 'about' | 'visit';

type PartnerDetailBodyProps = {
  listing: PartnerListing;
  onOpenLink: (url: string, label: string) => void;
  onOpenInMaps: () => void;
};

export function PartnerDetailBody({
  listing,
  onOpenLink,
  onOpenInMaps,
}: PartnerDetailBodyProps) {
  const openingHours = partnerListingOpeningHours(listing);
  const openStatus = openingHours ? isOpenNow(openingHours) : null;
  const mapCoords = getPartnerListingCoords(listing);
  const showAbout = partnerListingHasAboutContent(listing);
  const showVisit = partnerListingHasVisitContent(listing);

  const tabs = useMemo(() => {
    const items: { key: PartnerDetailTab; label: string }[] = [];
    if (showAbout) {
      items.push({ key: 'about', label: 'About' });
    }
    if (showVisit) {
      items.push({
        key: 'visit',
        label: partnerVisitTabLabel(listing.kind),
      });
    }
    return items;
  }, [listing.kind, showAbout, showVisit]);

  const [activeTab, setActiveTab] = useState<PartnerDetailTab>('about');

  useEffect(() => {
    setActiveTab('about');
  }, [listing.id, listing.kind]);

  useEffect(() => {
    if (!tabs.some((tab) => tab.key === activeTab)) {
      setActiveTab(tabs[0]?.key ?? 'about');
    }
  }, [activeTab, tabs]);

  const effectiveTab = tabs.length === 1 ? tabs[0].key : activeTab;

  return (
    <>
      <Text style={styles.kindBadge}>{KIND_LABELS[listing.kind]}</Text>
      <View style={styles.titleRow}>
        {openStatus !== null ? (
          <View
            style={[
              styles.openStatusDot,
              openStatus ? styles.openStatusDotOpen : styles.openStatusDotClosed,
            ]}
            accessibilityLabel={openStatus ? 'Open now' : 'Closed'}
          />
        ) : null}
        <Text style={styles.title}>{listing.name}</Text>
      </View>

      {tabs.length > 1 ? (
        <View style={styles.tabRow}>
          {tabs.map((tab) => (
            <View key={tab.key} style={styles.tabRowItem}>
              <Pill
                variant="card"
                onPress={() => setActiveTab(tab.key)}
                isActive={effectiveTab === tab.key}
                label={tab.label}
              />
            </View>
          ))}
        </View>
      ) : null}

      {effectiveTab === 'about' ? (
        <PartnerAboutPanel listing={listing} onOpenLink={onOpenLink} />
      ) : null}

      {effectiveTab === 'visit' ? (
        <PartnerVisitPanel
          listing={listing}
          openingHours={openingHours}
          openStatus={openStatus}
          mapCoords={mapCoords}
          onOpenInMaps={onOpenInMaps}
        />
      ) : null}
    </>
  );
}

type PartnerAboutPanelProps = {
  listing: PartnerListing;
  onOpenLink: (url: string, label: string) => void;
};

function getAboutFocusItems(listing: PartnerListing): string[] {
  if (listing.kind === 'gym' && gymShowsFocusAreas(listing)) {
    return listing.focusAreas;
  }

  if (listing.kind === 'coach' && listing.specialties.length > 0) {
    return listing.specialties;
  }

  return [];
}

function PartnerAboutPanel({ listing, onOpenLink }: PartnerAboutPanelProps) {
  const focusItems = getAboutFocusItems(listing);

  return (
    <View style={styles.tabPanel}>
      {listing.kind === 'gym' && gymHasVideo(listing) ? (
        <View style={styles.videoSection}>
          <YoutubeEmbed
            youtubeId={listing.videoId}
            accessibilityLabel={`Tour video for ${listing.name}`}
          />
        </View>
      ) : null}

      {focusItems.length > 0 ? (
        <View style={styles.focusAreasRow}>
          {focusItems.map((item) => (
            <View key={item} style={styles.focusAreaPill}>
              <Text style={styles.focusAreaPillText}>{item}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {listing.links.length > 0 ? (
        <View style={styles.contentBlock}>
          {listing.links.map((link) => (
            <TouchableOpacity
              key={`${link.label}-${link.url}`}
              style={styles.textLinkRow}
              onPress={() => onOpenLink(link.url, link.label)}
              accessibilityLabel={`Open ${link.label}`}
            >
              <Text style={styles.textLink}>{link.label}</Text>
              <Ionicons name="open-outline" size={16} color={Colors.accent} />
            </TouchableOpacity>
          ))}
        </View>
      ) : null}

      {listing.description ? (
        <View style={styles.contentBlock}>
          <Text style={styles.description}>{listing.description}</Text>
        </View>
      ) : null}
    </View>
  );
}

type PartnerVisitPanelProps = {
  listing: PartnerListing;
  openingHours: OpeningHours | null;
  openStatus: boolean | null;
  mapCoords: { latitude: number; longitude: number } | null;
  onOpenInMaps: () => void;
};

function PartnerVisitPanel({
  listing,
  openingHours,
  openStatus,
  mapCoords,
  onOpenInMaps,
}: PartnerVisitPanelProps) {
  const hidesLocation = partnerListingHidesLocation(listing);

  return (
    <View style={styles.tabPanel}>
      {hidesLocation ? (
        <View style={styles.contentBlock}>
          {openStatus !== null ? (
            <Text
              style={[
                styles.visitStatusLine,
                openStatus ? styles.visitStatusOpen : styles.visitStatusClosed,
              ]}
            >
              {openStatus ? 'Open now' : 'Closed'}
            </Text>
          ) : null}
          <Text style={styles.description}>Exact address not listed publicly.</Text>
          {listing.kind === 'coach' && listing.radiusServedKm != null ? (
            <Text style={styles.description}>
              {formatServiceRadius(listing.radiusServedKm)}
            </Text>
          ) : null}
        </View>
      ) : (
        <View style={styles.addressBlock}>
          {openStatus !== null ? (
            <Text
              style={[
                styles.visitStatusLine,
                openStatus ? styles.visitStatusOpen : styles.visitStatusClosed,
              ]}
            >
              {openStatus ? 'Open now' : 'Closed'}
            </Text>
          ) : null}
          <Text style={styles.sectionTitle}>Address</Text>
          <Text style={styles.addressBody}>
            {formatAddressMultiLine(listing.address)}
          </Text>
          {mapCoords ? (
            <PartnerMapPreview
              latitude={mapCoords.latitude}
              longitude={mapCoords.longitude}
              onPress={onOpenInMaps}
              accessibilityLabel={`View ${listing.name} on map`}
            />
          ) : null}
          {listing.kind === 'coach' && listing.radiusServedKm != null ? (
            <Text style={styles.sectionBody}>
              {formatServiceRadius(listing.radiusServedKm)}
            </Text>
          ) : null}
        </View>
      )}

      {openingHours ? (
        <View style={styles.contentBlock}>
          <Text style={styles.sectionTitle}>Opening hours</Text>
          {orderedOpeningHours(openingHours).map((row) => (
            <View key={row.day} style={styles.hoursRow}>
              <Text style={styles.hoursDay}>{row.label}</Text>
              <Text style={styles.hoursValue}>{row.hours}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}
