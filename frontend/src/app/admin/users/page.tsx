"use client";
import { useState } from "react";
import { Search, Shield, User, Crown, Eye, UserCog, ShoppingBag, Mail, Phone, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { useAllUsers } from "@/hooks/useAllUsers";
import { useMakeAdmin } from "@/hooks/useMakeAdmin";

interface UserType {
  id: number;
  name: string;
  email: string;
  role: string;
  is_verified?: boolean;
  phone?: string;
  dob?: string;
}

export default function AdminUsersPage() {
  const { users: allUsers, isLoading, refetch } = useAllUsers();
  const { makeAdmin, isPending: isMakingAdmin } = useMakeAdmin();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"users" | "admins">("users");
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

  const admins = (allUsers || []).filter(u => u.role === "admin");
  const regularUsers = (allUsers || []).filter(u => u.role !== "admin");

  const filteredAdmins = admins.filter(u =>
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = regularUsers.filter(u =>
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMakeAdmin = async (userId: number, userName: string) => {
    if (confirm(`Are you sure you want to make "${userName}" an admin?`)) {
      await makeAdmin(userId);
      refetch();
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-3 border-brown-warm border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige-light">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brown-warm/20 mb-4">
            <Shield className="w-8 h-8 text-brown-dark" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-brown-dark">User Management</h1>
          <p className="text-brown-dark/70 mt-2">Manage and monitor all users and administrators</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-brown-warm">
            <p className="text-sm font-medium text-brown-warm">Administrators</p>
            <p className="text-2xl font-bold text-brown-dark">{admins.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-brown-warm">
            <p className="text-sm font-medium text-brown-warm">Regular Users</p>
            <p className="text-2xl font-bold text-brown-dark">{regularUsers.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-brown-warm">
            <p className="text-sm font-medium text-brown-warm">Total Users</p>
            <p className="text-2xl font-bold text-brown-dark">{allUsers?.length || 0}</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-beige-medium p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-brown-warm" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-2.5 bg-beige-light/50 border border-beige-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-warm focus:border-transparent text-brown-dark font-medium placeholder:text-brown-warm/50"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-beige-medium">
          <button
            onClick={() => setActiveTab("users")}
            className={`px-5 py-2.5 font-bold transition-all rounded-t-lg flex items-center gap-2 ${
              activeTab === "users"
                ? "bg-white text-brown-dark border-t border-x border-beige-medium"
                : "text-brown-warm/70 hover:text-brown-dark"
            }`}
          >
            <User className="w-4 h-4" />
            Users ({filteredUsers.length})
          </button>
          <button
            onClick={() => setActiveTab("admins")}
            className={`px-5 py-2.5 font-bold transition-all rounded-t-lg flex items-center gap-2 ${
              activeTab === "admins"
                ? "bg-white text-brown-dark border-t border-x border-beige-medium"
                : "text-brown-warm/70 hover:text-brown-dark"
            }`}
          >
            <Shield className="w-4 h-4" />
            Administrators ({filteredAdmins.length})
          </button>
        </div>

        {/* Users List */}
        {activeTab === "users" && (
          <div className="space-y-3 max-h-[calc(100vh-380px)] overflow-y-auto pr-1">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl">
                <User className="w-12 h-12 mx-auto text-brown-warm/30 mb-3" />
                <p className="text-brown-warm font-medium">No users found</p>
              </div>
            ) : (
              filteredUsers.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  isAdmin={false}
                  onMakeAdmin={handleMakeAdmin}
                  isMakingAdmin={isMakingAdmin}
                  setSelectedUser={setSelectedUser}
                  selectedUser={selectedUser}
                />
              ))
            )}
          </div>
        )}

        {/* Admins List */}
        {activeTab === "admins" && (
          <div className="space-y-3 max-h-[calc(100vh-380px)] overflow-y-auto pr-1">
            {filteredAdmins.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl">
                <Shield className="w-12 h-12 mx-auto text-brown-warm/30 mb-3" />
                <p className="text-brown-warm font-medium">No administrators found</p>
              </div>
            ) : (
              filteredAdmins.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  isAdmin={true}
                  onMakeAdmin={handleMakeAdmin}
                  isMakingAdmin={isMakingAdmin}
                  setSelectedUser={setSelectedUser}
                  selectedUser={selectedUser}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// User Card Component
function UserCard({ 
  user, 
  isAdmin, 
  onMakeAdmin, 
  isMakingAdmin,
  setSelectedUser,
  selectedUser
}: { 
  user: UserType; 
  isAdmin: boolean;
  onMakeAdmin: (id: number, name: string) => void;
  isMakingAdmin: boolean;
  setSelectedUser: (user: UserType | null) => void;
  selectedUser: UserType | null;
}) {
  const isExpanded = selectedUser?.id === user.id;
  const initials = user.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <div className={`bg-white rounded-xl shadow-sm border transition-all duration-200 ${
      isExpanded ? 'border-brown-warm shadow-md' : 'border-beige-medium hover:shadow-md'
    }`}>
      <div 
        className="p-4 cursor-pointer"
        onClick={() => setSelectedUser(isExpanded ? null : user)}
      >
        <div className="flex items-center justify-between gap-3">
          {/* Avatar + Info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
              isAdmin ? "bg-brown-dark text-beige-light" : "bg-beige-medium text-brown-dark"
            }`}>
              {initials}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-brown-dark truncate">{user.name}</h3>
                {isAdmin ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-beige-medium text-brown-dark">
                    <Shield className="w-3 h-3" /> Admin
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-beige-medium text-brown-dark">
                    <User className="w-3 h-3" /> User
                  </span>
                )}
              </div>
              <p className="text-sm font-medium text-brown-warm truncate">{user.email}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            {!isAdmin && (
              <button
                onClick={() => onMakeAdmin(user.id, user.name)}
                disabled={isMakingAdmin}
                className="px-3 py-1.5 bg-brown-warm hover:bg-brown-dark text-white font-semibold text-sm rounded-lg transition flex items-center gap-1 disabled:opacity-50"
              >
                <Crown className="w-3.5 h-3.5" />
                Make Admin
              </button>
            )}
            <button className="p-1.5 text-brown-warm hover:text-brown-dark transition">
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-2 border-t border-beige-medium bg-beige-light/30 rounded-b-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-brown-dark flex items-center gap-2">
                <UserCog className="w-4 h-4" /> Account Information
              </h4>
              <div className="bg-white rounded-lg p-3 space-y-2 border border-beige-medium">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-brown-warm" />
                  <span className="text-brown-dark font-medium">{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-brown-warm" />
                    <span className="text-brown-dark font-medium">{user.phone}</span>
                  </div>
                )}
                {user.dob && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-brown-warm" />
                    <span className="text-brown-dark font-medium">{new Date(user.dob).toLocaleDateString()}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="w-4 h-4 text-brown-warm" />
                  <span className="text-brown-dark font-medium">Role: <span className="font-bold">{user.role || "user"}</span></span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-bold text-brown-dark flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" /> Quick Actions
              </h4>
              <div className="bg-white rounded-lg p-3 space-y-2 border border-beige-medium">
                {!isAdmin && (
                  <button
                    onClick={() => onMakeAdmin(user.id, user.name)}
                    disabled={isMakingAdmin}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-brown-warm hover:bg-brown-dark text-white font-semibold rounded-lg text-sm transition disabled:opacity-50"
                  >
                    <Crown className="w-4 h-4" />
                    Promote to Admin
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}