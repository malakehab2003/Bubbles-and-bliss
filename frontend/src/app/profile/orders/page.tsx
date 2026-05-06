"use client";
import { useMyOrders } from "@/hooks/useMyOrders";
import Link from "next/link";
import { useState } from "react";

export default function MyOrdersPage() {
  const { orders, isLoading, error } = useMyOrders();
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-600";
      case "shipped":
        return "bg-blue-100 text-blue-600";
      case "processing":
        return "bg-yellow-100 text-yellow-600";
      case "cancelled":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "delivered":
        return "تم التوصيل";
      case "shipped":
        return "تم الشحن";
      case "processing":
        return "قيد المعالجة";
      case "cancelled":
        return "ملغي";
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-[#F3E8DE] min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#8B5E3C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#F3E8DE] min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link href="/profile" className="text-[#8B5E3C] hover:text-[#5A3A2A] mb-6 inline-block">
            ← Back to Profile
          </Link>
          <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-8 shadow-md text-center">
            <p className="text-red-600">Error loading orders: {error.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-[#8B5E3C] hover:bg-[#5A3A2A] text-white px-6 py-2 rounded-full transition"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F3E8DE] min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <Link href="/profile" className="text-[#8B5E3C] hover:text-[#5A3A2A] mb-6 inline-block">
          ← Back to Profile
        </Link>

        <h1 className="text-3xl font-serif text-[#5A3A2A] mb-8 text-center">My Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-12 shadow-md text-center">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-xl font-serif text-[#5A3A2A] mb-2">No Orders Yet</h2>
            <p className="text-[#8B5E3C] mb-6">You haven't placed any orders yet.</p>
            <Link href="/shop">
              <button className="bg-[#8B5E3C] hover:bg-[#5A3A2A] text-white px-6 py-2 rounded-full transition">
                Start Shopping
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 shadow-md hover:shadow-lg transition cursor-pointer"
                onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
              >
                {/* Order Header */}
                <div className="flex flex-wrap justify-between items-center">
                  <div>
                    <p className="text-sm text-[#8B5E3C]">Order #{order.id}</p>
                    <p className="text-lg font-semibold text-[#5A3A2A]">
                      {new Date(order.created_at).toLocaleDateString("ar-EG")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-[#5A3A2A]">{order.total_price} EGP</p>
                    <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(order.order_status)}`}>
                      {getStatusText(order.order_status)}
                    </span>
                  </div>
                </div>

                {/* Order Details (Expanded) */}
                {selectedOrder === order.id && (
                  <div className="mt-4 pt-4 border-t border-[#E6D5C3]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-[#8B5E3C]">Shipping Address</p>
                        <p className="text-[#5A3A2A]">{order.address}</p>
                        {order.landmark && (
                          <p className="text-sm text-[#8B5E3C]">Landmark: {order.landmark}</p>
                        )}
                        <p className="text-sm text-[#8B5E3C]">Phone: {order.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[#8B5E3C]">Location</p>
                        <p className="text-[#5A3A2A]">
                          {order.city.name}, {order.government.name}
                        </p>
                        {order.promocode && (
                          <div className="mt-2">
                            <p className="text-sm text-[#8B5E3C]">Promocode Used</p>
                            <p className="text-[#5A3A2A]">
                              {order.promocode.code} - {order.promocode.discount}% off
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // يمكن إضافة صفحة تفاصيل الطلب
                        }}
                        className="text-[#8B5E3C] hover:text-[#5A3A2A] text-sm transition"
                      >
                        View Details →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}