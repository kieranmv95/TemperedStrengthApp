import { Spacing } from '@/src/constants/theme';
import { StyleSheet } from 'react-native';

export const restDayCarouselStyles = StyleSheet.create({
  scrollBleed: {
    marginHorizontal: -Spacing.xxl,
  },
  list: {
    gap: Spacing.md,
    paddingHorizontal: Spacing.xxl,
    alignItems: 'flex-start',
  },
  card: {
    marginBottom: 0,
  },
  cardFill: {
    flex: 1,
    alignSelf: 'stretch',
  },
});
