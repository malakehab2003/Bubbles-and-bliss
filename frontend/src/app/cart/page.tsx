"use client";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

// بيانات مؤقتة للعربة (هتتغير لما نضيف Zustand)
const initialCartItems = [
  {
    id: 1,
    name: "Midnight Wishes",
    price: 250,
    quantity: 1,
    image: "/images/midnight-wishes.jpg",
  },
  {
    id: 2,
    name: "Sakura Soul",
    price: 250,
    quantity: 2,
    image: "/images/sakura-soul.jpg",
  },
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [isCheckout, setIsCheckout] = useState(false);

  // حساب الإجمالي
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 50 : 0;
  const total = subtotal + shipping;

  // تحديث الكمية
  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // حذف منتج
  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  // لو العربة فاضية
  if (cartItems.length === 0) {
    return (
      <div className="bg-[#F3E8DE] min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-serif text-[#5A3A2A] text-center mb-8">
              Your Cart
            </h1>
            <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-12 text-center shadow-md">
              <div className="text-6xl mb-4">🛒</div>
              <p className="text-[#8B5E3C] text-lg mb-6">
                Your cart is currently empty
              </p>
              <Link href="/shop">
                <button className="bg-[#8B5E3C] hover:bg-[#5A3A2A] text-white px-8 py-3 rounded-full transition duration-300 transform hover:scale-105">
                  Continue Shopping
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F3E8DE] min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-serif text-[#5A3A2A] text-center mb-8">
          Your Cart
        </h1>

        <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
          {/* Cart Items - Left Side */}
          <div className="flex-1">
            <div className="bg-white/40 backdrop-blur-sm rounded-2xl shadow-md overflow-hidden">
              {/* Header */}
              <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-[#E6D5C3] text-[#5A3A2A] font-semibold">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-center">Total</div>
              </div>

              {/* Cart Items */}
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border-b border-[#E6D5C3] items-center"
                >
                  {/* Product Info */}
                  <div className="col-span-1 md:col-span-6 flex items-center gap-4">
                    <div className="w-16 h-16 bg-[#E6D5C3] rounded-xl flex items-center justify-center overflow-hidden">
                      <span className="text-[#8B5E3C] text-sm">🧴</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#5A3A2A]">{item.name}</h3>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-sm text-[#8B5E3C] hover:text-red-500 transition mt-1"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="col-span-1 md:col-span-2 text-center">
                    <span className="md:hidden text-[#8B5E3C] text-sm mr-2">Price:</span>
                    <span className="text-[#5A3A2A]}">{item.price} EGP</span>
                  </div>

                  {/* Quantity */}
                  <div className="col-span-1 md:col-span-2">
                    <div className="flex items-center justify-center gap-3">
                      <span className="md:hidden text-[#8B5E3C] text-sm mr-2">Qty:</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-full border border-[#8B5E3C] text-[#8B5E3C] hover:bg-[#8B5E3C] hover:text-white transition"
                      >
                        -
                      </button>
                      <span className="text-[#5A3A2A] min-w-[30px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-full border border-[#8B5E3C] text-[#8B5E3C] hover:bg-[#8B5E3C] hover:text-white transition"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="col-span-1 md:col-span-2 text-center">
                    <span className="md:hidden text-[#8B5E3C] text-sm mr-2">Total:</span>
                    <span className="font-semibold text-[#5A3A2A]">
                      {item.price * item.quantity} EGP
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Continue Shopping Link */}
            <div className="mt-6">
              <Link href="/shop" className="text-[#8B5E3C] hover:text-[#5A3A2A] transition inline-flex items-center gap-2">
                <span>←</span> Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary - Right Side */}
          <div className="lg:w-96">
            <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 shadow-md sticky top-24">
              <h2 className="text-xl font-serif text-[#5A3A2A] mb-6 pb-2 border-b border-[#E6D5C3]">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-[#8B5E3C]">
                  <span>Subtotal</span>
                  <span>{subtotal} EGP</span>
                </div>
                <div className="flex justify-between text-[#8B5E3C]">
                  <span>Shipping</span>
                  <span>{shipping > 0 ? `${shipping} EGP` : "Free"}</span>
                </div>
                <div className="border-t border-[#E6D5C3] pt-3 mt-3">
                  <div className="flex justify-between text-[#5A3A2A] font-semibold text-lg">
                    <span>Total</span>
                    <span>{total} EGP</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsCheckout(true)}
                className="w-full bg-[#8B5E3C] hover:bg-[#5A3A2A] text-white py-3 rounded-full transition duration-300 transform hover:scale-105 mb-3"
              >
                Proceed to Checkout
              </button>

              <p className="text-xs text-[#8B5E3C] text-center mt-4">
                Shipping and taxes calculated at checkout
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Simple Checkout Modal (مؤقت) */}
      {isCheckout && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-serif text-[#5A3A2A] mb-4">Checkout</h2>
            <p className="text-[#8B5E3C] mb-4">
              Total: {total} EGP
            </p>
            <p className="text-[#8B5E3C] mb-6">
              This is a demo. Payment integration coming soon!
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsCheckout(false)}
                className="flex-1 border-2 border-[#8B5E3C] text-[#8B5E3C] py-2 rounded-full hover:bg-[#8B5E3C] hover:text-white transition"
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert("Order placed! (Demo)");
                  setIsCheckout(false);
                  setCartItems([]);
                }}
                className="flex-1 bg-[#8B5E3C] text-white py-2 rounded-full hover:bg-[#5A3A2A] transition"
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}