import { SmallChevron } from '@/src/components/ds';
import { togetherWeLiftStyles as styles } from '@/src/components/hub/togetherWeLiftStyles';
import { TOGETHER_WE_LIFT } from '@/src/data/togetherWeLift';
import { Image } from 'expo-image';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

const twlLogo = require('@/assets/images/logos/twl.png');

type TogetherWeLiftBannerProps = {
  onPress: () => void;
};

/**
 * Keeps the charity's brand background: its white title and description pass
 * contrast on it (checked in `contrast.test.ts`).
 */
export function TogetherWeLiftBanner({ onPress }: TogetherWeLiftBannerProps) {
  const { colors } = TOGETHER_WE_LIFT;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.bannerCard,
        { backgroundColor: colors.background },
        pressed && styles.bannerCardPressed,
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${TOGETHER_WE_LIFT.name}, ${TOGETHER_WE_LIFT.bannerIntro}`}
      accessibilityHint="Opens details about our charity partner"
    >
      <View style={styles.bannerContent}>
        <View style={styles.bannerTitleRow}>
          <View style={styles.logoPanel}>
            <Image
              source={twlLogo}
              style={styles.logoImage}
              contentFit="contain"
              accessible={false}
              accessibilityIgnoresInvertColors
            />
          </View>
          <Text style={[styles.bannerTitle, { color: colors.title }]}>
            {TOGETHER_WE_LIFT.name}
          </Text>
        </View>
        <Text style={[styles.bannerDescription, { color: colors.description }]}>
          {TOGETHER_WE_LIFT.bannerIntro}
        </Text>
      </View>
      <SmallChevron color={colors.title} />
    </Pressable>
  );
}
