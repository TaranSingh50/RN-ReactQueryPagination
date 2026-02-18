import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchProducts } from "../api/productsApi";

export const useProducts = (search:string) =>{
    return useInfiniteQuery({
        queryKey: ['products', search],
        queryFn: ({ pageParam = 0}) => fetchProducts({ pageParam, search }),
        initialPageParam: 0, // ✅ REQUIRED in v5
        getNextPageParam: (lastPage) => {
            const totalLoaded = lastPage.skip + lastPage.products.length;

            if(totalLoaded >= lastPage.total){
                return undefined; // No more pages to load
            }

            return totalLoaded; // Next page's skip value
        },
        retry: 3,  
        refetchOnMount: true,
        refetchOnReconnect: true      
    }); 
};

/* 
   What does { pageParam = 0 } mean?

This is just JavaScript destructuring with a default value.

It means:

If pageParam is undefined → use 0.

It does NOT mean pageParam will always be 0.
*/