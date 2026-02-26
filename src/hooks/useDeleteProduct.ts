import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteProduct } from '../api/productsApi';
import Toast from 'react-native-toast-message';

export const useDeleteProduct = (search: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,

    // 🔥 OPTIMISTIC UPDATE
    onMutate: async (productId: number) => {
      await queryClient.cancelQueries({ queryKey: ['products', search] });

      const previousData = queryClient.getQueryData(['products', search]);

      queryClient.setQueryData(['products', search], (oldData: any) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            products: page.products.filter((p: any) => p.id !== productId),
            total: page.total - 1, // Decrease total count
          })),
        };
      });

      return { previousData };
    },

    // ❌ ROLLBACK
    onError: (err, productId, context: any) => {
      if (context?.previousData) {
        queryClient.setQueryData(['products', search], context.previousData);
      }
      Toast.show({
        type: 'error',
        text1: 'Failed to delete product',
        text2: err.message,
      });
    },

    // ✅ AFTER SUCCESS → REALIGN PAGINATION
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};
