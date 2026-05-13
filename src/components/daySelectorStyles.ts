import {
  GAP,
  ITEM_MIN_WIDTH,
  ITEM_PADDING_H,
  SCROLL_PADDING_H,
} from '@/src/components/daySelectorConstants';
import { BorderRadius, Colors, FontSize, Spacing } from '@/src/constants/theme';
import { StyleSheet } from 'react-native';

export const daySelectorStyles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundCard,
    borderBottomWidth: 1,
    borderBottomColor: Colors.backgroundElevated,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  scrollView: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingHorizontal: SCROLL_PADDING_H,
    alignItems: 'center',
    gap: GAP,
  },
  dayItem: {
    alignItems: 'center',
    paddingHorizontal: ITEM_PADDING_H,
    paddingVertical: Spacing.md,
    minWidth: ITEM_MIN_WIDTH,
    borderWidth: 1,
    borderColor: Colors.backgroundCard,
    borderRadius: BorderRadius.lg,
  },
  dayItemSelected: {
    backgroundColor: Colors.accentWashFill,
    borderWidth: 1,
  },
  dayItemToday: {
    borderColor: Colors.accentWashBorder,
  },
  dayLabel: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    fontWeight: '600',
  },
  dayLabelSelected: {
    color: Colors.textPrimary,
  },
  dayLabelOnToday: {
    color: Colors.textPrimary,
  },
  daySubLabel: {
    marginTop: 2,
    marginBottom: Spacing.xs,
    color: Colors.textMuted,
    fontSize: FontSize.sm,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  daySubLabelSelected: {
    color: Colors.textPrimary,
  },
  daySubLabelOnToday: {
    color: Colors.textOnAccent,
  },
  dot: {
    width: 12,
    height: 3,
    borderRadius: BorderRadius.xs,
    marginTop: 2,
  },
  dotPlaceholder: {
    opacity: 0,
  },
  dotWorkoutToday: {
    backgroundColor: Colors.accent,
  },
  dotWorkoutOnDarkSurface: {
    backgroundColor: Colors.textMuted,
  },
  jumpToTodayButton: {
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.accent,
  },
  jumpToTodayText: {
    color: Colors.accent,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  timelineActionRow: {
    alignSelf: 'center',
    marginTop: Spacing.md,
    flexDirection: 'row',
    gap: Spacing.md,
  },
});
