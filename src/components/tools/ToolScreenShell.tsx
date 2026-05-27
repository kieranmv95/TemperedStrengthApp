import { BorderRadius, Colors, FontSize, Spacing } from '@/src/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ToolScreenShellProps = {
  title: string;
  children: React.ReactNode;
};

export function ToolScreenShell({ title, children }: ToolScreenShellProps) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBackButton}
          onPress={() => router.back()}
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={styles.headerSpacer} />
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundScreen,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.backgroundElevated,
  },
  headerBackButton: {
    padding: Spacing.xs,
  },
  headerTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.displaySm,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.xxl,
    paddingBottom: Spacing.section,
    gap: Spacing.section,
  },
});

export const toolFormStyles = StyleSheet.create({
  card: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.xxl,
    borderWidth: 1,
    borderColor: Colors.backgroundElevated,
    padding: Spacing.xxl,
    gap: Spacing.xl,
  },
  cardTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.displayMd,
    fontWeight: '700',
  },
  cardDescription: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    lineHeight: 20,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xl,
  },
  fieldLabel: {
    color: Colors.textPrimary,
    fontSize: FontSize.lg,
    fontWeight: '600',
    width: 96,
  },
  fieldInput: {
    flex: 1,
    backgroundColor: Colors.backgroundScreen,
    borderRadius: BorderRadius.xxl,
    borderWidth: 1,
    borderColor: Colors.backgroundElevated,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    color: Colors.textPrimary,
    fontSize: FontSize.xxl,
  },
  unitToggle: {
    flexDirection: 'row',
    borderRadius: BorderRadius.xxl,
    borderWidth: 1,
    borderColor: Colors.backgroundElevated,
    overflow: 'hidden',
  },
  unitOption: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.backgroundScreen,
  },
  unitOptionActive: {
    backgroundColor: Colors.accentWashFill,
  },
  unitOptionText: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    fontWeight: '600',
  },
  unitOptionTextActive: {
    color: Colors.accent,
  },
  primaryButton: {
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.pill,
    paddingVertical: Spacing.xxl,
    alignItems: 'center',
  },
  primaryButtonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    color: Colors.textOnAccent,
    fontSize: FontSize.displaySm,
    fontWeight: '700',
  },
  resultHeading: {
    color: Colors.textPrimary,
    fontSize: FontSize.displayMd,
    fontWeight: '700',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.backgroundElevated,
  },
  tableHeaderCell: {
    flex: 1,
    color: Colors.textMuted,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.backgroundElevated,
  },
  tableCell: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: FontSize.lg,
  },
  errorText: {
    backgroundColor: Colors.destructiveWashFill,
    borderRadius: BorderRadius.xxl,
    borderWidth: 1,
    borderColor: Colors.backgroundElevated,
    padding: Spacing.xl,
    color: Colors.destructive,
    fontSize: FontSize.md,
  },
});
