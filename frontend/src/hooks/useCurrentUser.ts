"use client";
import { useQuery } from "@tanstack/react-query";
import type { User } from "./useSearchUsers";

async function fetchCurrentUser(): Promise<User | null> {
  const token = localStorage.getItem("token");
  if (!token) {
    return null;
  }

  const res = await fetch("http://localhost:5000/api/user/getMe", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    return null;
  }

  return await res.json();
}

export function useCurrentUser() {
  const { data: user, isLoading, error, refetch } = useQuery({
    queryKey: ["currentUser"],
    queryFn: fetchCurrentUser,
    retry: 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    user,
    isLoading,
    error,
    refetch,
    isAdmin: user?.role === "admin",
    isAuthenticated: !!user,
  };
}