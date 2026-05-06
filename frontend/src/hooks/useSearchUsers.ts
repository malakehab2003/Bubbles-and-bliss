"use client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  is_verified?: boolean;
  phone?: string;
  dob?: string;
}

async function fetchSearchUsers(query: string): Promise<User[]> {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found");
  }

  // لو مفيش بحث، جيب كل المستخدمين
  const searchQuery = query && query.trim() !== "" ? query : "";
  
  const res = await fetch(`http://localhost:5000/api/user/searchUser?q=${encodeURIComponent(searchQuery)}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || data.message || "Failed to search users");
  }

  return data.users || [];
}

export function useSearchUsers() {
  const [query, setQuery] = useState("");
  
  const { data: users, isLoading, error, refetch } = useQuery({
    queryKey: ["searchUsers", query],
    queryFn: () => fetchSearchUsers(query),
    retry: 1,
  });

  const searchUsers = (searchQuery: string) => {
    setQuery(searchQuery);
  };

  return {
    users: users || [],
    isLoading,
    error,
    searchUsers,
    query,
  };
}