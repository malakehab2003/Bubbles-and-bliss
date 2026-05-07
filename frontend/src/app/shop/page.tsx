"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useProducts } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";

interface ProductFilters {
  name?: string;
  minPrice?: number;
  maxPrice?: number;
  category_id?: number;
  minRate?: number;
  inStock?: boolean;
}

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<ProductFilters>({});
  
  const categories = ["All", "Signature", "Floral", "Sweet"];
  
  const { products, pagination, isLoading } = useProducts(currentPage, 12, {
    ...(selectedCategory && selectedCategory !== "All" ? { name: selectedCategory } : {}),
    ...filters,
  });

  const updateFilter = (key: keyof ProductFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "" || value === undefined ? undefined : value,
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({});
    setSelectedCategory(undefined);
    setCurrentPage(1);
  };

  const hasFilters = Object.keys(filters).filter(
    (k) => filters[k as keyof ProductFilters] !== undefined
  ).length > 0;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const addToCart = (productName: string) => {
    alert(`Added ${productName} to cart!`);
  };

  // دالة للحصول على رابط الصورة من المنتج
  const getProductImage = (product: any) => {
    if (product.image && product.image.length > 0) {
      const firstImage = product.image[0];
      return firstImage?.url || firstImage?.images_url || null;
    }
    if (product.images && product.images.length > 0) {
      return product.images[0]?.url || product.images[0]?.images_url || null;
    }
    if (product.images_url && product.images_url.length > 0) {
      return product.images_url[0];
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="bg-[#F3E8DE] min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#8B5E3C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-[#F3E8DE] min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl text-center text-[#5A3A2A] mb-8 font-serif">
          Our Collection
        </h1>
        
        {/* Category Filters */}
        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat === "All" ? undefined : cat);
                setCurrentPage(1);
              }}
              className={`px-6 py-2 rounded-full transition duration-300 ${
                (cat === "All" && !selectedCategory) || selectedCategory === cat
                  ? "bg-[#8B5E3C] text-white"
                  : "border-2 border-[#8B5E3C] text-[#8B5E3C] hover:bg-[#8B5E3C] hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        
        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#8B5E3C] text-lg">No products found</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {products?.map((product: any) => {
                const imageUrl = getProductImage(product);
                return (
                  <div key={product.id} className="bg-white/50 backdrop-blur-sm rounded-lg p-6 text-center hover:shadow-xl transition-all hover:transform hover:-translate-y-1">
                    <Link href={`/shop/${product.id}`}>
                      <div className="w-full h-64 bg-[#E6D5C3] rounded-lg mb-4 flex items-center justify-center cursor-pointer overflow-hidden">
                        {imageUrl ? (
                          <img
                            src={product.image?.[0]?.url}
                            alt={product.name}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <span className="text-[#8B5E3C] text-sm">🖼️ {product.name}</span>
                        )}
                      </div>
                      <h3 className="text-xl font-semibold text-[#5A3A2A] mb-2">{product.name}</h3>
                    </Link>
                    <p className="text-[#8B5E3C] mb-2">{product.price} EGP</p>
                    {product.sale > 0 && (
                      <p className="text-green-600 text-sm">-{product.sale}% OFF</p>
                    )}
                    <button 
                      onClick={() => addToCart(product.name)}
                      className="border-2 border-[#8B5E3C] text-[#8B5E3C] hover:bg-[#8B5E3C] hover:text-white px-6 py-2 rounded-full transition duration-300 mt-3"
                    >
                      Add to Cart
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages >= 1 && (
              <div className="mt-12 pt-6 border-t border-gray-200">
                <div className="flex justify-center gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                      disabled={pagination ? currentPage <= pagination.totalPages : false}

                  >
                    ← Previous
                  </Button>

                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handlePageChange(1)}
                    className="min-w-[40px]"
                  >
                    {currentPage}
                  </Button>

                  {pagination && pagination.totalPages >= 2 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(2)}
                      className="min-w-[40px]"
                    >
                      2
                    </Button>
                  )}

                  <Button
  variant="outline"
  size="sm"
  onClick={() => handlePageChange(currentPage + 1)}
  disabled={pagination ? currentPage != pagination.totalPages : false}
>
  Next →
</Button>

                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}