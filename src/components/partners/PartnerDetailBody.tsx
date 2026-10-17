import { Badge, FilterChip, Tag } from '@/src/components/ds';
import { GymLeadMedia } from '@/src/components/partners/GymLeadMedia';
import { partnerDetailStyles as styles } from '@/src/components/partners/partnerDetailStyles';
import { color } from '@/src/constants/tokens';
import {
  formatAddressMultiLine,
  formatServiceRadius,
  getPartnerListingCoords,
  isOpenNow,
  orderedOpeningHours,
} from '@/src/services/partnerApiService';
import type {
  OpeningHours,
  PartnerKind,
  PartnerListing,
} from '@/src/types/partner';
import {
  gymHasLeadMedia,
  gymShowsFocusAreas,
  partnerListingHasAboutContent,
  partnerListingHasContact,
  partnerListingHasVisitContent,
  partnerListingHidesLocation,
  partnerListingOpeningHours,
  partnerVisitTabLabel,
} from '@/src/types/partner';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

const KIND_LABELS: Record<PartnerKind, string> = {
  gym: 'Gym',
  club: 'Club',
  coach: 'Coach',
};

type PartnerDetailTab = 'about' | 'visit';

type PartnerDetailBodyProps = {
  listing: PartnerListing;
  onOpenLink: (url: string, label: string) => void;
  onOpenEmail: (email: string) => void;
  onOpenPhone: (phone: string) => void;
  onOpenInMaps: () => void;
};

type OpenStatusBadgeProps = {
  isOpen: boolean;
};

function OpenStatusBadge({ isOpen }: OpenStatusBadgeProps) {
  return (
    <Badge
      label={isOpen ? 'Open now' : 'Closed'}
      tone={isOpen ? 'success' : 'danger'}
    />
  );
}

