import { Card, SmallChevron } from '@/src/components/ds';
import { homeScreenStyles as styles } from '@/src/components/home/homeScreenStyles';
import { Colors, FontSize, Spacing } from '@/src/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type HomeCheckinCardProps = {
  loggedCount: number;
  totalCount: number;
  supplementsDue: number;
  supplementsTotal: number;
  onPress: () => void;
};

function buildStatusLine(input: {
  loggedCount: number;
  totalCount: number;
  supplementsDue: number;
  supplementsTotal: number;
}): string {
  const parts: string[] = [];

  if (input.totalCount > 0) {
    parts.push(
      `${input.loggedCount} of ${input.totalCount} behaviour${
        input.totalCount === 1 ? '' : 's'
      }`
    );
  }

  if (input.supplementsTotal > 0) {
    if (input.supplementsDue < 1) {
      parts.push(
        input.supplementsTotal === 1
          ? 'supplement done'
          : 'supplements done'
      );
    } else {
      parts.push(
        input.supplementsDue === 1
          ? '1 supplement due'
          : `${input.supplementsDue} supplements due`
      );
    }
  }

  if (parts.length === 0) {
    return 'Nothing tracked yet';
  }

  return parts.join(' · ');
}

export function HomeCheckinCard({
  loggedCount,
  totalCount,
  supplementsDue,
  supplementsTotal,
  onPress,
}: HomeCheckinCardProps) {
  if (totalCount < 1 && supplementsTotal < 1) {
    return (
      <Card onPress={onPress} accessibilityLabel="Set up daily check-in">
        <View style={styles.cardBody}>
          <View style={styles.pbListTitleRow}>
            <Ionicons name="checkbox-outline" size={16} color={Colors.accent} />
            <Text style={styles.pbListTitle}>Check-in</Text>
          </View>
          <Text style={cardStyles.statusLine}>
            Add behaviours and supplements to track today
          </Text>
        </View>
        <SmallChevron />
      </Card>
    );
  }

  const status = buildStatusLine({
    loggedCount,
    totalCount,
    supplementsDue,
    supplementsTotal,
  });

  return (
    <Card onPress={onPress} accessibilityLabel="Open daily check-in">
      <View style={styles.cardBody}>
        <View style={styles.pbListTitleRow}>
          <Ionicons name="checkbox-outline" size={16} color={Colors.accent} />
          <Text style={styles.pbListTitle}>Check-in</Text>
        </View>
        <Text style={cardStyles.statusLine}>{status}</Text>
      </View>
      <SmallChevron />
    </Card>
  );
}

const cardStyles = StyleSheet.create({
  statusLine: {
    color: Colors.textSecondary,
    fontSize: FontSize.base,
    fontWeight: '500',
    lineHeight: 18,
    marginTop: Spacing.xs,
  },
});
