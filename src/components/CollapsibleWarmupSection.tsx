import { BorderRadius, Colors, FontSize, Spacing } from '@/src/constants/theme';
import React, { useState, type ReactNode } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

type CollapsibleWarmupSectionProps = {
  title: string;
  /** Used in accessibility labels, e.g. "Show warm-up". Defaults to "warm-up". */
  contentName?: string;
  /** Optional content between the title and the SHOW/HIDE chip. */
  headerAccessory?: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  children: ReactNode;
};

export function CollapsibleWarmupSection({
  title,
  contentName = 'warm-up',
  headerAccessory,
  containerStyle,
  titleStyle,
  children,
}: CollapsibleWarmupSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View style={containerStyle}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setIsExpanded(true)}
        disabled={isExpanded}
        activeOpacity={0.7}
        accessible={!isExpanded}
        accessibilityRole="button"
        accessibilityLabel={`Show ${contentName}`}
      >
        <Text
          style={[
            styles.title,
            titleStyle,
            !isExpanded && styles.titleCollapsed,
          ]}
          numberOfLines={2}
        >
          {title}
        </Text>
        {headerAccessory}
        <TouchableOpacity
          style={styles.toggle}
          onPress={() => setIsExpanded((prev) => !prev)}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={
            isExpanded ? `Hide ${contentName}` : `Show ${contentName}`
          }
        >
          <Text style={styles.toggleText}>{isExpanded ? 'HIDE' : 'SHOW'}</Text>
        </TouchableOpacity>
      </TouchableOpacity>
      {isExpanded ? <View style={styles.body}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  title: {
    flex: 1,
  },
  titleCollapsed: {
    marginBottom: 0,
  },
  body: {
    marginTop: Spacing.md,
    gap: Spacing.md,
  },
  toggle: {
    flexShrink: 0,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.backgroundSubtle,
    backgroundColor: Colors.backgroundElevated,
  },
  toggleText: {
    color: Colors.accent,
    fontSize: FontSize.sm,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
