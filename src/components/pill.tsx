import { BorderRadius, Colors, FontSize, Spacing } from '@/src/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

type PillProps = {
  onPress: () => void;
  isActive: boolean;
  label: string;
  icon?: string;
  count?: number;
};

export const Pill = ({ onPress, isActive, label, icon, count }: PillProps) => {
  return (
    <TouchableOpacity
      style={[styles.filterTab, isActive && styles.filterTabActive]}
      onPress={onPress}
    >
      {icon && (
        <Ionicons
          name={icon as any}
          size={14}
          color={isActive ? Colors.textOnAccent : Colors.textMuted}
          style={styles.filterIcon}
        />
      )}
      <Text
        style={[styles.filterTabText, isActive && styles.filterTabTextActive]}
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
    backgroundColor: 'rgba(255,255,255,0.045)',
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    shadowColor: '#000000',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  filterTabActive: {
    backgroundColor: Colors.accentSoft,
    borderColor: Colors.accent,
    shadowColor: Colors.accent,
    shadowOpacity: 0.22,
    shadowRadius: 10,
  },
  filterIcon: {
    marginRight: Spacing.xs,
  },
  filterTabText: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    fontWeight: '800',
  },
  filterTabTextActive: {
    color: Colors.textPrimary,
  },
  filterCount: {
    color: Colors.textPlaceholder,
    fontSize: FontSize.md,
    fontWeight: '600',
    marginLeft: Spacing.sm,
  },
  filterCountActive: {
    color: Colors.accent,
  },
});
