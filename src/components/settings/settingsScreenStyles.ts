import { BorderRadius, Colors, FontSize, Spacing } from '@/src/constants/theme';
import { StyleSheet } from 'react-native';

export const settingsScreenStyles = StyleSheet.create({
  upgradePrompt: {
    backgroundColor: Colors.accentSoft,
    borderRadius: BorderRadius.xxl,
    borderWidth: 1,
    borderColor: 'rgba(201,150,58,0.28)',
    padding: Spacing.section,
    marginBottom: Spacing.xl,
    shadowColor: Colors.accent,
    shadowOpacity: 0.14,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
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
    color: Colors.accent,
    fontSize: FontSize.sm,
    fontWeight: '800',
    letterSpacing: 0.96,
    textTransform: 'uppercase',
    paddingHorizontal: Spacing.sm,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#151517',
    borderRadius: BorderRadius.xxl,
    padding: Spacing.xxl,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
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
    backgroundColor: Colors.accentSoft,
    paddingHorizontal: Spacing.md,
    paddingVertical: 2,
    borderRadius: BorderRadius.xxl,
    borderWidth: 1,
    borderColor: 'rgba(201,150,58,0.28)',
  },
  proBadgeText: {
    color: Colors.accent,
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
    backgroundColor: 'rgba(255,255,255,0.045)',
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
    backgroundColor: Colors.accentSoft,
  },
  unitToggleText: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  unitToggleTextActive: {
    color: Colors.textPrimary,
  },
});
