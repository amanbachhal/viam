export const CATEGORIES = [
  "All",
  "Earrings",
  "Necklace",
  "Bracelet",
  "Ring",
] as const;

export const STYLES = [
  "All",
  "Modern",
  "Traditional",
  "Party",
  "Minimal",
] as const;

export const TYPES = ["All", "Everyday", "Anti Tarnish"] as const;

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
