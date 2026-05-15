"use client";
import { useQuery } from "@tanstack/react-query";
import { type ProductFilters, type ProductsResponse } from "@/types/product";

export function useProducts(
  page: number = 1,
  limit: number = 12,
  filters: ProductFilters = {}
) {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (filters.category_id) queryParams.append("category_id", String(filters.category_id));
  if (filters.min_price) queryParams.append("min_price", String(filters.min_price));
  if (filters.max_price) queryParams.append("max_price", String(filters.max_price));
  if (filters.name) queryParams.append("name", filters.name);
  if (filters.status) queryParams.append("status", filters.status);

  const { data, isLoading, error, refetch } = useQuery<ProductsResponse>({
    queryKey: ["products", page, limit, filters],
    queryFn: async () => {
      const res = await fetch(
        `http://localhost:5000/api/product/list?${queryParams}`
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.err || data.message || "Failed to fetch products");
      }

      // معالجة response من backend
      let products = [];
      let pagination = { page: 1, limit: 12, total: 0, totalPages: 1 };

      if (data?.pagination?.rows) {
        products = data.products.rows;
        pagination = data.pagination || pagination;
      } else if (Array.isArray(data?.products)) {
        products = data.products;
        pagination = data.pagination || pagination;
      } else if (Array.isArray(data)) {
        products = data;
      }

      return { products, pagination };
    },
  });

  return {
    products: data?.products || [],
    pagination: data?.pagination,
    isLoading,
    error,
    refetch,
  };
}