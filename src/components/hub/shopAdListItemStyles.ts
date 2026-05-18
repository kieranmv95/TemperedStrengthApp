import { BorderRadius, FontSize, Spacing } from '@/src/constants/theme';
import { StyleSheet } from 'react-native';

export const SHOP_THUMB_SIZE = 72;

export const shopAdListItemStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    borderRadius: BorderRadius.xxl,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    overflow: 'hidden',
  },
  thumbWrap: {
    width: SHOP_THUMB_SIZE,
    height: SHOP_THUMB_SIZE,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  thumbImage: {
    width: SHOP_THUMB_SIZE,
    height: SHOP_THUMB_SIZE,
  },
  thumbImageLogo: {
    width: SHOP_THUMB_SIZE,
    height: SHOP_THUMB_SIZE,
  },
  thumbPlaceholder: {
    width: SHOP_THUMB_SIZE,
    height: SHOP_THUMB_SIZE,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    minWidth: 0,
    gap: Spacing.xs,
  },
  title: {
    fontSize: FontSize.displaySm,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  description: {
    fontSize: FontSize.base,
    lineHeight: 19,
    fontWeight: '500',
  },
  chevronWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 32,
    width: 32,
    borderRadius: BorderRadius.xxl,
    borderWidth: 1,
    opacity: 0.35,
    flexShrink: 0,
  },
});
