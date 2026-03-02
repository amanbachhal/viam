import { z } from "zod";

export const variantSchema = z.object({
  product_id: z.string().min(1, "Product is required"),
  name: z.string().min(1, "Variant name is required"),
  price: z.number().min(1, "Price must be greater than 0"),
  in_stock: z.boolean(),
});
