import {
  color,
  elevation,
  MIN_TARGET_SIZE,
  radius,
  space,
  typography,
} from '@/src/constants/tokens';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AppSafeAreaView, AppScrollView } from '@/src/components/ds';

type ToolScreenShellProps = {
  title: string;
  children: React.ReactNode;
};

export function ToolScreenShell({ title, children }: ToolScreenShellProps) {
  return (
    <AppSafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable
          style={styles.headerBackButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={24} color={color.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle} accessibilityRole="header">
          {title}
        </Text>
      </View>
      <AppScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </AppScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xxs,
    paddingHorizontal: space.md,
    paddingTop: space.md,
    paddingBottom: space.sm,
  },
  headerBackButton: {
    width: MIN_TARGET_SIZE,
    height: MIN_TARGET_SIZE,
    justifyContent: 'center',
    marginLeft: -space.xs,
  },
  headerTitle: {
    ...typography.title1,
    color: color.textPrimary,
    flex: 1,
    minWidth: 0,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: space.md,
    paddingTop: space.md,
    paddingBottom: space.xxl,
    gap: space.md,
  },
});

export const toolFormStyles = StyleSheet.create({
  card: {
    backgroundColor: color.surface1,
    borderRadius: radius.md,
    padding: space.md,
    gap: space.md,
    ...elevation.raised,
  },
  cardDescription: {
    ...typography.body,
    color: color.textSecondary,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: space.sm,
  },
  /** Large text: the unit choice wraps below the input. */
  fieldRowStacked: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  fieldInput: {
    flex: 1,
  },
  /** Holds the input height so chips line up with the field, not its label. */
  unitToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    minHeight: MIN_TARGET_SIZE + space.xxs,
  },
  sectionLabel: {
    ...typography.captionStrong,
    color: color.textSecondary,
  },
  primaryButton: {
    minHeight: MIN_TARGET_SIZE,
    paddingHorizontal: space.lg,
    borderRadius: radius.pill,
    backgroundColor: color.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonPressed: {
    backgroundColor: color.goldStrong,
  },
  primaryButtonText: {
    ...typography.headline,
    color: color.onGold,
  },
  resultLabel: {
    ...typography.headline,
    color: color.textPrimary,
  },
  resultValue: {
    ...typography.numericLarge,
    color: color.textPrimary,
  },
  resultBody: {
    ...typography.callout,
    color: color.textSecondary,
  },
  divider: {
    paddingTop: space.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: color.borderSubtle,
    gap: space.xs,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingBottom: space.xs,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: color.borderSubtle,
  },
  tableHeaderCell: {
    ...typography.captionStrong,
    flex: 1,
    color: color.textSecondary,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: space.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: color.borderSubtle,
  },
  tableCell: {
    ...typography.numericSmall,
    flex: 1,
    color: color.textPrimary,
  },
  errorText: {
    ...typography.callout,
    color: color.danger,
    backgroundColor: color.dangerTint,
    borderRadius: radius.sm,
    padding: space.sm,
  },
});
