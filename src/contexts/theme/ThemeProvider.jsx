import React, { useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import ThemeContext from './ThemeContext';

const LIGHT_THEME = {
  colors: {
    primary: '#9B59B6',
    onPrimary: '#ffffff',
    background: '#f8f8f8',
    surface: '#ffffff',
    surfaceVariant: '#f0f0f0',
    text: '#333333',
    textSecondary: '#666666',
    border: '#e0e0e0',
  },
};

const DARK_THEME = {
  colors: {
    primary: '#B07CC9',
    onPrimary: '#ffffff',
    background: '#121212',
    surface: '#1e1e1e',
    surfaceVariant: '#2a2a2a',
    text: '#eeeeee',
    textSecondary: '#b0b0b0',
    border: '#333333',
  },
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default function ThemeProvider({ children }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? DARK_THEME : LIGHT_THEME;

  const value = useMemo(
    () => ({
      theme,
      isDark,
    }),
    [theme, isDark]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
