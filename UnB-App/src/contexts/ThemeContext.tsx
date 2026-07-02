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

const lightHighContrastColors: Colors = {
  primary: '#0B4713', // Much darker green
  background: '#FFFFFF', // Pure white
  surface: '#FFFFFF',
  textPrimary: '#000000', // Pure black
  textSecondary: '#000000', // Pure black
  border: '#000000', // Pure black border for higher contrast
  success: '#0B4713',
  danger: '#7F0018', // Much darker red
  iconBackground: '#FFFFFF',
  inactiveText: '#000000',
  textPlaceholder: '#333333',
};

const darkHighContrastColors: Colors = {
  primary: '#6DCE49', // Brighter green
  background: '#000000', // Pure black
  surface: '#000000',
  textPrimary: '#FFFFFF', // Pure white
  textSecondary: '#FFFFFF', // Pure white
  border: '#FFFFFF', // Pure white border
  success: '#6DCE49',
  danger: '#FF4D6D', // Brighter red
  iconBackground: '#000000',
  inactiveText: '#FFFFFF',
  textPlaceholder: '#CCCCCC',
};

export const lightTheme: Theme = {
  isDark: false,
  colors: lightColors,
};

export const darkTheme: Theme = {
  isDark: true,
  colors: darkColors,
};

export const lightHighContrastTheme: Theme = {
  isDark: false,
  colors: lightHighContrastColors,
};

export const darkHighContrastTheme: Theme = {
  isDark: true,
  colors: darkHighContrastColors,
};

const ThemeContext = createContext<Theme>(lightTheme);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const { themePreference, highContrast } = useUserProfile();

  const theme = useMemo(() => {
    let isDarkMode = false;

    if (themePreference === 'automatic') {
      isDarkMode = systemColorScheme === 'dark';
    } else {
      isDarkMode = themePreference === 'dark';
    }

    if (highContrast) {
      return isDarkMode ? darkHighContrastTheme : lightHighContrastTheme;
    }

    return isDarkMode ? darkTheme : lightTheme;
  }, [themePreference, systemColorScheme, highContrast]);

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
