"use client";
import { useMyOrders } from "@/hooks/useMyOrders";
import Link from "next/link";
import { useState } from "react";
import {
  Package, MapPin, Phone, Tag, ChevronDown, ChevronUp,
  Clock, Truck, CheckCircle, XCircle, ShoppingBag, ArrowRight,
} from "lucide-react";

const statusConfig: Record<string, { label: string; color: string; bg: string; border: string; icon: any; step: number }> = {
  processing: { label: "قيد المعالجة", color: "text-amber-700",  bg: "bg-amber-50",  border: "border-amber-200", icon: Clock,        step: 1 },
  shipped:    { label: "تم الشحن",     color: "text-blue-700",   bg: "bg-blue-50",   border: "border-blue-200",  icon: Truck,        step: 2 },
  delivered:  { label: "تم التوصيل",   color: "text-green-700",  bg: "bg-green-50",  border: "border-green-200", icon: CheckCircle,  step: 3 },
  cancelled:  { label: "ملغي",         color: "text-red-600",    bg: "bg-red-50",    border: "border-red-200",   icon: XCircle,      step: 0 },
};

const STEPS = [
  { label: "Processing", icon: Clock,       step: 1 },
  { label: "Shipped",    icon: Truck,       step: 2 },
  { label: "Delivered",  icon: CheckCircle, step: 3 },
];

