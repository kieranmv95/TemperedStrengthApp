/** Days used in openingHours (gyms & clubs only). */
export type DayKey =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export type DayHours =
  | { open: string; close: string }
  | { closed: true };

export type OpeningHours = Record<DayKey, DayHours>;

export type PublicLink = {
  label: string;
  url: string;
};

export type PublicVenueAddress = {
  line1: string;
  line2: string | null;
  city: string;
  county: string | null;
  postcode: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
};

export type PublicListingBase = {
  id: string;
  name: string;
  description: string | null;
  address: PublicVenueAddress;
  links: PublicLink[];
  approvedAt: string | null;
  updatedAt: string;
};

export type PublicGymListing = PublicListingBase & {
  openingHours: OpeningHours;
};

export type PublicClubListing = PublicListingBase & {
  openingHours: OpeningHours;
  hideLocation: boolean;
};

export type PublicCoachListing = PublicListingBase & {
  specialties: string[];
  radiusServedKm: number | null;
  hideLocation: boolean;
};

export type PartnerKind = 'gym' | 'club' | 'coach';

export type PartnerListing =
  | (PublicGymListing & { kind: 'gym' })
  | (PublicClubListing & { kind: 'club' })
  | (PublicCoachListing & { kind: 'coach' });

export function partnerListingHidesLocation(listing: PartnerListing): boolean {
  if (listing.kind === 'gym') {
    return false;
  }
  return listing.hideLocation;
}

export function partnerFavoriteKey(kind: PartnerKind, id: string): string {
  return `partner:${kind}:${id}`;
}

export function parsePartnerFavoriteKey(
  key: string
): { kind: PartnerKind; id: string } | null {
  const match = /^partner:(gym|club|coach):(.+)$/.exec(key);
  if (!match) {
    return null;
  }
  return { kind: match[1] as PartnerKind, id: match[2] };
}
