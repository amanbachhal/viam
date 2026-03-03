import mongoose, { Schema, models } from "mongoose";

const masterItemSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    order: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { _id: true },
);

const MasterSchema = new Schema(
  {
    categories: {
      type: [masterItemSchema],
      default: [],
    },
    styles: {
      type: [masterItemSchema],
      default: [],
    },
    types: {
      type: [masterItemSchema],
      default: [],
    },
  },
  { timestamps: true },
);

export default models.Master || mongoose.model("Master", MasterSchema);
