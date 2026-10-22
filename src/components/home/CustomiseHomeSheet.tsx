import { settingsSwitchColors } from '@/src/components/settings/settingsScreenStyles';
import { color, space } from '@/src/constants/tokens';
import { useLargeText } from '@/src/hooks/useLargeText';
import {
  HOME_SECTION_LABELS,
  type HomeSectionId,
  type HomeSectionPreference,
} from '@/src/utils/homeLayout';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  type ComponentRef,
} from 'react';
import {
  AccessibilityInfo,
  Modal,
  Pressable,
  Switch,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
  ScrollView,
} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { customiseHomeStyles as styles } from './customiseHomeStyles';

const FALLBACK_ROW_HEIGHT = 56;

type CustomiseHomeSheetProps = {
  visible: boolean;
  layout: HomeSectionPreference[];
  /** Pro can show and hide. Everyone else still reorders, with every section shown. */
  canHideSections: boolean;
  onClose: () => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
  onToggleVisible: (id: HomeSectionId, visible: boolean) => void;
  onUpgrade: () => void;
  returnFocusRef?: React.RefObject<ComponentRef<typeof Pressable> | null>;
};

type CustomiseHomeRowProps = {
  index: number;
  count: number;
  section: HomeSectionPreference;
  canHideSections: boolean;
  onToggleVisible: (id: HomeSectionId, visible: boolean) => void;
  onUpgrade: () => void;
  onMove: (fromIndex: number, toIndex: number) => void;
  onDragEnd: (fromIndex: number, translationY: number) => void;
  onDragHandleTouch: (active: boolean) => void;
  onRowLayout: (index: number, height: number) => void;
};

function CustomiseHomeRow({
  index,
  count,
  section,
  canHideSections,
  onToggleVisible,
  onUpgrade,
  onMove,
  onDragEnd,
  onDragHandleTouch,
  onRowLayout,
}: CustomiseHomeRowProps) {
  const largeText = useLargeText();
  const label = HOME_SECTION_LABELS[section.id];
  const shown = canHideSections ? section.visible : true;
  const translateY = useSharedValue(0);
  const dragging = useSharedValue(0);

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetY([-8, 8])
        .onBegin(() => {
          runOnJS(onDragHandleTouch)(true);
        })
        .onStart(() => {
          dragging.value = 1;
        })
        .onUpdate((event) => {
          translateY.value = event.translationY;
        })
        .onEnd((event) => {
          dragging.value = 0;
          translateY.value = 0;
          runOnJS(onDragEnd)(index, event.translationY);
        })
        .onFinalize(() => {
          if (dragging.value === 1) {
            dragging.value = 0;
            translateY.value = 0;
            runOnJS(onDragEnd)(index, 0);
          }
          runOnJS(onDragHandleTouch)(false);
        }),
    [dragging, index, onDragEnd, onDragHandleTouch, translateY]
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    zIndex: dragging.value ? 2 : 0,
    backgroundColor: dragging.value ? color.surface2 : 'transparent',
  }));

  const actions = [
    ...(index > 0 ? [{ name: 'moveUp', label: 'Move up' }] : []),
    ...(index < count - 1 ? [{ name: 'moveDown', label: 'Move down' }] : []),
  ];

  return (
    <Animated.View
      style={[styles.row, largeText && styles.rowStacked, animatedStyle]}
      onLayout={(event) => {
        onRowLayout(index, event.nativeEvent.layout.height);
      }}
    >
      <View style={styles.rowMain}>
        <GestureDetector gesture={panGesture}>
          <View
            style={styles.dragHandle}
            accessible
            accessibilityRole="button"
            accessibilityLabel={`Reorder ${label}`}
            accessibilityHint="Drag up or down to change the order"
            accessibilityActions={actions}
            onAccessibilityAction={(event) => {
              if (event.nativeEvent.actionName === 'moveUp') {
                onMove(index, index - 1);
              }
              if (event.nativeEvent.actionName === 'moveDown') {
                onMove(index, index + 1);
              }
            }}
          >
            <Ionicons name="reorder-three" size={24} color={color.gold} />
          </View>
        </GestureDetector>
        <Text style={styles.label}>{label}</Text>
      </View>
      <View style={[styles.visibility, largeText && styles.visibilityStacked]}>
        {canHideSections ? (
          <Switch
            {...settingsSwitchColors}
            value={shown}
            onValueChange={(visible) => onToggleVisible(section.id, visible)}
            accessibilityLabel={`${shown ? 'Hide' : 'Show'} ${label}`}
          />
        ) : (
          <Pressable
            onPress={onUpgrade}
            accessibilityRole="button"
            accessibilityLabel={`${label}, shown. Hiding sections is a Pro feature`}
            accessibilityHint="Opens upgrade to Pro"
            style={styles.visibility}
          >
            <View pointerEvents="none">
              <Switch
                {...settingsSwitchColors}
                value
                disabled
                accessibilityElementsHidden
                importantForAccessibility="no-hide-descendants"
              />
            </View>
          </Pressable>
        )}
      </View>
    </Animated.View>
  );
}

