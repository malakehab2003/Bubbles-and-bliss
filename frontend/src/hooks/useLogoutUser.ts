"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export function useLogoutUser() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate: logoutUser, isPending, error } = useMutation({
    mutationFn: async () => Promise.resolve(),
    onSuccess: () => {
      localStorage.removeItem("token");
      queryClient.clear();
      toast.success("Logged out successfully!");
      router.push("/");
      setTimeout(() => {
        window.dispatchEvent(new Event("userChanged"));
      }, 300);
    },
    onError: () => {
      localStorage.removeItem("token");
      toast.success("Logged out successfully!");
      router.push("/");
      setTimeout(() => {
        window.dispatchEvent(new Event("userChanged"));
      }, 300);
    },
  });

  return { logoutUser, isPending, error };
}