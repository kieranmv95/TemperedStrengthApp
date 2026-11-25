import {
  color,
  MIN_TARGET_SIZE,
  space,
  typography,
} from '@/src/constants/tokens';
import { useSyncManager } from '@/src/hooks/sync-manager-context';
import {
  holdScreenCaptureProtection,
  isScreenCaptureExemptEmail,
  subscribeToScreenshots,
} from '@/src/services/screenCaptureProtection';
import { useIsFocused } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  AccessibilityInfo,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

/** Solid black, so a capture reads as a copyright slate. */
export const COPYRIGHT_OVERLAY_BACKGROUND = '#000000';

const COPYRIGHT_TITLE = 'Copyrighted content';
const COPYRIGHT_BODY = 'This session can’t be captured or shared.';

type CopyrightedContentGuardProps = {
  /** Turn protection on for the screen that is currently showing this content. */
  active: boolean;
};

/**
 * Blanks screenshots and recordings of the focused screen, and covers it
 * with a copyright notice when a screenshot is taken. Signed-in owner
 * accounts are exempt and can capture normally.
 */
export function CopyrightedContentGuard({
  active,
}: CopyrightedContentGuardProps) {
  const focused = useIsFocused();
  const { user } = useSyncManager();
  const enabled = active && focused && !isScreenCaptureExemptEmail(user?.email);
  const [noticeVisible, setNoticeVisible] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    return holdScreenCaptureProtection();
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    return subscribeToScreenshots(() => setNoticeVisible(true));
  }, [enabled]);

  useEffect(() => {
    if (!noticeVisible) return;
    AccessibilityInfo.announceForAccessibility(
      `${COPYRIGHT_TITLE}. ${COPYRIGHT_BODY}`
    );
  }, [noticeVisible]);

  if (!enabled && noticeVisible) {
    setNoticeVisible(false);
  }

  if (!noticeVisible) {
    return null;
  }

  return (
    <Modal
      visible
      animationType="fade"
      presentationStyle="fullScreen"
      statusBarTranslucent
      onRequestClose={() => setNoticeVisible(false)}
    >
      <View style={styles.fill} accessibilityViewIsModal>
        <View style={styles.copy}>
          <Text
            style={styles.title}
            accessibilityRole="header"
            accessibilityLiveRegion="assertive"
          >
            {COPYRIGHT_TITLE}
          </Text>
          <Text style={styles.body}>{COPYRIGHT_BODY}</Text>
          <Pressable
            style={styles.dismiss}
            onPress={() => setNoticeVisible(false)}
            accessibilityRole="button"
            accessibilityLabel="Dismiss copyright notice"
          >
            <Text style={styles.dismissLabel}>Dismiss</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    backgroundColor: COPYRIGHT_OVERLAY_BACKGROUND,
    alignItems: 'center',
    justifyContent: 'center',
    padding: space.xl,
  },
  copy: {
    alignItems: 'center',
    gap: space.sm,
    maxWidth: 320,
  },
  title: {
    ...typography.title1,
    color: color.textPrimary,
    textAlign: 'center',
  },
  body: {
    ...typography.body,
    color: color.textSecondary,
    textAlign: 'center',
  },
  dismiss: {
    minHeight: MIN_TARGET_SIZE,
    minWidth: MIN_TARGET_SIZE,
    marginTop: space.lg,
    paddingHorizontal: space.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dismissLabel: {
    ...typography.headline,
    color: color.textPrimary,
  },
});
