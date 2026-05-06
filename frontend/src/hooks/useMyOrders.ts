"use client";
import { useQuery } from "@tanstack/react-query";

export interface Order {
  id: number;
  total_price: string;
  address: string;
  landmark: string | null;
  phone: string;
  order_status: "processing" | "shipped" | "delivered" | "cancelled";
  created_at: string;
  updated_at: string;
  city_id: number;
  government_id: number;
  user_id: number;
  promocode_id: number | null;
  user: {
    id: number;
    name: string;
  };
  promocode: {
    id: number;
    code: string;
    description: string;
    discount: string;
  } | null;
  government: {
    id: number;
    name: string;
  };
  city: {
    id: number;
    name: string;
  };
}

async function fetchMyOrders(): Promise<Order[]> {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found");
  }

  const res = await fetch("http://localhost:5000/api/order/getMyorders", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || data.message || "Failed to fetch orders");
  }

  return data.orders || [];
}

export function useMyOrders() {
  const {
    data: orders,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["myOrders"],
    queryFn: fetchMyOrders,
    retry: 1,
  });

  return {
    orders: orders || [],
    isLoading,
    error,
    refetch,
  };
}