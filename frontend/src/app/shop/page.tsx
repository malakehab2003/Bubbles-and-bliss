"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useProducts } from "@/hooks/useProducts";

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  
  const categories = ["All", "Signature", "Floral", "Sweet"];
  
  const { products, pagination, isLoading } = useProducts(currentPage, 12, {
    ...(selectedCategory && selectedCategory !== "All" ? { name: selectedCategory } : {}),
  });

  const addToCart = (productName: string) => {
    alert(`Added ${productName} to cart!`);
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
              {products.map((product) => (
                <div key={product.id} className="bg-white/50 backdrop-blur-sm rounded-lg p-6 text-center hover:shadow-xl transition-all hover:transform hover:-translate-y-1">
                  <Link href={`/shop/${product.id}`}>
                    <div className="w-full h-64 bg-[#E6D5C3] rounded-lg mb-4 flex items-center justify-center cursor-pointer overflow-hidden">
                      {product.images?.[0]?.url ? (
                        <Image
                          src={product.images[0].url}
                          alt={product.name}
                          width={300}
                          height={300}
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
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-12">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-[#8B5E3C] rounded-lg text-[#8B5E3C] disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-[#5A3A2A]">
                  Page {currentPage} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(pagination.totalPages, p + 1))}
                  disabled={currentPage === pagination.totalPages}
                  className="px-4 py-2 border border-[#8B5E3C] rounded-lg text-[#8B5E3C] disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}