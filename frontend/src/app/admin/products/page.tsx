"use client";
import { useState, useEffect } from "react";

interface Order {
  id: number;
  total_price: string;
  order_status: string;
  payment_type: string;
  created_at: string;
  user_id: number;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchOrders();
  }, [selectedMonth, selectedYear]);

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `http://localhost:5000/api/dashboard/month-orders?month=${selectedMonth}&year=${selectedYear}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-600";
      case "processing":
        return "bg-blue-100 text-blue-600";
      case "shipped":
        return "bg-purple-100 text-purple-600";
      case "cancelled":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-[#8B5E3C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-serif text-[#5A3A2A]">Orders</h1>
        
        {/* Month/Year Filter */}
        <div className="flex gap-3">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="px-3 py-2 bg-white/50 border border-[#E6D5C3] rounded-lg"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
              <option key={month} value={month}>
                {new Date(2024, month - 1, 1).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="px-3 py-2 bg-white/50 border border-[#E6D5C3] rounded-lg"
          >
            {[2024, 2025, 2026].map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 shadow-md overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E6D5C3]">
              <th className="text-left py-3 text-[#5A3A2A]">Order ID</th>
              <th className="text-left py-3 text-[#5A3A2A]">User ID</th>
              <th className="text-left py-3 text-[#5A3A2A]">Total</th>
              <th className="text-left py-3 text-[#5A3A2A]">Payment</th>
              <th className="text-left py-3 text-[#5A3A2A]">Status</th>
              <th className="text-left py-3 text-[#5A3A2A]">Date</th>
             </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-[#E6D5C3] hover:bg-white/30">
                <td className="py-3 text-[#8B5E3C]">#{order.id}</td>
                <td className="py-3 text-[#5A3A2A]">{order.user_id}</td>
                <td className="py-3 text-[#5A3A2A] font-semibold">${order.total_price}</td>
                <td className="py-3 text-[#8B5E3C] capitalize">{order.payment_type}</td>
                <td className="py-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.order_status)}`}>
                    {order.order_status}
                  </span>
                </td>
                <td className="py-3 text-[#8B5E3C] text-sm">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
               </tr>
            ))}
          </tbody>
        </table>

        {orders.length === 0 && (
          <div className="text-center py-8 text-[#8B5E3C]">No orders found</div>
        )}
      </div>
    </div>
  );
}