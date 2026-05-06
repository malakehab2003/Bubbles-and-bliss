"use client";
import { toast } from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { type SignUpFormData } from "@/lib/validation/schemas";

export function useSignup() {
  const router = useRouter();

  const { mutate: signupUser, isPending } = useMutation({
    mutationFn: async (values: SignUpFormData) => {
      const payload = {
        name: values.name,
        email: values.email,
        password: values.password,
        phone: values.phone || "",
        dob: values.dob ? new Date(values.dob).toISOString().split('T')[0] : "",
      };

      console.log("📤 Sending payload:", payload);

      const response = await fetch("http://localhost:5000/api/user/createUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("📥 Response:", { status: response.status, data });

      if (!response.ok) {
        throw new Error(data.error || data.message || "Something went wrong");
      }
      
      return data;
    },
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem("token", data.token);
        console.log("🔑 Token saved");
      }
      
      toast.success("Account created successfully!");
      router.push("/");
      router.refresh();
    },
    onError: (err: any) => {
      console.error("❌ Error creating user:", err);
      toast.error(err.message || "Failed to create account. Please try again.");
    },
  });
  
  return { signupUser, isPending };
}