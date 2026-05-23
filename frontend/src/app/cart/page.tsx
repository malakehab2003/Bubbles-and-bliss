"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Gift } from "lucide-react";

const FREE_SHIPPING_THRESHOLD = 500;
const SHIPPING_COST = 50;

async function getCart() {
  const token = localStorage.getItem("token");
  const res = await fetch("http://localhost:5000/api/cart/list", {
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  return data.cart || [];
}

async function deleteCartItem(id: number) {
  const token = localStorage.getItem("token");
  const res = await fetch(`http://localhost:5000/api/cart/delete/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  });
  return await res.json();
}

async function updateCartQuantity(params: { product_id: number; cart_id: number; operation: "add" | "sub" }) {
  const token = localStorage.getItem("token");
  const res = await fetch("http://localhost:5000/api/cart/update/quantity", {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(params),
  });
  return await res.json();
}

interface CartItem {
  id: number;
  quantity: number;
  color: string;
  size: string;
  product_id: number;
  product: { id: number; name: string; price: number; image?: { url: string }[] };
}

export default function CartPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: cartItems, isLoading } = useQuery({ queryKey: ["cart"], queryFn: getCart });

  const { mutate: deleteItem } = useMutation({
    mutationFn: deleteCartItem,
    onSuccess: () => { toast.success("Item removed"); queryClient.invalidateQueries({ queryKey: ["cart"] }); },
    onError: () => toast.error("Failed to remove item"),
  });

  const { mutate: updateQuantity } = useMutation({
    mutationFn: updateCartQuantity,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
    onError: () => toast.error("Failed to update quantity"),
  });

  const subtotal = (cartItems || []).reduce((sum: number, item: CartItem) => sum + (item.product?.price || 0) * item.quantity, 0);
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shipping = isFreeShipping ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
  const progressPct = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

  if (isLoading) return (
    <div className="bg-[#F3E8DE] min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-[#8B5E3C] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!cartItems || cartItems.length === 0) return (
    <div className="bg-[#F3E8DE] min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="w-24 h-24 bg-[#E6D5C3] rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-10 h-10 text-[#8B5E3C]" />
        </div>
        <h1 className="text-2xl font-serif text-[#5A3A2A] mb-3">Your Cart is Empty</h1>
        <p className="text-[#8B5E3C] mb-8 text-sm">Looks like you haven't added anything yet</p>
        <Link href="/shop">
          <button className="bg-[#5A3A2A] hover:bg-[#3D2310] text-[#F3E8DE] px-8 py-3 rounded-full transition font-medium text-sm tracking-wide">
            Start Shopping
          </button>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="bg-[#F3E8DE] min-h-screen py-12">
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .cart-item { animation: fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) both; }
        .progress-bar { transition: width 0.6s cubic-bezier(0.22,1,0.36,1); }
        @keyframes celebrate { 0%,100% { transform:scale(1); } 50% { transform:scale(1.05); } }
        .free-celebrate { animation: celebrate 0.5s ease; }
      `}</style>

      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-serif text-[#5A3A2A] text-center mb-2">Shopping Cart</h1>
        <p className="text-center text-[#8B5E3C] text-sm mb-8">{cartItems.length} item{cartItems.length !== 1 ? "s" : ""}</p>

        {/* Free Shipping Progress */}
        <div className={`rounded-2xl p-4 mb-6 border transition-all ${isFreeShipping ? "bg-green-50 border-green-200" : "bg-white/50 border-[#E6D5C3]"}`}>
          <div className="flex items-center gap-3 mb-3">
            <Gift className={`w-5 h-5 flex-shrink-0 ${isFreeShipping ? "text-green-600" : "text-[#8B5E3C]"}`} />
            {isFreeShipping ? (
              <p className="text-green-700 font-medium text-sm free-celebrate">
                🎉 You unlocked <strong>FREE shipping!</strong> Enjoy your order.
              </p>
            ) : (
              <p className="text-[#5A3A2A] text-sm">
                Add <strong className="text-[#8B5E3C]">{remaining.toFixed(0)} EGP</strong> more to get <strong>free shipping</strong>
              </p>
            )}
          </div>
          <div className="w-full h-2 bg-[#E6D5C3] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full progress-bar ${isFreeShipping ? "bg-green-500" : "bg-[#8B5E3C]"}`}
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-xs text-[#8B5E3C]">0 EGP</span>
            <span className="text-xs text-[#8B5E3C]">500 EGP</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="md:col-span-2 space-y-3">
            {cartItems.map((item: CartItem, i: number) => {
              const imageUrl = item.product?.image?.[0]?.url;
              return (
                <div key={item.id} className="cart-item bg-white/50 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-[#E6D5C3]/50 flex gap-4" style={{ animationDelay: `${i * 0.06}s` }}>
                  {/* Image */}
                  <div className="w-20 h-20 bg-[#E6D5C3] rounded-xl overflow-hidden flex-shrink-0">
                    {imageUrl ? (
                      <img src={imageUrl} alt={item.product?.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">🧴</div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-[#5A3A2A] truncate">{item.product?.name}</h3>
                        <div className="flex gap-3 mt-0.5">
                          {item.color && <span className="text-xs text-[#8B5E3C]">Color: {item.color}</span>}
                          {item.size && <span className="text-xs text-[#8B5E3C]">Size: {item.size}</span>}
                        </div>
                      </div>
                      <p className="font-bold text-[#5A3A2A] flex-shrink-0">
                        {((item.product?.price || 0) * item.quantity).toFixed(0)} EGP
                      </p>
                    </div>

                    <div className="flex justify-between items-center mt-3">
                      {/* Quantity */}
                      <div className="flex items-center gap-2 bg-[#F3E8DE] rounded-full px-1 py-1">
                        <button
                          onClick={() => updateQuantity({ product_id: item.product_id, cart_id: item.id, operation: "sub" })}
                          className="w-7 h-7 rounded-full bg-white text-[#5A3A2A] hover:bg-[#8B5E3C] hover:text-white transition flex items-center justify-center shadow-sm"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-[#5A3A2A] font-semibold w-6 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity({ product_id: item.product_id, cart_id: item.id, operation: "add" })}
                          className="w-7 h-7 rounded-full bg-white text-[#5A3A2A] hover:bg-[#8B5E3C] hover:text-white transition flex items-center justify-center shadow-sm"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button onClick={() => deleteItem(item.id)} className="flex items-center gap-1 text-red-400 hover:text-red-600 transition text-xs">
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="md:col-span-1">
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-[#E6D5C3]/50 sticky top-24">
              <h2 className="text-lg font-serif text-[#5A3A2A] mb-4 pb-3 border-b border-[#E6D5C3]">Order Summary</h2>

              <div className="space-y-3 text-sm mb-5">
                <div className="flex justify-between text-[#8B5E3C]">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>{subtotal.toFixed(0)} EGP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8B5E3C]">Shipping</span>
                  {isFreeShipping ? (
                    <span className="text-green-600 font-semibold">FREE 🎉</span>
                  ) : (
                    <span className="text-[#8B5E3C]">{SHIPPING_COST} EGP</span>
                  )}
                </div>
                <div className="border-t border-[#E6D5C3] pt-3 flex justify-between text-[#5A3A2A] font-bold text-base">
                  <span>Total</span>
                  <span>{total.toFixed(0)} EGP</span>
                </div>
              </div>

              {isFreeShipping && (
                <div className="bg-green-50 border border-green-200 rounded-xl px-3 py-2 mb-4 text-xs text-green-700 text-center">
                  ✦ Free shipping applied — you saved {SHIPPING_COST} EGP!
                </div>
              )}

              <button
                onClick={() => cartItems.length > 0 ? router.push("/checkout") : toast.error("Your cart is empty")}
                className="w-full flex items-center justify-center gap-2 bg-[#5A3A2A] hover:bg-[#3D2310] text-[#F3E8DE] py-3.5 rounded-full transition font-medium text-sm tracking-wide"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </button>

              <Link href="/shop">
                <button className="w-full mt-3 border border-[#D4B896] text-[#8B5E3C] hover:bg-[#E6D5C3] py-3 rounded-full transition text-sm">
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