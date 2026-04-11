import { BorderRadius, Colors, FontSize, Spacing } from '@/src/constants/theme';
import { StyleSheet } from 'react-native';

export const exerciseCardStyles = StyleSheet.create({
  card: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.xxl,
    padding: Spacing.xxl,
    marginBottom: Spacing.xxl,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
  },
  header: {
    marginBottom: Spacing.xxl,
  },
  headerLeft: {
    flex: 1,
  },
  exerciseName: {
    color: Colors.accent,
    fontSize: FontSize.displayMd,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  additionalHeader: {
    color: Colors.textSecondary,
    fontSize: FontSize.md,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  additionalDescription: {
    color: Colors.textSecondary,
    fontSize: FontSize.md,
    fontWeight: '600',
    marginBottom: Spacing.xs,
    marginTop: Spacing.xl,
  },
  repRangeLabel: {
    color: Colors.textSecondary,
    fontSize: FontSize.lg,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  amrapLabel: {
    color: Colors.accent,
    fontWeight: '800',
    opacity: 0.75,
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  restTimerButton: {
    padding: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    borderRadius: BorderRadius.md,
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
  inputGroupWithCheckmark: {
    flex: 1,
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
    borderColor: Colors.borderSubtle,
  },
  inputCompleted: {
    borderColor: Colors.accent,
    borderWidth: 2,
  },
  inputFailed: {
    borderColor: Colors.destructive,
    borderWidth: 2,
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
