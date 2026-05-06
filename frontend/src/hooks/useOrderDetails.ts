"use client";
import { useQuery } from "@tanstack/react-query";
import type { Order } from "./useMyOrders";

async function fetchOrderDetails(orderId: number): Promise<Order> {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found");
  }

  const res = await fetch(`http://localhost:5000/api/order/getOrder/${orderId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || data.message || "Failed to fetch order details");
  }

  return data.order;
}

export function useOrderDetails(orderId: number) {
  const {
    data: order,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => fetchOrderDetails(orderId),
    enabled: !!orderId && orderId > 0,
    retry: 1,
  });

  return {
    order,
    isLoading,
    error,
    refetch,
  };
}