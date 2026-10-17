import { BottomSheet } from '@/src/components/ds';
import { togetherWeLiftStyles as styles } from '@/src/components/hub/togetherWeLiftStyles';
import { color } from '@/src/constants/tokens';
import {
  TOGETHER_WE_LIFT,
  type TogetherWeLiftLinkKey,
} from '@/src/data/togetherWeLift';
import { useLargeText } from '@/src/hooks/useLargeText';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

const twlLogo = require('@/assets/images/logos/twl.png');

type TogetherWeLiftSheetProps = {
  visible: boolean;
  onClose: () => void;
  onPressLink: (key: TogetherWeLiftLinkKey) => void;
};

export function TogetherWeLiftSheet({
  visible,
  onClose,
  onPressLink,
}: TogetherWeLiftSheetProps) {
  const largeText = useLargeText();

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title={TOGETHER_WE_LIFT.name}
      footer={
        <View
          style={[styles.sheetActions, largeText && styles.sheetActionsStacked]}
        >
          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              styles.secondaryButton,
              pressed && styles.secondaryButtonPressed,
            ]}
            onPress={() => onPressLink('linktree')}
            accessibilityRole="link"
            accessibilityLabel={TOGETHER_WE_LIFT.linkLabels.linktree}
            accessibilityHint="Opens in your browser"
          >
            <Ionicons name="link" size={18} color={color.textPrimary} />
            <Text style={styles.secondaryButtonText}>
              {TOGETHER_WE_LIFT.linkLabels.linktree}
            </Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              styles.primaryButton,
              pressed && styles.primaryButtonPressed,
            ]}
            onPress={() => onPressLink('zeffyDonate')}
            accessibilityRole="link"
            accessibilityLabel={TOGETHER_WE_LIFT.linkLabels.donate}
            accessibilityHint="Opens in your browser"
          >
            <Text style={styles.primaryButtonText}>
              {TOGETHER_WE_LIFT.linkLabels.donate}
            </Text>
          </Pressable>
        </View>
      }
    >
      <View style={styles.sheetLogoPanel}>
        <Image
          source={twlLogo}
          style={styles.sheetLogo}
          contentFit="contain"
          accessible={false}
          accessibilityIgnoresInvertColors
        />
      </View>

      <Text style={styles.sheetAbout}>{TOGETHER_WE_LIFT.sheetAbout}</Text>

      <View
        style={styles.temperedAside}
        accessible
        accessibilityRole="text"
        accessibilityLabel={`${TOGETHER_WE_LIFT.sheetTemperedLabel}: ${TOGETHER_WE_LIFT.sheetTemperedStatement}`}
      >
        <View style={styles.temperedAsideHeader}>
          <Ionicons
            name="ribbon-outline"
            size={16}
            color={color.textSecondary}
          />
          <Text style={styles.temperedAsideLabel}>
            {TOGETHER_WE_LIFT.sheetTemperedLabel}
          </Text>
        </View>
        <Text style={styles.temperedAsideText}>
          {TOGETHER_WE_LIFT.sheetTemperedStatement}
        </Text>
      </View>
    </BottomSheet>
  );
}
