import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProductsScreen } from './src/screens/ProductsScreen';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

// Create cache manager.
  const queryClient = new QueryClient();

export default function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f0f0f0' }}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <QueryClientProvider client={queryClient}>
          <ProductsScreen />
          <Toast />
        </QueryClientProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}


// Source: https://chatgpt.com/share/698ae6cf-be4c-8009-b675-5142988e6dd4