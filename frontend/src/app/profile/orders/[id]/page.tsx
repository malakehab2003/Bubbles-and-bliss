"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Package,
  MapPin,
  Phone,
  Tag,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  ShoppingBag,
} from "lucide-react";

interface OrderItem {
  id: number;
  quantity: number;
  size?: string;
  product_id: number;
  product: {
    id: number;
    name: string;
    price: number;
    sale: number;
    images?: { id: number; url: string }[];
  };
}

interface Order {
  id: number;
  total_price: string;
  address: string;
  landmark?: string;
  phone: string;
  order_status: "processing" | "shipped" | "delivered" | "cancelled";
  created_at: string;
  government: { id: number; name: string };
  city: { id: number; name: string };
  promocode?: { code: string; discount: string } | null;
}

const statusConfig = {
  processing: {
    label: "Processing",
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    icon: Clock,
    step: 1,
  },
  shipped: {
    label: "Shipped",
    color: "bg-blue-100 text-blue-700 border-blue-200",
    icon: Truck,
    step: 2,
  },
  delivered: {
    label: "Delivered",
    color: "bg-green-100 text-green-700 border-green-200",
    icon: CheckCircle,
    step: 3,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-700 border-red-200",
    icon: XCircle,
    step: 0,
  },
};

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = parseInt(params.id as string);

  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/signin";
        return;
      }

      try {
        const [orderRes, itemsRes] = await Promise.all([
          fetch(`http://localhost:5000/api/order/getOrder/${orderId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`http://localhost:5000/api/order/item/list/${orderId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const orderData = await orderRes.json();
        const itemsData = await itemsRes.json();

        if (orderRes.ok) setOrder(orderData.order);
        else setError(orderData.error || "Failed to load order");

        if (itemsRes.ok) setItems(itemsData.items || []);
      } catch {
        setError("Something went wrong");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="bg-[#F3E8DE] min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#8B5E3C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="bg-[#F3E8DE] min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <p className="text-red-500 mb-4">{error || "Order not found"}</p>
          <Link href="/profile/orders">
            <button className="bg-[#8B5E3C] text-white px-6 py-2 rounded-full hover:bg-[#5A3A2A] transition">
              Back to Orders
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const status = statusConfig[order.order_status] || statusConfig.processing;
  const StatusIcon = status.icon;
  const isCancelled = order.order_status === "cancelled";

  // حساب الأسعار
  const getItemPrice = (price: number, sale: number) =>
    sale > 0 ? price * (1 - sale / 100) : price;

  const itemsSubtotal = items.reduce(
    (sum, item) => sum + getItemPrice(item.product.price, item.product.sale) * item.quantity,
    0
  );

  return (
    <div className="bg-[#F3E8DE] min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Link */}
        <Link
          href="/profile/orders"
          className="text-[#8B5E3C] hover:text-[#5A3A2A] mb-6 inline-block transition"
        >
          ← Back to My Orders
        </Link>

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-serif text-[#5A3A2A]">
              Order #{order.id}
            </h1>
            <p className="text-[#8B5E3C] mt-1 text-sm">
              Placed on{" "}
              {new Date(order.created_at).toLocaleDateString("en-EG", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <span
            className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium ${status.color}`}
          >
            <StatusIcon className="w-4 h-4" />
            {status.label}
          </span>
        </div>

        {/* Order Progress (not for cancelled) */}
        {!isCancelled && (
          <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 shadow-md mb-6">
            <h2 className="text-lg font-serif text-[#5A3A2A] mb-5">
              Order Progress
            </h2>
            <div className="flex items-center justify-between relative">
              {/* Progress Line */}
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-[#E6D5C3] z-0" />
              <div
                className="absolute top-5 left-0 h-0.5 bg-[#8B5E3C] z-0 transition-all duration-500"
                style={{
                  width:
                    status.step === 1
                      ? "0%"
                      : status.step === 2
                      ? "50%"
                      : "100%",
                }}
              />

              {[
                { label: "Processing", icon: Clock, step: 1 },
                { label: "Shipped", icon: Truck, step: 2 },
                { label: "Delivered", icon: CheckCircle, step: 3 },
              ].map((s) => {
                const StepIcon = s.icon;
                const isActive = status.step >= s.step;
                return (
                  <div
                    key={s.step}
                    className="flex flex-col items-center gap-2 z-10"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition ${
                        isActive
                          ? "bg-[#8B5E3C] border-[#8B5E3C] text-white"
                          : "bg-white border-[#E6D5C3] text-[#8B5E3C]"
                      }`}
                    >
                      <StepIcon className="w-5 h-5" />
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        isActive ? "text-[#5A3A2A]" : "text-[#8B5E3C]"
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Shipping Info */}
          <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 shadow-md">
            <h2 className="text-lg font-serif text-[#5A3A2A] mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" /> Shipping Address
            </h2>
            <div className="space-y-2 text-sm">
              <p className="text-[#5A3A2A]">{order.address}</p>
              {order.landmark && (
                <p className="text-[#8B5E3C]">Near: {order.landmark}</p>
              )}
              <p className="text-[#8B5E3C]">
                {order.city.name}, {order.government.name}
              </p>
              <div className="flex items-center gap-1 text-[#8B5E3C] pt-1">
                <Phone className="w-4 h-4" />
                <span>{order.phone}</span>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 shadow-md">
            <h2 className="text-lg font-serif text-[#5A3A2A] mb-4 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" /> Order Summary
            </h2>
            <div className="space-y-2 text-sm">
              {items.length > 0 && (
                <div className="flex justify-between text-[#8B5E3C]">
                  <span>
                    Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)
                  </span>
                  <span>{itemsSubtotal.toFixed(0)} EGP</span>
                </div>
              )}
              <div className="flex justify-between text-[#8B5E3C]">
                <span>Shipping</span>
                <span>50 EGP</span>
              </div>
              {order.promocode && (
                <div className="flex justify-between text-green-600">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3 h-3" /> {order.promocode.code}
                  </span>
                  <span>-{order.promocode.discount}%</span>
                </div>
              )}
              <div className="border-t border-[#E6D5C3] pt-2 mt-2 flex justify-between font-bold text-[#5A3A2A] text-base">
                <span>Total</span>
                <span>{parseFloat(order.total_price).toFixed(0)} EGP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 shadow-md">
          <h2 className="text-lg font-serif text-[#5A3A2A] mb-5 flex items-center gap-2">
            <Package className="w-5 h-5" /> Items Ordered
          </h2>

          {items.length === 0 ? (
            <p className="text-[#8B5E3C] text-center py-6">
              No items found for this order
            </p>
          ) : (
            <div className="space-y-4">
              {items.map((item) => {
                const finalPrice = getItemPrice(
                  item.product.price,
                  item.product.sale
                );
                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 bg-white/30 rounded-xl border border-[#E6D5C3]"
                  >
                    {/* Image */}
                    <div className="w-16 h-16 bg-[#E6D5C3] rounded-xl overflow-hidden flex-shrink-0">
                      {item.product.images?.[0]?.url ? (
                        <Image
                          src={item.product.images[0].url}
                          alt={item.product.name}
                          width={64}
                          height={64}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">
                          🧴
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <Link href={`/shop/${item.product_id}`}>
                        <h3 className="font-semibold text-[#5A3A2A] hover:text-[#8B5E3C] transition truncate">
                          {item.product.name}
                        </h3>
                      </Link>
                      {item.size && (
                        <p className="text-xs text-[#8B5E3C]">
                          Size: {item.size}
                        </p>
                      )}
                      <p className="text-sm text-[#8B5E3C] mt-1">
                        {finalPrice.toFixed(0)} EGP × {item.quantity}
                      </p>
                    </div>

                    {/* Total */}
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-[#5A3A2A]">
                        {(finalPrice * item.quantity).toFixed(0)} EGP
                      </p>
                      {item.product.sale > 0 && (
                        <p className="text-xs text-green-600">
                          -{item.product.sale}% off
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}