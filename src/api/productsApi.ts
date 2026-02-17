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
}: {
    pageParam?: number;
}) => {
    const response = await apiClient.get<ProductResponse>(
        `/products?limit=10&skip=${pageParam}`
    )

    return response.data;
}