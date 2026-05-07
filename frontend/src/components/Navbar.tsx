"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, User, Menu, X } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import logo from "../../public/ChatGPT Image Apr 21, 2026, 08_28_17 PM.png";

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

// جلب عربة التسوق
async function getCart() {
  const token = localStorage.getItem("token");
  if (!token) return [];
  
  try {
    const res = await fetch("http://localhost:5000/api/cart/list", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.cart || [];
  } catch {
    return [];
  }
}

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const queryClient = useQueryClient();

  // جلب بيانات المستخدم
  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getCurrentUser();
      setUser(userData);
    };
    fetchUser();
  }, []);

  // جلب عربة التسوق (تتحدث تلقائياً عند إضافة منتج)
  const { data: cartItems = [], refetch: refetchCart } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    enabled: !!user,
  });

  // استماع لأحداث إضافة المنتج للعربة
  useEffect(() => {
    const handleCartUpdate = () => {
      refetchCart();
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, [refetchCart]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/";
  };

  // حساب عدد المنتجات في العربة
  const cartItemCount = cartItems.reduce((total: number, item: any) => {
    return total + (item.quantity || 1);
  }, 0);

  return (
    <nav className="bg-beige-light border-b border-beige-medium sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo + Brand - Left */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 relative rounded-full overflow-hidden bg-beige-medium transition-transform group-hover:scale-105">
              <Image src={logo} alt="Logo" fill sizes="36px" className="object-cover" />
            </div>
            <span className="text-xl font-serif text-brown-dark group-hover:tracking-wider transition-all">
              BUBBLES & BLISS
            </span>
          </Link>

          {/* Center Menu - Shop & About */}
          <div className="hidden md:flex gap-8">
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
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Cart Icon with Counter */}
            <Link href="/cart" className="relative">
              <div className="p-1.5 text-brown-warm hover:text-brown-dark transition">
                <ShoppingCart className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 font-bold">
                    {cartItemCount > 99 ? "99+" : cartItemCount}
                  </span>
                )}
              </div>
            </Link>

            {user ? (
              <Link href="/profile" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-beige-medium ring-2 ring-beige-medium group-hover:ring-brown-warm transition-all flex items-center justify-center">
                  {user.image ? (
                    <Image src={user.image} alt={user.name} width={32} height={32} className="object-cover" />
                  ) : (
                    <User className="w-4 h-4 text-brown-dark" />
                  )}
                </div>
                <span className="text-brown-dark text-sm font-medium hidden lg:block">
                  {user.name?.split(" ")[0]}
                </span>
              </Link>
            ) : (
              <Link href="/signin">
                <button className="relative overflow-hidden border-2 border-brown-warm text-brown-warm hover:text-white px-5 py-1.5 rounded-full transition-all duration-300 group">
                  <span className="relative z-10">Sign In</span>
                  <span className="absolute inset-0 bg-brown-warm transform translate-y-full transition-transform duration-300 group-hover:translate-y-0"></span>
                </button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-brown-dark p-2"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-beige-medium">
            <div className="flex flex-col space-y-3 mb-4">
              <Link
                href="/shop"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-brown-warm hover:text-brown-dark py-2 transition"
              >
                Shop
              </Link>
              <Link
                href="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-brown-warm hover:text-brown-dark py-2 transition"
              >
                About
              </Link>
              <Link
                href="/cart"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between text-brown-warm hover:text-brown-dark py-2 transition"
              >
                <span>Cart</span>
                {cartItemCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                    {cartItemCount} items
                  </span>
                )}
              </Link>
            </div>

            <div className="border-t border-beige-medium pt-4">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 pb-3 border-b border-beige-medium">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-beige-medium flex items-center justify-center">
                      {user.image ? (
                        <Image src={user.image} alt={user.name} width={40} height={40} className="object-cover" />
                      ) : (
                        <User className="w-5 h-5 text-brown-dark" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-brown-dark">{user.name}</p>
                      <p className="text-xs text-brown-warm">{user.email}</p>
                    </div>
                  </div>
                  <Link
                    href="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 text-brown-warm hover:text-brown-dark py-2 transition"
                  >
                    <User className="w-4 h-4" /> My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left text-red-600 py-2"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  href="/signin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-center bg-brown-warm text-white py-2 rounded-full"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}