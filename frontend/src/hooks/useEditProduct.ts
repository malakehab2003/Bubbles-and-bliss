"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

type EditProductPayload = {
  productId: number;
  data: {
    name?: string;
    price?: number;
    description?: string;
    stock?: number;
    category_id?: number;
    brand_id?: number;
    sale?: number;
  };
  newImages?: File[];
  imagesToDelete?: number[];
};

export function useEditProduct() {
  const queryClient = useQueryClient();

  const { mutate: editProduct, isPending } = useMutation({
    mutationFn: async ({ productId, data, newImages, imagesToDelete }: EditProductPayload) => {
      const token = localStorage.getItem("token");

      // Step 1: Update product details
      const updateRes = await fetch(`http://localhost:5000/api/product/update/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const updateData = await updateRes.json();

      if (!updateRes.ok) {
        throw new Error(updateData.err || updateData.message || "Failed to update product");
      }

      // Step 2: Delete old images if specified
      if (imagesToDelete && imagesToDelete.length > 0) {
        for (const imageId of imagesToDelete) {
          try {
            await fetch(`http://localhost:5000/api/product/image/delete/${imageId}`, {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
          } catch (err) {
            console.warn(`Failed to delete image ${imageId}:`, err);
          }
        }
      }

      // Step 3: Upload new images if exists
      if (newImages && newImages.length > 0) {
        const formData = new FormData();
        newImages.forEach((img) => {
          formData.append("images", img);
        });
        formData.append("owner_id", String(productId));
        formData.append("owner_type", "product");

        const imageRes = await fetch("http://localhost:5000/api/product/image/addImages", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!imageRes.ok) {
          console.warn("Image upload failed");
        }
      }

      return updateData;
    },

    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["product", variables.productId] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product updated successfully!");
    },

    onError: (err: any) => {
      console.error("❌ Update error:", err);
      toast.error(err.message || "Failed to update product");
    },
  });

  return { editProduct, isPending };
}