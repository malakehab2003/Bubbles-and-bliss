"use client";
import { useParams, useRouter } from "next/navigation";
import { useProduct } from "@/hooks/useProduct";
import { useEditProduct } from "@/hooks/useEditProduct";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditProductSchema, type EditProductForm } from "@/lib/validation/productSchemas";
import Link from "next/link";
import { useEffect } from "react";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = parseInt(params.id as string);
  const { product, isLoading } = useProduct(productId);
  const { editProduct, isPending } = useEditProduct();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditProductForm>({
    resolver: zodResolver(EditProductSchema),
  });

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        sale: product.sale,
        category_id: product.product_category_id,
        brand_id: product.brand_id,
      });
    }
  }, [product, reset]);

  const onSubmit = (data: EditProductForm) => {
    editProduct({ productId, data });
    router.push("/admin/products");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-4 border-[#8B5E3C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/products" className="text-[#8B5E3C] hover:text-[#5A3A2A]">
          ← Back
        </Link>
        <h1 className="text-3xl font-serif text-[#5A3A2A]">Edit Product: {product.name}</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white/40 backdrop-blur-sm rounded-2xl p-8 shadow-md space-y-6">
        <div>
          <label className="block text-[#5A3A2A] mb-2">Product Name</label>
          <input {...register("name")} className="w-full px-4 py-2 bg-white/50 border border-[#E6D5C3] rounded-lg" />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-[#5A3A2A] mb-2">Description</label>
          <textarea {...register("description")} rows={4} className="w-full px-4 py-2 bg-white/50 border border-[#E6D5C3] rounded-lg" />
          {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[#5A3A2A] mb-2">Price (EGP)</label>
            <input {...register("price")} type="number" step="0.01" className="w-full px-4 py-2 bg-white/50 border border-[#E6D5C3] rounded-lg" />
            {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
          </div>

          <div>
            <label className="block text-[#5A3A2A] mb-2">Stock</label>
            <input {...register("stock")} type="number" className="w-full px-4 py-2 bg-white/50 border border-[#E6D5C3] rounded-lg" />
            {errors.stock && <p className="text-red-500 text-sm">{errors.stock.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[#5A3A2A] mb-2">Sale (%)</label>
            <input {...register("sale")} type="number" className="w-full px-4 py-2 bg-white/50 border border-[#E6D5C3] rounded-lg" />
          </div>

          <div>
            <label className="block text-[#5A3A2A] mb-2">Category ID</label>
            <input {...register("category_id")} type="number" className="w-full px-4 py-2 bg-white/50 border border-[#E6D5C3] rounded-lg" />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button type="submit" disabled={isPending} className="bg-[#8B5E3C] hover:bg-[#5A3A2A] text-white px-6 py-2 rounded-lg transition">
            {isPending ? "Saving..." : "Save Changes"}
          </button>
          <Link href="/admin/products" className="border border-[#8B5E3C] text-[#8B5E3C] hover:bg-[#8B5E3C] hover:text-white px-6 py-2 rounded-lg transition">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}