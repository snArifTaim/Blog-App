import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/context/ThemeContext';
import client from './src/apollo/client';
import AppNavigator from './src/navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <ApolloProvider client={client}>
      <SafeAreaView style={{ flex: 1 }}>
        <ThemeProvider>
          <StatusBar style="auto" />
          <AppNavigator />
        </ThemeProvider>
      </SafeAreaView>
    </ApolloProvider>
  );
}
