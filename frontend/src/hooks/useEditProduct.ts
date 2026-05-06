"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { type EditProductForm } from "@/lib/validation/productSchemas";

type EditProductPayload = {
  productId: number;
  data: EditProductForm;
};

export function useEditProduct() {
  const queryClient = useQueryClient();

  const { mutate: editProduct, isPending } = useMutation({
    mutationFn: async ({ productId, data }: EditProductPayload) => {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/api/product/update/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.err || result.message || "Failed to update product");
      }

      return result;
    },

    onSuccess: (data, variables) => {
      // تحديث cache للمنتج الفردي
      queryClient.invalidateQueries({ queryKey: ["product", variables.productId] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      
      toast.success("Product updated successfully!");
    },

    onError: (err: any) => {
      console.error("Update error:", err);
      toast.error(err.message || "Failed to update product");
    },
  });

  return { editProduct, isPending };
}