import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchProducts } from "../api/productsApi";

export const useProducts = () =>{
    return useInfiniteQuery({
        queryKey: ['products'],
        queryFn: ({ pageParam}) => fetchProducts({ pageParam }),
        initialPageParam: 0, // ✅ REQUIRED in v5
        getNextPageParam: (lastPage) => {
            const totalLoaded = lastPage.skip + lastPage.products.length;

            if(totalLoaded >= lastPage.total){
                return undefined; // No more pages to load
            }

            return totalLoaded; // Next page's skip value
        },
        retry: 3,        
    }); 
};