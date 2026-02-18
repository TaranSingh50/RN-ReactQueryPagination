import { apiClient } from "./client";

export interface Product {
    id: number;
    title: string;
    price: number;
    thumbnail: string;
}

interface ProductResponse {
    products: Product[];
    total: number;
    skip: number;
    limit: number;
}

export const fetchProducts = async ({
    pageParam = 0,
    search = '',
}: {
    pageParam?: number;
    search?:string;
}):Promise<ProductResponse> => {
    const endpoint = search 
    ? `/products/search?q=${search}&limit=10&skip=${pageParam}`
    : `/products?limit=10&skip=${pageParam}`; 
    
    const response = await apiClient.get<ProductResponse>(
        endpoint
    )

    return response.data;
}