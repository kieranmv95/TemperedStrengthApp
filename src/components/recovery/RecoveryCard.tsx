import { Badge, PressableCard, Tag } from '@/src/components/ds';
import { workoutsListStyles as styles } from '@/src/components/workouts/workoutsListStyles';
import { color } from '@/src/constants/tokens';
import type { Recovery, RecoveryEquipment } from '@/src/types/recovery';
import { COACH_ROLE, premiumAccessBadgeLabel } from '@/src/utils/workoutAccess';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleProp, Text, View, ViewStyle } from 'react-native';

const MAX_TAGS = 3;

function equipmentLabel(equipment: RecoveryEquipment): string {
  return equipment.charAt(0).toUpperCase() + equipment.slice(1);
}

type RecoveryCardProps = {
  recovery: Recovery;
  isPro: boolean;
  onPress: (recovery: Recovery) => void;
  onLockedPress: () => void;
  style?: StyleProp<ViewStyle>;
  /** Hide equipment/tag pills under the meta row. */
  hidePills?: boolean;
  /** Hide the PRO badge, e.g. in compact carousels. */
  hideProBadge?: boolean;
};

export function RecoveryCard({
  recovery,
  isPro,
  onPress,
  onLockedPress,
  style,
  hidePills = false,
  hideProBadge = false,
}: RecoveryCardProps) {
  const isLocked = recovery.isPremium && !isPro;
  const showProBadge = recovery.isPremium && !hideProBadge;
  // All premium mobility flows unlock for coaches.
  const premiumBadge = premiumAccessBadgeLabel([COACH_ROLE]);
  const hasPills = recovery.equipment.length > 0 || recovery.tags.length > 0;

  const handlePress = () => {
    if (isLocked) {
      onLockedPress();
      return;
    }
    onPress(recovery);
  };

  const accessibilityLabel = [
    recovery.title,
    `${recovery.estimatedTime} minutes`,
    recovery.difficulty,
    recovery.isPremium ? premiumBadge : null,
    isLocked ? 'locked' : null,
  ]
    .filter((part): part is string => !!part)
    .join(', ');

  return (
    <PressableCard
      onPress={handlePress}
      showChevron={false}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={
        isLocked ? 'Opens the You tab to unlock this flow' : undefined
      }
      style={[styles.recoveryCard, style]}
    >
      {showProBadge ? (
        <View style={styles.cardHeader}>
          <Badge label={premiumBadge} />
        </View>
      ) : null}

      <Text style={styles.cardTitle}>{recovery.title}</Text>
      <Text style={styles.cardDescription} numberOfLines={1}>
        {recovery.description}
      </Text>

      <View style={styles.cardMeta}>
        <View style={styles.metaItem}>
          <Ionicons name="time-outline" size={16} color={color.textSecondary} />
          <Text style={styles.metaTimeText}>{recovery.estimatedTime} min</Text>
        </View>
        <Badge label={recovery.difficulty} tone="neutral" />
        {isLocked ? (
          <View style={styles.metaItem}>
            <Ionicons name="lock-closed" size={14} color={color.gold} />
            <Text style={styles.lockedText}>Unlock with Pro</Text>
          </View>
        ) : null}
      </View>

      {hidePills || !hasPills ? null : (
        <View style={styles.tagsContainer}>
          {recovery.equipment.map((equipment, index) => (
            <Tag key={`equipment-${index}`} label={equipmentLabel(equipment)} />
          ))}
          {recovery.tags.slice(0, MAX_TAGS).map((tag, index) => (
            <Tag key={`tag-${index}`} label={tag} />
          ))}
        </View>
      )}
    </PressableCard>
  );
}
