import { z } from "zod";

// Schema لإنشاء منتج جديد
export const CreateProductSchema = z.object({
  name: z.string()
    .min(2, "Product name must be at least 2 characters")
    .max(100, "Product name is too long"),
  
  description: z.string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description is too long"),
  
  price: z.coerce.number()
    .positive("Price must be positive")
    .min(1, "Price must be at least 1 EGP"),
  
  sale: z.coerce.number()
    .min(0, "Sale cannot be negative")
    .max(100, "Sale cannot exceed 100%")
    .optional(),
  
  stock: z.coerce.number()
    .int("Stock must be a whole number")
    .min(0, "Stock cannot be negative"),
  
  brand_id: z.coerce.number()
    .int()
    .positive("Brand is required"),
  
  category_id: z.coerce.number()
    .int()
    .positive("Category is required"),
  
  rate: z.coerce.number()
    .min(0)
    .max(5)
    .optional(),
  
  colors: z.array(z.string()).optional(),
  
  sizes: z.array(z.string()).optional(),
  
  images: z.any().optional(),
});

// Schema لتعديل منتج
export const EditProductSchema = CreateProductSchema.partial();

// Types
export type CreateProductForm = z.infer<typeof CreateProductSchema>;
export type EditProductForm = z.infer<typeof EditProductSchema>;