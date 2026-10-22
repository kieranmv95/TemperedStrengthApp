import { color, space, typography } from '@/src/constants/tokens';
import { Ionicons } from '@expo/vector-icons';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

type CuratedSectionProps = {
  title: string;
  description: string;
  size: 'large' | 'medium' | 'small';
  style?: StyleProp<ViewStyle>;
  icon?: string;
  iconSizeOverride?: number;
  theme?: 'gold';
};

const TITLE_STYLE = {
  large: typography.title2,
  medium: typography.headline,
  small: typography.calloutStrong,
} as const;

const ICON_SIZE = { large: 22, medium: 20, small: 18 } as const;

/**
 * Section heading with a description. Prefer SectionHeader for new code;
 * this keeps its legacy props for existing screens.
 */
export const CuratedSection = ({
  title,
  description,
  size,
  style,
  icon,
  iconSizeOverride,
  theme,
}: CuratedSectionProps) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.titleRow}>
        {icon ? (
          <Ionicons
            name={icon as keyof typeof Ionicons.glyphMap}
            size={iconSizeOverride ?? ICON_SIZE[size]}
            color={color.gold}
          />
        ) : null}
        <Text
          style={[
            TITLE_STYLE[size],
            styles.title,
            theme === 'gold' && styles.titleGold,
          ]}
          accessibilityRole="header"
        >
          {title}
        </Text>
      </View>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: space.xxs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
  },
  title: {
    color: color.textPrimary,
    flexShrink: 1,
  },
  titleGold: {
    color: color.gold,
  },
  description: {
    ...typography.callout,
    color: color.textSecondary,
  },
});