export function PartnerDetailBody({
  listing,
  onOpenLink,
  onOpenEmail,
  onOpenPhone,
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
      <View style={styles.heading}>
        <Text style={styles.kindLabel}>{KIND_LABELS[listing.kind]}</Text>
        <Text style={styles.title} accessibilityRole="header">
          {listing.name}
        </Text>
        {openStatus !== null ? (
          <View style={styles.statusRow}>
            <OpenStatusBadge isOpen={openStatus} />
          </View>
        ) : null}
      </View>

      {tabs.length > 1 ? (
        <View style={styles.tabRow}>
          {tabs.map((tab) => (
            <FilterChip
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              selected={effectiveTab === tab.key}
              label={tab.label}
            />
          ))}
        </View>
      ) : null}

      {effectiveTab === 'about' ? (
        <PartnerAboutPanel
          listing={listing}
          onOpenLink={onOpenLink}
          onOpenEmail={onOpenEmail}
          onOpenPhone={onOpenPhone}
        />
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
  onOpenEmail: (email: string) => void;
  onOpenPhone: (phone: string) => void;
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

function PartnerAboutPanel({
  listing,
  onOpenLink,
  onOpenEmail,
  onOpenPhone,
}: PartnerAboutPanelProps) {
  const focusItems = getAboutFocusItems(listing);

  return (
    <View style={styles.tabPanel}>
      {listing.kind === 'gym' && gymHasLeadMedia(listing) ? (
        <GymLeadMedia gym={listing} />
      ) : null}

      {focusItems.length > 0 ? (
        <View style={styles.tagsRow}>
          {focusItems.map((item) => (
            <Tag key={item} label={item} />
          ))}
        </View>
      ) : null}

      {listing.links.length > 0 ? (
        <View style={styles.linkList}>
          {listing.links.map((link, index) => (
            <Pressable
              key={`${link.label}-${link.url}`}
              style={({ pressed }) => [
                styles.linkRow,
                index > 0 && styles.linkRowDivider,
                pressed && styles.linkRowPressed,
              ]}
              onPress={() => onOpenLink(link.url, link.label)}
              accessibilityRole="link"
              accessibilityLabel={link.label}
              accessibilityHint="Opens in your browser"
            >
              <Text style={styles.linkText}>{link.label}</Text>
              <Ionicons
                name="open-outline"
                size={18}
                color={color.textSecondary}
              />
            </Pressable>
          ))}
        </View>
      ) : null}

      <PartnerContactBlock
        listing={listing}
        onOpenEmail={onOpenEmail}
        onOpenPhone={onOpenPhone}
      />

      {listing.description ? (
        <View style={styles.contentBlock}>
          <Text style={styles.description}>{listing.description}</Text>
        </View>
      ) : null}
    </View>
  );
}

type PartnerContactBlockProps = {
  listing: PartnerListing;
  onOpenEmail: (email: string) => void;
  onOpenPhone: (phone: string) => void;
};

function PartnerContactBlock({
  listing,
  onOpenEmail,
  onOpenPhone,
}: PartnerContactBlockProps) {
  if (!partnerListingHasContact(listing)) {
    return null;
  }

  return (
    <View style={styles.contentBlock}>
      <Text style={styles.sectionTitle} accessibilityRole="header">
        Contact
      </Text>
      {listing.email ? (
        <Pressable
          style={({ pressed }) => [
            styles.contactRow,
            pressed && styles.contactRowPressed,
          ]}
          onPress={() => {
            const email = listing.email;
            if (email) {
              onOpenEmail(email);
            }
          }}
          accessibilityLabel={`Email ${listing.name}, ${listing.email}`}
          accessibilityRole="link"
        >
          <Ionicons name="mail-outline" size={18} color={color.textSecondary} />
          <Text style={styles.contactValue}>{listing.email}</Text>
        </Pressable>
      ) : null}
      {listing.phone ? (
        <Pressable
          style={({ pressed }) => [
            styles.contactRow,
            pressed && styles.contactRowPressed,
          ]}
          onPress={() => {
            const phone = listing.phone;
            if (phone) {
              onOpenPhone(phone);
            }
          }}
          accessibilityLabel={`Call ${listing.name}, ${listing.phone}`}
          accessibilityRole="link"
        >
          <Ionicons name="call-outline" size={18} color={color.textSecondary} />
          <Text style={styles.contactValue}>{listing.phone}</Text>
        </Pressable>
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
          {openStatus !== null ? <OpenStatusBadge isOpen={openStatus} /> : null}
          <Text style={styles.sectionBody}>
            Exact address not listed publicly.
          </Text>
          {listing.kind === 'coach' && listing.radiusServedKm != null ? (
            <Text style={styles.sectionBody}>
              {formatServiceRadius(listing.radiusServedKm)}
            </Text>
          ) : null}
        </View>
      ) : (
        <View style={styles.contentBlock}>
          {openStatus !== null ? <OpenStatusBadge isOpen={openStatus} /> : null}
          <Text style={styles.sectionTitle} accessibilityRole="header">
            Address
          </Text>
          <Text style={styles.addressBody}>
            {formatAddressMultiLine(listing.address)}
          </Text>
          {mapCoords ? (
            <Pressable
              style={({ pressed }) => [
                styles.contactRow,
                pressed && styles.contactRowPressed,
              ]}
              onPress={onOpenInMaps}
              accessibilityRole="link"
              accessibilityLabel={`Open ${listing.name} in Maps`}
            >
              <Ionicons
                name="map-outline"
                size={18}
                color={color.textSecondary}
              />
              <Text style={styles.contactValue}>Open in Maps</Text>
            </Pressable>
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
          <Text style={styles.sectionTitle} accessibilityRole="header">
            Opening hours
          </Text>
          {orderedOpeningHours(openingHours).map((row) => (
            <View
              key={row.day}
              style={styles.hoursRow}
              accessible
              accessibilityLabel={`${row.label}, ${row.hours}`}
            >
              <Text style={styles.hoursDay}>{row.label}</Text>
              <Text style={styles.hoursValue}>{row.hours}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}
