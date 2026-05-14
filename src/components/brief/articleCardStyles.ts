import { BorderRadius, Colors, FontSize, Spacing } from '@/src/constants/theme';
import { StyleSheet } from 'react-native';

export const articleCardStyles = StyleSheet.create({
  card: {
    marginBottom: Spacing.lg,
  },
  compactImage: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.backgroundElevated,
  },
  compactContent: {
    flex: 1,
    marginLeft: Spacing.xl,
    gap: Spacing.xs,
  },
  compactCategoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactCategory: {
    color: Colors.accent,
    fontSize: FontSize.sm,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  compactTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.xl,
    fontWeight: '600',
    lineHeight: 20,
  },
  compactMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  compactMetaText: {
    color: Colors.textPlaceholder,
    fontSize: FontSize.md,
  },
});