export default function MyOrdersPage() {
  const { orders, isLoading, error } = useMyOrders();
  const [expandedId, setExpandedId] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="bg-[#F3E8DE] min-h-screen flex items-center justify-center">
        <div className="space-y-3 text-center">
          <div className="w-12 h-12 border-4 border-[#8B5E3C] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-[#8B5E3C] text-sm font-medium tracking-wide">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#F3E8DE] min-h-screen py-12 px-4">
        <div className="max-w-xl mx-auto text-center bg-white/40 backdrop-blur-sm rounded-2xl p-10 shadow-md">
          <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-600 mb-4">Error loading orders: {error.message}</p>
          <button onClick={() => window.location.reload()}
            className="bg-[#8B5E3C] hover:bg-[#5A3A2A] text-white px-6 py-2 rounded-full transition">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F3E8DE] min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-3xl">

        {/* Header */}
        <div className="mb-10">
          <Link href="/profile"
            className="inline-flex items-center gap-1 text-[#8B5E3C] hover:text-[#5A3A2A] text-sm mb-6 transition group">
            <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
            Back to Profile
          </Link>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-[#8B5E3C]/10 rounded-2xl mb-4">
              <Package className="w-7 h-7 text-[#8B5E3C]" />
            </div>
            <h1 className="text-3xl md:text-4xl font-serif text-[#5A3A2A]">My Orders</h1>
            <p className="text-[#8B5E3C] mt-2 text-sm">
              {orders.length > 0 ? `${orders.length} order${orders.length > 1 ? "s" : ""} placed` : "No orders yet"}
            </p>
          </div>
        </div>

        {/* Empty State */}
        {orders.length === 0 ? (
          <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-14 shadow-md text-center">
            <div className="w-20 h-20 bg-[#E6D5C3] rounded-full flex items-center justify-center mx-auto mb-5">
              <ShoppingBag className="w-9 h-9 text-[#8B5E3C]" />
            </div>
            <h2 className="text-xl font-serif text-[#5A3A2A] mb-2">No Orders Yet</h2>
            <p className="text-[#8B5E3C] mb-7 text-sm">You haven't placed any orders yet. Start exploring our collection!</p>
            <Link href="/shop">
              <button className="bg-[#8B5E3C] hover:bg-[#5A3A2A] text-white px-8 py-3 rounded-full transition duration-300 transform hover:scale-105">
                Start Shopping
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, idx) => {
              const cfg = statusConfig[order.order_status] || statusConfig.processing;
              const StatusIcon = cfg.icon;
              const isExpanded = expandedId === order.id;
              const isCancelled = order.order_status === "cancelled";

              return (
                <div key={order.id}
                  className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                  style={{ animationDelay: `${idx * 60}ms` }}>

                  {/* ── Card Header ── */}
                  <div
                    className="flex items-center justify-between p-5 cursor-pointer group"
                    onClick={() => setExpandedId(isExpanded ? null : order.id)}
                  >
                    {/* Left */}
                    <div className="flex items-center gap-4">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.bg} ${cfg.border} border`}>
                        <StatusIcon className={`w-5 h-5 ${cfg.color}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-[#5A3A2A]">Order #{order.id}</span>
                          <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                            {cfg.label}
                          </span>
                        </div>
                        <p className="text-xs text-[#8B5E3C] mt-0.5">
                          {new Date(order.created_at).toLocaleDateString("en-EG", {
                            year: "numeric", month: "long", day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Right */}
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-bold text-[#5A3A2A] text-lg leading-none">
                          {parseFloat(order.total_price).toFixed(0)} EGP
                        </p>
                      </div>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                        isExpanded ? "bg-[#8B5E3C] text-white" : "bg-[#E6D5C3] text-[#8B5E3C] group-hover:bg-[#8B5E3C] group-hover:text-white"
                      }`}>
                        {isExpanded
                          ? <ChevronUp className="w-4 h-4" />
                          : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {/* ── Expanded Details ── */}
                  {isExpanded && (
                    <div className="border-t border-[#E6D5C3] px-5 pb-5 pt-4 space-y-5">

                      {/* Progress Bar */}
                      {!isCancelled && (
                        <div className="bg-[#F3E8DE] rounded-xl p-4">
                          <div className="flex items-center justify-between relative">
                            <div className="absolute top-4 left-4 right-4 h-0.5 bg-[#E6D5C3] z-0" />
                            <div
                              className="absolute top-4 left-4 h-0.5 bg-[#8B5E3C] z-0 transition-all duration-700"
                              style={{
                                width: cfg.step === 1 ? "0%" : cfg.step === 2 ? "50%" : "calc(100% - 32px)",
                              }}
                            />
                            {STEPS.map((s) => {
                              const SIcon = s.icon;
                              const active = cfg.step >= s.step;
                              return (
                                <div key={s.step} className="flex flex-col items-center gap-1.5 z-10">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                                    active
                                      ? "bg-[#8B5E3C] border-[#8B5E3C] text-white"
                                      : "bg-white border-[#E6D5C3] text-[#8B5E3C]"
                                  }`}>
                                    <SIcon className="w-4 h-4" />
                                  </div>
                                  <span className={`text-xs font-medium ${active ? "text-[#5A3A2A]" : "text-[#b09070]"}`}>
                                    {s.label}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Shipping + Promo */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-[#F3E8DE] rounded-xl p-4">
                          <p className="text-xs font-semibold text-[#8B5E3C] uppercase tracking-wide mb-2 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" /> Shipping Address
                          </p>
                          <p className="text-[#5A3A2A] text-sm">{order.address}</p>
                          {order.landmark && (
                            <p className="text-[#8B5E3C] text-xs mt-1">Near: {order.landmark}</p>
                          )}
                          <p className="text-[#8B5E3C] text-xs mt-1">
                            {order.city?.name}, {order.government?.name}
                          </p>
                          <p className="text-[#8B5E3C] text-xs mt-1 flex items-center gap-1">
                            <Phone className="w-3 h-3" /> {order.phone}
                          </p>
                        </div>

                        <div className="bg-[#F3E8DE] rounded-xl p-4 space-y-3">
                          <div>
                            <p className="text-xs font-semibold text-[#8B5E3C] uppercase tracking-wide mb-2">
                              Order Summary
                            </p>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between text-[#8B5E3C]">
                                <span>Subtotal</span>
                                <span>{parseFloat(order.total_price).toFixed(0)} EGP</span>
                              </div>
                              {order.promocode && (
                                <div className="flex justify-between text-green-600">
                                  <span className="flex items-center gap-1">
                                    <Tag className="w-3 h-3" /> {order.promocode.code}
                                  </span>
                                  <span>-{order.promocode.discount}%</span>
                                </div>
                              )}
                              <div className="flex justify-between font-bold text-[#5A3A2A] pt-1 border-t border-[#E6D5C3]">
                                <span>Total</span>
                                <span>{parseFloat(order.total_price).toFixed(0)} EGP</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* View Details Button */}
                      <div className="flex justify-end">
                        <Link href={`/profile/orders/${order.id}`}>
                          <button className="flex items-center gap-2 bg-[#8B5E3C] hover:bg-[#5A3A2A] text-white text-sm px-5 py-2.5 rounded-full transition duration-300 group">
                            View Full Details
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </button>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}