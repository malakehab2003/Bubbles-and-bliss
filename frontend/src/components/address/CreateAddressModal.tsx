"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateAddressSchema, type CreateAddressFormSchema } from "@/lib/validation/addressSchemas";
import { useCreateAddress } from "@/hooks/useAddresses";
import { X } from "lucide-react";

interface CreateAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// بيانات مؤقتة للمدن والمحافظات (يمكن جلبها من API)
const governments = [
  { id: 1, name: "Cairo" },
  { id: 2, name: "Alexandria" },
  { id: 3, name: "Giza" },
];

const cities = [
  { id: 1, name: "15 May", government_id: 1 },
  { id: 2, name: "Nasr City", government_id: 1 },
  { id: 3, name: "Maadi", government_id: 1 },
  { id: 4, name: "Alexandria", government_id: 2 },
  { id: 5, name: "Giza", government_id: 3 },
];

export default function CreateAddressModal({ isOpen, onClose, onSuccess }: CreateAddressModalProps) {
  const { createAddress, isPending } = useCreateAddress();
  const [selectedGovernment, setSelectedGovernment] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateAddressFormSchema>({
    resolver: zodResolver(CreateAddressSchema),
    defaultValues: {
      name: "",
      address: "",
      city_id: 0,
      government_id: 0,
      postal_code: "",
      landmark: "",
    },
  });

  const governmentId = watch("government_id");

  // Filter cities based on selected government
  const filteredCities = cities.filter((city) => city.government_id === governmentId);

  const onSubmit = async (data: CreateAddressFormSchema) => {
    await createAddress(data);
    reset();
    onSuccess();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-beige-medium sticky top-0 bg-white">
          <h2 className="text-2xl font-serif font-bold text-brown-dark">Add New Address</h2>
          <button onClick={onClose} className="p-1 hover:bg-beige-light rounded-full transition">
            <X className="w-5 h-5 text-brown-warm" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          {/* Address Name */}
          <div>
            <label className="block text-sm font-semibold text-brown-dark mb-1">
              Address Name <span className="text-red-500">*</span>
            </label>
            <input
              {...register("name")}
              type="text"
              placeholder="Home, Work, etc."
              className="w-full px-4 py-2 bg-beige-light/50 border border-beige-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-warm text-brown-dark"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-semibold text-brown-dark mb-1">
              Address <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register("address")}
              rows={2}
              placeholder="Street, building, apartment number"
              className="w-full px-4 py-2 bg-beige-light/50 border border-beige-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-warm text-brown-dark"
            />
            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
          </div>

          {/* Landmark */}
          <div>
            <label className="block text-sm font-semibold text-brown-dark mb-1">Landmark (Optional)</label>
            <input
              {...register("landmark")}
              type="text"
              placeholder="Nearby landmark"
              className="w-full px-4 py-2 bg-beige-light/50 border border-beige-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-warm text-brown-dark"
            />
          </div>

          {/* Government */}
          <div>
            <label className="block text-sm font-semibold text-brown-dark mb-1">
              Government <span className="text-red-500">*</span>
            </label>
            <select
              {...register("government_id", { valueAsNumber: true })}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setValue("government_id", val);
                setValue("city_id", 0);
              }}
              className="w-full px-4 py-2 bg-beige-light/50 border border-beige-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-warm text-brown-dark"
            >
              <option value={0}>Select Government</option>
              {governments.map((gov) => (
                <option key={gov.id} value={gov.id}>
                  {gov.name}
                </option>
              ))}
            </select>
            {errors.government_id && <p className="text-red-500 text-sm mt-1">{errors.government_id.message}</p>}
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-semibold text-brown-dark mb-1">
              City <span className="text-red-500">*</span>
            </label>
            <select
              {...register("city_id", { valueAsNumber: true })}
              disabled={!governmentId}
              className="w-full px-4 py-2 bg-beige-light/50 border border-beige-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-warm text-brown-dark disabled:opacity-50"
            >
              <option value={0}>Select City</option>
              {filteredCities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
            {errors.city_id && <p className="text-red-500 text-sm mt-1">{errors.city_id.message}</p>}
          </div>

          {/* Postal Code */}
          <div>
            <label className="block text-sm font-semibold text-brown-dark mb-1">
              Postal Code <span className="text-red-500">*</span>
            </label>
            <input
              {...register("postal_code")}
              type="text"
              placeholder="e.g., 12345"
              className="w-full px-4 py-2 bg-beige-light/50 border border-beige-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-warm text-brown-dark"
            />
            {errors.postal_code && <p className="text-red-500 text-sm mt-1">{errors.postal_code.message}</p>}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-brown-warm hover:bg-brown-dark text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
            >
              {isPending ? "Creating..." : "Create Address"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-beige-medium text-brown-dark font-semibold rounded-lg hover:bg-beige-light transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}