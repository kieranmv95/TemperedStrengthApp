import { Colors } from '@/src/constants/theme';
import type { Recovery } from '@/src/types/recovery';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { Card } from '../ds';
import { DIFFICULTY_COLORS } from '../workouts/workoutUiConstants';
import { workoutsListStyles as styles } from '../workouts/workoutsListStyles';

type RecoveryCardProps = {
  recovery: Recovery;
  isPro: boolean;
  onPress: (recovery: Recovery) => void;
  onLockedPress: () => void;
};

export function RecoveryCard({
  recovery,
  isPro,
  onPress,
  onLockedPress,
}: RecoveryCardProps) {
  const isLocked = recovery.isPremium && !isPro;

  const handlePress = () => {
    if (isLocked) {
      onLockedPress();
      return;
    }
    onPress(recovery);
  };

  return (
    <Card
      style={[styles.workoutCard, isLocked && styles.workoutCardLocked]}
      onPress={handlePress}
      activeOpacity={0.7}
      accessibilityLabel="Open recovery flow"
    >
      <View>
        {recovery.isPremium ? (
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <View style={styles.premiumBadge}>
                <Text style={styles.premiumBadgeText}>PRO</Text>
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

        <View style={styles.tagsContainer}>
          {recovery.equipment.map((equipment, index) => (
            <View key={index} style={[styles.tag, styles.tagGold]}>
              <Text style={[styles.tagText, styles.tagGoldText]}>{equipment}</Text>
            </View>
          ))}
          {recovery.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </Card>
  );
}
