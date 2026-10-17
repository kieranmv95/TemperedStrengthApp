import { color, radius, space, typography } from '@/src/constants/tokens';
import { StyleSheet } from 'react-native';

const ICON_WELL_SIZE = 40;

export const shopAdListItemStyles = StyleSheet.create({
  content: {
    gap: space.xs,
  },
  overline: {
    ...typography.overline,
    color: color.textTertiary,
  },
  imagePanel: {
    width: '100%',
    aspectRatio: 1,
    padding: space.sm,
    borderRadius: radius.sm,
    backgroundColor: color.textPrimary,
  },
  image: {
    flex: 1,
    backgroundColor: color.textPrimary,
  },
  iconWell: {
    width: ICON_WELL_SIZE,
    height: ICON_WELL_SIZE,
    borderRadius: radius.sm,
    backgroundColor: color.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.headline,
    color: color.textPrimary,
  },
});
