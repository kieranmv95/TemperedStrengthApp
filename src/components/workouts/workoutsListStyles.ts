import {
  color,
  MIN_TARGET_SIZE,
  radius,
  space,
  typography,
} from '@/src/constants/tokens';
import { StyleSheet } from 'react-native';

const CHIP_ROW_PADDING = space.xxs;

export const workoutsListStyles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    minHeight: MIN_TARGET_SIZE + space.xxs,
    paddingLeft: space.sm,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: color.borderStrong,
    backgroundColor: color.surface2,
  },
  searchInput: {
    ...typography.body,
    flex: 1,
    color: color.textPrimary,
    paddingVertical: space.xs,
  },
  clearSearch: {
    width: MIN_TARGET_SIZE,
    height: MIN_TARGET_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filtersRow: {
    gap: space.xxs,
  },
  filtersLabel: {
    ...typography.captionStrong,
    color: color.textSecondary,
  },
  /** Vertical padding keeps each chip's 44pt hit area inside the scroll view. */
  filterScrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    paddingVertical: CHIP_ROW_PADDING,
  },
  listContent: {
    paddingHorizontal: space.md,
    paddingTop: space.xs,
    paddingBottom: space.xxl,
  },
  sponsorCard: {
    marginBottom: space.md,
  },
  sponsorContent: {
    flex: 1,
    gap: space.sm,
  },
  sponsorDescription: {
    ...typography.callout,
    color: color.textSecondary,
  },
  sponsorLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
  },
  sponsorLinkText: {
    ...typography.calloutStrong,
    color: color.gold,
  },
  sponsorLogo: {
    resizeMode: 'contain',
  },
  recoveryCard: {
    marginBottom: space.xs,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    marginBottom: space.xxs,
  },
  cardTitle: {
    ...typography.headline,
    color: color.textPrimary,
  },
  cardDescription: {
    ...typography.callout,
    color: color.textSecondary,
    marginTop: space.xxs,
  },
  cardMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: space.sm,
    marginTop: space.sm,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xxs,
  },
  metaTimeText: {
    ...typography.captionStrong,
    fontVariant: ['tabular-nums'],
    color: color.textSecondary,
  },
  lockedText: {
    ...typography.captionStrong,
    color: color.gold,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.xs,
    marginTop: space.sm,
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
});
