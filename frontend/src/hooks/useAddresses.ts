"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

export interface Address {
  id: number;
  name: string;
  address: string;
  city_id: number;
  government_id: number;
  postal_code: string;
  landmark?: string;
  city?: {
    id: number;
    name: string;
  };
  government?: {
    id: number;
    name: string;
  };
}

// جلب كل العناوين
async function fetchAddresses(): Promise<Address[]> {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found");
  }

  const res = await fetch("http://localhost:5000/api/address/list", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.err || data.message || "Failed to fetch addresses");
  }

  return data.addresses || [];
}

// إنشاء عنوان جديد
async function createAddress(addressData: {
  name: string;
  address: string;
  city_id: number;
  government_id: number;
  postal_code: string;
  landmark?: string;
}): Promise<Address> {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found");
  }

  const res = await fetch("http://localhost:5000/api/address/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(addressData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.err || data.message || "Failed to create address");
  }

  return data.address;
}

// تحديث عنوان
async function updateAddress(id: number, addressData: Partial<Address>): Promise<Address> {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found");
  }

  const res = await fetch(`http://localhost:5000/api/address/update/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(addressData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.err || data.message || "Failed to update address");
  }

  return data.address;
}

// حذف عنوان
async function deleteAddress(id: number): Promise<void> {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found");
  }

  const res = await fetch(`http://localhost:5000/api/address/delete/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.err || data.message || "Failed to delete address");
  }
}

// Hooks
export function useAddresses() {
  const { data: addresses, isLoading, error, refetch } = useQuery({
    queryKey: ["addresses"],
    queryFn: fetchAddresses,
  });

  return {
    addresses: addresses || [],
    isLoading,
    error,
    refetch,
  };
}

export function useCreateAddress() {
  const queryClient = useQueryClient();

  const { mutate: createAddressMutation, isPending } = useMutation({
    mutationFn: createAddress,
    onSuccess: () => {
      toast.success("Address created successfully!");
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create address");
    },
  });

  return { createAddress: createAddressMutation, isPending };
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();

  const { mutate: updateAddressMutation, isPending } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Address> }) =>
      updateAddress(id, data),
    onSuccess: () => {
      toast.success("Address updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update address");
    },
  });

  return { updateAddress: updateAddressMutation, isPending };
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();

  const { mutate: deleteAddressMutation, isPending } = useMutation({
    mutationFn: deleteAddress,
    onSuccess: () => {
      toast.success("Address deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete address");
    },
  });

  return { deleteAddress: deleteAddressMutation, isPending };
}