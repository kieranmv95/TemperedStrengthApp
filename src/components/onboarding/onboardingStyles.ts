import { BorderRadius, Colors, FontSize, Spacing } from '@/src/constants/theme';
import { StyleSheet } from 'react-native';

export const onboardingStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundScreen,
  },
  header: {
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.xl,
    gap: Spacing.xl,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.xl,
  },
  progressRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  progressTrack: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.backgroundElevated,
    borderRadius: BorderRadius.pill,
    overflow: 'hidden',
  },
  progressFill: {
    height: 4,
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.pill,
  },
  progressText: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
    fontWeight: '700',
    letterSpacing: 0.5,
    minWidth: 56,
    textAlign: 'right',
  },
  skipSetupButton: {
    paddingVertical: Spacing.sm,
  },
  skipSetupText: {
    color: Colors.textMuted,
    fontSize: FontSize.base,
    fontWeight: '600',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.xxl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.section,
    flexGrow: 1,
  },
  stepBody: {
    flex: 1,
    gap: Spacing.xl,
  },
  stepTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.displayXXl,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  stepSubtitle: {
    color: Colors.textMuted,
    fontSize: FontSize.xxl,
    fontWeight: '500',
    lineHeight: 22,
  },
  textInput: {
    backgroundColor: Colors.backgroundElevated,
    borderRadius: BorderRadius.xxl,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.xxl,
    color: Colors.textPrimary,
    fontSize: FontSize.displaySm,
    fontWeight: '600',
  },
  optionList: {
    gap: Spacing.md,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.backgroundElevated,
    borderRadius: BorderRadius.xxl,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.xxl,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  optionCardSelected: {
    borderColor: Colors.accent,
  },
  optionLabel: {
    color: Colors.textPrimary,
    fontSize: FontSize.displaySm,
    fontWeight: '700',
    flex: 1,
  },
  optionLabelSelected: {
    color: Colors.accent,
  },
  optionCheckSlot: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.md,
  },
  optionCheck: {
    color: Colors.accent,
    fontSize: FontSize.displayLg,
    fontWeight: '800',
    lineHeight: 24,
  },
  iCloudCard: {
    backgroundColor: Colors.backgroundElevated,
    borderRadius: BorderRadius.xxl,
    padding: Spacing.xxl,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    gap: Spacing.md,
  },
  iCloudTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.displaySm,
    fontWeight: '700',
  },
  iCloudDescription: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    lineHeight: 20,
  },
  iCloudRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
  },
  iCloudToggleLabel: {
    color: Colors.textPrimary,
    fontSize: FontSize.xxl,
    fontWeight: '700',
  },
  iCloudUnavailable: {
    color: Colors.textPlaceholder,
    fontSize: FontSize.md,
    fontStyle: 'italic',
    marginTop: Spacing.sm,
  },
  footer: {
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.xl,
    gap: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderDefault,
  },
  primaryButton: {
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.xxl,
    paddingVertical: Spacing.xxl,
    alignItems: 'center',
  },
  primaryButtonDisabled: {
    opacity: 0.4,
  },
  primaryButtonText: {
    color: Colors.textOnAccent,
    fontSize: FontSize.xxl,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  skipStepButton: {
    alignSelf: 'center',
    paddingVertical: Spacing.md,
  },
  skipStepText: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    fontWeight: '600',
  },
});
