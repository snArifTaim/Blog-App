import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { FavoritesProvider } from './src/context/FavoritesContext';
import AppNavigator from './src/navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';

// Inner component that can access theme context for SafeAreaView background
function AppContent() {
  const { colors, theme } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <AppNavigator />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <FavoritesProvider>
        <AppContent />
      </FavoritesProvider>
    </ThemeProvider>
  );
}
