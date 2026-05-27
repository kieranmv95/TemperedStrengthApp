import { BorderRadius, Colors, FontSize, Spacing } from '@/src/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

type PillVariant = 'filter' | 'card';

type PillProps = {
  onPress: () => void;
  isActive: boolean;
  label: string;
  icon?: string;
  count?: number;
  /** When true, the pill is non-interactive (no press feedback / action). */
  disabled?: boolean;
  /** `card` matches home quick-link buttons; `filter` is the compact chip style. */
  variant?: PillVariant;
};

export const Pill = ({
  onPress,
  isActive,
  label,
  icon,
  count,
  disabled = false,
  variant = 'filter',
}: PillProps) => {
  const isCard = variant === 'card';

  return (
    <TouchableOpacity
      style={[
        isCard ? styles.cardTab : styles.filterTab,
        isActive &&
          (isCard ? styles.cardTabActive : styles.filterTabActive),
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={disabled ? 1 : undefined}
    >
      {icon && (
        <Ionicons
          name={icon as any}
          size={isCard ? 22 : 14}
          color={
            isCard
              ? Colors.accent
              : isActive
                ? Colors.accent
                : Colors.textMuted
          }
          style={!isCard ? styles.filterIcon : undefined}
        />
      )}
      <Text
        style={[
          isCard ? styles.cardTabText : styles.filterTabText,
          !isCard && isActive && styles.filterTabTextActive,
        ]}
      >
        {label}
      </Text>
      {typeof count === 'number' && (
        <Text
          style={[styles.filterCount, isActive && styles.filterCountActive]}
        >
          {count}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.pill,
    backgroundColor: Colors.backgroundCard,
    borderWidth: 1,
    borderColor: Colors.backgroundElevated,
  },
  filterTabActive: {
    backgroundColor: Colors.accentWashFill,
    borderColor: Colors.accentWashBorder,
  },
  filterIcon: {
    marginRight: Spacing.xs,
  },
  filterTabText: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    fontWeight: '600',
  },
  filterTabTextActive: {
    color: Colors.accent,
  },
  filterCount: {
    color: Colors.textPlaceholder,
    fontSize: FontSize.md,
    fontWeight: '600',
    marginLeft: Spacing.sm,
  },
  filterCountActive: {
    color: Colors.accent,
    opacity: 0.7,
  },
  cardTab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xl,
    borderRadius: BorderRadius.xxl,
    backgroundColor: Colors.backgroundCard,
    borderWidth: 1,
    borderColor: Colors.accentWashBorder,
  },
  cardTabActive: {
    backgroundColor: Colors.accentWashFill,
  },
  cardTabText: {
    color: Colors.textPrimary,
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
});
