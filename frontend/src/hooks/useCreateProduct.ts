"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import type { CreateProductForm } from "@/lib/validation/productSchemas";

export function useCreateProduct() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate: createProduct, isPending } = useMutation({
    mutationFn: async (productData: CreateProductForm & { images?: File[] }) => {
      // Step 1: Create product first
      const productPayload = {
        name: productData.name,
        description: productData.description,
        price: productData.price,
        stock: productData.stock,
        category_id: productData.category_id,
        brand_id: productData.brand_id || 1,
        sale: productData.sale || 0,
        rate: productData.rate || 0,
        colors: productData.colors || [],
        sizes: productData.sizes || [],
      };

      console.log("📤 Creating product:", productPayload);

      const token = localStorage.getItem("token");
      
      const createRes = await fetch("http://localhost:5000/api/product/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productPayload),
      });

      const createData = await createRes.json();

      if (!createRes.ok) {
        throw new Error(createData.err || createData.message || "Failed to create product");
      }

      const productId = createData.product?.id || createData.id;
      console.log("✅ Product created with ID:", productId);

      // Step 2: Upload images if exists
      if (productData.images && productData.images.length > 0 && productId) {
        const formData = new FormData();
        productData.images.forEach((img) => {
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

        const imageData = await imageRes.json();

        if (!imageRes.ok) {
          console.warn("Image upload failed:", imageData);
          toast.warning("Product created but image upload failed");
        } else {
          console.log("✅ Images uploaded successfully");
        }
      }

      return createData;
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product created successfully!");
      router.push("/admin/products");
      router.refresh();
    },

    onError: (err: any) => {
      console.error("❌ Create product error:", err);
      toast.error(err.message || "Failed to create product");
    },
  });

  return { createProduct, isPending };
}