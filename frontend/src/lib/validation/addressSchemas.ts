import { z } from "zod";

export const CreateAddressSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  city_id: z.number({ required_error: "City is required" }).int().positive(),
  government_id: z.number({ required_error: "Government is required" }).int().positive(),
  postal_code: z.string().min(1, "Postal Code is required"),
  landmark: z.string().optional(),
});

export type CreateAddressFormSchema = z.infer<typeof CreateAddressSchema>;

export const EditAddressSchema = z.object({
  name: z.string().min(1).optional(),
  address: z.string().min(1).optional(),
  city_id: z.number().int().positive().optional(),
  government_id: z.number().int().positive().optional(),
  postal_code: z.string().min(1).optional(),
  landmark: z.string().optional(),
});

export type EditAddressFormSchema = z.infer<typeof EditAddressSchema>;