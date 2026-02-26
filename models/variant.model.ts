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

export default models.ProductVariant ||
  mongoose.model("ProductVariant", ProductVariantSchema);
