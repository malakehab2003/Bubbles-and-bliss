"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Product {
  id: number;
  name: string;
  price: string;
  sale: number;
  stock: number;
  image?: { url: string }[];
}

export default function FeaturedProducts() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/dashboard/featured-products")
      .then((r) => r.json())
      .then((data) => setProducts(data.products || []))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const addToCart = async (productId: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first");
      router.push("/signin");
      return;
    }
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
        toast.success("Added to cart!");
        window.dispatchEvent(new Event("cartUpdated"));
      } else {
        toast(
          (t) => (
            <div className="flex items-center gap-3">
              <span>⚠️ Product already in cart!</span>
              <button
                onClick={() => { router.push("/cart"); toast.dismiss(t.id); }}
                className="bg-[#8B5E3C] text-white px-3 py-1 rounded-lg text-sm"
              >
                Go to Cart
              </button>
            </div>
          ),
          { duration: 5000 }
        );
      }
    } catch {
      toast.error("Error adding to cart");
    }
  };

  const getImage = (product: Product) =>
    product.image?.[0]?.url || null;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white/50 rounded-lg p-6 animate-pulse">
            <div className="w-full h-64 bg-[#E6D5C3] rounded-lg mb-4" />
            <div className="h-5 bg-[#E6D5C3] rounded w-3/4 mx-auto mb-2" />
            <div className="h-4 bg-[#E6D5C3] rounded w-1/3 mx-auto" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
      {products.map((product) => {
        const imageUrl = getImage(product);
        return (
          <div
            key={product.id}
            className="bg-white/50 backdrop-blur-sm rounded-lg p-6 text-center hover:shadow-xl transition-all hover:-translate-y-1"
          >
            <Link href={`/shop/${product.id}`}>
              <div className="w-full h-64 bg-[#E6D5C3] rounded-lg mb-4 flex items-center justify-center cursor-pointer overflow-hidden">
                {imageUrl ? (
                  <img
                    src={imageUrl}
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
              <p className="text-green-600 text-sm mb-1">-{product.sale}% OFF</p>
            )}
            <button
              onClick={() => addToCart(product.id)}
              className="border-2 border-[#8B5E3C] text-[#8B5E3C] hover:bg-[#8B5E3C] hover:text-white px-6 py-2 rounded-full transition duration-300 mt-3"
            >
              Add to Cart
            </button>
          </div>
        );
      })}
    </div>
  );
}
