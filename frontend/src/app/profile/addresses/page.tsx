"use client";
import { useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, MapPin, Home, Building, Package } from "lucide-react";
import { useAddresses, useDeleteAddress } from "@/hooks/useAddresses";
import CreateAddressModal from "@/components/address/CreateAddressModal";
import EditAddressModal from "@/components/address/EditAddressModal";

interface Address {
  id: number;
  name: string;
  address: string;
  city_id: number;
  government_id: number;
  postal_code: string;
  landmark?: string;
  city?: { name: string };
  government?: { name: string };
}

export default function AddressesPage() {
  const { addresses, isLoading, refetch } = useAddresses();
  const { deleteAddress, isPending: isDeleting } = useDeleteAddress();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  const handleDelete = (id: number, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteAddress(id);
    }
  };

  const handleEdit = (address: Address) => {
    setSelectedAddress(address);
    setIsEditModalOpen(true);
  };

  const handleRefresh = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className="bg-[#F3E8DE] min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#8B5E3C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-[#F3E8DE] min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brown-warm/20 mb-4">
            <MapPin className="w-8 h-8 text-brown-dark" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-brown-dark">My Addresses</h1>
          <p className="text-brown-dark/70 mt-2">Manage your saved addresses</p>
        </div>

        {/* Add Address Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-brown-warm hover:bg-brown-dark text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add New Address
          </button>
        </div>

        {/* Addresses List */}
        {addresses.length === 0 ? (
          <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-12 text-center shadow-md">
            <MapPin className="w-16 h-16 mx-auto text-brown-warm/30 mb-4" />
            <h2 className="text-xl font-serif text-brown-dark mb-2">No Addresses Yet</h2>
            <p className="text-brown-warm mb-6">Add your first address for faster checkout</p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-brown-warm hover:bg-brown-dark text-white px-6 py-2 rounded-full transition"
            >
              Add Address
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses.map((address: Address) => (
              <AddressCard
                key={address.id}
                address={address}
                onEdit={() => handleEdit(address)}
                onDelete={() => handleDelete(address.id, address.name)}
                isDeleting={isDeleting}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateAddressModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleRefresh}
      />
      <EditAddressModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={handleRefresh}
        address={selectedAddress}
      />
    </div>
  );
}

// Address Card Component
function AddressCard({
  address,
  onEdit,
  onDelete,
  isDeleting,
}: {
  address: Address;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}) {
  const getAddressIcon = () => {
    if (address.name?.toLowerCase().includes("home")) return <Home className="w-5 h-5" />;
    if (address.name?.toLowerCase().includes("work")) return <Building className="w-5 h-5" />;
    return <Package className="w-5 h-5" />;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-beige-medium p-5 hover:shadow-md transition">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-beige-light rounded-full text-brown-warm">
            {getAddressIcon()}
          </div>
          <h3 className="font-bold text-brown-dark text-lg">{address.name}</h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            disabled={isDeleting}
            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <p className="text-brown-dark">
          <span className="text-brown-warm">Address:</span> {address.address}
        </p>
        {address.landmark && (
          <p className="text-brown-dark">
            <span className="text-brown-warm">Landmark:</span> {address.landmark}
          </p>
        )}
        <p className="text-brown-dark">
          <span className="text-brown-warm">Postal Code:</span> {address.postal_code}
        </p>
        <p className="text-brown-dark">
          <span className="text-brown-warm">Location:</span>{" "}
          {address.city?.name}, {address.government?.name}
        </p>
      </div>
    </div>
  );
}