import {
  Colors,
  FontSize,
  Spacing
} from '@/src/constants/theme';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AwardsScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.title}>Awards</Text>
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundScreen,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing.section,
  },
  header: {
    padding: Spacing.section,
    paddingBottom: Spacing.xxl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDefault,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: FontSize.displayXXXl,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
});
