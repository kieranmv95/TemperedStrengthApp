import { BorderRadius, Colors, FontSize, Spacing } from '@/src/constants/theme';
import { StyleSheet } from 'react-native';

export const settingsScreenStyles = StyleSheet.create({
  upgradePrompt: {
    backgroundColor: Colors.accentWashFill,
    borderRadius: BorderRadius.xxl,
    borderWidth: 1,
    borderColor: Colors.accentWashBorder,
    padding: Spacing.section,
    marginBottom: Spacing.xl,
  },
  upgradePromptTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.displaySm,
    fontWeight: '800',
    marginBottom: Spacing.sm,
  },
  upgradePromptBody: {
    color: Colors.textSecondary,
    fontSize: FontSize.lg,
    lineHeight: 22,
    fontWeight: '500',
  },
  upgradePromptCta: {
    color: Colors.accent,
    fontSize: FontSize.xl,
    fontWeight: '800',
    marginTop: Spacing.xl,
  },
  settingsList: {
    gap: Spacing.xl,
  },
  settingsSection: {
    gap: Spacing.md,
  },
  settingsSectionTitle: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    fontWeight: '700',
    paddingHorizontal: Spacing.sm,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.backgroundElevated,
    borderRadius: BorderRadius.xxl,
    padding: Spacing.xxl,
    borderWidth: 1,
    borderColor: Colors.backgroundSubtle,
  },
  settingItemDisabled: {
    opacity: 0.5,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.displaySm,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  settingTitleDisabled: {
    color: Colors.textMuted,
  },
  settingDescription: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    lineHeight: 20,
  },
  settingArrow: {
    color: Colors.accent,
    fontSize: FontSize.displayXl,
    fontWeight: '600',
    marginLeft: Spacing.xl,
  },
  settingArrowDisabled: {
    color: Colors.textPlaceholder,
  },
  dangerItem: {
    borderColor: Colors.destructive,
  },
  dangerText: {
    color: Colors.destructive,
  },
  proItem: {
    borderColor: Colors.accent,
  },
  proArrow: {
    color: Colors.accent,
  },
  settingTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.xs,
  },
  proBadge: {
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.md,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  proBadgeText: {
    color: Colors.textBlack,
    fontSize: FontSize.xxs,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  proTitle: {
    color: Colors.accent,
    fontSize: FontSize.lg,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  proFeaturesList: {
    marginTop: Spacing.md,
    gap: Spacing.xs,
  },
  proFeatureItem: {
    color: Colors.textPrimary,
    fontSize: FontSize.lg,
    fontWeight: '500',
    lineHeight: 20,
  },
  unitToggle: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
    borderColor: Colors.backgroundElevated,
    overflow: 'hidden',
    marginLeft: Spacing.xl,
  },
  unitToggleDisabled: {
    opacity: 0.5,
  },
  unitToggleOption: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  unitToggleOptionActive: {
    backgroundColor: Colors.accent,
  },
  unitToggleText: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  unitToggleTextActive: {
    color: Colors.textOnAccent,
  },
});
