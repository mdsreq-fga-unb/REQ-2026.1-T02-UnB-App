import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { useUserProfile } from './UserProfileContext';

export type Colors = {
  primary: string;
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  success: string;
  danger: string;
  iconBackground: string;
  inactiveText: string;
  textPlaceholder: string;
};

export type Theme = {
  isDark: boolean;
  colors: Colors;
};

const lightColors: Colors = {
  primary: '#1D8D28',
  background: '#f8fafc',
  surface: '#ffffff',
  textPrimary: '#0f172b',
  textSecondary: '#64748b',
  border: '#d6dfec',
  success: '#35A92E',
  danger: '#D4183D',
  iconBackground: '#e8f5ea',
  inactiveText: '#64748b',
  textPlaceholder: '#94a3b8',
};

const darkColors: Colors = {
  primary: '#1D8D28',
  background: '#0F172B', // Or #0A0A0A for outer edges if needed
  surface: '#1D293D',
  textPrimary: '#F8FAFC',
  textSecondary: '#90A1B9', // Secondary text and inactive states
  border: '#314158',
  success: '#6DCE49',
  danger: '#D4183D',
  iconBackground: '#E8F5EA',
  inactiveText: '#64748B',
  textPlaceholder: '#64748B',
};

export const lightTheme: Theme = {
  isDark: false,
  colors: lightColors,
};

export const darkTheme: Theme = {
  isDark: true,
  colors: darkColors,
};

const ThemeContext = createContext<Theme>(lightTheme);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const { themePreference } = useUserProfile();

  const theme = useMemo(() => {
    if (themePreference === 'automatic') {
      return systemColorScheme === 'dark' ? darkTheme : lightTheme;
    }
    return themePreference === 'dark' ? darkTheme : lightTheme;
  }, [themePreference, systemColorScheme]);

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
