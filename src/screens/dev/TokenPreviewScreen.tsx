import { MotionTokenPreview } from '@/src/components/dev/MotionTokenPreview';
import { PreviewHeader } from '@/src/components/dev/PreviewHeader';
import { PreviewSection } from '@/src/components/dev/PreviewSection';
import { AppSafeAreaView, AppScrollView } from '@/src/components/ds';
import {
  color,
  elevation,
  fontFamily,
  radius,
  space,
  typography,
  type ColorToken,
  type ElevationToken,
  type RadiusToken,
  type SpaceToken,
  type TypographyToken,
} from '@/src/constants/tokens';
import { contrastRatio } from '@/src/utils/contrast';
import * as Font from 'expo-font';
import React from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';

const COLOR_TOKENS = Object.keys(color) as ColorToken[];
const TYPOGRAPHY_TOKENS = Object.keys(typography) as TypographyToken[];
const SPACE_TOKENS = Object.keys(space) as SpaceToken[];
const RADIUS_TOKENS = Object.keys(radius) as RadiusToken[];
const ELEVATION_TOKENS = Object.keys(elevation) as ElevationToken[];

const NUMERIC_TOKENS: TypographyToken[] = [
  'numericLarge',
  'numericMedium',
  'numericSmall',
];

type ColorRowProps = {
  token: ColorToken;
};

function ColorRow({ token }: ColorRowProps) {
  const value = color[token];
  const onBg = contrastRatio(value, color.bg).toFixed(2);
  const onSurface1 = contrastRatio(value, color.surface1).toFixed(2);

  return (
    <View
      style={styles.colorRow}
      accessible
      accessibilityLabel={`${token}, ${value}, ${onBg} to 1 on background, ${onSurface1} to 1 on surface 1`}
    >
      <View style={[styles.swatch, { backgroundColor: value }]} />
      <View style={styles.colorText}>
        <Text style={styles.tokenName}>{token}</Text>
        <Text style={styles.tokenMeta}>{value}</Text>
        <Text style={styles.tokenMeta}>
          {onBg}:1 on bg · {onSurface1}:1 on surface1
        </Text>
      </View>
    </View>
  );
}

type TypographyRowProps = {
  token: TypographyToken;
};

function TypographyRow({ token }: TypographyRowProps) {
  const style = typography[token];
  const sample = NUMERIC_TOKENS.includes(token)
    ? '142.5 kg · 5×2'
    : 'Clean & jerk warm-up';

  return (
    <View style={styles.typeRow}>
      <Text style={[style, styles.typeSample]}>{sample}</Text>
      <Text style={styles.tokenMeta}>
        {token} · {style.fontSize}/{style.lineHeight}
        {'fontFamily' in style ? ` · ${style.fontFamily}` : ' · system'}
      </Text>
    </View>
  );
}

export function TokenPreviewScreen() {
  const { fontScale } = useWindowDimensions();
  const displayFontLoaded = Font.isLoaded(fontFamily.displayBold);

  return (
    <AppSafeAreaView style={styles.screen}>
      <AppScrollView contentContainerStyle={styles.content}>
        <PreviewHeader
          title="Design tokens"
          subtitle={`Font scale ${fontScale.toFixed(2)} · Barlow Condensed ${
            displayFontLoaded ? 'loaded' : 'not loaded (system fallback)'
          }`}
        />

        <PreviewSection title="Colour">
          {COLOR_TOKENS.map((token) => (
            <ColorRow key={token} token={token} />
          ))}
        </PreviewSection>

        <PreviewSection title="Typography">
          {TYPOGRAPHY_TOKENS.map((token) => (
            <TypographyRow key={token} token={token} />
          ))}
        </PreviewSection>

        <PreviewSection title="Spacing">
          {SPACE_TOKENS.map((token) => (
            <View key={token} style={styles.spaceRow}>
              <Text style={styles.spaceLabel}>
                {token} · {space[token]}
              </Text>
              <View style={[styles.spaceBar, { width: space[token] }]} />
            </View>
          ))}
        </PreviewSection>

        <PreviewSection title="Radius">
          <View style={styles.radiusRow}>
            {RADIUS_TOKENS.map((token) => (
              <View key={token} style={styles.radiusItem}>
                <View
                  style={[styles.radiusBox, { borderRadius: radius[token] }]}
                />
                <Text style={styles.tokenMeta}>
                  {token} · {radius[token]}
                </Text>
              </View>
            ))}
          </View>
        </PreviewSection>

        <PreviewSection title="Elevation">
          {ELEVATION_TOKENS.map((token) => (
            <View key={token} style={[styles.elevationCard, elevation[token]]}>
              <Text style={styles.tokenName}>{token}</Text>
              <Text style={styles.tokenMeta}>surface1</Text>
            </View>
          ))}
        </PreviewSection>

        <PreviewSection title="Motion">
          <MotionTokenPreview />
        </PreviewSection>
      </AppScrollView>
    </AppSafeAreaView>
  );
}

const SWATCH_SIZE = 48;
const RADIUS_BOX_SIZE = 64;

const styles = StyleSheet.create({
  screen: {
    backgroundColor: color.bg,
  },
  content: {
    paddingHorizontal: space.md,
    paddingBottom: space.jumbo,
    gap: space.xxl,
  },
  colorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  swatch: {
    width: SWATCH_SIZE,
    height: SWATCH_SIZE,
    borderRadius: radius.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: color.borderStrong,
  },
  colorText: {
    flex: 1,
  },
  tokenName: {
    ...typography.headline,
    color: color.textPrimary,
  },
  tokenMeta: {
    ...typography.caption,
    color: color.textTertiary,
  },
  typeRow: {
    gap: space.xxs,
  },
  typeSample: {
    color: color.textPrimary,
  },
  spaceRow: {
    gap: space.xxs,
  },
  spaceLabel: {
    ...typography.caption,
    color: color.textTertiary,
  },
  spaceBar: {
    height: space.xs,
    backgroundColor: color.gold,
    borderRadius: radius.pill,
  },
  radiusRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.md,
  },
  radiusItem: {
    alignItems: 'center',
    gap: space.xxs,
  },
  radiusBox: {
    width: RADIUS_BOX_SIZE,
    height: RADIUS_BOX_SIZE,
    backgroundColor: color.surface2,
  },
  elevationCard: {
    backgroundColor: color.surface1,
    borderRadius: radius.md,
    padding: space.md,
  },
});
