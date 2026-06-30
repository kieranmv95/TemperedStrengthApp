import * as Linking from 'expo-linking';
import { Alert, Platform } from 'react-native';

import {
  partnerListingHidesLocation,
  type DayHours,
  type DayKey,
  type OpeningHours,
  type PartnerKind,
  type PartnerListing,
  type PublicClubListing,
  type PublicCoachListing,
  type PublicGymListing,
  type PublicMapMarker,
  type PublicVenueAddress,
} from '@/src/types/partner';
import type { PartnerMapPoint } from '@/src/utils/partnerMapClustering';

const API_BASE = 'https://temperedstrength.com';

const PARTNER_CACHE_TTL_MS = 5 * 60 * 1000;

type PartnerCache = {
  gyms: PublicGymListing[];
  clubs: PublicClubListing[];
  coaches: PublicCoachListing[];
  fetchedAt: number;
};

let partnerCache: PartnerCache | null = null;

async function fetchPartnerList<T>(path: string): Promise<T[]> {
  try {
    const response = await fetch(`${API_BASE}${path}`);
    if (!response.ok) {
      if (__DEV__) {
        console.warn(`Partner fetch failed (${path}): ${response.status}`);
      }
      return [];
    }
    const data = (await response.json()) as T[];
    return Array.isArray(data) ? data : [];
  } catch (error) {
    if (__DEV__) {
      console.warn(`Partner fetch error (${path}):`, error);
    }
    return [];
  }
}

function normalizeContactFields(raw: {
  email?: unknown;
  phone?: unknown;
}): { email: string | null; phone: string | null } {
  return {
    email:
      typeof raw.email === 'string' && raw.email.trim().length > 0
        ? raw.email.trim()
        : null,
    phone:
      typeof raw.phone === 'string' && raw.phone.trim().length > 0
        ? raw.phone.trim()
        : null,
  };
}

function normalizeMapMarker(raw: unknown): PublicMapMarker | null {
  if (!raw || typeof raw !== 'object') {
    return null;
  }

  const marker = raw as Record<string, unknown>;
  const latitude = typeof marker.latitude === 'number' ? marker.latitude : null;
  const longitude =
    typeof marker.longitude === 'number' ? marker.longitude : null;

  if (latitude == null || longitude == null) {
    return null;
  }

  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    return null;
  }

  return { latitude, longitude };
}

function normalizeListingBaseFields(raw: {
  email?: unknown;
  phone?: unknown;
  mapMarker?: unknown;
  imageUrl?: unknown;
}): {
  email: string | null;
  phone: string | null;
  mapMarker: PublicMapMarker | null;
  imageUrl: string | null;
} {
  return {
    ...normalizeContactFields(raw),
    mapMarker: normalizeMapMarker(raw.mapMarker),
    imageUrl:
      typeof raw.imageUrl === 'string' && raw.imageUrl.trim().length > 0
        ? raw.imageUrl.trim()
        : null,
  };
}

function normalizeGymListing(raw: PublicGymListing): PublicGymListing {
  const videoId =
    typeof raw.videoId === 'string' && raw.videoId.length > 0
      ? raw.videoId
      : null;
  return {
    ...raw,
    ...normalizeListingBaseFields(raw),
    focusAreas: Array.isArray(raw.focusAreas) ? raw.focusAreas : [],
    videoId,
  };
}

export async function fetchGyms(): Promise<PublicGymListing[]> {
  const gyms = await fetchPartnerList<PublicGymListing>('/api/gyms');
  return gyms.map(normalizeGymListing);
}

function normalizeClubListing(raw: PublicClubListing): PublicClubListing {
  const hasOpeningHours = raw.hasOpeningHours === true;
  return {
    ...raw,
    ...normalizeListingBaseFields(raw),
    hideLocation: raw.hideLocation === true,
    hasOpeningHours,
    openingHours: hasOpeningHours ? raw.openingHours : undefined,
  };
}

export async function fetchClubs(): Promise<PublicClubListing[]> {
  const clubs = await fetchPartnerList<PublicClubListing>('/api/clubs');
  return clubs.map(normalizeClubListing);
}

function normalizeCoachListing(raw: PublicCoachListing): PublicCoachListing {
  return {
    ...raw,
    ...normalizeListingBaseFields(raw),
    specialties: Array.isArray(raw.specialties) ? raw.specialties : [],
    radiusServedKm:
      typeof raw.radiusServedKm === 'number' ? raw.radiusServedKm : null,
    hideLocation: raw.hideLocation === true,
  };
}

export async function fetchCoaches(): Promise<PublicCoachListing[]> {
  const coaches = await fetchPartnerList<PublicCoachListing>('/api/coaches');
  return coaches.map(normalizeCoachListing);
}

