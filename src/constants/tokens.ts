import { Platform, type TextStyle, type ViewStyle } from 'react-native';

/**
 * "Forged" design tokens. Single source of truth for colour, type, spacing,
 * radius, elevation and motion. Every text/background pair used in the UI must
 * be declared in `src/__tests__/contrast.test.ts`.
 */

export const color = {
  bg: '#0E0E10',
  surface1: '#17171A',
  surface2: '#1F1F23',
  surface3: '#2A2A2F',

  /** Decorative hairlines only; never the sole boundary of a control. */
  borderSubtle: 'rgba(255, 255, 255, 0.06)',
  /** Input outlines, unselected control edges, focus rings (≥3:1 on surface1/2). */
  borderStrong: '#6E6A63',
  /** 1px top highlight on raised surfaces. */
  highlightTop: 'rgba(255, 255, 255, 0.04)',

  textPrimary: '#F5F3EE',
  textSecondary: '#B4B0A8',
  /** Meta and placeholders; passes 4.5:1 up to surface3. */
  textTertiary: '#9A958C',
  /** Disabled labels only (exempt from contrast minimums). */
  textDisabled: '#5E5A54',

  gold: '#FFBA6F',
  goldStrong: '#FFCA91',
  onGold: '#1A1108',
  /** Same hue as `gold` (255, 186, 111). */
  goldTint: 'rgba(255, 186, 111, 0.12)',
  goldTintStrong: 'rgba(255, 186, 111, 0.24)',

  success: '#4CC38A',
  successTint: 'rgba(76, 195, 138, 0.12)',
  warning: '#E8A33D',
  warningTint: 'rgba(232, 163, 61, 0.12)',
  danger: '#FF7A70',
  dangerTint: 'rgba(255, 122, 112, 0.12)',
  info: '#6CB4EE',
  infoTint: 'rgba(108, 180, 238, 0.12)',
  infoTintStrong: 'rgba(108, 180, 238, 0.24)',

  scrim: 'rgba(0, 0, 0, 0.6)',
} as const;

export type ColorToken = keyof typeof color;

export const fontFamily = {
  displaySemiBold: 'BarlowCondensed-SemiBold',
  displayBold: 'BarlowCondensed-Bold',
} as const;

/**
 * Display styles use Barlow Condensed and omit `fontWeight`: the weight lives
 * in the font file, and setting both makes Android fall back to the system font.
 * Body styles use the system font so Dynamic Type / font scaling stay native.
 */
export const typography = {
  display: {
    fontFamily: fontFamily.displayBold,
    fontSize: 38,
    lineHeight: 42,
  },
  title1: {
    fontFamily: fontFamily.displayBold,
    fontSize: 28,
    lineHeight: 32,
  },
  title2: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700',
  },
  headline: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600',
  },
  body: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '400',
  },
  callout: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '400',
  },
  calloutStrong: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '600',
  },
  caption: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400',
  },
  captionStrong: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
  },
  /** Small category labels only (e.g. "Open workouts"). Use sparingly. */
  overline: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  numericLarge: {
    fontFamily: fontFamily.displaySemiBold,
    fontSize: 40,
    lineHeight: 44,
    fontVariant: ['tabular-nums'],
  },
  numericMedium: {
    fontFamily: fontFamily.displaySemiBold,
    fontSize: 24,
    lineHeight: 28,
    fontVariant: ['tabular-nums'],
  },
  /** Inline counts (chips, badges) on the system font. */
  numericSmall: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
} as const satisfies Record<string, TextStyle>;

export type TypographyToken = keyof typeof typography;

/** Large-text threshold for WCAG: 24px regular, or 19px bold. */
export const LARGE_TEXT_MIN_SIZE = 24;
export const LARGE_BOLD_TEXT_MIN_SIZE = 19;

/** 4pt grid. */
export const space = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  jumbo: 56,
} as const;

export type SpaceToken = keyof typeof space;

/**
 * One radius per component type: tags and badges sm, cards md, sheets lg,
 * interactive chips and buttons pill. The shape difference signals what's tappable.
 */
export const radius = {
  sm: 10,
  md: 16,
  lg: 24,
  pill: 999,
} as const;

export type RadiusToken = keyof typeof radius;

/** OS font scale at which side-by-side rows reflow to stacked layouts. */
export const LARGE_TEXT_FONT_SCALE = 1.3;

/** Minimum interactive target: 44pt (Apple HIG) on iOS, 48dp (Material) on Android. */
export const MIN_TARGET_SIZE = Platform.OS === 'android' ? 48 : 44;

/**
 * Depth on dark UI comes from surface tone plus a soft shadow and a 1px top
 * highlight, never from heavy drop shadows or outlines.
 */
export const elevation = {
  flat: {},
  raised: {
    boxShadow: `inset 0px 1px 0px ${color.highlightTop}, 0px 2px 8px rgba(0, 0, 0, 0.35)`,
  },
  overlay: {
    boxShadow: `inset 0px 1px 0px ${color.highlightTop}, 0px 12px 32px rgba(0, 0, 0, 0.5)`,
  },
} as const satisfies Record<string, ViewStyle>;

export type ElevationToken = keyof typeof elevation;

export const motion = {
  duration: {
    instant: 100,
    fast: 180,
    base: 260,
    slow: 400,
    celebrate: 700,
  },
  /** Maximum duration of the Reduce Motion opacity crossfade. */
  reducedFadeDuration: 150,
  /** Cubic-bezier control points (x1, y1, x2, y2). */
  easing: {
    standard: [0.2, 0, 0, 1],
    exit: [0.3, 0, 1, 1],
  },
  spring: {
    snappy: { damping: 18, stiffness: 320, mass: 1 },
    gentle: { damping: 22, stiffness: 180, mass: 1 },
  },
  pressScale: 0.98,
  entranceOffset: 8,
  entranceStagger: 40,
  /** Full cycle of the loading skeleton pulse; the only looping animation, shown while loading. */
  skeletonCycle: 1200,
} as const;

export type DurationToken = keyof typeof motion.duration;
export type EasingToken = keyof typeof motion.easing;
export type SpringToken = keyof typeof motion.spring;
