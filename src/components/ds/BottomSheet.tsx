import {
  color,
  elevation,
  MIN_TARGET_SIZE,
  motion,
  radius,
  space,
  typography,
} from '@/src/constants/tokens';
import { useMotion } from '@/src/hooks/useMotion';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState, type ComponentRef } from 'react';
import {
  AccessibilityInfo,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type BottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  /** Pinned below the scrolling content, above the home indicator, e.g. an action bar. */
  footer?: React.ReactNode;
  /** The control that opened the sheet; focus returns to it on close. */
  returnFocusRef?: React.RefObject<ComponentRef<typeof View> | null>;
};

const MAX_HEIGHT_RATIO = 0.9;
const DISMISS_DISTANCE_RATIO = 0.25;
const DISMISS_VELOCITY = 800;
const HANDLE_WIDTH = 36;
const HANDLE_HEIGHT = 4;

/**
 * Modal sheet that springs up from the bottom. Drag the header down, tap the
 * scrim, use the close button or Android back to dismiss. Moves screen-reader
 * focus to the title on open and back to `returnFocusRef` on close.
 */
export function BottomSheet({
  visible,
  onClose,
  title,
  children,
  footer,
  returnFocusRef,
}: BottomSheetProps) {
  const motionHelpers = useMotion();
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const [mounted, setMounted] = useState(visible);
  const titleRef = useRef<ComponentRef<typeof Text>>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const translateY = useSharedValue(windowHeight);
  const opacity = useSharedValue(0);
  const sheetHeight = useSharedValue(windowHeight);

  if (visible && !mounted) {
    setMounted(true);
  }

  useEffect(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }

    if (visible) {
      translateY.set(motionHelpers.spring(0, 'gentle'));
      opacity.set(motionHelpers.fade(1, 'fast'));
      return;
    }

    if (!motionHelpers.reduceMotion) {
      translateY.set(motionHelpers.timing(sheetHeight.get(), 'base', 'exit'));
    }
    opacity.set(motionHelpers.fade(0, 'base'));
    closeTimer.current = setTimeout(
      () => {
        setMounted(false);
        if (returnFocusRef?.current) {
          AccessibilityInfo.sendAccessibilityEvent(
            returnFocusRef.current,
            'focus'
          );
        }
      },
      motionHelpers.reduceMotion
        ? motion.reducedFadeDuration
        : motion.duration.base
    );
  }, [
    visible,
    translateY,
    opacity,
    sheetHeight,
    motionHelpers,
    returnFocusRef,
  ]);

  useEffect(
    () => () => {
      if (closeTimer.current) {
        clearTimeout(closeTimer.current);
      }
    },
    []
  );

  const handleShow = () => {
    if (titleRef.current) {
      AccessibilityInfo.sendAccessibilityEvent(titleRef.current, 'focus');
    }
  };

  const dragGesture = Gesture.Pan()
    .activeOffsetY(8)
    .onUpdate((event) => {
      translateY.set(Math.max(0, event.translationY));
    })
    .onEnd((event) => {
      const shouldDismiss =
        event.translationY > sheetHeight.get() * DISMISS_DISTANCE_RATIO ||
        event.velocityY > DISMISS_VELOCITY;
      if (shouldDismiss) {
        runOnJS(onClose)();
      } else {
        translateY.set(motionHelpers.spring(0, 'snappy'));
      }
    });

  const scrimStyle = useAnimatedStyle(() => ({ opacity: opacity.get() }));

  const sheetStyle = useAnimatedStyle(() => ({
    opacity: opacity.get(),
    transform: [{ translateY: translateY.get() }],
  }));

  if (!mounted) {
    return null;
  }

  return (
    <Modal
      visible
      transparent
      animationType="none"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onClose}
      onShow={handleShow}
      testID="bottom-sheet-modal"
    >
      {/* Modal content is a separate native window, so gestures need their own root. */}
      <GestureHandlerRootView style={styles.root}>
        <Animated.View
          style={[styles.scrim, scrimStyle]}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={onClose}
            accessible={false}
            testID="bottom-sheet-scrim"
          />
        </Animated.View>
        <Animated.View
          style={[
            styles.sheet,
            elevation.overlay,
            { maxHeight: windowHeight * MAX_HEIGHT_RATIO },
            sheetStyle,
          ]}
          onLayout={(event) => {
            sheetHeight.set(event.nativeEvent.layout.height);
          }}
          accessibilityViewIsModal
          onAccessibilityEscape={onClose}
        >
          <GestureDetector gesture={dragGesture}>
            <View style={styles.header}>
              <View style={styles.handle} />
              <View style={styles.titleRow}>
                <Text
                  ref={titleRef}
                  style={styles.title}
                  accessibilityRole="header"
                >
                  {title}
                </Text>
                <Pressable
                  onPress={onClose}
                  style={styles.closeButton}
                  hitSlop={space.xxs}
                  accessibilityRole="button"
                  accessibilityLabel={`Close ${title}`}
                >
                  <Ionicons name="close" size={24} color={color.textPrimary} />
                </Pressable>
              </View>
            </View>
          </GestureDetector>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>
          <View
            style={[
              styles.footer,
              footer ? styles.footerWithContent : null,
              { paddingBottom: insets.bottom + space.sm },
            ]}
          >
            {footer}
          </View>
        </Animated.View>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  scrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: color.scrim,
  },
  sheet: {
    backgroundColor: color.surface1,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
  },
  header: {
    paddingTop: space.xs,
    paddingHorizontal: space.md,
  },
  handle: {
    alignSelf: 'center',
    width: HANDLE_WIDTH,
    height: HANDLE_HEIGHT,
    borderRadius: radius.pill,
    backgroundColor: color.borderStrong,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    minHeight: MIN_TARGET_SIZE,
    marginTop: space.xxs,
  },
  title: {
    ...typography.title2,
    color: color.textPrimary,
    flex: 1,
  },
  closeButton: {
    width: MIN_TARGET_SIZE,
    height: MIN_TARGET_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -space.xs,
  },
  scroll: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingHorizontal: space.md,
    paddingBottom: space.md,
    gap: space.md,
  },
  footer: {
    paddingHorizontal: space.md,
  },
  footerWithContent: {
    paddingTop: space.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: color.borderSubtle,
  },
});
