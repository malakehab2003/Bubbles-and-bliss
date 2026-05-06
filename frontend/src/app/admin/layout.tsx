"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { LayoutDashboard, ShoppingBag, Package, Users } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // التحقق من صلاحيات admin
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/signin";
      return;
    }

    fetch("http://localhost:5000/api/user/getMe", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.role !== "admin") {
          window.location.href = "/profile";
        }
      })
      .catch(() => {
        window.location.href = "/signin";
      });
  }, []);

  const menuItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Users", href: "/admin/users", icon: Users },
  ];


  return (
    <div className="bg-[#F3E8DE] min-h-screen">
      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`bg-[#5A3A2A] text-black min-h-screen transition-all duration-300 ${
            isSidebarOpen ? "w-64" : "w-20"
          }`}
        >
          <div className="p-4 border-b text-black border-[#8B5E3C] flex justify-between items-center">
            <h2 className={`font-serif ${!isSidebarOpen && "hidden"}`}>
              Admin Panel
            </h2>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-black hover:text-[#E6D5C3]"
            >
              {isSidebarOpen ? "◀" : "▶"}
            </button>
          </div>

          <nav className="mt-6">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 hover:bg-[#8B5E3C] transition ${
                    isActive ? "bg-[#8B5E3C]" : ""
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {isSidebarOpen && <span>{item.name}</span>}
                </Link>
              );
            })}
            
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}