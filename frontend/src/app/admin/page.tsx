"use client";
import { useState, useEffect } from "react";
import { DollarSign, Package, ShoppingBag, TrendingUp, TrendingDown } from "lucide-react";

interface DashboardData {
  totalRevenue: number;
  totalOrders: number;
  topSellingProducts: Array<{
    product_id: number;
    salesCount: string;
    product: { name: string };
  }>;
  leastSellingProducts: Array<{
    product_id: number;
    salesCount: string;
    product: { name: string };
  }>;
  salesByCategory: Array<{
    category: string;
    totalSales: string;
  }>;
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/api/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dashboardData = await res.json();
      setData(dashboardData);
    } catch (error) {
      console.error("Error fetching dashboard:", error);
    } finally {
      setIsLoading(false);
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
      <h1 className="text-3xl font-serif  text-[#5A3A2A] mb-8">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#8B5E3C] text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-[#5A3A2A]">
                ${data?.totalRevenue?.toFixed(2) || "0"}
              </p>
            </div>
            <DollarSign className="w-10 h-10 text-[#8B5E3C] opacity-50" />
          </div>
        </div>

        <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#8B5E3C] text-sm">Total Orders</p>
              <p className="text-2xl font-bold text-[#5A3A2A]">
                {data?.totalOrders || 0}
              </p>
            </div>
            <ShoppingBag className="w-10 h-10 text-[#8B5E3C] opacity-50" />
          </div>
        </div>

        <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#8B5E3C] text-sm">Top Product Sales</p>
              <p className="text-xl font-bold text-[#5A3A2A]">
                {data?.topSellingProducts?.[0]?.salesCount || 0} units
              </p>
            </div>
            <TrendingUp className="w-10 h-10 text-green-600 opacity-50" />
          </div>
        </div>

        <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#8B5E3C] text-sm">Categories</p>
              <p className="text-2xl font-bold text-[#5A3A2A]">
                {data?.salesByCategory?.length || 0}
              </p>
            </div>
            <Package className="w-10 h-10 text-[#8B5E3C] opacity-50" />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Top Selling Products */}
        <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 shadow-md">
          <h2 className="text-xl font-serif text-[#5A3A2A] mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Top Selling Products
          </h2>
          <div className="space-y-3">
            {data?.topSellingProducts?.map((product, index) => (
              <div key={product.product_id} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#8B5E3C] text-white flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </span>
                  <span className="text-[#5A3A2A]">{product.product.name}</span>
                </div>
                <span className="text-[#8B5E3C] font-semibold">{product.salesCount} sales</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sales by Category */}
        <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 shadow-md">
          <h2 className="text-xl font-serif text-[#5A3A2A] mb-4">Sales by Category</h2>
          <div className="space-y-3">
            {data?.salesByCategory?.map((category) => (
              <div key={category.category}>
                <div className="flex justify-between mb-1">
                  <span className="text-[#5A3A2A]">{category.category}</span>
                  <span className="text-[#8B5E3C]">{category.totalSales} sales</span>
                </div>
                <div className="w-full bg-[#E6D5C3] rounded-full h-2">
                  <div
                    className="bg-[#8B5E3C] h-2 rounded-full"
                    style={{
                      width: `${(parseInt(category.totalSales) / (data?.totalOrders || 1)) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Least Selling Products */}
      <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 shadow-md">
        <h2 className="text-xl font-serif text-[#5A3A2A] mb-4 flex items-center gap-2">
          <TrendingDown className="w-5 h-5 text-red-600" />
          Least Selling Products
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.leastSellingProducts?.map((product) => (
            <div key={product.product_id} className="flex justify-between items-center p-3 bg-white/30 rounded-lg">
              <span className="text-[#5A3A2A]">{product.product.name}</span>
              <span className="text-[#8B5E3C]">{product.salesCount} sales</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}