import {
  partnerListingHidesLocation,
  type DayKey,
  type OpeningHours,
  type PartnerKind,
  type PartnerListing,
  type PublicClubListing,
  type PublicCoachListing,
  type PublicGymListing,
  type PublicVenueAddress,
} from '@/src/types/partner';

const API_BASE = __DEV__
  ? 'http://localhost:3000'
  : 'https://temperedstrength.com';

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

export async function fetchGyms(): Promise<PublicGymListing[]> {
  return fetchPartnerList<PublicGymListing>('/api/gyms');
}

function normalizeClubListing(raw: PublicClubListing): PublicClubListing {
  return {
    ...raw,
    hideLocation: raw.hideLocation === true,
  };
}

export async function fetchClubs(): Promise<PublicClubListing[]> {
  const clubs = await fetchPartnerList<PublicClubListing>('/api/clubs');
  return clubs.map(normalizeClubListing);
}

function normalizeCoachListing(
  raw: PublicCoachListing
): PublicCoachListing {
  return {
    ...raw,
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

export function formatLocationSubtitle(address: PublicVenueAddress): string {
  return [address.city, address.postcode].filter(Boolean).join(', ');
}

export function getPartnerListingCoords(
  listing: PartnerListing
): { latitude: number; longitude: number } | null {
  if (partnerListingHidesLocation(listing)) {
    return null;
  }
  const { latitude, longitude } = listing.address;
  if (latitude == null || longitude == null) {
    return null;
  }
  return { latitude, longitude };
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

export function formatServiceRadius(radiusServedKm: number): string {
  return `Serves approximately ${radiusServedKm} km`;
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
  if ('closed' in hours) {
    return false;
  }
  const toMinutes = (time: string) => {
    const [hoursPart, minutesPart] = time.split(':').map(Number);
    return hoursPart * 60 + minutesPart;
  };
  const minutes = now.getHours() * 60 + now.getMinutes();
  return (
    minutes >= toMinutes(hours.open) && minutes < toMinutes(hours.close)
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
  if ('closed' in hours) {
    return 'Closed';
  }
  return `${hours.open} – ${hours.close}`;
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
