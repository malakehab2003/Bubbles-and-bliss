// أنواع المنتجات
export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  sale: number;
  stock: number;
  brand_id: number;
  product_category_id: number;
  rate?: number;
  status?: "active" | "inactive";
  colors?: string[];
  sizes?: string[];
  images?: ProductImage[];
  createdAt?: string;
  updatedAt?: string;
};

export type ProductImage = {
  id: number;
  product_id: number;
  url: string;
};

export type ProductFilters = {
  status?: "active" | "inactive";
  min_price?: number;
  max_price?: number;
  category_id?: number;
  brand_id?: number;
  rate?: number;
  name?: string;
  colors?: string;
  page?: number;
  limit?: number;
};

export type PaginationData = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ProductsResponse = {
  products: Product[];
  pagination: PaginationData;
};