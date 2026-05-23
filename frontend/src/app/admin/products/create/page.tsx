"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateProductSchema, type CreateProductForm } from "@/lib/validation/productSchemas";
import { useCreateProduct } from "@/hooks/useCreateProduct";
import Link from "next/link";
import { useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";

export default function CreateProductPage() {
  const { createProduct, isPending } = useCreateProduct();

  // الصور مخزنة هنا بشكل مستقل عن react-hook-form
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateProductForm>({
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
    if (files.length === 0) return;

    setSelectedFiles(files);
    const previews = files.map((f) => URL.createObjectURL(f));
    setImagePreviews(previews);
  };

  const removeImage = (idx: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== idx));
    setImagePreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const onSubmit = (data: CreateProductForm) => {
    createProduct({
      ...data,
      images: selectedFiles, // نبعت الـ files مباشرة
    });
  };

  const inputClass = "w-full px-4 py-2.5 text-[#3a2010] bg-white/60 border border-[#E6D5C3] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] transition";
  const labelClass = "block text-sm font-semibold text-[#5A3A2A] mb-1.5";

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/products" className="text-[#8B5E3C] hover:text-[#5A3A2A] transition">
          ← Back
        </Link>
        <h1 className="text-3xl font-serif text-[#5A3A2A]">Add New Product</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white/40 backdrop-blur-sm rounded-2xl p-8 shadow-md space-y-6">

        {/* Name */}
        <div>
          <label className={labelClass}>Product Name *</label>
          <input {...register("name")} type="text" className={inputClass} placeholder="e.g. Rose Bath Bomb" />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        {/* Description */}
        <div>
          <label className={labelClass}>Description *</label>
          <textarea {...register("description")} rows={4} className={inputClass} placeholder="Describe your product..." />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Price */}
          <div>
            <label className={labelClass}>Price (EGP) *</label>
            <input {...register("price")} type="number" step="0.01" min="0" className={inputClass} />
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
          </div>
          {/* Sale */}
          <div>
            <label className={labelClass}>Sale (%)</label>
            <input {...register("sale")} type="number" step="1" min="0" max="100" className={inputClass} />
            {errors.sale && <p className="text-red-500 text-sm mt-1">{errors.sale.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Stock */}
          <div>
            <label className={labelClass}>Stock *</label>
            <input {...register("stock")} type="number" min="0" className={inputClass} />
            {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock.message}</p>}
          </div>
          {/* Category ID */}
          <div>
            <label className={labelClass}>Category ID *</label>
            <input {...register("category_id")} type="number" min="1" className={inputClass} />
            {errors.category_id && <p className="text-red-500 text-sm mt-1">{errors.category_id.message}</p>}
          </div>
        </div>

        {/* Brand ID */}
        <div>
          <label className={labelClass}>Brand ID *</label>
          <input {...register("brand_id")} type="number" min="1" className={inputClass} />
          {errors.brand_id && <p className="text-red-500 text-sm mt-1">{errors.brand_id.message}</p>}
        </div>

        {/* Colors */}
        <div>
          <label className={labelClass}>Colors <span className="font-normal text-[#8B5E3C]">(comma separated)</span></label>
          <input
            onChange={(e) => setValue("colors", e.target.value.split(",").map((c) => c.trim()).filter(Boolean))}
            placeholder="Gold, Silver, Black"
            className={inputClass}
          />
        </div>

        {/* ─── Images ─────────────────────────────── */}
        <div>
          <label className={labelClass}>Product Images</label>

          {/* Upload Area */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-[#E6D5C3] rounded-xl p-8 text-center cursor-pointer hover:border-[#8B5E3C] hover:bg-white/30 transition-all"
          >
            <ImagePlus className="w-10 h-10 text-[#8B5E3C] mx-auto mb-3 opacity-60" />
            <p className="text-[#5A3A2A] font-semibold text-sm">Click to upload images</p>
            <p className="text-[#8B5E3C] text-xs mt-1">PNG, JPG, WEBP — max 4MB each</p>
          </div>

          {/* Hidden real input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="hidden"
          />

          {/* Previews */}
          {imagePreviews.length > 0 && (
            <div className="flex gap-3 mt-4 flex-wrap">
              {imagePreviews.map((src, i) => (
                <div key={i} className="relative group">
                  <img
                    src={src}
                    alt={`Preview ${i + 1}`}
                    className="w-20 h-20 object-cover rounded-xl border-2 border-[#E6D5C3]"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {selectedFiles.length > 0 && (
            <p className="text-[#8B5E3C] text-sm mt-2">
              ✓ {selectedFiles.length} image{selectedFiles.length > 1 ? "s" : ""} selected
            </p>
          )}
        </div>

        {/* Submit */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isPending}
            className="bg-[#8B5E3C] hover:bg-[#5A3A2A] text-white px-8 py-3 rounded-full transition disabled:opacity-50 font-semibold"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating...
              </span>
            ) : "Create Product"}
          </button>
          <Link
            href="/admin/products"
            className="border-2 border-[#8B5E3C] text-[#8B5E3C] hover:bg-[#8B5E3C] hover:text-white px-8 py-3 rounded-full transition font-semibold"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}