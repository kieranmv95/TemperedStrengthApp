import {
  color,
  elevation,
  MIN_TARGET_SIZE,
  radius,
  space,
  typography,
} from '@/src/constants/tokens';
import { StyleSheet } from 'react-native';

const CATEGORY_ICON_SIZE = 14;
const COLLAB_IMAGE_SIZE = 48;
const LIST_BULLET_SIZE = 6;

export const workoutDetailStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.bg,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xxs,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
  },
  backButton: {
    width: MIN_TARGET_SIZE,
    height: MIN_TARGET_SIZE,
    justifyContent: 'center',
    marginLeft: -space.xs,
  },
  detailTitle: {
    ...typography.title2,
    color: color.textPrimary,
    flex: 1,
  },
  headerRightSpacer: {
    width: MIN_TARGET_SIZE,
  },
  detailFavoriteButton: {
    width: MIN_TARGET_SIZE,
    height: MIN_TARGET_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -space.xs,
  },
  lockedState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.xxl,
    gap: space.sm,
  },
  lockedTitle: {
    ...typography.title2,
    color: color.textPrimary,
    textAlign: 'center',
  },
  lockedDescription: {
    ...typography.callout,
    color: color.textSecondary,
    textAlign: 'center',
  },
  lockedCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.xs,
    minHeight: MIN_TARGET_SIZE,
    marginTop: space.sm,
    paddingHorizontal: space.xl,
    borderRadius: radius.pill,
    backgroundColor: color.gold,
  },
  lockedCtaPressed: {
    backgroundColor: color.goldStrong,
  },
  lockedCtaText: {
    ...typography.calloutStrong,
    color: color.onGold,
  },
  detailContent: {
    flex: 1,
  },
  detailContentContainer: {
    paddingHorizontal: space.md,
    paddingTop: space.xs,
    paddingBottom: space.xxl,
    gap: space.md,
  },
  detailMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: space.sm,
  },
  detailCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
  },
  categoryIconImage: {
    width: CATEGORY_ICON_SIZE + space.xxs,
    height: CATEGORY_ICON_SIZE + space.xxs,
    resizeMode: 'contain',
  },
  detailCategoryText: {
    ...typography.overline,
    color: color.textTertiary,
  },
  detailMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xxs,
  },
  detailMetaText: {
    ...typography.captionStrong,
    fontVariant: ['tabular-nums'],
    color: color.textSecondary,
  },
  detailDescription: {
    ...typography.body,
    color: color.textSecondary,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.xs,
  },
  scaleSection: {
    gap: space.xs,
  },
  scaleSelectorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.xs,
  },
  blockContainer: {
    ...elevation.raised,
    backgroundColor: color.surface1,
    borderRadius: radius.md,
    padding: space.md,
    gap: space.sm,
  },
  blockName: {
    ...typography.headline,
    color: color.textPrimary,
  },
  blockInstructions: {
    ...typography.callout,
    color: color.textSecondary,
  },
  blockHighlightInstructions: {
    ...typography.calloutStrong,
    color: color.textPrimary,
    backgroundColor: color.surface2,
    borderRadius: radius.sm,
    padding: space.sm,
  },
  movementsList: {
    gap: space.xs,
  },
  movementItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space.xs,
  },
  movementBullet: {
    width: LIST_BULLET_SIZE,
    height: LIST_BULLET_SIZE,
    borderRadius: LIST_BULLET_SIZE / 2,
    backgroundColor: color.gold,
    marginTop: (typography.body.lineHeight - LIST_BULLET_SIZE) / 2,
  },
  movementText: {
    ...typography.body,
    color: color.textPrimary,
    flex: 1,
  },
  divider: {
    paddingLeft: LIST_BULLET_SIZE + space.xs,
    paddingVertical: space.xxs,
  },
  dividerText: {
    ...typography.callout,
    color: color.textTertiary,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.xxl,
    gap: space.xs,
  },
  emptyTitle: {
    ...typography.title2,
    color: color.textPrimary,
    textAlign: 'center',
  },
  emptyDescription: {
    ...typography.callout,
    color: color.textSecondary,
    textAlign: 'center',
  },
  collabHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  collabImage: {
    width: COLLAB_IMAGE_SIZE,
    height: COLLAB_IMAGE_SIZE,
    borderRadius: radius.pill,
    resizeMode: 'cover',
    backgroundColor: color.surface2,
  },
  collabHeaderText: {
    flex: 1,
    gap: space.xxs,
  },
  collabLabel: {
    ...typography.overline,
    color: color.textTertiary,
  },
  collabName: {
    ...typography.headline,
    color: color.textPrimary,
  },
  collabDescription: {
    ...typography.callout,
    color: color.textSecondary,
    marginTop: space.sm,
  },
  collabCtaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    marginTop: space.sm,
  },
  collabCtaText: {
    ...typography.calloutStrong,
    color: color.gold,
  },
});
