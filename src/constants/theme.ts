import { color } from './tokens';

/**
 * Colours outside the "Forged" token set: Award icon artwork and the Sanity
 * schema defaults for the remote notification banner (the CMS may override
 * them). New UI code should import from `tokens.ts`.
 */
export const Colors = {
  textPrimary: color.textPrimary,
  textBlack: '#000000',

  // Remote notification banner (Sanity schema defaults; CMS may override)
  remoteNotificationBorder: '#2a3142',
  remoteNotificationBackground: '#1a1f2b',
  remoteNotificationDescription: '#cbd5e1',
  remoteNotificationCta: '#d4b96a',
  remoteNotificationCtaText: '#1a1f2b',

  // Award icon (react-native-svg)
  awardShadowRaised: 'rgba(0,0,0,0.22)',
  awardShadowSurface: 'rgba(0,0,0,0.16)',
  awardShadowSoft: 'rgba(0,0,0,0.10)',
  awardShadowRivet: 'rgba(0,0,0,0.32)',
  awardHighlight06: 'rgba(255,255,255,0.06)',
  awardBannerText: 'rgba(0,0,0,0.38)',
};

export type AwardIconVariantKey = 'bronze' | 'silver' | 'platinum';

type AwardTierPalette = {
  shieldBase: string;
  borderTop: string;
  borderBottom: string;
  bannerBase: string;
  bannerText: string;
  trophy: string;
};

export const AwardIconPalettes: Record<AwardIconVariantKey, AwardTierPalette> =
  {
    platinum: {
      shieldBase: '#1B3A5C',
      borderTop: '#A8C8E8',
      borderBottom: '#4A7AAE',
      bannerBase: '#5B92C4',
      bannerText: Colors.awardBannerText,
      trophy: Colors.textPrimary,
    },
    silver: {
      shieldBase: '#58667A',
      borderTop: '#D0D8E8',
      borderBottom: '#7888A0',
      bannerBase: '#C8D0DA',
      bannerText: Colors.awardBannerText,
      trophy: Colors.textPrimary,
    },
    bronze: {
      shieldBase: '#A24A27',
      borderTop: '#DCA870',
      borderBottom: '#A06030',
      bannerBase: '#D6862A',
      bannerText: Colors.awardBannerText,
      trophy: Colors.textPrimary,
    },
  };
