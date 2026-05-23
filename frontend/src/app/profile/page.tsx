"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { User, Mail, Phone, Calendar, Edit, ShoppingBag, LogOut, LayoutDashboard } from "lucide-react";
import { useLogoutUser } from '@/hooks/useLogoutUser';

interface UserData {
  id: number;
  name: string;
  email: string;
  phone: string;
  dob: string;
  image?: string;
  role: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });
  const { logoutUser } = useLogoutUser();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/signin";
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/user/getMe", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data);
        setFormData({ name: data.name, phone: data.phone || "" });
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:5000/api/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setUser((prev) => prev ? { ...prev, ...formData } : null);
        setIsEditing(false);
        alert("Profile updated successfully!");
      } else {
        alert(data.error || "Update failed");
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-[#F3E8DE] min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#8B5E3C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const isAdmin = user.role === "admin";

  return (
    <div className="bg-[#F3E8DE] min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-serif text-[#5A3A2A]">My Profile</h1>
          <p className="text-[#8B5E3C] mt-2">Manage your account information</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 shadow-md sticky top-24">
              <div className="text-center mb-6">
                <div className="w-24 h-24 mx-auto bg-[#E6D5C3] rounded-full overflow-hidden mb-3">
                  {user.image ? (
                    <Image src={user.image} alt={user.name} width={96} height={96} className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl text-[#8B5E3C]">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <h2 className="text-lg font-semibold text-[#5A3A2A]">{user.name}</h2>
                <p className="text-sm text-[#8B5E3C] capitalize">Role: {user.role}</p>
              </div>

              <div className="space-y-2 border-t border-[#E6D5C3] pt-4">
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-3 w-full px-4 py-2 text-[#8B5E3C] hover:bg-[#E6D5C3] rounded-lg transition"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                )}
                <Link
                  href="/profile/orders"
                  className="flex items-center gap-3 w-full px-4 py-2 text-[#8B5E3C] hover:bg-[#E6D5C3] rounded-lg transition"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>My Orders</span>
                </Link>
                <button
                  onClick={() => logoutUser()}
                  className="flex items-center gap-3 w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content - Personal Information */}
          <div className="md:col-span-2">
            <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-8 shadow-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-serif text-[#5A3A2A]">Personal Information</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-2 text-[#8B5E3C] hover:text-[#5A3A2A] transition"
                >
                  <Edit className="w-4 h-4" /> {isEditing ? "Cancel" : "Edit"}
                </button>
              </div>

              {isEditing ? (
                <form onSubmit={handleUpdate} className="space-y-4">
                  <div>
                    <label className="block text-[#5A3A2A] mb-2">Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 bg-white/50 border border-[#E6D5C3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#5A3A2A] mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2 bg-white/50 border border-[#E6D5C3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-[#8B5E3C] hover:bg-[#5A3A2A] text-white px-6 py-2 rounded-lg transition"
                  >
                    Save Changes
                  </button>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 py-3 border-b border-[#E6D5C3]">
                    <User className="w-5 h-5 text-[#8B5E3C]" />
                    <div className="flex-1">
                      <p className="text-sm text-[#8B5E3C]">Full Name</p>
                      <p className="text-[#5A3A2A] font-medium">{user.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 py-3 border-b border-[#E6D5C3]">
                    <Mail className="w-5 h-5 text-[#8B5E3C]" />
                    <div className="flex-1">
                      <p className="text-sm text-[#8B5E3C]">Email Address</p>
                      <p className="text-[#5A3A2A] font-medium">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 py-3 border-b border-[#E6D5C3]">
                    <Phone className="w-5 h-5 text-[#8B5E3C]" />
                    <div className="flex-1">
                      <p className="text-sm text-[#8B5E3C]">Phone Number</p>
                      <p className="text-[#5A3A2A] font-medium">{user.phone || "Not provided"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 py-3">
                    <Calendar className="w-5 h-5 text-[#8B5E3C]" />
                    <div className="flex-1">
                      <p className="text-sm text-[#8B5E3C]">Date of Birth</p>
                      <p className="text-[#5A3A2A] font-medium">
                        {user.dob ? new Date(user.dob).toLocaleDateString() : "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}