export function CustomiseHomeSheet({
  visible,
  layout,
  canHideSections,
  onClose,
  onReorder,
  onToggleVisible,
  onUpgrade,
  returnFocusRef,
}: CustomiseHomeSheetProps) {
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const titleRef = useRef<ComponentRef<typeof Text>>(null);
  const rowHeights = useRef<Record<number, number>>({});
  const [scrollLocked, setScrollLocked] = useState(false);

  const handleShow = () => {
    if (titleRef.current) {
      AccessibilityInfo.sendAccessibilityEvent(titleRef.current, 'focus');
    }
  };

  const handleClose = () => {
    onClose();
    if (returnFocusRef?.current) {
      AccessibilityInfo.sendAccessibilityEvent(returnFocusRef.current, 'focus');
    }
  };

  const handleRowLayout = useCallback((index: number, height: number) => {
    if (height > 0) {
      rowHeights.current[index] = height;
    }
  }, []);

  const handleDragHandleTouch = useCallback((active: boolean) => {
    setScrollLocked(active);
  }, []);

  const commitMove = useCallback(
    (fromIndex: number, toIndex: number) => {
      if (
        fromIndex === toIndex ||
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= layout.length ||
        toIndex >= layout.length
      ) {
        return;
      }
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onReorder(fromIndex, toIndex);
    },
    [layout.length, onReorder]
  );

  const handleDragEnd = useCallback(
    (fromIndex: number, translationY: number) => {
      const rowHeight = rowHeights.current[fromIndex] ?? FALLBACK_ROW_HEIGHT;
      const delta = Math.round(translationY / rowHeight);
      commitMove(
        fromIndex,
        Math.max(0, Math.min(layout.length - 1, fromIndex + delta))
      );
    },
    [commitMove, layout.length]
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={handleClose}
      onShow={handleShow}
    >
      <GestureHandlerRootView style={styles.root}>
        <View style={styles.dock}>
          <Pressable
            style={styles.scrim}
            onPress={handleClose}
            accessible={false}
            importantForAccessibility="no"
          />
          <View
            style={[
              styles.card,
              {
                maxHeight: windowHeight * 0.85,
                paddingBottom: insets.bottom + space.sm,
              },
            ]}
            accessibilityViewIsModal
            onAccessibilityEscape={handleClose}
          >
            <View style={styles.header}>
              <View style={styles.titleRow}>
                <Text
                  ref={titleRef}
                  style={styles.title}
                  accessibilityRole="header"
                >
                  Customise home
                </Text>
                <Pressable
                  onPress={handleClose}
                  style={styles.closeButton}
                  accessibilityRole="button"
                  accessibilityLabel="Close Customise home"
                >
                  <Ionicons name="close" size={24} color={color.textPrimary} />
                </Pressable>
              </View>
              <Text style={styles.body}>
                {canHideSections
                  ? 'Drag a handle to reorder. Use the switch to show or hide a section.'
                  : 'Drag a handle to reorder. Showing and hiding sections is part of Pro.'}
              </Text>
              {canHideSections ? null : (
                <Pressable
                  onPress={onUpgrade}
                  accessibilityRole="button"
                  accessibilityLabel="Upgrade to Pro"
                  accessibilityHint="Opens the upgrade screen to show and hide home sections"
                >
                  <Text style={styles.upgrade}>Upgrade to Pro</Text>
                </Pressable>
              )}
            </View>
            <ScrollView
              style={styles.list}
              contentContainerStyle={styles.listContent}
              scrollEnabled={!scrollLocked}
              keyboardShouldPersistTaps="handled"
            >
              {layout.map((section, index) => (
                <CustomiseHomeRow
                  key={section.id}
                  index={index}
                  count={layout.length}
                  section={section}
                  canHideSections={canHideSections}
                  onToggleVisible={onToggleVisible}
                  onUpgrade={onUpgrade}
                  onMove={commitMove}
                  onDragEnd={handleDragEnd}
                  onDragHandleTouch={handleDragHandleTouch}
                  onRowLayout={handleRowLayout}
                />
              ))}
            </ScrollView>
          </View>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
}
