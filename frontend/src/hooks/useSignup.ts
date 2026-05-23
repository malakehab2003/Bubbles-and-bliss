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

      const response = await fetch("http://localhost:5000/api/user/createUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || data.message || "Something went wrong");
      }
      return data;
    },
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      toast.success("Account created successfully! 🎉");
      router.push("/");
      // بعد ما الصفحة تتحول، ابعت الـ event عشان الـ Navbar يتحدث
      setTimeout(() => {
        window.dispatchEvent(new Event("userChanged"));
      }, 300);
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to create account. Please try again.");
    },
  });

  return { signupUser, isPending };
}