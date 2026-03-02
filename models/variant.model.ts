import mongoose, { Schema, models } from "mongoose";

const ProductVariantSchema = new Schema(
  {
    product_id: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: String,
    code: { type: String, required: true },
    price: Number,
    in_stock: Boolean,
    images: [String],
  },
  { timestamps: true },
);

ProductVariantSchema.index({ product_id: 1 });
ProductVariantSchema.index({ name: "text", code: "text" });

export default models.ProductVariant ||
  mongoose.model("ProductVariant", ProductVariantSchema);
