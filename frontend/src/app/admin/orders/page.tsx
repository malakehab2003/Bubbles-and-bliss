"use client";
import { useState, useEffect, useMemo } from "react";
import {
  Search, Clock, Truck, CheckCircle, XCircle, Package, X, Save,
  User, Mail, Phone, MapPin, Tag, Hash, ShoppingBag, Loader2,
} from "lucide-react";

interface OrderItem {
  id: number;
  quantity: number;
  size?: string;
  product: {
    id: number;
    name: string;
    price: string;
    images?: { url: string }[];
  };
}

interface Order {
  id: number;
  total_price: string;
  order_status: "processing" | "shipped" | "delivered" | "cancelled";
  address: string;
  phone: string;
  created_at: string;
  user: { id: number; name: string; email?: string; phone?: string };
  government?: { name: string };
  city?: { name: string };
  promocode?: { id: number; code: string; discount: string } | null;
}

const STATUS_OPTIONS = ["processing", "shipped", "delivered", "cancelled"] as const;
type StatusType = typeof STATUS_OPTIONS[number];

const statusConfig: Record<StatusType, { label: string; color: string; icon: any }> = {
  processing: { label: "Processing", color: "bg-yellow-100 text-yellow-700 border-yellow-200", icon: Clock },
  shipped:    { label: "Shipped",    color: "bg-blue-100 text-blue-700 border-blue-200",   icon: Truck },
  delivered:  { label: "Delivered",  color: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle },
  cancelled:  { label: "Cancelled",  color: "bg-red-100 text-red-700 border-red-200",       icon: XCircle },
};

function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2 text-sm">
      <Icon className="w-4 h-4 text-[#8B5E3C] mt-0.5 flex-shrink-0" />
      <div>
        <span className="text-[#8B5E3C] text-xs block">{label}</span>
        <p className="text-[#3a2010] font-medium">{value}</p>
      </div>
    </div>
  );
}

