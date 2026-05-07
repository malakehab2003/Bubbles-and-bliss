"use client";
import { useState, useEffect } from "react";
import { Search, ShoppingBag, Eye, Package, Truck, CheckCircle, XCircle, Clock, User, MapPin } from "lucide-react";

interface Order {
  id: number;
  total_price: string;
  address: string;
  landmark: string | null;
  phone: string;
  order_status: "processing" | "shipped" | "delivered" | "cancelled";
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  government: {
    id: number;
    name: string;
  };
  city: {
    id: number;
    name: string;
  };
  promocode: {
    code: string;
    discount: string;
  } | null;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    try {
      // استخدام getMyorders للحصول على كل الطلبات (لأنه endpoint مفتوح للأدمن)
      const res = await fetch("http://localhost:5000/api/order/getOrders?user_id", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      console.log("Fetched orders:", data);
      setOrders(data.orders || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "shipped":
        return <Truck className="w-4 h-4 text-blue-600" />;
      case "processing":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case "cancelled":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Package className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-700 border-green-200";
      case "shipped":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "processing":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "delivered":
        return "Delivered";
      case "shipped":
        return "Shipped";
      case "processing":
        return "Processing";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  const filteredOrders = orders.filter(order => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      order.id.toString().includes(searchLower) ||
      order.user?.name?.toLowerCase().includes(searchLower) ||
      order.user?.email?.toLowerCase().includes(searchLower);
    const matchesStatus = filterStatus === "all" || order.order_status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: orders.length,
    processing: orders.filter(o => o.order_status === "processing").length,
    shipped: orders.filter(o => o.order_status === "shipped").length,
    delivered: orders.filter(o => o.order_status === "delivered").length,
    cancelled: orders.filter(o => o.order_status === "cancelled").length,
    revenue: orders.reduce((sum, o) => sum + parseFloat(o.total_price), 0),
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-3 border-brown-warm border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige-light">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brown-warm/20 mb-4">
            <ShoppingBag className="w-8 h-8 text-brown-dark" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-brown-dark">Order Management</h1>
          <p className="text-brown-dark/70 mt-2">Manage and track all customer orders</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-brown-warm">
            <p className="text-sm font-medium text-brown-warm">Total Orders</p>
            <p className="text-2xl font-bold text-brown-dark">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-yellow-500">
            <p className="text-sm font-medium text-yellow-600">Processing</p>
            <p className="text-2xl font-bold text-yellow-700">{stats.processing}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-blue-500">
            <p className="text-sm font-medium text-blue-600">Shipped</p>
            <p className="text-2xl font-bold text-blue-700">{stats.shipped}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-green-500">
            <p className="text-sm font-medium text-green-600">Delivered</p>
            <p className="text-2xl font-bold text-green-700">{stats.delivered}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-emerald-600">
            <p className="text-sm font-medium text-emerald-600">Revenue</p>
            <p className="text-2xl font-bold text-emerald-700">${stats.revenue.toFixed(2)}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-beige-medium p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-brown-warm" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by order ID, customer name or email..."
                  className="w-full pl-10 pr-4 py-2.5 bg-beige-light/50 border border-beige-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-warm focus:border-transparent text-brown-dark font-medium placeholder:text-brown-warm/50"
                />
              </div>
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 bg-beige-light/50 border border-beige-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-warm text-brown-dark font-medium"
            >
              <option value="all">All Status</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-3">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl">
              <ShoppingBag className="w-12 h-12 mx-auto text-brown-warm/30 mb-3" />
              <p className="text-brown-warm font-medium">No orders found</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                isSelected={selectedOrder?.id === order.id}
                onSelect={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                getStatusIcon={getStatusIcon}
                getStatusColor={getStatusColor}
                getStatusText={getStatusText}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// Order Card Component
function OrderCard({ 
  order, 
  isSelected, 
  onSelect,
  getStatusIcon,
  getStatusColor,
  getStatusText
}: { 
  order: Order; 
  isSelected: boolean;
  onSelect: () => void;
  getStatusIcon: (status: string) => JSX.Element;
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
}) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border transition-all duration-200 ${
      isSelected ? 'border-brown-warm shadow-md' : 'border-beige-medium hover:shadow-md'
    }`}>
      <div className="p-4 cursor-pointer" onClick={onSelect}>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-beige-medium flex items-center justify-center">
              <Package className="w-5 h-5 text-brown-dark" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-brown-dark">Order #{order.id}</h3>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(order.order_status)}`}>
                  {getStatusIcon(order.order_status)}
                  {getStatusText(order.order_status)}
                </span>
              </div>
              <p className="text-sm text-brown-warm">{order.user?.name} • {order.user?.email}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-brown-dark">${order.total_price}</p>
            <p className="text-xs text-brown-warm">{new Date(order.created_at).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {isSelected && (
        <div className="px-4 pb-4 pt-2 border-t border-beige-medium bg-beige-light/30 rounded-b-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-brown-dark flex items-center gap-2">
                <User className="w-4 h-4" /> Customer Information
              </h4>
              <div className="bg-white rounded-lg p-3 space-y-2 border border-beige-medium">
                <p className="text-brown-dark"><span className="font-semibold">Name:</span> {order.user?.name}</p>
                <p className="text-brown-dark"><span className="font-semibold">Email:</span> {order.user?.email}</p>
                <p className="text-brown-dark"><span className="font-semibold">Phone:</span> {order.phone}</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-bold text-brown-dark flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Shipping Information
              </h4>
              <div className="bg-white rounded-lg p-3 space-y-2 border border-beige-medium">
                <p className="text-brown-dark"><span className="font-semibold">Address:</span> {order.address}</p>
                {order.landmark && <p className="text-brown-dark"><span className="font-semibold">Landmark:</span> {order.landmark}</p>}
                <p className="text-brown-dark"><span className="font-semibold">Location:</span> {order.city?.name}, {order.government?.name}</p>
                {order.promocode && (
                  <p className="text-brown-dark"><span className="font-semibold">Promocode:</span> {order.promocode.code} ({order.promocode.discount}% off)</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}