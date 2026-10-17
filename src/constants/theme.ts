import { color } from './tokens';

/**
 * Legacy palette for screens not yet moved to `tokens.ts`. Values point at the
 * "Forged" tokens where a direct equivalent exists so every screen shares one
 * palette; new code should import from `tokens.ts` instead.
 */
export const Colors = {
  // Backgrounds
  backgroundScreen: color.bg,
  backgroundCard: color.surface1,
  /** Workout header timer strips (session + rest) */
  timerBarBackground: color.surface1,
  /** Raised surfaces and default borders (same tone) */
  backgroundElevated: color.surface3,
  /** Muted fills and soft borders (same tone) */
  backgroundSubtle: '#333',
  backgroundBorder: '#3A3A3A',

  // Overlays
  overlay: 'rgba(0, 0, 0, 0.8)',
  /** Bottom sheet backdrops */
  overlayMedium: 'rgba(0, 0, 0, 0.65)',
  overlayLight: 'rgba(0,0,0,0.45)',

  // Text
  textPrimary: color.textPrimary,
  textSecondary: color.textSecondary,
  textMuted: color.textTertiary,
  textPlaceholder: color.textTertiary,
  textOnAccent: color.onGold,
  textOnDark: '#444444',
  textBlack: '#000000',

  // Accent / brand
  accent: color.gold,
  /** Gold text on dark surfaces (same as accent in default palette). */
  accentText: color.gold,
  /** Same hue as `accent` (#D4B97A → rgb 212, 185, 122) */
  accentOverlay: 'rgba(212, 185, 122, 0.9)',
  /** Translucent accent fills */
  accentWashFill: color.goldTint,
  /** Translucent accent borders and rings */
  accentWashBorder: 'rgba(212, 185, 122, 0.25)',
  /** Strong accent outline (e.g. hollow badges) */
  accentWashOutline: 'rgba(212, 185, 122, 0.45)',

  // Positive state (open, completed, recommended)
  recommended: color.success,
  /** Translucent recommended fills */
  recommendedWashFill: color.successTint,
  /** Translucent recommended borders */
  recommendedWashBorder: 'rgba(76, 195, 138, 0.25)',

  // Semantic
  destructive: color.danger,
  destructiveWashFill: color.dangerTint,
  destructiveWashBorder: 'rgba(255, 122, 112, 0.25)',

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

export type ThemeColors = typeof Colors;

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
  /** Horizontal padding inside pills and search fields */
  control: 14,
  /** Horizontal gutter for empty, locked, and centered states */
  emptyState: 48,
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
