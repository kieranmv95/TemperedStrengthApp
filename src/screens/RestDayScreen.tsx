import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

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
    padding: 24,
  },
  title: {
    color: '#c9b072',
    fontSize: 36,
    fontWeight: '800',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    color: '#888',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    color: '#CCC',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
});
