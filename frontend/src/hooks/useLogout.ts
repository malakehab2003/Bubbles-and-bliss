"use client";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export function useLogout() {
  const router = useRouter();

  const logout = async () => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      localStorage.removeItem("token");
      router.push("/");
      router.refresh();
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/user/logOut", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.removeItem("token");
        
        toast.success("Logged out successfully!");
        
        router.push("/");
        router.refresh();
      } else {
        throw new Error(data.error || data.message || "Logout failed");
      }
    } catch (error: any) {
      console.error("Logout error:", error);
      toast.error(error.message || "Failed to logout");
      
      localStorage.removeItem("token");
      router.push("/");
      router.refresh();
    }
  };

  return { logout };
}