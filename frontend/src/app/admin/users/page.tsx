"use client";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  is_verified: boolean;
  phone?: string;
  dob?: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchEmail, setSearchEmail] = useState("");
  const [searchId, setSearchId] = useState("");
  const [searchedUser, setSearchedUser] = useState<User | null>(null);

  // جلب كل المستخدمين (لو في endpoint مخصص)
  // بما إن الـ API مش عنده endpoint لجلب كل المستخدمين، هنجيبهم عن طريق البحث
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    
    // مؤقتاً، نجيب المستخدم الحالي
    try {
      const res = await fetch("http://localhost:5000/api/user/getMe", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const currentUser = await res.json();
      if (res.ok) {
        setUsers([currentUser]);
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const searchUser = async () => {
    const token = localStorage.getItem("token");
    const params = new URLSearchParams();
    if (searchEmail) params.append("email", searchEmail);
    if (searchId) params.append("id", searchId);
    
    if (!searchEmail && !searchId) {
      alert("Please enter either email or ID");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/user/getUser?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setSearchedUser(data.user);
        // إضافة المستخدم إلى القائمة إذا لم يكن موجوداً
        setUsers(prev => {
          if (!prev.find(u => u.id === data.user.id)) {
            return [data.user, ...prev];
          }
          return prev;
        });
      } else {
        alert("User not found");
        setSearchedUser(null);
      }
    } catch (error) {
      console.error("Error searching user:", error);
      alert("Error searching user");
    }
  };

  const makeAdmin = async (userId: number) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/api/user/createAdmin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user_id: userId }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("User promoted to admin!");
        // تحديث حالة المستخدم في القائمة
        setUsers(prev => prev.map(user => 
          user.id === userId ? { ...user, role: "admin" } : user
        ));
        setSearchedUser(null);
      } else {
        alert(data.error || "Failed to make admin");
      }
    } catch (error) {
      console.error("Error making admin:", error);
      alert("Error making admin");
    }
  };

  const handleLogout = async (userId: number) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/api/user/logOut", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        alert("User logged out successfully");
      }
    } catch (error) {
      console.error("Error logging out:", error);
      alert("Error logging out");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-[#8B5E3C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-serif text-[#5A3A2A] mb-6">Users Management</h1>

      {/* Search Section */}
      <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 shadow-md mb-6">
        <h2 className="text-lg font-serif text-[#5A3A2A] mb-4">Search User</h2>
        <div className="flex flex-wrap gap-4">
          <div className="flex-1">
            <label className="block text-[#8B5E3C] text-sm mb-1">Email</label>
            <input
              type="email"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              placeholder="user@example.com"
              className="w-full px-4 py-2 bg-white/50 border border-[#E6D5C3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
            />
          </div>
          <div className="flex-1">
            <label className="block text-[#8B5E3C] text-sm mb-1">ID</label>
            <input
              type="number"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="User ID"
              className="w-full px-4 py-2 bg-white/50 border border-[#E6D5C3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={searchUser}
              className="bg-[#8B5E3C] hover:bg-[#5A3A2A] text-white px-6 py-2 rounded-lg transition flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Search
            </button>
          </div>
        </div>

        {/* Search Result */}
        {searchedUser && (
          <div className="mt-4 p-4 bg-[#E6D5C3]/30 rounded-lg">
            <p className="text-[#5A3A2A] font-semibold">Search Result:</p>
            <div className="flex justify-between items-center mt-2">
              <div>
                <p><span className="text-[#8B5E3C]">Name:</span> {searchedUser.name}</p>
                <p><span className="text-[#8B5E3C]">Email:</span> {searchedUser.email}</p>
                <p><span className="text-[#8B5E3C]">Role:</span> {searchedUser.role}</p>
              </div>
              {searchedUser.role !== "admin" && (
                <button
                  onClick={() => makeAdmin(searchedUser.id)}
                  className="bg-[#8B5E3C] hover:bg-[#5A3A2A] text-white px-4 py-2 rounded-lg transition"
                >
                  Make Admin
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Users List */}
      <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 shadow-md overflow-x-auto">
        <h2 className="text-lg font-serif text-[#5A3A2A] mb-4">All Users</h2>
        <table className="w-full">
         <thead>
  <tr className="border-b border-[#E6D5C3]">
    <th className="text-left py-3 text-[#5A3A2A]">ID</th>
    <th className="text-left py-3 text-[#5A3A2A]">Name</th>
    <th className="text-left py-3 text-[#5A3A2A]">Email</th>
    <th className="text-left py-3 text-[#5A3A2A]">Phone</th>
    <th className="text-left py-3 text-[#5A3A2A]">Role</th>
    <th className="text-left py-3 text-[#5A3A2A]">Verified</th>
    <th className="text-left py-3 text-[#5A3A2A]">Actions</th>
   </tr>
</thead>
<tbody>
  {users.map((user) => (
    <tr key={user.id} className="border-b  border-[#E6D5C3] hover:bg-white/30">
      <td className="ps-5 text-[#8B5E3C] ">{user.id}</td>
      <td className="ps-3 text-[#8B5E3C] align-top">{user.name}</td>
      <td className="ps-5 text-[#8B5E3C] align-top">{user.email}</td>
      <td className="p-5 text-[#8B5E3C] ">{user.phone || "-"}</td>
      <td className="ps-5 align-top">
        <span className={`px-2 text-black text-xl font-bold rounded-full ${
          user.role === "admin" 
            ? "bg-purple-100 text-purple-600" 
            : "bg-gray-100 text-gray-600"
        }`}>
          {user.role}
        </span>
      </td>
      <td className="ps-5 align-top">
        {user.is_verified ? (
          <span className="text-green-600">Verified</span>
        ) : (
          <span className="text-red-600">Not verified</span>
        )}
      </td>
      <td className="py-3 align-top">
        <div className="flex flex-col gap-2">
          {user.role !== "admin" && (
            <button
              onClick={() => makeAdmin(user.id)}
              className="bg-[#8B5E3C] hover:bg-[#5A3A2A] px-3 py-1 rounded-lg text-sm transition whitespace-nowrap"
            >
              Make Admin
            </button>
          )}
          <button
            onClick={() => handleLogout(user.id)}
            className="border border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-3 py-1 rounded-lg text-sm transition whitespace-nowrap"
          >
            Logout
          </button>
        </div>
      </td>
    </tr>
  ))}
</tbody>
        </table>

        {users.length === 0 && (
          <div className="text-center py-8 text-[#8B5E3C]">
            No users found. Search for users using email or ID.
          </div>
        )}
      </div>
    </div>
  );
}