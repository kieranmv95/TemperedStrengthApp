import { space } from '@/src/constants/tokens';
import { StyleSheet } from 'react-native';

export const restDayCarouselStyles = StyleSheet.create({
  scrollBleed: {
    marginHorizontal: -space.md,
  },
  list: {
    gap: space.sm,
    paddingHorizontal: space.md,
    alignItems: 'stretch',
  },
  card: {
    flex: 1,
    marginBottom: 0,
  },
});
