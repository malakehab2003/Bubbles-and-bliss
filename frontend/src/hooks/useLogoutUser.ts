"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

async function logoutCurrentUser(): Promise<void> {
  const token = localStorage.getItem("token");
  if (!token) {
    return;
  }

  const res = await fetch("http://localhost:5000/api/user/logOut", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || data.message || "Failed to logout");
  }
}

export function useLogoutUser() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate: logoutUser, isPending, error } = useMutation({
    mutationFn: logoutCurrentUser,
    onSuccess: () => {
      // Clear token from localStorage
      localStorage.removeItem("token");
      
      // Invalidate all queries
      queryClient.clear();
      
      toast.success("Logged out successfully!");
      
      // Redirect to home page
      router.push("/");
      router.refresh();
    },
    onError: (error: any) => {
      // Even if API fails, clear token locally
      localStorage.removeItem("token");
      toast.error(error.message || "Failed to logout");
      router.push("/");
    },
  });

  return { logoutUser, isPending, error };
}