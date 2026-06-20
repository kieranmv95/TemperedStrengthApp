import {
  BorderRadius,
  Colors,
  FontSize,
  Spacing,
  type ThemeColors,
} from '@/src/constants/theme';
import { StyleSheet } from 'react-native';

export const createOnboardingStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundScreen,
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
      backgroundColor: colors.backgroundElevated,
      borderRadius: BorderRadius.pill,
      overflow: 'hidden',
    },
    progressFill: {
      height: 4,
      backgroundColor: colors.accent,
      borderRadius: BorderRadius.pill,
    },
    progressText: {
      color: colors.textMuted,
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
      color: colors.textMuted,
      fontSize: FontSize.base,
      fontWeight: '600',
    },
    scroll: {
      flex: 1,
    },
    welcomeStepContainer: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: Spacing.xxl,
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
    welcomeStepBody: {
      alignItems: 'center',
      gap: Spacing.xl,
    },
    welcomeStepTitle: {
      color: colors.textPrimary,
      fontSize: FontSize.displayXXl,
      fontWeight: '800',
      letterSpacing: -0.5,
      textAlign: 'center',
    },
    welcomeStepSubtitle: {
      color: colors.textMuted,
      fontSize: FontSize.xxl,
      fontWeight: '500',
      lineHeight: 22,
      textAlign: 'center',
    },
    stepTitle: {
      color: colors.textPrimary,
      fontSize: FontSize.displayXXl,
      fontWeight: '800',
      letterSpacing: -0.5,
    },
    stepSubtitle: {
      color: colors.textMuted,
      fontSize: FontSize.xxl,
      fontWeight: '500',
      lineHeight: 22,
    },
    genderHeroImage: {
      width: '100%',
      height: 280,
    },
    textInput: {
      backgroundColor: colors.backgroundElevated,
      borderRadius: BorderRadius.xxl,
      borderWidth: 1,
      borderColor: colors.backgroundSubtle,
      paddingHorizontal: Spacing.xxl,
      paddingVertical: Spacing.xxl,
      color: colors.textPrimary,
      fontSize: FontSize.displaySm,
      fontWeight: '600',
    },
    optionList: {
      gap: Spacing.md,
    },
    optionListInline: {
      gap: Spacing.md,
      flexWrap: 'wrap',
      flexDirection: 'row',
    },
    optionCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.backgroundElevated,
      borderRadius: BorderRadius.xxl,
      paddingHorizontal: Spacing.xxl,
      paddingVertical: Spacing.xxl,
      borderWidth: 1,
      borderColor: colors.backgroundSubtle,
    },
    optionCardSelected: {
      borderColor: colors.accentWashBorder,
      backgroundColor: colors.accentWashFill,
    },
    optionCardNotFullWidth: {
      alignSelf: 'flex-start',
    },
    optionLabelNotFullWidth: {
      flex: 0,
    },
    optionLabel: {
      color: colors.textPrimary,
      fontSize: FontSize.displaySm,
      fontWeight: '700',
      flex: 1,
    },
    optionLabelSelected: {
      color: colors.accentText,
    },
    optionCheckSlot: {
      width: 24,
      height: 24,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: Spacing.md,
    },
    optionCheck: {
      color: colors.accentText,
      fontSize: FontSize.displayLg,
      fontWeight: '800',
      lineHeight: 24,
    },
    iCloudCard: {
      backgroundColor: colors.backgroundElevated,
      borderRadius: BorderRadius.xxl,
      padding: Spacing.xxl,
      borderWidth: 1,
      borderColor: colors.backgroundSubtle,
      gap: Spacing.md,
    },
    iCloudTitle: {
      color: colors.textPrimary,
      fontSize: FontSize.displaySm,
      fontWeight: '700',
    },
    iCloudDescription: {
      color: colors.textMuted,
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
      color: colors.textPrimary,
      fontSize: FontSize.xxl,
      fontWeight: '700',
    },
    iCloudUnavailable: {
      color: colors.textPlaceholder,
      fontSize: FontSize.md,
      fontStyle: 'italic',
      marginTop: Spacing.sm,
    },
    footer: {
      paddingHorizontal: Spacing.xxl,
      paddingTop: Spacing.xl,
      gap: Spacing.md,
      borderTopWidth: 1,
      borderTopColor: colors.backgroundElevated,
    },
    footerSecondaryRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    primaryButton: {
      backgroundColor: colors.accent,
      borderRadius: BorderRadius.xxl,
      paddingVertical: Spacing.xxl,
      alignItems: 'center',
    },
    primaryButtonDisabled: {
      opacity: 0.4,
    },
    primaryButtonText: {
      color: colors.textOnAccent,
      fontSize: FontSize.xxl,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    skipStepButton: {
      alignSelf: 'center',
      paddingVertical: Spacing.md,
    },
    backStepButton: {
      paddingVertical: Spacing.md,
    },
    skipStepText: {
      color: colors.textMuted,
      fontSize: FontSize.lg,
      fontWeight: '600',
    },
  });

/** Static dark-theme styles for onboarding (see createOnboardingStyles for themed variant). */
export const onboardingStyles = createOnboardingStyles(Colors);
