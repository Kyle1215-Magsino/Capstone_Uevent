import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme !== null) {
        setIsDark(savedTheme === 'dark');
      }
    } catch (error) {
      console.log('Error loading theme:', error);
      // Ignore error and use system theme
    }
  };

  const toggleTheme = async () => {
    try {
      const newTheme = !isDark;
      setIsDark(newTheme);
      await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.log('Error saving theme:', error);
      // Theme still toggles in memory even if save fails
    }
  };

  const theme = {
    isDark,
    colors: {
      // Background colors
      background: isDark ? '#111827' : '#f0fdf4',
      card: isDark ? '#1f2937' : '#ffffff',
      cardSecondary: isDark ? '#111827' : '#f9fafb',
      
      // Text colors
      text: isDark ? '#f9fafb' : '#111827',
      textSecondary: isDark ? '#d1d5db' : '#6b7280',
      textTertiary: isDark ? '#9ca3af' : '#9ca3af',
      
      // Primary colors
      primary: '#10b981',
      primaryDark: '#059669',
      primaryLight: '#34d399',
      
      // Status colors
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
      
      // Border colors
      border: isDark ? '#374151' : '#e5e7eb',
      borderLight: isDark ? '#374151' : '#f3f4f6',
      
      // Special colors
      overlay: isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.5)',
      shadow: isDark ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.1)',
      
      // Input colors
      inputBackground: isDark ? '#374151' : '#ffffff',
      inputBorder: isDark ? '#4b5563' : '#10b981',
      placeholder: isDark ? '#9ca3af' : '#6b7280',
    },
  };

  return (
    <ThemeContext.Provider value={{ ...theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
