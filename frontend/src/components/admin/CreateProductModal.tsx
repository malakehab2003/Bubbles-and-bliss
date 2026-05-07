"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateProductSchema, type CreateProductForm } from "@/lib/validation/productSchemas";
import { useCreateProduct } from "@/hooks/useCreateProduct";
import { X, Upload } from "lucide-react";

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateProductModal({ isOpen, onClose, onSuccess }: CreateProductModalProps) {
  const { createProduct, isPending } = useCreateProduct();
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
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
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setImageFiles(files);
      const previews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews(previews);
    }
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: CreateProductForm) => {
    await createProduct({
      ...data,
      images: imageFiles,
    });
    reset();
    setImageFiles([]);
    setImagePreviews([]);
    onSuccess();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-beige-medium sticky top-0 bg-white">
          <h2 className="text-2xl font-serif font-bold text-brown-dark">Add New Product</h2>
          <button onClick={onClose} className="p-1 hover:bg-beige-light rounded-full transition">
            <X className="w-5 h-5 text-brown-warm" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-brown-dark mb-1">Product Name *</label>
            <input
              {...register("name")}
              type="text"
              placeholder="Enter product name"
              className="w-full px-4 py-2 bg-beige-light/50 border border-beige-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-warm text-brown-dark"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-brown-dark mb-1">Description *</label>
            <textarea
              {...register("description")}
              rows={3}
              placeholder="Enter product description"
              className="w-full px-4 py-2 bg-beige-light/50 border border-beige-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-warm text-brown-dark"
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-brown-dark mb-1">Price (EGP) *</label>
              <input
                {...register("price")}
                type="number"
                step="0.01"
                placeholder="0.00"
                className="w-full px-4 py-2 bg-beige-light/50 border border-beige-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-warm text-brown-dark"
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-brown-dark mb-1">Stock *</label>
              <input
                {...register("stock")}
                type="number"
                placeholder="0"
                className="w-full px-4 py-2 bg-beige-light/50 border border-beige-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-warm text-brown-dark"
              />
              {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-brown-dark mb-1">Sale (%)</label>
              <input
                {...register("sale")}
                type="number"
                step="1"
                placeholder="0"
                className="w-full px-4 py-2 bg-beige-light/50 border border-beige-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-warm text-brown-dark"
              />
              {errors.sale && <p className="text-red-500 text-sm mt-1">{errors.sale.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-brown-dark mb-1">Category ID</label>
              <input
                {...register("category_id")}
                type="number"
                placeholder="1"
                className="w-full px-4 py-2 bg-beige-light/50 border border-beige-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-warm text-brown-dark"
              />
              {errors.category_id && <p className="text-red-500 text-sm mt-1">{errors.category_id.message}</p>}
            </div>
          </div>

          {/* Hidden fields */}
          <input {...register("brand_id")} type="hidden" value={1} />

          {/* Images */}
          <div>
            <label className="block text-sm font-semibold text-brown-dark mb-1">Product Images</label>
            
            {imagePreviews.length > 0 && (
              <div className="mb-3">
                <div className="flex gap-2 flex-wrap">
                  {imagePreviews.map((preview, i) => (
                    <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-beige-medium">
                      <img src={preview} alt={`Preview ${i}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="border-2 border-dashed border-beige-medium rounded-lg p-3 text-center">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
                id="create-product-images"
              />
              <label htmlFor="create-product-images" className="cursor-pointer flex items-center justify-center gap-2">
                <Upload className="w-4 h-4 text-brown-warm" />
                <span className="text-sm text-brown-warm">Click to upload images</span>
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-brown-warm hover:bg-brown-dark text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
            >
              {isPending ? "Creating..." : "Create Product"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-beige-medium text-brown-dark font-semibold rounded-lg hover:bg-beige-light transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}