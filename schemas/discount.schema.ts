import { z } from "zod";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID");

export const discountSchema = z
  .object({
    name: z.string().min(2).max(100),

    value: z.number().min(1).max(100),

    startAt: z.string().min(1, "Start date required"),
    endAt: z.string().min(1, "End date required"),

    type: z.enum(["all", "category", "style", "type", "product", "variant"]),

    categories: z.array(objectId),
    styles: z.array(objectId),
    types: z.array(objectId),
    products: z.array(objectId),
    variants: z.array(objectId),

    isActive: z.boolean(),
  })
  .refine((data) => new Date(data.startAt) < new Date(data.endAt), {
    message: "End date must be after start date",
    path: ["endAt"],
  });