export async function fetchAllPartnerListings(options?: {
  force?: boolean;
}): Promise<{
  gyms: PublicGymListing[];
  clubs: PublicClubListing[];
  coaches: PublicCoachListing[];
}> {
  const now = Date.now();
  if (
    !options?.force &&
    partnerCache &&
    now - partnerCache.fetchedAt < PARTNER_CACHE_TTL_MS
  ) {
    return {
      gyms: partnerCache.gyms,
      clubs: partnerCache.clubs,
      coaches: partnerCache.coaches,
    };
  }

  const [gyms, clubs, coaches] = await Promise.all([
    fetchGyms(),
    fetchClubs(),
    fetchCoaches(),
  ]);

  partnerCache = { gyms, clubs, coaches, fetchedAt: now };
  return { gyms, clubs, coaches };
}

export function getCachedPartnerListing(
  kind: PartnerKind,
  id: string
): PartnerListing | null {
  if (!partnerCache) {
    return null;
  }

  if (kind === 'gym') {
    const gym = partnerCache.gyms.find((item) => item.id === id);
    return gym ? { ...gym, kind: 'gym' } : null;
  }

  if (kind === 'club') {
    const club = partnerCache.clubs.find((item) => item.id === id);
    return club ? { ...club, kind: 'club' } : null;
  }

  const coach = partnerCache.coaches.find((item) => item.id === id);
  return coach ? { ...coach, kind: 'coach' } : null;
}

export function formatAddressOneLine(address: PublicVenueAddress): string {
  const parts = [
    address.line1,
    address.line2,
    address.city,
    address.postcode,
  ].filter(Boolean);
  return parts.join(', ');
}

export function formatAddressMultiLine(address: PublicVenueAddress): string {
  const lines = [
    address.line1,
    address.line2,
    [address.city, address.county].filter(Boolean).join(', '),
    address.postcode,
    address.country === 'GB' ? 'United Kingdom' : address.country,
  ].filter(Boolean);
  return lines.join('\n');
}


export function getPartnerMapPoints(listings: PartnerListing[]): PartnerMapPoint[] {
  const points = [];

  for (const listing of listings) {
    const coords = getPartnerListingCoords(listing);
    if (!coords) {
      continue;
    }

    points.push({
      listingId: listing.id,
      kind: listing.kind,
      name: listing.name,
      latitude: coords.latitude,
      longitude: coords.longitude,
    });
  }

  return points;
}

export function formatLocationSubtitle(address: PublicVenueAddress): string {
  return [address.city, address.postcode].filter(Boolean).join(', ');
}

export function getPartnerListingCoords(
  listing: PartnerListing
): { latitude: number; longitude: number } | null {
  if (partnerListingHidesLocation(listing)) {
    return null;
  }

  if (listing.mapMarker) {
    return {
      latitude: listing.mapMarker.latitude,
      longitude: listing.mapMarker.longitude,
    };
  }

  const { latitude, longitude } = listing.address;
  if (latitude == null || longitude == null) {
    return null;
  }

  return { latitude, longitude };
}

export function buildPartnerMapsUrl(listing: PartnerListing): string | null {
  const coords = getPartnerListingCoords(listing);
  if (!coords) {
    return null;
  }

  const { latitude, longitude } = coords;
  const coordsParam = `${latitude},${longitude}`;
  const label = encodeURIComponent(listing.name);

  if (Platform.OS === 'ios') {
    return `http://maps.apple.com/?ll=${coordsParam}&q=${label}`;
  }

  if (Platform.OS === 'android') {
    return `geo:${coordsParam}?q=${coordsParam}(${label})`;
  }

  return `https://www.google.com/maps/search/?api=1&query=${coordsParam}`;
}

