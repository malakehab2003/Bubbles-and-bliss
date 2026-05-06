"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useOrderDetails } from "@/hooks/useOrderDetails";

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = parseInt(params.id as string);
  const { order, isLoading, error } = useOrderDetails(orderId);

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

  if (error || !order) {
    return (
      <div className="bg-[#F3E8DE] min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link href="/profile/orders" className="text-[#8B5E3C] hover:text-[#5A3A2A] mb-6 inline-block">
            ← Back to Orders
          </Link>
          <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-8 shadow-md text-center">
            <p className="text-red-600">Order not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F3E8DE] min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link href="/profile/orders" className="text-[#8B5E3C] hover:text-[#5A3A2A] mb-6 inline-block">
          ← Back to Orders
        </Link>

        <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-8 shadow-md">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-serif text-[#5A3A2A]">Order #{order.id}</h1>
              <p className="text-sm text-[#8B5E3C]">
                Placed on {new Date(order.created_at).toLocaleDateString("ar-EG")}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.order_status)}`}>
              {getStatusText(order.order_status)}
            </span>
          </div>

          <div className="border-t border-[#E6D5C3] pt-6">
            <h2 className="text-lg font-serif text-[#5A3A2A] mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-[#8B5E3C]">Subtotal</span>
                <span className="text-[#5A3A2A]">{order.total_price} EGP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8B5E3C]">Shipping</span>
                <span className="text-[#5A3A2A]">Free</span>
              </div>
              <div className="border-t border-[#E6D5C3] pt-3 mt-3">
                <div className="flex justify-between">
                  <span className="font-semibold text-[#5A3A2A]">Total</span>
                  <span className="font-bold text-xl text-[#5A3A2A]">{order.total_price} EGP</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-[#E6D5C3] pt-6 mt-6">
            <h2 className="text-lg font-serif text-[#5A3A2A] mb-4">Shipping Information</h2>
            <div className="space-y-2">
              <p className="text-[#5A3A2A]">
                <span className="text-[#8B5E3C]">Address:</span> {order.address}
              </p>
              {order.landmark && (
                <p className="text-[#5A3A2A]">
                  <span className="text-[#8B5E3C]">Landmark:</span> {order.landmark}
                </p>
              )}
              <p className="text-[#5A3A2A]">
                <span className="text-[#8B5E3C]">Phone:</span> {order.phone}
              </p>
              <p className="text-[#5A3A2A]">
                <span className="text-[#8B5E3C]">Location:</span> {order.city.name}, {order.government.name}
              </p>
            </div>
          </div>

          {order.promocode && (
            <div className="border-t border-[#E6D5C3] pt-6 mt-6">
              <h2 className="text-lg font-serif text-[#5A3A2A] mb-4">Promocode</h2>
              <div className="bg-[#E6D5C3]/30 rounded-lg p-4">
                <p className="text-[#5A3A2A] font-semibold">{order.promocode.code}</p>
                <p className="text-sm text-[#8B5E3C]">{order.promocode.description}</p>
                <p className="text-sm text-[#8B5E3C]">Discount: {order.promocode.discount}%</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}