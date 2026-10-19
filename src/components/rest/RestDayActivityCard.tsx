import { Card } from '@/src/components/ds';
import { color, radius, space, typography } from '@/src/constants/tokens';
import type { RestDayActivitySuggestion } from '@/src/types/restDaySuggestions';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

type RestDayActivityCardProps = {
  activity: RestDayActivitySuggestion;
  style?: StyleProp<ViewStyle>;
};

const ICON_TILE_SIZE = 44;

export function RestDayActivityCard({
  activity,
  style,
}: RestDayActivityCardProps) {
  return (
    <Card style={[styles.card, style]}>
      <View
        style={styles.row}
        accessible
        accessibilityLabel={`${activity.title}, ${activity.description}`}
      >
        <View style={styles.visualTile}>
          <Ionicons name={activity.icon} size={22} color={color.gold} />
        </View>
        <View style={styles.textBlock}>
          <Text style={styles.title}>{activity.title}</Text>
          <Text style={styles.description}>{activity.description}</Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'stretch',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  visualTile: {
    width: ICON_TILE_SIZE,
    height: ICON_TILE_SIZE,
    borderRadius: radius.sm,
    backgroundColor: color.goldTint,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  textBlock: {
    flex: 1,
    minWidth: 0,
    gap: space.xxs,
  },
  title: {
    ...typography.calloutStrong,
    color: color.textPrimary,
  },
  description: {
    ...typography.caption,
    color: color.textSecondary,
  },
});
