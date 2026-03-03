import mongoose, { Schema, models } from "mongoose";

const DiscountSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    value: {
      type: Number,
      required: true,
    },

    startAt: {
      type: Date,
      required: true,
    },
    endAt: {
      type: Date,
      required: true,
    },

    type: {
      type: String,
      enum: ["all", "category", "style", "type", "product", "variant"],
      required: true,
    },

    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Master",
      },
    ],

    styles: [
      {
        type: Schema.Types.ObjectId,
        ref: "Master",
      },
    ],

    types: [
      {
        type: Schema.Types.ObjectId,
        ref: "Master",
      },
    ],

    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    variants: [
      {
        type: Schema.Types.ObjectId,
        ref: "Variant",
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

// ===== INDEXES =====

// Active discount lookup
DiscountSchema.index({ isActive: 1 });

// Time filtering
DiscountSchema.index({ startAt: 1, endAt: 1 });

// Type filtering
DiscountSchema.index({ type: 1 });

export default models.Discount || mongoose.model("Discount", DiscountSchema);
