import {
  color,
  elevation,
  MIN_TARGET_SIZE,
  radius,
  space,
  typography,
} from '@/src/constants/tokens';
import { flattenToHex } from '@/src/utils/contrast';
import { StyleSheet } from 'react-native';

const GENDER_HERO_IMAGE_HEIGHT = 280;

const OPTION_SELECTED_FILL = flattenToHex(color.goldTint, color.surface1);

export const onboardingStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.bg,
  },
  keyboardWrapper: {
    flex: 1,
  },
  intro: {
    flex: 1,
  },
  introOverlay: {
    flex: 1,
    padding: space.xl,
  },
  introSkipButton: {
    alignSelf: 'flex-end',
    minHeight: MIN_TARGET_SIZE,
    justifyContent: 'center',
    paddingHorizontal: space.md,
    borderRadius: radius.pill,
    backgroundColor: color.scrim,
  },
  introSkipButtonPressed: {
    backgroundColor: color.surface3,
  },
  introSkipText: {
    ...typography.calloutStrong,
    color: color.textPrimary,
  },
  header: {
    paddingHorizontal: space.md,
    paddingTop: space.md,
    paddingBottom: space.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.sm,
  },
  progressRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
  },
  progressTrack: {
    flex: 1,
  },
  progressText: {
    ...typography.numericSmall,
    color: color.textTertiary,
  },
  skipSetupButton: {
    minHeight: MIN_TARGET_SIZE,
    justifyContent: 'center',
    paddingHorizontal: space.xs,
    marginRight: -space.xs,
    borderRadius: radius.pill,
  },
  skipSetupText: {
    ...typography.calloutStrong,
    color: color.textSecondary,
  },
  stepScreen: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  stepFade: {
    flex: 1,
  },
  welcomeStepContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: space.md,
  },
  scrollContent: {
    padding: space.md,
    paddingBottom: space.xl,
    flexGrow: 1,
  },
  stepBody: {
    flex: 1,
    gap: space.md,
  },
  stepHeading: {
    gap: space.xs,
  },
  welcomeStepBody: {
    alignItems: 'center',
    gap: space.md,
  },
  welcomeStepTitle: {
    ...typography.display,
    color: color.textPrimary,
    textAlign: 'center',
  },
  welcomeStepSubtitle: {
    ...typography.body,
    color: color.textSecondary,
    textAlign: 'center',
  },
  stepTitle: {
    ...typography.title1,
    color: color.textPrimary,
  },
  stepSubtitle: {
    ...typography.body,
    color: color.textSecondary,
  },
  genderHeroImage: {
    width: '100%',
    height: GENDER_HERO_IMAGE_HEIGHT,
  },
  textInput: {
    ...typography.body,
    minHeight: MIN_TARGET_SIZE + space.xxs,
    paddingHorizontal: space.sm,
    paddingVertical: space.sm,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: color.borderStrong,
    backgroundColor: color.surface2,
    color: color.textPrimary,
  },
  optionList: {
    gap: space.xs,
  },
  optionListInline: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.xs,
  },
  optionCard: {
    ...elevation.raised,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    minHeight: MIN_TARGET_SIZE + space.xs,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.borderSubtle,
    backgroundColor: color.surface1,
  },
  optionCardPressed: {
    backgroundColor: color.surface2,
  },
  optionCardSelected: {
    borderColor: color.gold,
    backgroundColor: OPTION_SELECTED_FILL,
  },
  optionLabel: {
    ...typography.headline,
    color: color.textPrimary,
    flex: 1,
  },
  accountChoiceContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: space.xl,
  },
  accountChoiceBody: {
    paddingHorizontal: space.md,
  },
  accountCard: {
    ...elevation.raised,
    backgroundColor: color.surface1,
    borderRadius: radius.md,
    padding: space.md,
    gap: space.xs,
  },
  accountCardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
  },
  accountCardTitle: {
    ...typography.headline,
    color: color.textPrimary,
    flex: 1,
  },
  accountCardDescription: {
    ...typography.callout,
    color: color.textSecondary,
  },
  footer: {
    flexShrink: 0,
    paddingHorizontal: space.md,
    paddingTop: space.sm,
    gap: space.xxs,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: color.borderSubtle,
  },
  footerSecondaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  primaryButton: {
    minHeight: MIN_TARGET_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.lg,
    borderRadius: radius.pill,
    backgroundColor: color.gold,
  },
  primaryButtonPressed: {
    backgroundColor: color.goldStrong,
  },
  primaryButtonDisabled: {
    backgroundColor: color.surface3,
  },
  primaryButtonText: {
    ...typography.calloutStrong,
    color: color.onGold,
  },
  primaryButtonTextDisabled: {
    color: color.textDisabled,
  },
  skipStepButton: {
    alignSelf: 'center',
    minHeight: MIN_TARGET_SIZE,
    justifyContent: 'center',
    paddingHorizontal: space.md,
    borderRadius: radius.pill,
  },
  backStepButton: {
    minHeight: MIN_TARGET_SIZE,
    justifyContent: 'center',
    paddingHorizontal: space.md,
    borderRadius: radius.pill,
  },
  skipStepText: {
    ...typography.calloutStrong,
    color: color.textSecondary,
  },
  textButtonPressed: {
    backgroundColor: color.surface2,
  },
});
