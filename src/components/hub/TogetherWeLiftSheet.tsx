import { togetherWeLiftStyles as styles } from '@/src/components/hub/togetherWeLiftStyles';
import { Spacing } from '@/src/constants/theme';
import {
  TOGETHER_WE_LIFT,
  type TogetherWeLiftLinkKey,
} from '@/src/data/togetherWeLift';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
  const insets = useSafeAreaInsets();
  const { colors } = TOGETHER_WE_LIFT;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.sheetOverlay}>
        <Pressable
          style={styles.sheetBackdrop}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close Together We Lift details"
        />
        <View
          style={[
            styles.sheet,
            {
              backgroundColor: colors.background,
              paddingBottom: insets.bottom + Spacing.lg,
            },
          ]}
        >
          <TouchableOpacity
            style={styles.sheetCloseButton}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Close"
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="close" size={28} color={colors.title} />
          </TouchableOpacity>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.sheetContent}
          >
            <View style={styles.sheetLogoWrap}>
              <Image
                source={twlLogo}
                style={styles.sheetLogo}
                contentFit="contain"
                accessibilityIgnoresInvertColors
              />
            </View>

            <Text style={[styles.sheetTitle, { color: colors.title }]}>
              {TOGETHER_WE_LIFT.name}
            </Text>

            <View style={styles.sheetAboutBlock}>
              <Text style={[styles.sheetAbout, { color: colors.description }]}>
                {TOGETHER_WE_LIFT.sheetAbout}
              </Text>
            </View>

            <View
              style={[styles.temperedAside, { borderLeftColor: colors.title }]}
              accessibilityRole="text"
              accessibilityLabel={`${TOGETHER_WE_LIFT.sheetTemperedLabel}: ${TOGETHER_WE_LIFT.sheetTemperedStatement}`}
            >
              <View style={styles.temperedAsideHeader}>
                <Ionicons name="ribbon" size={16} color={colors.title} />
                <Text
                  style={[styles.temperedAsideLabel, { color: colors.title }]}
                >
                  {TOGETHER_WE_LIFT.sheetTemperedLabel}
                </Text>
              </View>
              <Text
                style={[
                  styles.temperedAsideText,
                  { color: colors.description },
                ]}
              >
                {TOGETHER_WE_LIFT.sheetTemperedStatement}
              </Text>
            </View>

            <View style={styles.sheetActions}>
              <TouchableOpacity
                style={[
                  styles.linkButtonPrimary,
                  { backgroundColor: colors.ctaBackground },
                ]}
                onPress={() => onPressLink('zeffyDonate')}
                accessibilityRole="button"
                accessibilityLabel={TOGETHER_WE_LIFT.linkLabels.donate}
              >
                <Text
                  style={[styles.linkButtonText, { color: colors.ctaText }]}
                >
                  {TOGETHER_WE_LIFT.linkLabels.donate}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.linkButton,
                  { backgroundColor: colors.linkBackground },
                ]}
                onPress={() => onPressLink('linktree')}
                accessibilityRole="button"
                accessibilityLabel={TOGETHER_WE_LIFT.linkLabels.linktree}
              >
                <Ionicons name="link" size={18} color={colors.linkText} />
                <Text
                  style={[
                    styles.linkButtonTextSecondary,
                    { color: colors.linkText },
                  ]}
                >
                  {TOGETHER_WE_LIFT.linkLabels.linktree}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