export default function AdminOrdersPage() {
  const [orders, setOrders]               = useState<Order[]>([]);
  const [isLoading, setIsLoading]         = useState(true);
  const [searchQuery, setSearchQuery]     = useState("");
  const [statusFilter, setStatusFilter]   = useState("all");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear]   = useState(new Date().getFullYear());

  const [editOrder, setEditOrder]     = useState<Order | null>(null);
  const [editStatus, setEditStatus]   = useState<StatusType>("processing");
  const [editTotal, setEditTotal]     = useState("");
  const [editPromoId, setEditPromoId] = useState("");
  const [isSaving, setIsSaving]       = useState(false);
  const [saveError, setSaveError]     = useState("");

  const [orderItems, setOrderItems]     = useState<OrderItem[]>([]);
  const [itemsLoading, setItemsLoading] = useState(false);

  useEffect(() => { fetchOrders(); }, [selectedMonth, selectedYear]);

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    setIsLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/dashboard/month-orders?month=${selectedMonth}&year=${selectedYear}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrderItems = async (orderId: number) => {
    const token = localStorage.getItem("token");
    setItemsLoading(true);
    setOrderItems([]);
    try {
      const res = await fetch(
        `http://localhost:5000/api/order/item/admin/list/${orderId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setOrderItems(data.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setItemsLoading(false);
    }
  };

  const openEdit = (order: Order) => {
    setEditOrder(order);
    setEditStatus(order.order_status);
    setEditTotal(parseFloat(order.total_price).toFixed(2));
    setEditPromoId(order.promocode?.id ? String(order.promocode.id) : "");
    setSaveError("");
    fetchOrderItems(order.id);
  };

  const closeEdit = () => { setEditOrder(null); setOrderItems([]); setSaveError(""); };

  const saveEdit = async () => {
    if (!editOrder) return;
    const token = localStorage.getItem("token");
    setIsSaving(true);
    setSaveError("");
    try {
      const body: Record<string, any> = {};
      if (editStatus !== editOrder.order_status) body.order_status = editStatus;
      if (editTotal && parseFloat(editTotal) !== parseFloat(editOrder.total_price))
        body.total_price = parseFloat(editTotal);
      if (editPromoId && editPromoId !== String(editOrder.promocode?.id || ""))
        body.promocode_id = parseInt(editPromoId);

      if (Object.keys(body).length === 0) { closeEdit(); return; }

      const res = await fetch(
        `http://localhost:5000/api/order/updateOrder/${editOrder.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(body),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === editOrder.id
              ? {
                  ...o,
                  order_status: editStatus,
                  total_price: editTotal,
                  promocode: editPromoId
                    ? { id: parseInt(editPromoId), code: "", discount: "" }
                    : o.promocode,
                }
              : o
          )
        );
        closeEdit();
      } else {
        setSaveError(data.err || "Failed to update order");
      }
    } catch {
      setSaveError("Something went wrong");
    } finally {
      setIsSaving(false);
    }
  };

  const stats = useMemo(() => ({
    total:      orders.length,
    processing: orders.filter((o) => o.order_status === "processing").length,
    shipped:    orders.filter((o) => o.order_status === "shipped").length,
    delivered:  orders.filter((o) => o.order_status === "delivered").length,
    revenue:    orders
      .filter((o) => o.order_status !== "cancelled")
      .reduce((sum, o) => sum + parseFloat(o.total_price), 0),
  }), [orders]);

  const filtered = useMemo(() =>
    orders.filter((order) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !q ||
        String(order.id).includes(q) ||
        order.user?.name?.toLowerCase().includes(q) ||
        order.user?.email?.toLowerCase().includes(q) ||
        order.phone?.includes(q);
      const matchStatus = statusFilter === "all" || order.order_status === statusFilter;
      return matchSearch && matchStatus;
    }),
  [orders, searchQuery, statusFilter]);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-serif text-[#5A3A2A]">Order Management</h1>
          <p className="text-[#8B5E3C] text-sm mt-1">Click any order to view details and edit</p>
        </div>
        <div className="flex gap-3">
          <select value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="px-3 py-2 bg-white/50 border border-[#E6D5C3] rounded-lg text-[#5A3A2A] text-sm">
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>{new Date(2024, m - 1, 1).toLocaleString("default", { month: "long" })}</option>
            ))}
          </select>
          <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="px-3 py-2 bg-white/50 border border-[#E6D5C3] rounded-lg text-[#5A3A2A] text-sm">
            {[2024, 2025, 2026].map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {[
          { label: "Total Orders", value: stats.total,      border: "" },
          { label: "Processing",   value: stats.processing, border: "border-l-4 border-yellow-400" },
          { label: "Shipped",      value: stats.shipped,    border: "border-l-4 border-blue-400" },
          { label: "Delivered",    value: stats.delivered,  border: "border-l-4 border-green-400" },
        ].map((s) => (
          <div key={s.label} className={`bg-white/40 backdrop-blur-sm rounded-xl p-4 shadow-sm ${s.border}`}>
            <p className="text-[#8B5E3C] text-xs mb-1">{s.label}</p>
            <p className="text-2xl font-bold text-[#5A3A2A]">{s.value}</p>
          </div>
        ))}
        <div className="bg-white/40 backdrop-blur-sm rounded-xl p-4 shadow-sm border-l-4 border-[#8B5E3C]">
          <p className="text-[#8B5E3C] text-xs mb-1">Revenue</p>
          <p className="text-xl font-bold text-green-600">{stats.revenue.toFixed(0)} EGP</p>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B5E3C]" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order ID, name, email or phone..."
            className="w-full pl-10 pr-4 py-3 bg-white/50 border border-[#E6D5C3] rounded-xl text-[#5A3A2A] placeholder-[#b09070] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] transition" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 bg-white/50 border border-[#E6D5C3] rounded-xl text-[#5A3A2A] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]">
          <option value="all">All Status</option>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{statusConfig[s].label}</option>)}
        </select>
      </div>

      {/* Orders List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-10 h-10 border-4 border-[#8B5E3C] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white/40 rounded-2xl p-12 text-center shadow-md">
          <Package className="w-12 h-12 text-[#8B5E3C] mx-auto mb-3 opacity-40" />
          <p className="text-[#8B5E3C]">No orders found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => {
            const cfg = statusConfig[order.order_status] || statusConfig.processing;
            const StatusIcon = cfg.icon;
            return (
              <div key={order.id} onClick={() => openEdit(order)}
                className="bg-white/40 backdrop-blur-sm rounded-xl p-5 shadow-sm hover:shadow-md hover:bg-white/60 transition-all cursor-pointer">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 bg-[#E6D5C3] rounded-full flex items-center justify-center flex-shrink-0">
                      <Package className="w-5 h-5 text-[#8B5E3C]" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-[#5A3A2A]">Order #{order.id}</span>
                        <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${cfg.color}`}>
                          <StatusIcon className="w-3 h-3" />{cfg.label}
                        </span>
                      </div>
                      <p className="text-sm text-[#8B5E3C] truncate">
                        {order.user?.name || `User #${order.user?.id}`}
                        {order.user?.email && <span className="ml-2 text-xs opacity-75">• {order.user.email}</span>}
                        {order.phone && <span className="ml-2 text-xs">• {order.phone}</span>}
                      </p>
                      {(order.city || order.government) && (
                        <p className="text-xs text-[#8B5E3C] mt-0.5">
                          📍 {order.city?.name}, {order.government?.name}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-[#5A3A2A]">{parseFloat(order.total_price).toFixed(0)} EGP</p>
                    <p className="text-xs text-[#8B5E3C]">{new Date(order.created_at).toLocaleDateString("en-EG")}</p>
                    <p className="text-xs text-[#8B5E3C] mt-1 underline">Click to edit</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!isLoading && filtered.length > 0 && (
        <p className="text-center text-sm text-[#8B5E3C] mt-4">
          Showing {filtered.length} of {orders.length} orders
        </p>
      )}

      {/* ── Modal ── */}
      {editOrder && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeEdit}>
          <div className="bg-[#F3E8DE] rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>

            {/* Header */}
            <div className="flex justify-between items-center mb-5">
              <div>
                <h2 className="text-2xl font-serif text-[#5A3A2A]">Order #{editOrder.id}</h2>
                <p className="text-xs text-[#8B5E3C] mt-0.5">{new Date(editOrder.created_at).toLocaleString("en-EG")}</p>
              </div>
              <button onClick={closeEdit} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#E6D5C3] transition text-[#8B5E3C]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* بيانات الزبون */}
            <div className="bg-white/50 rounded-xl p-4 mb-4">
              <p className="text-xs font-bold text-[#5A3A2A] uppercase tracking-wider mb-3 flex items-center gap-1">
                <User className="w-3.5 h-3.5" /> بيانات الزبون
              </p>
              <div className="grid grid-cols-2 gap-3">
                <InfoRow icon={User}  label="الاسم"    value={editOrder.user?.name} />
                <InfoRow icon={Hash}  label="User ID"  value={String(editOrder.user?.id)} />
              </div>
              <div className="grid grid-cols-1 gap-3 mt-3">
                <InfoRow icon={Mail}  label="الإيميل"  value={editOrder.user?.email} />
                <InfoRow icon={Phone} label="التليفون" value={editOrder.phone || editOrder.user?.phone} />
              </div>
            </div>

            {/* عنوان التوصيل */}
            <div className="bg-white/50 rounded-xl p-4 mb-4">
              <p className="text-xs font-bold text-[#5A3A2A] uppercase tracking-wider mb-3 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> عنوان التوصيل
              </p>
              <div className="grid grid-cols-1 gap-3">
                <InfoRow
                  icon={MapPin}
                  label="المحافظة / المدينة"
                  value={[editOrder.government?.name, editOrder.city?.name].filter(Boolean).join(" — ")}
                />
                <InfoRow icon={MapPin} label="العنوان التفصيلي" value={editOrder.address} />
              </div>
            </div>

            {/* محتويات الأوردر */}
            <div className="bg-white/50 rounded-xl p-4 mb-4">
              <p className="text-xs font-bold text-[#5A3A2A] uppercase tracking-wider mb-3 flex items-center gap-1">
                <ShoppingBag className="w-3.5 h-3.5" /> محتويات الأوردر
              </p>

              {itemsLoading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="w-6 h-6 text-[#8B5E3C] animate-spin" />
                </div>
              ) : orderItems.length === 0 ? (
                <p className="text-sm text-[#8B5E3C] text-center py-4">لا توجد منتجات</p>
              ) : (
                <div className="space-y-2">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 bg-white/60 rounded-lg p-2.5">
                      {item.product?.images?.[0]?.url ? (
                        <img src={item.product.images[0].url} alt={item.product.name}
                          className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-[#E6D5C3]" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-[#E6D5C3] flex items-center justify-center flex-shrink-0">
                          <Package className="w-5 h-5 text-[#8B5E3C]" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#3a2010] truncate">
                          {item.product?.name || `Product #${item.product?.id}`}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          {item.size && (
                            <span className="text-xs bg-[#E6D5C3] text-[#5A3A2A] px-1.5 py-0.5 rounded">
                              Size: {item.size}
                            </span>
                          )}
                          <span className="text-xs text-[#8B5E3C]">× {item.quantity}</span>
                        </div>
                      </div>
                      {item.product?.price && (
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-semibold text-[#5A3A2A]">
                            {(parseFloat(item.product.price) * item.quantity).toFixed(0)} EGP
                          </p>
                          <p className="text-xs text-[#8B5E3C]">
                            {parseFloat(item.product.price).toFixed(0)} × {item.quantity}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}

                  <div className="flex justify-between items-center pt-2 border-t border-[#E6D5C3] mt-2">
                    <span className="text-sm font-semibold text-[#5A3A2A]">الإجمالي</span>
                    <span className="font-bold text-[#5A3A2A]">{parseFloat(editOrder.total_price).toFixed(0)} EGP</span>
                  </div>

                  {editOrder.promocode && (
                    <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 rounded-lg px-3 py-1.5">
                      <Tag className="w-3 h-3" />
                      بروموكود: <span className="font-semibold">{editOrder.promocode.code}</span>
                      — خصم {editOrder.promocode.discount}%
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* تعديل الأوردر */}
            <div className="space-y-4">
              <p className="text-xs font-bold text-[#5A3A2A] uppercase tracking-wider">تعديل الأوردر</p>

              <div>
                <label className="block text-sm font-semibold text-[#5A3A2A] mb-2">الحالة</label>
                <div className="grid grid-cols-2 gap-2">
                  {STATUS_OPTIONS.map((status) => {
                    const s = statusConfig[status];
                    const SIcon = s.icon;
                    const isSelected = editStatus === status;
                    return (
                      <button key={status} onClick={() => setEditStatus(status)}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-sm transition ${
                          isSelected
                            ? "border-[#8B5E3C] bg-[#8B5E3C] text-white"
                            : "border-[#E6D5C3] bg-white/50 text-[#5A3A2A] hover:border-[#8B5E3C]"
                        }`}>
                        <SIcon className="w-4 h-4" />{s.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#5A3A2A] mb-2">السعر الإجمالي (EGP)</label>
                <input type="number" value={editTotal} onChange={(e) => setEditTotal(e.target.value)}
                  min="0" step="0.01"
                  className="w-full px-4 py-3 bg-white/60 border border-[#E6D5C3] rounded-xl text-[#3a2010] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] transition" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#5A3A2A] mb-2">
                  Promo Code ID <span className="text-[#8B5E3C] font-normal">(اختياري)</span>
                </label>
                {editOrder.promocode && (
                  <p className="text-xs text-[#8B5E3C] mb-1">
                    الحالي: <span className="font-medium">{editOrder.promocode.code}</span>{" "}
                    (ID: {editOrder.promocode.id}، خصم {editOrder.promocode.discount}%)
                  </p>
                )}
                <input type="number" value={editPromoId} onChange={(e) => setEditPromoId(e.target.value)}
                  placeholder="ادخل ID البروموكود" min="1"
                  className="w-full px-4 py-3 bg-white/60 border border-[#E6D5C3] rounded-xl text-[#3a2010] placeholder-[#b09070] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] transition" />
              </div>

              {saveError && (
                <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">{saveError}</p>
              )}

              <div className="flex gap-3 pt-2">
                <button onClick={closeEdit}
                  className="flex-1 py-3 border-2 border-[#E6D5C3] text-[#8B5E3C] rounded-full hover:bg-[#E6D5C3] transition">
                  إلغاء
                </button>
                <button onClick={saveEdit} disabled={isSaving}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#8B5E3C] hover:bg-[#5A3A2A] text-white rounded-full transition disabled:opacity-50">
                  {isSaving ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <><Save className="w-4 h-4" /> حفظ التعديلات</>
                  )}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
