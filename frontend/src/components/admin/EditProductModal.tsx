"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditProductSchema, type EditProductForm } from "@/lib/validation/productSchemas";
import { useEditProduct } from "@/hooks/useEditProduct";
import { X, Upload, Trash2, Image as ImageIcon } from "lucide-react";

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product: {
    id: number;
    name: string;
    description: string;
    price: number;
    sale: number;
    stock: number;
    images?: { id: number; url: string }[];
  } | null;
}

export default function EditProductModal({ isOpen, onClose, onSuccess, product }: EditProductModalProps) {
  const { editProduct, isPending } = useEditProduct();
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<number[]>([]);
  const [existingImages, setExistingImages] = useState<{ id: number; url: string }[]>([]);

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
      });
      setExistingImages(product.images || []);
      setNewImages([]);
      setNewImagePreviews([]);
      setImagesToDelete([]);
    }
  }, [product, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setNewImages(prev => [...prev, ...files]);
      const previews = files.map(file => URL.createObjectURL(file));
      setNewImagePreviews(prev => [...prev, ...previews]);
    }
  };

  const removeNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
    setNewImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const markImageForDeletion = (imageId: number) => {
    setImagesToDelete(prev => [...prev, imageId]);
    setExistingImages(prev => prev.filter(img => img.id !== imageId));
  };

  const onSubmit = async (data: EditProductForm) => {
    if (!product) return;
    await editProduct({
      productId: product.id,
      data,
      newImages: newImages.length > 0 ? newImages : undefined,
      imagesToDelete: imagesToDelete.length > 0 ? imagesToDelete : undefined,
    });
    onSuccess();
    onClose();
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-beige-medium sticky top-0 bg-white">
          <h2 className="text-2xl font-serif font-bold text-brown-dark">Edit Product</h2>
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
              className="w-full px-4 py-2 bg-beige-light/50 border border-beige-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-warm text-brown-dark"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-brown-dark mb-1">Description *</label>
            <textarea
              {...register("description")}
              rows={3}
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
                className="w-full px-4 py-2 bg-beige-light/50 border border-beige-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-warm text-brown-dark"
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-brown-dark mb-1">Stock *</label>
              <input
                {...register("stock")}
                type="number"
                className="w-full px-4 py-2 bg-beige-light/50 border border-beige-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-warm text-brown-dark"
              />
              {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-brown-dark mb-1">Sale (%)</label>
            <input
              {...register("sale")}
              type="number"
              step="1"
              className="w-full px-4 py-2 bg-beige-light/50 border border-beige-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-warm text-brown-dark"
            />
            {errors.sale && <p className="text-red-500 text-sm mt-1">{errors.sale.message}</p>}
          </div>

          {/* Images Section */}
          <div>
            <label className="block text-sm font-semibold text-brown-dark mb-1">Product Images</label>
            
            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div className="mb-3">
                <p className="text-xs text-brown-warm mb-2">Current Images:</p>
                <div className="flex gap-2 flex-wrap">
                  {existingImages.map((img) => (
                    <div key={img.id} className="relative w-16 h-16 rounded-lg overflow-hidden border border-beige-medium group">
                      <img src={img.url} alt="Product" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => markImageForDeletion(img.id)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Images Preview */}
            {newImagePreviews.length > 0 && (
              <div className="mb-3">
                <p className="text-xs text-green-600 mb-2">New Images to add:</p>
                <div className="flex gap-2 flex-wrap">
                  {newImagePreviews.map((preview, i) => (
                    <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-beige-medium">
                      <img src={preview} alt={`New ${i}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeNewImage(i)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Button */}
            <div className="border-2 border-dashed border-beige-medium rounded-lg p-3 text-center">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
                id="edit-product-images"
              />
              <label htmlFor="edit-product-images" className="cursor-pointer flex items-center justify-center gap-2">
                <Upload className="w-4 h-4 text-brown-warm" />
                <span className="text-sm text-brown-warm">Upload new images</span>
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
              {isPending ? "Saving..." : "Save Changes"}
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