import {
  color,
  MIN_TARGET_SIZE,
  radius,
  space,
  typography,
} from '@/src/constants/tokens';
import { StyleSheet } from 'react-native';

const THUMB_SIZE = 64;

export const partnerListingCardStyles = StyleSheet.create({
  container: {
    marginBottom: space.sm,
  },
  containerCompact: {
    marginBottom: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space.sm,
  },
  rowWithFavorite: {
    paddingRight: MIN_TARGET_SIZE - space.xs,
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: radius.pill,
  },
  iconTile: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: radius.pill,
    backgroundColor: color.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    minWidth: 0,
    gap: space.xxs,
  },
  kindLabel: {
    ...typography.overline,
    color: color.textTertiary,
  },
  title: {
    ...typography.headline,
    color: color.textPrimary,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    columnGap: space.xs,
    rowGap: space.xxs,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xxs,
    flexShrink: 1,
  },
  locationText: {
    ...typography.caption,
    color: color.textSecondary,
    flexShrink: 1,
  },
  distanceText: {
    ...typography.captionStrong,
    fontVariant: ['tabular-nums'],
    color: color.textSecondary,
  },
  specialtiesText: {
    ...typography.caption,
    color: color.textSecondary,
  },
  description: {
    ...typography.callout,
    color: color.textSecondary,
  },
  statusRow: {
    marginTop: space.xxs,
  },
  favoriteButton: {
    position: 'absolute',
    top: space.xxs,
    right: space.xxs,
    width: MIN_TARGET_SIZE,
    height: MIN_TARGET_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
