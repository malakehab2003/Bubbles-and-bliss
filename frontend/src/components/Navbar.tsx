"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { User, LayoutDashboard, LogOut } from "lucide-react";
import logo from "../../public/ChatGPT Image Apr 21, 2026, 08_28_17 PM.png";
import { useLogout } from "@/hooks/useLogout";

// جلب بيانات المستخدم الحالي
async function getCurrentUser() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  
  try {
    const res = await fetch("http://localhost:5000/api/user/getMe", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const { logout } = useLogout();

  // جلب بيانات المستخدم
  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getCurrentUser();
      setUser(userData);
    };
    fetchUser();
  }, []);

  const isAdmin = user?.role === "admin";

  return (
    <nav className="bg-beige-light border-b border-beige-medium sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo + Brand - Left */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 relative rounded-full overflow-hidden bg-beige-medium transition-transform group-hover:scale-105">
              <Image
                src={logo}
                alt="Logo"
                fill
                sizes="36px"
                className="object-cover"
              />
            </div>
            <span className="text-xl font-serif text-brown-dark group-hover:tracking-wider transition-all">
              BUBBLES & BLISS
            </span>
          </Link>

          {/* Center Menu - Shop & About */}
          <div className="flex gap-8">
            <Link
              href="/shop"
              className="text-brown-warm hover:text-brown-dark transition-colors duration-200 font-medium"
            >
              Shop
            </Link>
            <Link
              href="/about"
              className="text-brown-warm hover:text-brown-dark transition-colors duration-200 font-medium"
            >
              About
            </Link>
            {/* Admin Dashboard Link */}
            {isAdmin && (
              <Link
                href="/admin"
                className="text-brown-warm hover:text-brown-dark transition-colors duration-200 font-medium flex items-center gap-1"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <Link href="/profile" className="flex items-center gap-2 cursor-pointer group">
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-beige-medium ring-2 ring-beige-medium group-hover:ring-brown-warm transition-all">
                    {user.image ? (
                      <Image src={user.image} alt={user.name} width={36} height={36} className="object-cover w-full h-full" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-brown-warm">
                        <User className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                  <span className="text-brown-dark text-sm font-medium hidden md:block">
                    {user.name?.split(" ")[0]}
                  </span>
                </Link>
                <button
                  onClick={logout}
                  className="text-red-500 hover:text-red-700 transition p-1"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link href="/signin">
                <button className="relative overflow-hidden border-2 border-brown-warm text-brown-warm hover:text-white px-5 py-1.5 rounded-full transition-all duration-300 group">
                  <span className="relative z-10">Sign In</span>
                  <span className="absolute inset-0 bg-brown-warm transform translate-y-full transition-transform duration-300 group-hover:translate-y-0"></span>
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}