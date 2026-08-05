import { BorderRadius, FontSize, Spacing } from '@/src/constants/theme';
import { StyleSheet } from 'react-native';

export const shopAdListItemStyles = StyleSheet.create({
  card: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: BorderRadius.xxl,
    borderWidth: 1.5,
    padding: Spacing.lg,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    position: 'absolute',
    top: Spacing.lg,
    left: Spacing.lg,
    right: Spacing.lg,
    zIndex: 1,
    fontSize: FontSize.md,
    fontWeight: '800',
    letterSpacing: -0.2,
    textAlign: 'center',
    opacity: 0.75,
  },
  thumbWrap: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '70%',
    height: '70%',
  },
});
