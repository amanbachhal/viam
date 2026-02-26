"use server";

import { connectDB } from "@/lib/mongodb";
import ProductVariant from "@/models/variant.model";
import { uploadImage } from "@/lib/blob";
import { deleteImages } from "@/lib/image-cleanup";

// CREATE VARIANT WITH IMAGES
export async function createVariant(formData: FormData) {
  await connectDB();

  const files = formData.getAll("images") as File[];

  const imageUrls = await Promise.all(
    files.filter((f) => f.size > 0).map(uploadImage),
  );

  return ProductVariant.create({
    product_id: formData.get("product_id"),
    name: formData.get("name"),
    code: formData.get("code"),
    price: Number(formData.get("price")),
    in_stock: formData.get("in_stock") === "true",
    images: imageUrls,
  });
}

// UPDATE VARIANT (replace images optional)
export async function updateVariant(
  id: string,
  formData: FormData,
  replaceImages: boolean,
) {
  await connectDB();

  const variant = await ProductVariant.findById(id);

  if (!variant) throw new Error("Variant not found");

  let imageUrls = variant.images;

  if (replaceImages) {
    await deleteImages(variant.images);

    const files = formData.getAll("images") as File[];

    imageUrls = await Promise.all(
      files.filter((f) => f.size > 0).map(uploadImage),
    );
  }

  return ProductVariant.findByIdAndUpdate(
    id,
    {
      name: formData.get("name"),
      code: formData.get("code"),
      price: Number(formData.get("price")),
      in_stock: formData.get("in_stock") === "true",
      images: imageUrls,
    },
    { new: true },
  );
}

// DELETE VARIANT (delete images)
export async function deleteVariant(id: string) {
  await connectDB();

  const variant = await ProductVariant.findById(id);

  if (!variant) return;

  await deleteImages(variant.images);

  return ProductVariant.findByIdAndDelete(id);
}
