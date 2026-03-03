import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2).max(80),
  code: z.string().min(3).max(20),
  description: z.string().max(500).optional(),
  category: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Category ID"),
  style: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Style ID"),
  type: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Type ID"),
});
