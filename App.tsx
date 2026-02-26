import React, {useEffect} from 'react';
import {
  QueryClient,
  QueryClientProvider,
  focusManager,
} from '@tanstack/react-query';
import { ProductsScreen } from './src/screens/ProductsScreen';
import {
  StatusBar,
  useColorScheme,
  AppState,
  AppStateStatus,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

// Create cache manager.
const queryClient = new QueryClient({
  defaultOptions: {
    queries:{
      retry: 3,
      refetchOnMount: true,
      refetchOnReconnect: true,
      staleTime:0, // always stale (good for learning phase) 
    }
  }
});

export default function App() {
  const isDarkMode = useColorScheme() === 'dark';

  // ✅ Connect React Native AppState to React Query
  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      (status: AppStateStatus) => {
        focusManager.setFocused(status === 'active');
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);


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

/* 
Source: Part 1. https://chatgpt.com/share/698ae6cf-be4c-8009-b675-5142988e6dd4
        Part 2: https://chatgpt.com/share/6996ac31-d06c-8009-a68f-fa54fe561015 
*/
