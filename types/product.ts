export type ProductCategory = "Earrings" | "Necklace" | "Bracelet" | "Ring";

export type ProductStyle = "Modern" | "Traditional" | "Party" | "Minimal";

export type ProductType = "Everyday" | "Anti Tarnish";

export interface ProductVariant {
  id: string;
  product_id: string;
  name?: string;
  code: string;
  price: number;
  inStock: boolean;
  images: string[];
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  category: string;
  style: string;
  type: string;
  variants: ProductVariant[];
}

export interface StoreProduct {
  id: string;
  name: string;
  description?: string;
  category: string;
  style: string;
  type: string;

  image: string | null;

  inStock: boolean;

  minPrice: number;
  maxPrice: number;
  priceSame: boolean;
}

export interface StoreProductsResponse {
  data: StoreProduct[];
  total: number;
  page: number;
  pages: number;
  hasMore: boolean;
}
