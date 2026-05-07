"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Link from "next/link";

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

async function getAddresses() {
  const token = localStorage.getItem("token");
  const res = await fetch("http://localhost:5000/api/address/list", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  return data.addresses || [];
}

async function createOrder(orderData: {
  total_price: number;
  receive_type: string;
  payment_type: string;
  address_id: number | null;
  promo_code_id: number;
}) {
  const token = localStorage.getItem("token");
  const res = await fetch("http://localhost:5000/api/order/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || data.message || "Failed to create order");
  return data;
}

async function createOrderItems(orderId: number) {
  const token = localStorage.getItem("token");
  const res = await fetch("http://localhost:5000/api/order/createItems", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ order_id: orderId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || data.message || "Failed to create order items");
  return data;
}

interface CartItem {
  id: number;
  quantity: number;
  product_id: number;
  product: {
    id: number;
    name: string;
    price: number;
  };
}

export default function CheckoutPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [receiveType, setReceiveType] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [addressId, setAddressId] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // Get cart data
  const { data: cart, isLoading: cartLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
  });

  // Get addresses
  const { data: addresses, isLoading: addressLoading } = useQuery({
    queryKey: ["addresses"],
    queryFn: getAddresses,
  });

  // Calculate total
  useEffect(() => {
    if (cart && cart.length > 0) {
      setCartItems(cart);
      const total = cart.reduce((sum: number, item: CartItem) => {
        return sum + (item.product?.price || 0) * item.quantity;
      }, 0);
      setTotalPrice(total);
    }
  }, [cart]);

  // Order mutation
  const { mutateAsync: createOrderMutation } = useMutation({
    mutationFn: createOrder,
    onError: (error: any) => {
      toast.error(error.message || "Failed to create order");
    },
  });

  const { mutateAsync: createOrderItemsMutation } = useMutation({
    mutationFn: createOrderItems,
    onError: (error: any) => {
      toast.error(error.message || "Failed to create order items");
    },
  });

  const handleSubmit = async () => {
    // Validation
    if (!receiveType) {
      toast.error("Please select delivery type");
      return;
    }
    if (!paymentType) {
      toast.error("Please select payment method");
      return;
    }
    if (totalPrice <= 0) {
      toast.error("Your cart is empty");
      return;
    }
    if (!addressId && receiveType === "delivery") {
      toast.error("Please select an address for delivery");
      return;
    }

    setIsProcessing(true);
    const loadingToast = toast.loading("Processing your order...");

    try {
      // Step 1: Create order
      const orderResponse = await createOrderMutation({
        total_price: totalPrice,
        receive_type: receiveType,
        payment_type: paymentType,
        address_id: receiveType === "delivery" ? Number(addressId) : null,
        promo_code_id: 0,
      });

      if (!orderResponse?.order?.id) {
        throw new Error("Failed to create order");
      }

      const newOrderId = orderResponse.order.id;

      // Step 2: Create order items
      await createOrderItemsMutation(newOrderId);

      // Step 3: Clear cart and redirect
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Order created successfully! ✅", { id: loadingToast });
      
      setTimeout(() => {
        router.push("/profile/orders");
      }, 1500);
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error(error.message || "Something went wrong", { id: loadingToast });
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartLoading || addressLoading) {
    return (
      <div className="bg-[#F3E8DE] min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#8B5E3C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="bg-[#F3E8DE] min-h-screen flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-12 shadow-md">
            <div className="text-7xl mb-4">🛒</div>
            <h1 className="text-2xl font-serif text-[#5A3A2A] mb-4">Your Cart is Empty</h1>
            <p className="text-[#8B5E3C] mb-8">Add some items before checking out</p>
            <Link href="/shop">
              <button className="bg-[#8B5E3C] hover:bg-[#5A3A2A] text-white px-8 py-3 rounded-full transition">
                Continue Shopping
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F3E8DE] min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif text-[#5A3A2A]">Checkout</h1>
          <p className="text-[#8B5E3C] mt-2">Complete your order</p>
        </div>

        <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-8 shadow-md space-y-6">
          {/* Order Summary */}
          <div className="bg-[#E6D5C3]/30 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[#8B5E3C]">Total Items:</span>
              <span className="font-bold text-[#5A3A2A]">{cartItems.length}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-[#E6D5C3]">
              <span className="text-[#8B5E3C]">Total Price:</span>
              <span className="font-bold text-2xl text-[#5A3A2A]">{totalPrice} EGP</span>
            </div>
          </div>

          {/* Delivery Type */}
          <div>
            <label className="block text-sm font-semibold text-[#5A3A2A] mb-2">
              Delivery Type <span className="text-red-500">*</span>
            </label>
            <select
              value={receiveType}
              onChange={(e) => setReceiveType(e.target.value)}
              className="w-full px-4 py-3 bg-white/50 border border-[#E6D5C3] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] text-[#5A3A2A]"
            >
              <option value="">Select delivery type</option>
              <option value="delivery">🚚 Home Delivery</option>
              <option value="pickup">🏬 Store Pickup</option>
            </select>
          </div>

          {/* Address - Show only for delivery */}
          {receiveType === "delivery" && (
            <div>
              <label className="block text-sm font-semibold text-[#5A3A2A] mb-2">
                Delivery Address <span className="text-red-500">*</span>
              </label>
              <select
                value={addressId}
                onChange={(e) => setAddressId(e.target.value)}
                className="w-full px-4 py-3 bg-white/50 border border-[#E6D5C3] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] text-[#5A3A2A]"
              >
                <option value="">Select an address</option>
                {addresses?.map((addr: any) => (
                  <option key={addr.id} value={addr.id}>
                    📍 {addr.address}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-semibold text-[#5A3A2A] mb-2">
              Payment Method <span className="text-red-500">*</span>
            </label>
            <select
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
              className="w-full px-4 py-3 bg-white/50 border border-[#E6D5C3] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] text-[#5A3A2A]"
            >
              <option value="">Select payment method</option>
              <option value="cash">💵 Cash on Delivery</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isProcessing}
            className="w-full bg-[#8B5E3C] hover:bg-[#5A3A2A] text-white py-3 rounded-xl font-semibold transition duration-300 transform hover:scale-105 disabled:opacity-50"
          >
            {isProcessing ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </span>
            ) : (
              `Confirm Order • ${totalPrice} EGP`
            )}
          </button>

          {/* Back to Cart */}
          <Link href="/cart">
            <button className="w-full border border-[#8B5E3C] text-[#8B5E3C] hover:bg-[#8B5E3C] hover:text-white py-3 rounded-xl transition duration-300">
              ← Back to Cart
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}