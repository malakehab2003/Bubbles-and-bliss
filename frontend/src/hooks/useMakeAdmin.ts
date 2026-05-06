"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import type { User } from "./useSearchUsers";

async function makeAdminUser(userId: number): Promise<User> {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found");
  }

  const res = await fetch("http://localhost:5000/api/user/createAdmin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ user_id: userId }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || data.message || "Failed to make admin");
  }

  return data.user;
}

export function useMakeAdmin() {
  const queryClient = useQueryClient();

  const { mutate: makeAdmin, isPending, error } = useMutation({
    mutationFn: makeAdminUser,
    onSuccess: (data, userId) => {
      toast.success(`User ${data.name} is now an admin!`);
      // Invalidate and refetch users lists
      queryClient.invalidateQueries({ queryKey: ["searchUsers"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to make admin");
    },
  });

  return { makeAdmin, isPending, error };
}