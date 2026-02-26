import { z } from "zod";

export const variantSchema = z.object({
  product_id: z.string(),
  name: z.string().optional(),
  code: z.string().min(2),
  price: z.number().positive(),
  in_stock: z.boolean(),
});
