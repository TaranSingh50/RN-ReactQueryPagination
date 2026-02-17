import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useProducts } from '../hooks/useProducts';
import Toast from 'react-native-toast-message';
import ProductItem from '../components/ProductItem';

export const ProductsScreen = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isRefetching,
    refetch,
    status,
    error,
    isError,
    isLoading
  } = useProducts();

  const products = data?.pages.flatMap(page => page.products) ?? [];

  // ✅ Hook must be BEFORE any return
  useEffect(() => {
    if (isError && error instanceof Error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message,
        position: 'top',
      });
    }
  }, [isError, error]);

  if (isLoading) {
    return <ActivityIndicator size="large" />;
  }


  return (
    <FlatList
      data={products}
      renderItem={({ item }) => <ProductItem item={item} />}
      keyExtractor={item => item.id.toString()}
      onEndReached={() => {
        if (hasNextPage) {
          fetchNextPage();
        }
      }}
      onEndReachedThreshold={0.5}
      ListFooterComponent={isFetchingNextPage ? <ActivityIndicator /> : null}
      // ✅ Pull to refresh
      refreshing={isRefetching}
      onRefresh={refetch}
    />
  );
};
