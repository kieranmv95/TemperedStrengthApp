import { StyleSheet } from 'react-native';
import { BorderRadius, Colors, FontSize, Spacing } from '../constants/theme';

export const workoutTimerBarStyles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.timerBarBackground,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDefault,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.xl,
  },
  timerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
    minWidth: 0,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accent,
  },
  timerText: {
    color: Colors.textPrimary,
    fontSize: FontSize.displaySm,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  finishButton: {
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md,
  },
  finishButtonText: {
    color: Colors.textOnAccent,
    fontSize: FontSize.lg,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  iconButtonGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  iconButton: {
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    minWidth: 32,
    minHeight: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
