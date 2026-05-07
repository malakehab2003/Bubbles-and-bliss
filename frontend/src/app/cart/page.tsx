"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// API Functions
async function getCart() {
  const token = localStorage.getItem("token");
  const res = await fetch("http://localhost:5000/api/cart/list", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  return data.cart || [];
}

async function deleteCartItem(id: number) {
  const token = localStorage.getItem("token");
  const res = await fetch(`http://localhost:5000/api/cart/delete/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return await res.json();
}

async function updateCartQuantity(params: {
  product_id: number;
  cart_id: number;
  operation: "add" | "sub";
}) {
  const token = localStorage.getItem("token");
  const res = await fetch("http://localhost:5000/api/cart/update/quantity", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(params),
  });
  return await res.json();
}

// Types
interface CartItem {
  id: number;
  quantity: number;
  color: string;
  size: string;
  product_id: number;
  product: {
    id: number;
    name: string;
    price: number;
    image?: { url: string }[];
  };
}

export default function CartPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Get cart data
  const { data: cartItems, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
  });

  // Delete item mutation
  const { mutate: deleteItem } = useMutation({
    mutationFn: deleteCartItem,
    onSuccess: () => {
      toast.success("Item removed from cart");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: () => {
      toast.error("Failed to remove item");
    },
  });

  // Update quantity mutation
  const { mutate: updateQuantity } = useMutation({
    mutationFn: updateCartQuantity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: () => {
      toast.error("Failed to update quantity");
    },
  });

  // Calculate total price
  const calculateTotal = () => {
    if (!cartItems || cartItems.length === 0) return 0;
    return cartItems.reduce((sum: number, item: CartItem) => {
      return sum + (item.product?.price || 0) * item.quantity;
    }, 0);
  };

  const totalPrice = calculateTotal();

  const handleCheckout = () => {
    if (cartItems?.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    router.push("/checkout");
  };

  if (isLoading) {
    return (
      <div className="bg-[#F3E8DE] min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#8B5E3C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="bg-[#F3E8DE] min-h-screen flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-12 shadow-md">
            <div className="text-7xl mb-4">🛒</div>
            <h1 className="text-2xl font-serif text-[#5A3A2A] mb-4">Your Cart is Empty</h1>
            <p className="text-[#8B5E3C] mb-8">
              Looks like you haven't added any items yet
            </p>
            <Link href="/shop">
              <button className="bg-[#8B5E3C] hover:bg-[#5A3A2A] text-white px-8 py-3 rounded-full transition duration-300">
                Start Shopping
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F3E8DE] min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-3xl font-serif text-[#5A3A2A] text-center mb-8">
          Shopping Cart
        </h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Cart Items - Left Side */}
          <div className="md:col-span-2 space-y-4">
            {cartItems.map((item: CartItem) => {
              const imageUrl = item.product?.image?.[0]?.url;
              return (
                <div
                  key={item.id}
                  className="bg-white/40 backdrop-blur-sm rounded-2xl p-4 shadow-md flex gap-4"
                >
                  {/* Product Image */}
                  <div className="w-24 h-24 bg-[#E6D5C3] rounded-xl overflow-hidden flex-shrink-0">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={item.product?.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl text-[#8B5E3C]">
                        🧴
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-semibold text-[#5A3A2A]">
                          {item.product?.name}
                        </h3>
                        {item.color && (
                          <p className="text-sm text-[#8B5E3C]">Color: {item.color}</p>
                        )}
                        {item.size && (
                          <p className="text-sm text-[#8B5E3C]">Size: {item.size}</p>
                        )}
                      </div>
                      <p className="font-bold text-[#5A3A2A]">
                        {item.product?.price} EGP
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            updateQuantity({
                              product_id: item.product_id,
                              cart_id: item.id,
                              operation: "sub",
                            })
                          }
                          className="w-8 h-8 rounded-full bg-[#E6D5C3] text-[#5A3A2A] hover:bg-[#8B5E3C] hover:text-white transition"
                        >
                          -
                        </button>
                        <span className="text-[#5A3A2A] font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity({
                              product_id: item.product_id,
                              cart_id: item.id,
                              operation: "add",
                            })
                          }
                          className="w-8 h-8 rounded-full bg-[#E6D5C3] text-[#5A3A2A] hover:bg-[#8B5E3C] hover:text-white transition"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="text-red-500 hover:text-red-700 transition text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary - Right Side */}
          <div className="md:col-span-1">
            <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 shadow-md sticky top-24">
              <h2 className="text-xl font-serif text-[#5A3A2A] mb-4 pb-2 border-b border-[#E6D5C3]">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-[#8B5E3C]">
                  <span>Items ({cartItems.length})</span>
                  <span>{totalPrice} EGP</span>
                </div>
                <div className="flex justify-between text-[#8B5E3C]">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t border-[#E6D5C3] pt-3 mt-3">
                  <div className="flex justify-between text-[#5A3A2A] font-bold text-lg">
                    <span>Total</span>
                    <span>{totalPrice} EGP</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-[#8B5E3C] hover:bg-[#5A3A2A] text-white py-3 rounded-full transition duration-300 transform hover:scale-105"
              >
                Proceed to Checkout
              </button>

              <Link href="/shop">
                <button className="w-full mt-3 border border-[#8B5E3C] text-[#8B5E3C] hover:bg-[#8B5E3C] hover:text-white py-3 rounded-full transition duration-300">
                  Continue Shopping
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}