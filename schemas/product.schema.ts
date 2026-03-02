import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2).max(80),
  code: z.string().min(3).max(20),
  description: z.string().max(500).optional(),

  category: z.enum(["Earrings", "Necklace", "Bracelet", "Ring"]),
  style: z.enum(["Modern", "Traditional", "Party", "Minimal"]),
  type: z.enum(["Everyday", "Anti Tarnish"]),
});
