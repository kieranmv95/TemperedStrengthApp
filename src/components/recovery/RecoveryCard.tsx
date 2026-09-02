import { Colors } from '@/src/constants/theme';
import type { Recovery } from '@/src/types/recovery';
import { COACH_ROLE, premiumAccessBadgeLabel } from '@/src/utils/workoutAccess';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleProp, Text, View, ViewStyle } from 'react-native';
import { Card } from '../ds';
import { DIFFICULTY_COLORS } from '../workouts/workoutUiConstants';
import { workoutsListStyles as styles } from '../workouts/workoutsListStyles';

type RecoveryCardProps = {
  recovery: Recovery;
  isPro: boolean;
  onPress: (recovery: Recovery) => void;
  onLockedPress: () => void;
  style?: StyleProp<ViewStyle>;
  /** Hide equipment/tag pills under the meta row. */
  hidePills?: boolean;
  /** Hide the PRO pill; premium flows use a gold border instead. */
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
  const usePremiumBorder = recovery.isPremium && hideProBadge;
  // All premium mobility flows unlock for coaches.
  const premiumBadge = premiumAccessBadgeLabel([COACH_ROLE]);

  const handlePress = () => {
    if (isLocked) {
      onLockedPress();
      return;
    }
    onPress(recovery);
  };

  return (
    <Card
      style={[
        styles.workoutCard,
        isLocked && styles.workoutCardLocked,
        usePremiumBorder && styles.workoutCardLocked,
        style,
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
      accessibilityLabel="Open recovery flow"
    >
      <View>
        {showProBadge ? (
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <View style={styles.premiumBadge}>
                <Text style={styles.premiumBadgeText}>{premiumBadge}</Text>
              </View>
            </View>
          </View>
        ) : null}

        <Text style={styles.cardTitle}>{recovery.title}</Text>
        <Text style={styles.cardDescription} numberOfLines={1}>
          {recovery.description}
        </Text>

        <View style={styles.cardMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={14} color={Colors.accent} />
            <Text style={styles.metaTimeText}>
              {recovery.estimatedTime} min
            </Text>
          </View>
          <View
            style={[
              styles.difficultyBadge,
              { borderColor: DIFFICULTY_COLORS[recovery.difficulty] },
            ]}
          >
            <Text
              style={[
                styles.difficultyText,
                { color: DIFFICULTY_COLORS[recovery.difficulty] },
              ]}
            >
              {recovery.difficulty}
            </Text>
          </View>
        </View>

        {hidePills ? null : (
          <View style={styles.tagsContainer}>
            {recovery.equipment.map((equipment, index) => (
              <View key={index} style={[styles.tag, styles.tagGold]}>
                <Text style={[styles.tagText, styles.tagGoldText]}>
                  {equipment}
                </Text>
              </View>
            ))}
            {recovery.tags.slice(0, 3).map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </Card>
  );
}