function haversineDistanceKm(
  from: { latitude: number; longitude: number },
  to: { latitude: number; longitude: number }
): number {
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRadians(to.latitude - from.latitude);
  const dLon = toRadians(to.longitude - from.longitude);
  const lat1 = toRadians(from.latitude);
  const lat2 = toRadians(to.latitude);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function comparePartnerListingsByDistance(
  a: PartnerListing,
  b: PartnerListing,
  origin: { latitude: number; longitude: number }
): number {
  const aCoords = getPartnerListingCoords(a);
  const bCoords = getPartnerListingCoords(b);

  if (!aCoords && !bCoords) {
    return a.name.localeCompare(b.name);
  }
  if (!aCoords) {
    return 1;
  }
  if (!bCoords) {
    return -1;
  }

  const distanceDelta =
    haversineDistanceKm(origin, aCoords) - haversineDistanceKm(origin, bCoords);
  if (distanceDelta !== 0) {
    return distanceDelta;
  }
  return a.name.localeCompare(b.name);
}

export function sortPartnerListingsByDistance(
  listings: PartnerListing[],
  origin: { latitude: number; longitude: number }
): PartnerListing[] {
  return [...listings].sort((a, b) =>
    comparePartnerListingsByDistance(a, b, origin)
  );
}

export function getPartnerListingDistanceKm(
  listing: PartnerListing,
  origin: { latitude: number; longitude: number }
): number | null {
  const coords = getPartnerListingCoords(listing);
  if (!coords) {
    return null;
  }
  return haversineDistanceKm(origin, coords);
}

export function formatPartnerDistanceKm(distanceKm: number): string {
  if (distanceKm < 1) {
    const metres = Math.max(1, Math.round(distanceKm * 1000));
    return `${metres} m away`;
  }
  if (distanceKm < 10) {
    return `${distanceKm.toFixed(1)} km away`;
  }
  return `${Math.round(distanceKm)} km away`;
}

export function formatServiceRadius(radiusServedKm: number): string {
  return `Serves approximately ${radiusServedKm} km`;
}

function getDayOpenHours(
  hours: DayHours
): { open: string; close: string } | null {
  if ('closed' in hours || 'off' in hours) {
    return null;
  }
  const open = hours.open.trim().toLowerCase();
  const close = hours.close.trim().toLowerCase();
  if (
    open === 'off' ||
    open === 'closed' ||
    close === 'off' ||
    close === 'closed'
  ) {
    return null;
  }
  return hours;
}

function isDayClosed(hours: DayHours | undefined): boolean {
  if (!hours) {
    return false;
  }
  return getDayOpenHours(hours) === null;
}

export function isOpenNow(
  openingHours: OpeningHours,
  now = new Date()
): boolean | null {
  const days: DayKey[] = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ];
  const key = days[now.getDay()];
  const hours = openingHours[key];
  if (!hours) {
    return null;
  }
  if (isDayClosed(hours)) {
    return false;
  }
  const openHours = getDayOpenHours(hours);
  if (!openHours) {
    return false;
  }
  const toMinutes = (time: string) => {
    const [hoursPart, minutesPart] = time.split(':').map(Number);
    return hoursPart * 60 + minutesPart;
  };
  const minutes = now.getHours() * 60 + now.getMinutes();
  return (
    minutes >= toMinutes(openHours.open) && minutes < toMinutes(openHours.close)
  );
}

const DAY_ORDER: DayKey[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

const DAY_REFERENCE: Record<DayKey, Date> = {
  monday: new Date(2024, 0, 1),
  tuesday: new Date(2024, 0, 2),
  wednesday: new Date(2024, 0, 3),
  thursday: new Date(2024, 0, 4),
  friday: new Date(2024, 0, 5),
  saturday: new Date(2024, 0, 6),
  sunday: new Date(2024, 0, 7),
};

export function formatDayLabel(day: DayKey): string {
  return new Intl.DateTimeFormat(undefined, { weekday: 'long' }).format(
    DAY_REFERENCE[day]
  );
}

export function formatOpeningHoursLine(
  day: DayKey,
  hours: OpeningHours[DayKey]
): string {
  const openHours = getDayOpenHours(hours);
  if (!openHours) {
    return 'Closed';
  }
  return `${openHours.open} – ${openHours.close}`;
}

export function orderedOpeningHours(
  openingHours: OpeningHours
): { day: DayKey; label: string; hours: string }[] {
  return DAY_ORDER.map((day) => ({
    day,
    label: formatDayLabel(day),
    hours: formatOpeningHoursLine(day, openingHours[day]),
  }));
}

function sanitizePhoneDigits(phone: string): string {
  return phone.replace(/[^\d+]/g, '');
}

export function buildPartnerTelUrl(phone: string): string {
  const digits = sanitizePhoneDigits(phone);
  if (Platform.OS === 'ios') {
    return `telprompt:${digits}`;
  }
  return `tel:${digits}`;
}

export function buildPartnerMailtoUrl(email: string): string {
  return `mailto:${email.trim()}`;
}

async function tryOpenUrl(url: string): Promise<boolean> {
  try {
    await Linking.openURL(url);
    return true;
  } catch {
    return false;
  }
}

export async function openPartnerEmail(email: string): Promise<void> {
  const trimmed = email.trim();
  const url = buildPartnerMailtoUrl(trimmed);
  if (await tryOpenUrl(url)) {
    return;
  }

  Alert.alert('Email', trimmed, [{ text: 'OK' }]);
}

export async function openPartnerPhone(phone: string): Promise<void> {
  const digits = sanitizePhoneDigits(phone);
  const urls =
    Platform.OS === 'ios'
      ? [`telprompt:${digits}`, `tel:${digits}`]
      : [`tel:${digits}`];

  for (const url of urls) {
    if (await tryOpenUrl(url)) {
      return;
    }
  }

  Alert.alert('Phone', phone.trim(), [{ text: 'OK' }]);
}
