import {
  color,
  MIN_TARGET_SIZE,
  radius,
  space,
  typography,
} from '@/src/constants/tokens';
import { StyleSheet } from 'react-native';

const THUMBNAIL_SIZE = 72;

export const articleCardStyles = StyleSheet.create({
  card: {
    marginBottom: space.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  rowWithFavourite: {
    paddingRight: MIN_TARGET_SIZE - space.xs,
  },
  compactImage: {
    width: THUMBNAIL_SIZE,
    height: THUMBNAIL_SIZE,
    borderRadius: radius.sm,
  },
  compactContent: {
    flexGrow: 1,
    flexShrink: 1,
    minWidth: 0,
    gap: space.xxs,
  },
  compactCategory: {
    ...typography.overline,
    color: color.gold,
  },
  compactTitle: {
    ...typography.headline,
    color: color.textPrimary,
  },
  compactMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xxs,
  },
  compactMetaText: {
    ...typography.caption,
    fontVariant: ['tabular-nums'],
    color: color.textSecondary,
  },
  favouriteButton: {
    position: 'absolute',
    top: space.xxs,
    right: space.xxs,
    width: MIN_TARGET_SIZE,
    height: MIN_TARGET_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
