import { BorderRadius, Colors, FontSize, Spacing } from '@/src/constants/theme';
import { StyleSheet } from 'react-native';

export const exerciseVideoStyles = StyleSheet.create({
  sheetOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheetBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
  sheet: {
    backgroundColor: Colors.backgroundCard,
    borderTopLeftRadius: BorderRadius.pill,
    borderTopRightRadius: BorderRadius.pill,
    paddingTop: Spacing.xl,
    paddingHorizontal: Spacing.section,
    maxHeight: '88%',
  },
  sheetCloseButton: {
    position: 'absolute',
    top: Spacing.lg,
    right: Spacing.lg,
    zIndex: 1,
    padding: Spacing.xs,
  },
  sheetContent: {
    gap: Spacing.lg,
    paddingTop: Spacing.xxxl,
    paddingBottom: Spacing.sm,
    alignItems: 'center',
  },
  textBlock: {
    alignSelf: 'stretch',
    gap: Spacing.sm,
    paddingRight: Spacing.xxxl,
  },
  videoContainer: {
    alignSelf: 'stretch',
    aspectRatio: 16 / 9,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    backgroundColor: Colors.backgroundElevated,
  },
  webView: {
    flex: 1,
    backgroundColor: Colors.backgroundElevated,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: FontSize.displayMd,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  description: {
    color: Colors.textSecondary,
    fontSize: FontSize.md,
    lineHeight: 22,
    fontWeight: '500',
  },
  playButtonBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    gap: Spacing.md,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.recommendedWashFill,
    borderWidth: 1,
    borderColor: Colors.recommendedWashBorder,
  },
  playButtonLabel: {
    color: Colors.recommended,
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  playButtonSubLabel: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontWeight: '500',
    marginTop: 2,
  },
  playButtonTextBlock: {
    flex: 1,
    minWidth: 0,
  },
});
