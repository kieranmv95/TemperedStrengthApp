import { LARGE_TEXT_FONT_SCALE } from '@/src/constants/tokens';
import { useWindowDimensions } from 'react-native';

/**
 * True when the OS text size is large enough that side-by-side rows should
 * stack. Updates live when the user changes their text size.
 */
export function useLargeText(): boolean {
  const { fontScale } = useWindowDimensions();
  return fontScale >= LARGE_TEXT_FONT_SCALE;
}
