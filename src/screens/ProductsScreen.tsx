import React, { useState, useMemo } from 'react';
import {
  View,
  TextInput,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useProducts } from '../hooks/useProducts';
import { useDebounce } from '../hooks/useDebounce';
import ProductItem from '../components/ProductItem';
import { useDeleteProduct } from '../hooks/useDeleteProduct';

export const ProductsScreen = () => {
  const [search, setSearch] = useState('');

  const debouncedSearch = useDebounce(search, 500);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isRefetching,
    refetch,
    status,
    isLoading,
  } = useProducts(debouncedSearch);

  const deleteMutation = useDeleteProduct(debouncedSearch);

  /* useMemo => memoize the products array reference
     During refresh:
     First render (isRefetching true) → data unchanged → same products reference
     Second render (isRefetching false) → still same reference

     FlatList won’t think data changed.
     Much more stable.

    🧠 Important Distinction

       Re-render ≠ list item re-render

       Even if parent renders:

       FlatList will not re-render each item if:

       - data reference is same
       - keyExtractor stable
       - renderItem stable
  */
  const products = useMemo(() => {
    return data?.pages.flatMap(page => page.products) ?? [];
  }, [data]);

  const isInitialLoading = isLoading && !data;

  return (
    <View style={{ flex: 1 }}>
      <TextInput
        placeholder="Search products..."
        value={search}
        onChangeText={setSearch}
        style={styles.input}
      />
      {isInitialLoading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={products}
          renderItem={({ item }) => (
            <ProductItem 
            item={item} 
            onDelete={(id) => deleteMutation.mutate(id)} 
            />
          )}
          keyExtractor={item => item.id.toString()}
          onEndReached={() => {
            if (hasNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingNextPage ? <ActivityIndicator /> : null
          }
          // ✅ Pull to refresh
          refreshing={isRefetching}
          onRefresh={refetch}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#464444',
    borderRadius: 24,
    margin: 16,
  },
});
