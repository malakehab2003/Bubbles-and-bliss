"use client";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { useProduct } from "@/hooks/useProduct";

// خيارات المقاسات المتاحة في الـ Backend
const SIZES = ["Small", "Medium", "Large", "X-Large"];

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = parseInt(params.id as string);
  const { product, isLoading } = useProduct(productId);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null); // تغيير: يمكن يكون null

  const addToCart = async () => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      toast.error("Please login first");
      router.push("/signin");
      return;
    }

    setIsAddingToCart(true);

    try {
      // بناء الـ payload - size optional
      const payload: any = {
        product_id: productId,
        quantity: quantity,
      };

      // أضف size فقط لو تم اختياره وليس null
      if (selectedSize && selectedSize !== "") {
        payload.size = selectedSize;
      }

      console.log("📤 Sending payload:", payload);

      const res = await fetch("http://localhost:5000/api/cart/addProduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("📥 Response:", { status: res.status, data });

      if (res.ok) {
        toast.success(`Added ${quantity} item(s) to cart!`);
        window.dispatchEvent(new Event("cartUpdated"));
      } else {
        toast.error(data.err || data.message || "Failed to add to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Something went wrong");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const buyNow = async () => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      toast.error("Please login first");
      router.push("/signin");
      return;
    }

    setIsAddingToCart(true);

    try {
      const payload: any = {
        product_id: productId,
        quantity: quantity,
      };

      if (selectedSize && selectedSize !== "") {
        payload.size = selectedSize;
      }

      const res = await fetch("http://localhost:5000/api/cart/addProduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(`Added ${quantity} item(s) to cart!`);
        window.dispatchEvent(new Event("cartUpdated"));
        router.push("/cart");
      } else {
        toast.error(data.err || data.message || "Failed to add to cart");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong");
    } finally {
      setIsAddingToCart(false);
    }
  };

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

  const getProductImage = () => {
    if (product.image && product.image.length > 0) {
      const firstImage = product.image[0];
      return firstImage?.url || firstImage?.image_url || null;
    }
    if (product.images && product.images.length > 0) {
      return product.images[0]?.url || null;
    }
    return null;
  };

  const imageUrl = getProductImage();

  return (
    <div className="bg-[#F3E8DE] min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <Link href="/shop" className="text-[#8B5E3C] hover:text-[#5A3A2A] mb-6 inline-block">
          ← Back to Collection
        </Link>
        
        <div className="grid md:grid-cols-2 gap-12 bg-white/30 backdrop-blur-sm rounded-2xl p-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="bg-[#E6D5C3] h-96 rounded-lg flex items-center justify-center overflow-hidden">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={product.name}
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-6xl text-[#8B5E3C]">🖼️</span>
              )}
            </div>
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
            
            {/* Size Selector - Optional */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-[#5A3A2A] mb-3">Select Size (Optional)</h3>
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={() => setSelectedSize(null)}
                  className={`px-4 py-2 rounded-full transition duration-300 ${
                    selectedSize === null
                      ? "bg-[#8B5E3C] text-white"
                      : "bg-white/50 border border-[#E6D5C3] text-[#5A3A2A] hover:bg-[#E6D5C3]"
                  }`}
                >
                  No Size
                </button>
                {SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-full transition duration-300 ${
                      selectedSize === size
                        ? "bg-[#8B5E3C] text-white"
                        : "bg-white/50 border border-[#E6D5C3] text-[#5A3A2A] hover:bg-[#E6D5C3]"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Quantity Selector */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-[#5A3A2A] mb-3">Quantity</h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-full bg-[#E6D5C3] text-[#5A3A2A] hover:bg-[#8B5E3C] hover:text-white transition"
                >
                  -
                </button>
                <span className="text-xl font-semibold text-[#5A3A2A] min-w-[40px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-full bg-[#E6D5C3] text-[#5A3A2A] hover:bg-[#8B5E3C] hover:text-white transition"
                >
                  +
                </button>
              </div>
            </div>
            
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
              <button
                onClick={addToCart}
                disabled={isAddingToCart || product.stock === 0}
                className="flex-1 bg-[#8B5E3C] hover:bg-[#5A3A2A] text-white px-6 py-3 rounded-full transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAddingToCart ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Adding...
                  </span>
                ) : (
                  "Add to Cart"
                )}
              </button>
              <button
                onClick={buyNow}
                disabled={isAddingToCart || product.stock === 0}
                className="flex-1 border-2 border-[#8B5E3C] text-[#8B5E3C] hover:bg-[#8B5E3C] hover:text-white px-6 py-3 rounded-full transition duration-300 disabled:opacity-50"
              >
                Buy Now
              </button>
            </div>
            
            {product.stock === 0 && (
              <p className="text-red-500 text-sm mt-3 text-center">Out of stock</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}