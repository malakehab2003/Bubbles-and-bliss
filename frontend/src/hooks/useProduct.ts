"use client";
import { useQuery } from "@tanstack/react-query";
import { type Product } from "@/types/product";

export function useProduct(productId: number) {
  const { data, isLoading, error } = useQuery<Product | null>({
    queryKey: ["product", productId],
    queryFn: async () => {
      if (!productId) return null;

      const token = localStorage.getItem("token");
      
      const res = await fetch(
        `http://localhost:5000/api/product/getProduct/${productId}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.err || data.message || "Failed to fetch product");
      }

      return data.product || data;
    },
    enabled: !!productId,
  });

  return { product: data, isLoading, error };
}