import mongoose, { Schema, models } from "mongoose";

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    description: String,
    category: {
      type: String,
      enum: ["Earrings", "Necklace", "Bracelet", "Ring"],
    },
    style: {
      type: String,
      enum: ["Modern", "Traditional", "Party", "Minimal"],
    },
    type: {
      type: String,
      enum: ["Everyday", "Anti Tarnish"],
    },
  },
  { timestamps: true },
);

export default models.Product || mongoose.model("Product", ProductSchema);
