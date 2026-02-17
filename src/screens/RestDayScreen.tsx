import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, FontSize, Spacing } from '../constants/theme';

type RestDayScreenProps = {
  onProgramReset?: () => void;
};

export const RestDayScreen: React.FC<RestDayScreenProps> = ({
  onProgramReset,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Rest Day</Text>
        <Text style={styles.subtitle}>
          Your body needs recovery to grow stronger.
        </Text>
        <Text style={styles.description}>
          Take this time to perform active recovery activities such as
          stretching, foam rolling, or yoga, or simply take a day off.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.section,
  },
  title: {
    color: Colors.accent,
    fontSize: FontSize.hero,
    fontWeight: '800',
    marginBottom: Spacing.xl,
    textAlign: 'center',
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: FontSize.displaySm,
    fontWeight: '600',
    marginBottom: Spacing.xxl,
    textAlign: 'center',
  },
  description: {
    color: Colors.textSecondary,
    fontSize: FontSize.xxl,
    lineHeight: 24,
    textAlign: 'center',
    paddingHorizontal: Spacing.xxl,
  },
});
