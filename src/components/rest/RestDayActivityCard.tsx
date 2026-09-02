import { Card } from '@/src/components/ds';
import { BorderRadius, Colors, FontSize, Spacing } from '@/src/constants/theme';
import type { RestDayActivitySuggestion } from '@/src/types/restDaySuggestions';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

type RestDayActivityCardProps = {
  activity: RestDayActivitySuggestion;
  style?: StyleProp<ViewStyle>;
};

export function RestDayActivityCard({ activity, style }: RestDayActivityCardProps) {
  return (
    <Card style={[styles.card, style]}>
      <View style={styles.visualTile}>
        <Ionicons name={activity.icon} size={22} color={Colors.accent} />
      </View>
      <View style={styles.textBlock}>
        <Text style={styles.title}>{activity.title}</Text>
        <Text style={styles.description}>{activity.description}</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundCard,
    borderColor: Colors.backgroundElevated,
    borderWidth: 1,
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.xxl,
    gap: Spacing.xl,
    marginBottom: Spacing.md,
  },
  visualTile: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.accentWashFill,
    borderWidth: 1,
    borderColor: Colors.accentWashOutline,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  textBlock: {
    flex: 1,
    minWidth: 0,
    gap: Spacing.xs,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: FontSize.xl,
    fontWeight: '800',
    lineHeight: 20,
  },
  description: {
    color: Colors.textSecondary,
    fontSize: FontSize.md,
    lineHeight: 18,
  },
});
