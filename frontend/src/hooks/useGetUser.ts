"use client";
import { useQuery } from "@tanstack/react-query";
import type { User } from "./useSearchUsers";

async function fetchUser(params: { email?: string; id?: number }): Promise<User | null> {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found");
  }

  const searchParams = new URLSearchParams();
  if (params.email) searchParams.append("email", params.email);
  if (params.id) searchParams.append("id", String(params.id));

  const res = await fetch(`http://localhost:5000/api/user/getUser?${searchParams.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || data.message || "Failed to get user");
  }

  return data.user || null;
}

export function useGetUser(email?: string, id?: number) {
  const enabled = !!(email || id);
  
  const { data: user, isLoading, error, refetch } = useQuery({
    queryKey: ["user", { email, id }],
    queryFn: () => fetchUser({ email, id }),
    enabled,
    retry: 1,
  });

  return {
    user,
    isLoading,
    error,
    refetch,
  };
}