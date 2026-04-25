import { BorderRadius, Colors, FontSize, Spacing } from '@/src/constants/theme';
import { StyleSheet } from 'react-native';

export const settingsScreenStyles = StyleSheet.create({
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
    borderColor: Colors.borderSubtle,
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
    borderColor: Colors.destructiveAlt,
  },
  dangerText: {
    color: Colors.destructiveAlt,
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
    borderColor: Colors.borderDefault,
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
