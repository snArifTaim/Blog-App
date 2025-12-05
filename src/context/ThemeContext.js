import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';

const ThemeContext = createContext();

export const lightTheme = {
  mode: 'light',
  background: '#F8F9FA',
  card: '#FFFFFF',
  text: '#212529',
  textSecondary: '#6C757D',
  primary: '#4F46E5', // Indigo 600
  secondary: '#E0E7FF', // Indigo 100
  border: '#E9ECEF',
  error: '#DC3545',
  success: '#28A745',
  tint: '#4F46E5',
};

export const darkTheme = {
  mode: 'dark',
  background: '#121212',
  card: '#1E1E1E',
  text: '#E0E0E0',
  textSecondary: '#A0A0A0',
  primary: '#818CF8', // Indigo 400
  secondary: '#312E81', // Indigo 900
  border: '#333333',
  error: '#CF6679',
  success: '#03DAC6',
  tint: '#818CF8',
};

export const ThemeProvider = ({ children }) => {
  const systemScheme = useColorScheme();
  const [theme, setTheme] = useState(systemScheme === 'dark' ? 'dark' : 'light');

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const colors = theme === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
