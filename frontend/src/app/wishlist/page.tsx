"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Heart, ShoppingCart, Trash2, ArrowRight, Sparkles } from "lucide-react";

interface WishlistItem {
  id: number;
  product_id: number;
  product: {
    id: number;
    name: string;
    price: number;
    sale: number;
    description?: string;
    image: { id: number; url: string }[];
  };
}

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [addingToCartId, setAddingToCartId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/signin");
      return;
    }
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/api/wishlist/list", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setWishlist(data.wishlist || []);
    } catch (err) {
      console.error("Error fetching wishlist:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromWishlist = async (productId: number) => {
    const token = localStorage.getItem("token");
    setRemovingId(productId);
    try {
      const res = await fetch(
        `http://localhost:5000/api/wishlist/delete/${productId}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.ok) {
        setWishlist((prev) => prev.filter((item) => item.product_id !== productId));
      }
    } catch (err) {
      console.error("Error removing from wishlist:", err);
    } finally {
      setRemovingId(null);
    }
  };

  const addToCart = async (productId: number) => {
    const token = localStorage.getItem("token");
    setAddingToCartId(productId);
    try {
      const res = await fetch("http://localhost:5000/api/cart/addProduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: productId, quantity: 1 }),
      });
      if (res.ok) {
        window.dispatchEvent(new Event("cartUpdated"));
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
    } finally {
      setAddingToCartId(null);
    }
  };

  const getPrice = (item: WishlistItem) => {
    const { price, sale } = item.product;
    return sale > 0 ? price * (1 - sale / 100) : price;
  };

  // ─── Loading ────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="bg-[#F3E8DE] min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#8B5E3C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ─── Empty State ────────────────────────────────────────
  if (wishlist.length === 0) {
    return (
      <div className="bg-[#F3E8DE] min-h-screen py-16">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <div className="relative inline-block mb-6">
            <div className="w-24 h-24 bg-[#E6D5C3] rounded-full flex items-center justify-center mx-auto">
              <Heart className="w-10 h-10 text-[#8B5E3C]" strokeWidth={1.5} />
            </div>
            <div className="absolute -top-1 -right-1 w-8 h-8 bg-[#F3E8DE] rounded-full flex items-center justify-center border-2 border-[#E6D5C3]">
              <Sparkles className="w-4 h-4 text-[#8B5E3C]" />
            </div>
          </div>

          <h1 className="text-3xl font-serif text-[#5A3A2A] mb-3">
            Your Wishlist is Empty
          </h1>
          <p className="text-[#8B5E3C] mb-8 text-sm leading-relaxed">
            Save your favourite products here and come back to them anytime.
          </p>

          <Link href="/shop">
            <button className="inline-flex items-center gap-2 bg-[#8B5E3C] hover:bg-[#5A3A2A] text-white px-8 py-3 rounded-full transition duration-300 transform hover:scale-105 font-medium">
              Explore Products
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // ─── Wishlist ────────────────────────────────────────────
  return (
    <div className="bg-[#F3E8DE] min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-5xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif text-[#5A3A2A]">
              My Wishlist
            </h1>
            <p className="text-[#8B5E3C] text-sm mt-1">
              {wishlist.length} {wishlist.length === 1 ? "item" : "items"} saved
            </p>
          </div>
          <Link
            href="/shop"
            className="text-[#8B5E3C] hover:text-[#5A3A2A] text-sm transition inline-flex items-center gap-1 font-medium"
          >
            ← Continue Shopping
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {wishlist.map((item) => {
            const finalPrice = getPrice(item);
            const isRemoving = removingId === item.product_id;
            const isAddingCart = addingToCartId === item.product_id;

            return (
              <div
                key={item.id}
                className={`bg-white/40 backdrop-blur-sm rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group ${
                  isRemoving ? "opacity-40 scale-95" : ""
                }`}
              >
                {/* Image */}
                <Link href={`/shop/${item.product_id}`} className="block relative">
                  <div className="relative w-full aspect-square bg-[#E6D5C3] overflow-hidden">
                    {item.product.image?.[0]?.url ? (
                      <Image
                        src={item.product.image[0].url}
                        alt={item.product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">
                        🧴
                      </div>
                    )}

                    {/* Sale Badge */}
                    {item.product.sale > 0 && (
                      <span className="absolute top-3 left-3 bg-[#5A3A2A] text-[#F3E8DE] text-xs font-bold px-2.5 py-1 rounded-full">
                        -{item.product.sale}%
                      </span>
                    )}

                    {/* Remove Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        removeFromWishlist(item.product_id);
                      }}
                      disabled={isRemoving}
                      className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-[#8B5E3C] hover:bg-red-50 hover:text-red-500 transition opacity-0 group-hover:opacity-100 shadow-sm"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </Link>

                {/* Info */}
                <div className="p-4">
                  <Link href={`/shop/${item.product_id}`}>
                    <h3 className="font-semibold text-[#5A3A2A] hover:text-[#8B5E3C] transition line-clamp-1 mb-1">
                      {item.product.name}
                    </h3>
                  </Link>

                  {item.product.description && (
                    <p className="text-xs text-[#8B5E3C] line-clamp-2 mb-3">
                      {item.product.description}
                    </p>
                  )}

                  {/* Price Row */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="font-bold text-[#5A3A2A] text-lg">
                      {finalPrice.toFixed(0)} EGP
                    </span>
                    {item.product.sale > 0 && (
                      <span className="text-sm text-[#8B5E3C] line-through">
                        {item.product.price} EGP
                      </span>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => addToCart(item.product_id)}
                      disabled={isAddingCart}
                      className="flex-1 flex items-center justify-center gap-2 bg-[#8B5E3C] hover:bg-[#5A3A2A] text-white text-sm py-2.5 rounded-full transition duration-300 disabled:opacity-60"
                    >
                      {isAddingCart ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4" />
                          Add to Cart
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => removeFromWishlist(item.product_id)}
                      disabled={isRemoving}
                      className="w-10 h-10 flex items-center justify-center rounded-full border border-[#E6D5C3] text-[#8B5E3C] hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition disabled:opacity-40"
                      title="Remove"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 text-center">
          <p className="text-[#8B5E3C] text-sm mb-4">
            Want to move everything to your cart?
          </p>
          <button
            onClick={async () => {
              for (const item of wishlist) {
                await addToCart(item.product_id);
              }
            }}
            className="inline-flex items-center gap-2 border-2 border-[#8B5E3C] text-[#8B5E3C] hover:bg-[#8B5E3C] hover:text-white px-8 py-3 rounded-full transition duration-300 font-medium text-sm"
          >
            <ShoppingCart className="w-4 h-4" />
            Add All to Cart
          </button>
        </div>
      </div>
    </div>
  );
}