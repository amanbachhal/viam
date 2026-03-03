import mongoose, { Schema, models } from "mongoose";

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    description: String,
    category: { type: Schema.Types.ObjectId, ref: "Master" },
    style: { type: Schema.Types.ObjectId, ref: "Master" },
    type: { type: Schema.Types.ObjectId, ref: "Master" },
  },
  { timestamps: true },
);

ProductSchema.index({ name: "text", code: "text" });
ProductSchema.index({ category: 1 });
ProductSchema.index({ style: 1 });
ProductSchema.index({ type: 1 });
ProductSchema.index({ name: "text", code: "text", description: "text" });

export default models.Product || mongoose.model("Product", ProductSchema);
