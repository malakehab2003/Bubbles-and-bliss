"use client";
import { toast } from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { type SignInFormData } from "@/lib/validation/schemas";

export function useLogin() {
  const router = useRouter();

  const { mutate: loginUser, isPending } = useMutation({
    mutationFn: async (values: SignInFormData) => {
      const res = await fetch("http://localhost:5000/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || "Failed to login");
      return data;
    },
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem("token", data.token);
        window.dispatchEvent(new Event("login"));
      }
      
      console.log("Login successful:", data);
      toast.success("Logged in successfully!");
      router.push("/");
      router.refresh();
    },
    onError: (err: any) => {
      console.error(err);
      toast.error(err.message || "Failed to log in");
    },
  });
  
  return { loginUser, isPending };
}