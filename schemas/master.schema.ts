import z from "zod";

export const masterItemSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  order: z.coerce.number().min(0, "Must be >= 0"),
  isActive: z.boolean().default(true),
});

export const masterFormSchema = z.object({
  categories: z.array(masterItemSchema),
  styles: z.array(masterItemSchema),
  types: z.array(masterItemSchema),
});
