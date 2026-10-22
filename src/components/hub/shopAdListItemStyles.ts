import { radius, space, typography } from '@/src/constants/tokens';
import { StyleSheet } from 'react-native';

export const shopAdListItemStyles = StyleSheet.create({
  card: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: radius.md,
    borderWidth: 1.5,
    padding: space.sm,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardPressed: {
    opacity: 0.85,
  },
  title: {
    ...typography.captionStrong,
    position: 'absolute',
    top: space.sm,
    left: space.sm,
    right: space.sm,
    zIndex: 1,
    textAlign: 'center',
  },
  image: {
    width: '70%',
    height: '70%',
  },
});
