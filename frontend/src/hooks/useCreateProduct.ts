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
      const formData = new FormData();

      // ✅ إضافة الصور
      if (productData.images && productData.images.length > 0) {
        productData.images.forEach((img) => {
          formData.append("images", img);
        });
      }

      // ✅ الحقول الأساسية
      formData.append("name", productData.name);
      formData.append("price", String(productData.price));
      formData.append("description", productData.description);
      formData.append("category_id", String(productData.category_id));
      formData.append("brand_id", String(productData.brand_id || 1));
      formData.append("stock", String(productData.stock || 0));
      formData.append("sale", String(productData.sale || 0));
      formData.append("rate", String(productData.rate || 0));

      // ✅ الألوان
      if (productData.colors && productData.colors.length > 0) {
        productData.colors.forEach((color) => {
          formData.append("colors", color);
        });
      }

      // ✅ المقاسات
      if (productData.sizes && productData.sizes.length > 0) {
        productData.sizes.forEach((size) => {
          formData.append("sizes", size);
        });
      }

      console.log("📤 Sending formData with product info");

      const token = localStorage.getItem("token");
      
      const res = await fetch("http://localhost:5000/api/product/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.err || data.message || "Failed to create product");
      }

      return data;
    },

    onSuccess: (data) => {
      // ✅ تحديث cache فوراً
      const newProduct = data.product || data;
      
      queryClient.setQueryData(["products"], (oldData: any) => {
        console.log("📦 Old products:", oldData);
        console.log("🆕 New product:", newProduct);
        
        if (!oldData) return { products: [newProduct], pagination: { total: 1 } };
        
        // لو كان Array
        if (Array.isArray(oldData)) {
          return [newProduct, ...oldData];
        }
        
        // لو كان Object مع products
        if (oldData?.products) {
          return {
            ...oldData,
            products: [newProduct, ...oldData.products],
            pagination: {
              ...oldData.pagination,
              total: (oldData.pagination?.total || 0) + 1,
            },
          };
        }
        
        return oldData;
      });
      
      // ✅ invalidate لضمان التحديث
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("✨ Product created successfully!");
      
      // ✅ التوجيه لصفحة المنتج الجديد
      const productId = newProduct.id;
      if (productId) {
        router.push(`/shop/${productId}`);
      } else {
        router.push("/admin/products");
      }
      router.refresh();
    },

    onError: (err: any) => {
      console.error("❌ Create product error:", err);
      toast.error(err.message || "Failed to create product");
    },
  });

  return { createProduct, isPending };
}