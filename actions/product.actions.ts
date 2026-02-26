"use server";

import { connectDB } from "@/lib/mongodb";
import Product from "@/models/product.model";
import ProductVariant from "@/models/variant.model";
import { deleteImages } from "@/lib/image-cleanup";

// CREATE PRODUCT
export async function createProduct(data: any) {
  await connectDB();
  return Product.create(data);
}

// UPDATE PRODUCT
export async function updateProduct(id: string, data: any) {
  await connectDB();
  return Product.findByIdAndUpdate(id, data, { new: true });
}

// DELETE PRODUCT (cascade variants + images)
export async function deleteProduct(productId: string) {
  await connectDB();

  const variants = await ProductVariant.find({ product_id: productId });

  for (const variant of variants) {
    await deleteImages(variant.images);
  }

  await ProductVariant.deleteMany({ product_id: productId });

  return Product.findByIdAndDelete(productId);
}
