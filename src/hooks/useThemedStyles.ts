import type { ThemeColors } from '@/src/constants/theme';
import { useMemo } from 'react';
import { useTheme } from '@/src/hooks/use-theme';

export function useThemedStyles<T>(
  factory: (colors: ThemeColors) => T
): T {
  const { colors } = useTheme();
  return useMemo(() => factory(colors), [colors, factory]);
}
