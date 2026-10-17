import {
  color,
  elevation,
  MIN_TARGET_SIZE,
  radius,
  space,
  typography,
} from '@/src/constants/tokens';
import { StyleSheet } from 'react-native';

/** Native Switch colours. The thumb position carries the state; the off track is a visible outline colour. */
export const settingsSwitchColors = {
  trackColor: { false: color.borderStrong, true: color.gold },
  thumbColor: color.textPrimary,
  ios_backgroundColor: color.borderStrong,
} as const;

export const settingsScreenStyles = StyleSheet.create({
  /** Also used by the check-in upsell cards. */
  upgradePrompt: {
    ...elevation.raised,
    backgroundColor: color.surface1,
    borderRadius: radius.md,
    padding: space.md,
    gap: space.xs,
  },
  upgradePromptTitle: {
    ...typography.headline,
    color: color.textPrimary,
  },
  upgradePromptBody: {
    ...typography.callout,
    color: color.textSecondary,
  },
  upgradePromptCta: {
    ...typography.calloutStrong,
    color: color.gold,
    marginTop: space.xxs,
  },
  settingsList: {
    gap: space.xl,
  },
  settingsSection: {
    gap: space.xs,
  },
  /** Non-tappable row; matches PressableCard so tappable and static rows line up. */
  settingItem: {
    ...elevation.raised,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    minHeight: MIN_TARGET_SIZE,
    padding: space.md,
    borderRadius: radius.md,
    backgroundColor: color.surface1,
  },
  /** Large text: the control drops below its label. */
  settingItemStacked: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  settingContent: {
    flex: 1,
    minWidth: 0,
    gap: space.xxs,
  },
  settingTitle: {
    ...typography.headline,
    color: color.textPrimary,
  },
  settingTitleDisabled: {
    color: color.textTertiary,
  },
  settingDescription: {
    ...typography.callout,
    color: color.textSecondary,
  },
  settingTitleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: space.xs,
  },
  dangerText: {
    color: color.danger,
  },
  proFeaturesList: {
    marginTop: space.xs,
    gap: space.xxs,
  },
  proTitle: {
    ...typography.calloutStrong,
    color: color.textPrimary,
  },
  proFeatureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space.xs,
  },
  proFeatureItem: {
    ...typography.callout,
    color: color.textPrimary,
    flex: 1,
  },
  unitToggle: {
    flexDirection: 'row',
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: color.borderStrong,
    backgroundColor: color.surface2,
    overflow: 'hidden',
  },
  unitToggleDisabled: {
    opacity: 0.6,
  },
  unitToggleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.xxs,
    minHeight: MIN_TARGET_SIZE,
    minWidth: MIN_TARGET_SIZE,
    paddingHorizontal: space.md,
  },
  unitToggleOptionPressed: {
    backgroundColor: color.surface3,
  },
  unitToggleOptionActive: {
    backgroundColor: color.goldTint,
  },
  unitToggleText: {
    ...typography.calloutStrong,
    color: color.textSecondary,
  },
  unitToggleTextActive: {
    color: color.gold,
  },
});
