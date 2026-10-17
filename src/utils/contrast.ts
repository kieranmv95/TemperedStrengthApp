type Rgb = { r: number; g: number; b: number };
type Rgba = Rgb & { a: number };

export type ContrastKind = 'text' | 'largeText' | 'nonText';

/** WCAG 2.x minimums: SC 1.4.3 (text) and SC 1.4.11 (non-text UI). */
export const CONTRAST_MINIMUMS: Record<ContrastKind, number> = {
  text: 4.5,
  largeText: 3,
  nonText: 3,
};

const HEX_COLOR = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;
const RGBA_COLOR =
  /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/i;

export function parseColor(value: string): Rgba {
  const hex = HEX_COLOR.exec(value);
  if (hex) {
    const digits =
      hex[1].length === 3
        ? hex[1]
            .split('')
            .map((d) => d + d)
            .join('')
        : hex[1];
    return {
      r: parseInt(digits.slice(0, 2), 16),
      g: parseInt(digits.slice(2, 4), 16),
      b: parseInt(digits.slice(4, 6), 16),
      a: 1,
    };
  }

  const rgba = RGBA_COLOR.exec(value);
  if (rgba) {
    return {
      r: Number(rgba[1]),
      g: Number(rgba[2]),
      b: Number(rgba[3]),
      a: rgba[4] === undefined ? 1 : Number(rgba[4]),
    };
  }

  throw new Error(`Unsupported colour format: ${value}`);
}

/** Composites a (possibly translucent) colour over an opaque background. */
export function flattenColor(foreground: string, background: string): Rgb {
  const fg = parseColor(foreground);
  const bg = parseColor(background);
  if (bg.a !== 1) {
    throw new Error(`Background must be opaque: ${background}`);
  }
  return {
    r: Math.round(fg.r * fg.a + bg.r * (1 - fg.a)),
    g: Math.round(fg.g * fg.a + bg.g * (1 - fg.a)),
    b: Math.round(fg.b * fg.a + bg.b * (1 - fg.a)),
  };
}

function channelLuminance(channel: number): number {
  const c = channel / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function relativeLuminance({ r, g, b }: Rgb): number {
  return (
    0.2126 * channelLuminance(r) +
    0.7152 * channelLuminance(g) +
    0.0722 * channelLuminance(b)
  );
}

/**
 * WCAG contrast ratio between a foreground and an opaque background.
 * Translucent foregrounds are flattened onto the background first.
 */
export function contrastRatio(foreground: string, background: string): number {
  const fg = flattenColor(foreground, background);
  const bg = flattenColor(background, background);
  const lighter = Math.max(relativeLuminance(fg), relativeLuminance(bg));
  const darker = Math.min(relativeLuminance(fg), relativeLuminance(bg));
  return (lighter + 0.05) / (darker + 0.05);
}

/** Hex string for a flattened colour, e.g. a tint composited over a surface. */
export function flattenToHex(foreground: string, background: string): string {
  const { r, g, b } = flattenColor(foreground, background);
  return `#${[r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('')}`;
}
