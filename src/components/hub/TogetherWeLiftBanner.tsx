import { togetherWeLiftStyles as styles } from '@/src/components/hub/togetherWeLiftStyles';
import { TOGETHER_WE_LIFT } from '@/src/data/togetherWeLift';
import { Image } from 'expo-image';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const twlLogo = require('@/assets/images/logos/twl.png');

type TogetherWeLiftBannerProps = {
  onPress: () => void;
};

export function TogetherWeLiftBanner({ onPress }: TogetherWeLiftBannerProps) {
  const { colors } = TOGETHER_WE_LIFT;

  return (
    <TouchableOpacity
      style={[styles.bannerCard, { backgroundColor: colors.background }]}
      onPress={onPress}
      activeOpacity={0.9}
      accessibilityRole="button"
      accessibilityLabel={`${TOGETHER_WE_LIFT.name}. Learn more`}
      accessibilityHint="Opens details about our charity partner"
    >
      <View style={styles.bannerContent}>
        <View style={styles.bannerTitleRow}>
          <Image
            source={twlLogo}
            style={styles.logoImage}
            contentFit="contain"
            accessibilityLabel={TOGETHER_WE_LIFT.name}
            accessibilityIgnoresInvertColors
          />
          <Text style={[styles.bannerTitle, { color: colors.title }]}>
            {TOGETHER_WE_LIFT.name}
          </Text>
        </View>
        <Text
          style={[styles.bannerDescription, { color: colors.description }]}
        >
          {TOGETHER_WE_LIFT.bannerIntro}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
