import { color, radius, space, typography } from '@/src/constants/tokens';
import { StyleSheet } from 'react-native';

export const swapModalStyles = StyleSheet.create({
  modalSubtitle: {
    ...typography.callout,
    color: color.textSecondary,
  },
  deviationTitle: {
    ...typography.callout,
    color: color.textPrimary,
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space.xs,
    padding: space.sm,
    borderRadius: radius.sm,
    backgroundColor: color.surface2,
  },
  disclaimerText: {
    ...typography.caption,
    color: color.textSecondary,
    flex: 1,
  },
  section: {
    gap: space.xs,
  },
  noAlternatives: {
    ...typography.callout,
    color: color.textTertiary,
    textAlign: 'center',
    paddingVertical: space.lg,
  },
  sectionHelperText: {
    ...typography.caption,
    color: color.textTertiary,
  },
  alternativeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    padding: space.md,
    borderRadius: radius.md,
    backgroundColor: color.surface2,
  },
  alternativeItemPressed: {
    backgroundColor: color.surface3,
  },
  alternativeContent: {
    flex: 1,
    minWidth: 0,
    gap: space.xs,
  },
  alternativeName: {
    ...typography.headline,
    color: color.textPrimary,
  },
  alternativeMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: space.xs,
  },
  alternativeMatchScore: {
    ...typography.caption,
    color: color.textSecondary,
  },
});
