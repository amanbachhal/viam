import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2),
  code: z.string().min(2),
  description: z.string().optional(),
  category: z.enum(["Earrings", "Necklace", "Bracelet", "Ring"]),
  style: z.enum(["Modern", "Traditional", "Party", "Minimal"]),
  type: z.enum(["Everyday", "Anti Tarnish"]),
});
