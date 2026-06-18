import {
  type ColorScheme,
  type ThemeColors,
  getColorsForScheme,
} from '@/src/constants/theme';
import { getColorScheme, setColorScheme } from '@/src/utils/storage';
import {
  DarkTheme,
  ThemeProvider as NavigationThemeProvider,
  type Theme,
} from '@react-navigation/native';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { StatusBar } from 'expo-status-bar';

type AppThemeContextValue = {
  colorScheme: ColorScheme;
  colors: ThemeColors;
  isReady: boolean;
  setColorScheme: (scheme: ColorScheme) => Promise<void>;
};

const AppThemeContext = createContext<AppThemeContextValue | null>(null);

function buildNavigationTheme(colors: ThemeColors): Theme {
  return {
    ...DarkTheme,
    dark: true,
    colors: {
      ...DarkTheme.colors,
      primary: colors.accent,
      background: colors.backgroundScreen,
      card: colors.backgroundCard,
      text: colors.textPrimary,
      border: colors.backgroundBorder,
      notification: colors.accent,
    },
  };
}

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>('dark');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const stored = await getColorScheme();
        if (!cancelled) {
          setColorSchemeState(stored);
        }
      } catch (error) {
        console.error('Failed to load color scheme:', error);
      } finally {
        if (!cancelled) {
          setIsReady(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const colors = useMemo(
    () => getColorsForScheme(colorScheme),
    [colorScheme]
  );

  const navigationTheme = useMemo(
    () => buildNavigationTheme(colors),
    [colors]
  );

  const persistColorScheme = useCallback(async (scheme: ColorScheme) => {
    setColorSchemeState(scheme);
    try {
      await setColorScheme(scheme);
    } catch (error) {
      console.error('Failed to save color scheme:', error);
      const previous = await getColorScheme();
      setColorSchemeState(previous);
      throw error;
    }
  }, []);

  const value = useMemo(
    () => ({
      colorScheme,
      colors,
      isReady,
      setColorScheme: persistColorScheme,
    }),
    [colorScheme, colors, isReady, persistColorScheme]
  );

  if (!isReady) {
    return null;
  }

  return (
    <AppThemeContext.Provider value={value}>
      <NavigationThemeProvider value={navigationTheme}>
        {children}
        <StatusBar style="light" />
      </NavigationThemeProvider>
    </AppThemeContext.Provider>
  );
}

export function useThemeContext(): AppThemeContextValue {
  const context = useContext(AppThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within AppThemeProvider');
  }
  return context;
}
