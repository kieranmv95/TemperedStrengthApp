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
    borderBottomColor: Colors.borderDefault,
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
  },
  dayItemSelected: {
    backgroundColor: Colors.backgroundElevated,
    borderRadius: BorderRadius.lg,
  },
  dayLabel: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  dayLabelSelected: {
    color: Colors.textPrimary,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: BorderRadius.xs,
    marginTop: 2,
  },
  dotWorkout: {
    backgroundColor: Colors.textMuted,
  },
  dotToday: {
    backgroundColor: Colors.accent,
  },
  jumpToTodayButton: {
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.backgroundElevated,
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
