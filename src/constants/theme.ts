export const Colors = {
  // Backgrounds
  backgroundScreen: '#121212',
  backgroundCard: '#1E1E1E',
  /** Workout header timer strips (session + rest) */
  timerBarBackground: '#1A1A1A',
  /** Raised surfaces and default borders (same tone) */
  backgroundElevated: '#2A2A2A',
  /** Muted fills and soft borders (same tone) */
  backgroundSubtle: '#333',
  backgroundBorder: '#3A3A3A',

  // Overlays
  overlay: 'rgba(0, 0, 0, 0.8)',
  overlayLight: 'rgba(0,0,0,0.45)',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#CCCCCC',
  textMuted: '#888888',
  textPlaceholder: '#666666',
  textOnAccent: '#121212',
  textOnDark: '#444444',
  textBlack: '#000000',

  // Accent / brand
  accent: '#C9B072',
  /** Same hue as `accent` (#C9B072 → rgb 201, 176, 114) */
  accentOverlay: 'rgba(201, 176, 114, 0.9)',
  /** Translucent accent fills */
  accentWashFill: 'rgba(201, 176, 114, 0.12)',
  /** Translucent accent borders and rings */
  accentWashBorder: 'rgba(201, 176, 114, 0.25)',
  /** Strong accent outline (e.g. hollow badges) */
  accentWashOutline: 'rgba(201, 176, 114, 0.45)',

  // Recommended (personalization signal — intentionally distinct from accent)
  recommended: '#1abc9c',

  // Semantic
  destructive: '#FF6B6B',
  destructiveWashFill: 'rgba(255, 107, 107, 0.12)',

  // Tab bar
  tabIconDefault: '#9BA1A6',

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

export const Spacing = {
  xxs: 3,
  xs: 4,
  sm: 6,
  md: 8,
  lg: 10,
  xl: 12,
  xxl: 16,
  xxxl: 20,
  section: 24,
};

export const BorderRadius = {
  xs: 3,
  sm: 4,
  md: 6,
  lg: 8,
  xl: 10,
  xxl: 12,
  xxxl: 14,
  full: 16,
  pill: 20,
};

export const FontSize = {
  xs: 9,
  xxs: 10,
  sm: 11,
  md: 12,
  base: 13,
  lg: 14,
  xl: 15,
  xxl: 16,
  xxxl: 17,
  displaySm: 18,
  displayMd: 20,
  displayLg: 22,
  displayXl: 24,
  displayXXl: 28,
  displayXXXl: 32,
  hero: 36,
};
