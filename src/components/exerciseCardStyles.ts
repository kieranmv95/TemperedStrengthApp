import { BorderRadius, Colors, FontSize, Spacing } from '@/src/constants/theme';
import { StyleSheet } from 'react-native';

export const exerciseCardStyles = StyleSheet.create({
  card: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.xxl,
    padding: Spacing.xxl,
    marginBottom: Spacing.xxl,
    borderWidth: 1,
    borderColor: Colors.backgroundElevated,
  },
  header: {
    marginBottom: Spacing.xxl,
  },
  headerLeft: {
    flex: 1,
    gap: Spacing.md,
  },
  exerciseName: {
    color: Colors.textPrimary,
    fontSize: FontSize.displayXl,
    fontWeight: '700',
  },
  headerMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  metaChip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.backgroundElevated,
    borderWidth: 1,
    borderColor: Colors.backgroundSubtle,
  },
  metaChipAccent: {
    backgroundColor: Colors.accentWashFill,
    borderColor: Colors.accentWashBorder,
  },
  metaChipText: {
    color: Colors.textPrimary,
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
  metaChipAccentText: {
    color: Colors.accent,
    fontSize: FontSize.sm,
    fontWeight: '800',
  },
  metaChipRecommended: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.recommendedWashFill,
    borderColor: Colors.recommendedWashBorder,
  },
  metaChipRecommendedText: {
    color: Colors.recommended,
    fontSize: FontSize.sm,
    fontWeight: '800',
  },
  additionalDescription: {
    color: Colors.textSecondary,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  setsHeader: {
    marginBottom: Spacing.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  setsLabel: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  setControls: {
    backgroundColor: Colors.backgroundElevated,
    borderWidth: 1,
    borderColor: Colors.backgroundSubtle,
    borderRadius: BorderRadius.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  restTimerButton: {
    padding: Spacing.xs,
  },
  setControlButton: {
    padding: Spacing.xs,
  },
  setControlButtonDisabled: {
    opacity: 0.3,
  },
  setCountText: {
    color: Colors.textPrimary,
    fontSize: FontSize.xxl,
    fontWeight: '700',
    minWidth: 24,
    textAlign: 'center',
  },
  setContainer: {
    marginBottom: Spacing.xl,
  },
  inputContainer: {
    flexDirection: 'row',
    gap: Spacing.xl,
    marginBottom: 0,
  },
  inputGroup: {
    flex: 1,
  },
  inputGroupRepsOrTime: {
    flex: 1,
  },
  inputGroupGoldButton: {
    backgroundColor: Colors.accent,
  },
  inputGroupWithCheckmark: {
    flex: 0.5,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.md,
  },
  inputLabel: {
    color: Colors.textSecondary,
    fontSize: FontSize.md,
    fontWeight: '600',
    marginBottom: Spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: Colors.backgroundElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    color: Colors.textPrimary,
    fontSize: FontSize.xxl,
    fontWeight: '600',
    borderWidth: 1,
    borderColor: Colors.backgroundSubtle,
  },
  inputFlex: {
    flex: 1,
  },
  inputWithLeadingButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  leadingIconButton: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.backgroundElevated,
    borderWidth: 2,
    borderColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leadingIconButtonDisabled: {
    opacity: 0.5,
  },
  inputButton: {
    borderColor: Colors.accent,
  },
  inputButtonText: {
    paddingVertical: 1,
    color: Colors.accent,
    fontWeight: '700',
    textAlign: 'center',
  },
  inputCompleted: {
    borderColor: Colors.accent,
    borderWidth: 1,
  },
  inputFailed: {
    borderColor: Colors.destructive,
    borderWidth: 1,
  },
  checkmarkButton: {
    paddingBottom: Spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkButtonDisabled: {
    opacity: 0.3,
  },
  swapButtonContainer: {
    marginTop: Spacing.md,
  },
  swapButton: {
    paddingVertical: Spacing.xl,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swapButtonText: {
    color: Colors.accent,
    fontSize: FontSize.lg,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  slotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  slotLabel: {
    color: Colors.accent,
    fontSize: FontSize.md,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.xs,
  },
});
