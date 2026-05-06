"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateProductSchema, type CreateProductForm } from "@/lib/validation/productSchemas";
import { useCreateProduct } from "@/hooks/useCreateProduct";
import Link from "next/link";
import { useState } from "react";

export default function CreateProductPage() {
  const { createProduct, isPending } = useCreateProduct();
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateProductForm & { imageFiles?: FileList }>({
    resolver: zodResolver(CreateProductSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      sale: 0,
      stock: 0,
      brand_id: 1,
      category_id: 1,
      colors: [],
      sizes: [],
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setValue("images", files);
      const previews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews(previews);
    }
  };

  const onSubmit = (data: CreateProductForm & { imageFiles?: FileList }) => {
    const { imageFiles, ...rest } = data;
    createProduct({
      ...rest,
      images: data.images as File[],
    });
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/products" className="text-[#8B5E3C] hover:text-[#5A3A2A]">
          ← Back
        </Link>
        <h1 className="text-3xl font-serif text-[#5A3A2A]">Add New Product</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white/40 backdrop-blur-sm rounded-2xl p-8 shadow-md space-y-6">
        {/* Name */}
        <div>
          <label className="block text-[#5A3A2A] mb-2">Product Name *</label>
          <input
            {...register("name")}
            type="text"
            className="w-full px-4 py-2 bg-white/50 border border-[#E6D5C3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-[#5A3A2A] mb-2">Description *</label>
          <textarea
            {...register("description")}
            rows={4}
            className="w-full px-4 py-2 text-black bg-white/50 border border-[#E6D5C3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Price */}
          <div>
            <label className="block  text-[#5A3A2A] mb-2">Price (EGP) *</label>
            <input
              {...register("price")}
              type="number"
              step="0.01"
              className="w-full px-4 py-2 text-black bg-white/50 border border-[#E6D5C3] rounded-lg"
            />
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
          </div>

          {/* Sale */}
          <div>
            <label className="block text-[#5A3A2A] mb-2">Sale (%)</label>
            <input
              {...register("sale")}
              type="number"
              step="1"
              className="w-full px-4 py-2 text-black bg-white/50 border border-[#E6D5C3] rounded-lg"
            />
            {errors.sale && <p className="text-red-500 text-sm mt-1">{errors.sale.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Stock */}
          <div>
            <label className="block text-[#5A3A2A] mb-2">Stock *</label>
            <input
              {...register("stock")}
              type="number"
              className="w-full px-4 py-2 text-black bg-white/50 border border-[#E6D5C3] rounded-lg"
            />
            {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock.message}</p>}
          </div>

          {/* Category ID */}
          <div>
            <label className="block text-[#5A3A2A] mb-2">Category ID *</label>
            <input
              {...register("category_id")}
              type="number"
              className="w-full px-4 py-2 text-black bg-white/50 border border-[#E6D5C3] rounded-lg"
            />
            {errors.category_id && <p className="text-red-500 text-sm mt-1">{errors.category_id.message}</p>}
          </div>
        </div>

        {/* Brand ID */}
        <div>
          <label className="block text-[#5A3A2A] mb-2">Brand ID *</label>
          <input
            {...register("brand_id")}
            type="number"
            className="w-full px-4 py-2 text-black bg-white/50 border border-[#E6D5C3] rounded-lg"
          />
          {errors.brand_id && <p className="text-red-500 text-sm mt-1">{errors.brand_id.message}</p>}
        </div>

        {/* Colors */}
        <div>
          <label className="block text-[#5A3A2A] mb-2">Colors (comma separated)</label>
          <input
            onChange={(e) => setValue("colors", e.target.value.split(",").map(c => c.trim()))}
            placeholder="Gold, Silver, Black"
            className="w-full px-4 py-2 text-black bg-white/50 border border-[#E6D5C3] rounded-lg"
          />
        </div>

        {/* Images */}
        <div>
          <label className="block text-[#5A3A2A] mb-2">Product Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="w-full"
          />
          {imagePreviews.length > 0 && (
            <div className="flex gap-2 mt-2">
              {imagePreviews.map((src, i) => (
                <img key={i} src={src} alt="Preview" className="w-16 h-16 object-cover rounded-lg" />
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isPending}
            className="bg-[#8B5E3C] hover:bg-[#5A3A2A] text-white px-6 py-2 rounded-lg transition disabled:opacity-50"
          >
            {isPending ? "Creating..." : "Create Product"}
          </button>
          <Link
            href="/admin/products"
            className="border border-[#8B5E3C] text-[#8B5E3C] hover:bg-[#8B5E3C] hover:text-white px-6 py-2 rounded-lg transition"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}