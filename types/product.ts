export type ProductCategory = "Earrings" | "Necklace" | "Bracelet" | "Ring";

export type ProductStyle = "Modern" | "Traditional" | "Party" | "Minimal";

export type ProductType = "Everyday" | "Anti Tarnish";

export interface ProductVariant {
  id: string;
  product_id: string;
  name?: string;
  code: string;
  price: number;
  in_stock: boolean;
  images: string[];
}

export interface Product {
  id: string;
  name: string;
  code: string;
  description?: string;
  category: ProductCategory;
  style: ProductStyle;
  type: ProductType;
  variants: ProductVariant[];
}
