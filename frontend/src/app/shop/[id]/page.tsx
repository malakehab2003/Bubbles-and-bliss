"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useProduct } from "@/hooks/useProduct";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = parseInt(params.id as string);
  const { product, isLoading } = useProduct(productId);

  if (isLoading) {
    return (
      <div className="bg-[#F3E8DE] min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#8B5E3C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-[#F3E8DE] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-[#5A3A2A] mb-4">Product Not Found</h1>
          <Link href="/shop">
            <button className="bg-[#8B5E3C] text-white px-6 py-2 rounded-full">Back to Shop</button>
          </Link>
        </div>
      </div>
    );
  }

  const finalPrice = product.sale > 0 
    ? product.price * (1 - product.sale / 100) 
    : product.price;

  return (
    <div className="bg-[#F3E8DE] min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <Link href="/shop" className="text-[#8B5E3C] hover:text-[#5A3A2A] mb-6 inline-block">
          ← Back to Collection
        </Link>
        
        <div className="grid md:grid-cols-2 gap-12 bg-white/30 rounded-2xl p-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="bg-[#E6D5C3] h-96 rounded-lg flex items-center justify-center overflow-hidden">
              {product.images?.[0]?.url ? (
                <Image
                  src={product.images[0].url}
                  alt={product.name}
                  width={400}
                  height={400}
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-6xl text-[#8B5E3C]">🖼️</span>
              )}
            </div>
            
            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.slice(1, 4).map((img) => (
                  <div key={img.id} className="w-20 h-20 bg-[#E6D5C3] rounded-lg overflow-hidden">
                    <Image src={img.url} alt={product.name} width={80} height={80} className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Info */}
          <div>
            <h1 className="text-3xl md:text-4xl text-[#5A3A2A] mb-4 font-serif">{product.name}</h1>
            
            <div className="mb-4">
              {product.sale > 0 ? (
                <>
                  <span className="text-2xl text-red-500 font-bold">{finalPrice.toFixed(0)} EGP</span>
                  <span className="text-lg text-[#8B5E3C] line-through ml-2">{product.price} EGP</span>
                  <span className="ml-2 text-green-600">-{product.sale}%</span>
                </>
              ) : (
                <span className="text-2xl text-[#8B5E3C] font-bold">{product.price} EGP</span>
              )}
            </div>
            
            <p className="text-[#5A3A2A] mb-6 leading-relaxed">{product.description}</p>
            
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[#5A3A2A] mb-3">Colors</h3>
                <div className="flex gap-2">
                  {product.colors.map((color, i) => (
                    <span key={i} className="px-3 py-1 bg-white/50 rounded-full text-sm text-[#8B5E3C]">
                      {color}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mb-6">
              <p className="text-[#8B5E3C]">
                <span className="font-semibold">Stock:</span> {product.stock} items
              </p>
            </div>
            
            <div className="flex gap-4 mt-8">
              <button className="bg-[#8B5E3C] hover:bg-[#5A3A2A] text-white px-8 py-3 rounded-full transition duration-300">
                Add to Cart
              </button>
              <button className="border-2 border-[#8B5E3C] text-[#8B5E3C] hover:bg-[#8B5E3C] hover:text-white px-8 py-3 rounded-full transition duration-300">
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}