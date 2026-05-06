"use client";
import { useQuery } from "@tanstack/react-query";
import type { User } from "./useSearchUsers";

async function fetchAllUsers(): Promise<User[]> {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found");
  }

  // جيب كل المستخدمين (بعدل الـ API)
  const res = await fetch(`http://localhost:5000/api/user/searchUser?q=`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || data.message || "Failed to fetch users");
  }

  return data.users || [];
}

export function useAllUsers() {
  const { data: users, isLoading, error, refetch } = useQuery({
    queryKey: ["allUsers"],
    queryFn: fetchAllUsers,
    retry: 1,
  });

  return {
    users: users || [],
    isLoading,
    error,
    refetch,
  };
}