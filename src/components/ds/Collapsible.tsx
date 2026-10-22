import {
  color,
  elevation,
  MIN_TARGET_SIZE,
  radius,
  space,
  typography,
} from '@/src/constants/tokens';
import { useMotion } from '@/src/hooks/useMotion';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

type CollapsibleProps = {
  title: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  /** Shown between the title and the chevron, e.g. a "Completed" badge. */
  accessory?: React.ReactNode;
  /** Defaults to the title. Include accessory meaning, e.g. "Session actions, completed". */
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * Card with a header row that expands and collapses its content. Controlled,
 * so callers can remember the expanded state. Content mounts on first expand
 * and is hidden from assistive tech while collapsed.
 */
export function Collapsible({
  title,
  expanded,
  onToggle,
  children,
  accessory,
  accessibilityLabel,
  style,
}: CollapsibleProps) {
  const motionHelpers = useMotion();
  const progress = useSharedValue(expanded ? 1 : 0);
  const contentHeight = useSharedValue(0);
  const [hasMountedContent, setHasMountedContent] = useState(expanded);

  if (expanded && !hasMountedContent) {
    setHasMountedContent(true);
  }

  useEffect(() => {
    progress.set(motionHelpers.timing(expanded ? 1 : 0, 'base'));
  }, [expanded, progress, motionHelpers]);

  const bodyStyle = useAnimatedStyle(() => ({
    height: contentHeight.get() * progress.get(),
  }));

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${progress.get() * 180}deg` }],
  }));

  return (
    <View style={[styles.card, elevation.raised, style]}>
      <Pressable
        onPress={onToggle}
        style={styles.header}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? title}
        accessibilityState={{ expanded }}
      >
        <Text style={styles.title}>{title}</Text>
        {accessory}
        <Animated.View style={chevronStyle}>
          <Ionicons name="chevron-down" size={20} color={color.textSecondary} />
        </Animated.View>
      </Pressable>
      {hasMountedContent ? (
        <Animated.View
          style={[styles.body, bodyStyle]}
          accessibilityElementsHidden={!expanded}
          importantForAccessibility={expanded ? 'auto' : 'no-hide-descendants'}
          pointerEvents={expanded ? 'auto' : 'none'}
        >
          <View
            style={styles.measured}
            onLayout={(event) => {
              contentHeight.set(event.nativeEvent.layout.height);
            }}
          >
            {children}
          </View>
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: color.surface1,
    borderRadius: radius.md,
    paddingHorizontal: space.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    minHeight: MIN_TARGET_SIZE,
    paddingVertical: space.sm,
  },
  title: {
    ...typography.headline,
    color: color.textPrimary,
    flex: 1,
  },
  body: {
    overflow: 'hidden',
  },
  measured: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingBottom: space.md,
    gap: space.sm,
  },
});
