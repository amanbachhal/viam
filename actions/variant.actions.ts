"use server";

import { connectDB } from "@/lib/mongodb";
import ProductVariant from "@/models/variant.model";
import Product from "@/models/product.model";
import { uploadImage } from "@/lib/blob";
import { deleteImages } from "@/lib/image-cleanup";
import { Types } from "mongoose";
import { serialize } from "@/lib/serialize";
import Master from "@/models/master.model";

// ================= CREATE VARIANT =================
export async function createVariant(formData: FormData) {
  try {
    await connectDB();

    const productId = formData.get("product_id")?.toString();
    const name = formData.get("name")?.toString();
    const price = Number(formData.get("price"));
    const inStock = formData.get("in_stock") === "true";

    if (!productId || !name || !price) {
      throw new Error("Missing required fields");
    }

    if (!Types.ObjectId.isValid(productId)) {
      throw new Error("Invalid product id");
    }

    const files = formData
      .getAll("images")
      .filter((f): f is File => f instanceof File && f.size > 0);

    const imageUrls = await Promise.all(files.map(uploadImage));

    const code = await generateVariantCode(productId);

    const created = await ProductVariant.create({
      product_id: productId,
      name,
      code,
      price,
      in_stock: inStock,
      images: imageUrls,
    });

    return {
      success: true,
      message: "Variant created successfully",
      data: serialize({
        _id: created._id,
        code: created.code,
        name: created.name,
      }),
    };
  } catch (error: any) {
    throw new Error(error?.message || "Failed to create variant");
  }
}

// ================= UPDATE VARIANT =================
export async function updateVariant(
  id: string,
  formData: FormData,
  replaceImages: boolean,
) {
  try {
    await connectDB();

    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid variant id");
    }

    const variant = await ProductVariant.findById(id);
    if (!variant) throw new Error("Variant not found");

    let imageUrls = variant.images;

    const files = formData
      .getAll("images")
      .filter((f): f is File => f instanceof File && f.size > 0);

    // ================= IMAGE LOGIC =================

    // CASE 1 + 2 → Replace mode ON
    if (replaceImages) {
      // delete all old images
      await deleteImages(variant.images);

      // upload new ones if provided
      imageUrls =
        files.length > 0 ? await Promise.all(files.map(uploadImage)) : [];
    }

    // CASE 3 → Replace OFF but new images provided → append
    else if (files.length > 0) {
      const newImages = await Promise.all(files.map(uploadImage));
      imageUrls = [...variant.images, ...newImages];
    }

    // CASE 4 → replace OFF + no files → keep existing

    // ================= UPDATE =================
    const updated = await ProductVariant.findByIdAndUpdate(
      id,
      {
        name: formData.get("name")?.toString(),
        price: Number(formData.get("price")),
        in_stock: formData.get("in_stock") === "true",
        images: imageUrls,
      },
      { new: true },
    ).lean();

    if (!updated) throw new Error("Variant not found");

    return {
      success: true,
      message: "Variant updated successfully",
      data: serialize(updated),
    };
  } catch (error: any) {
    throw new Error(error?.message || "Failed to update variant");
  }
}

// ================= DELETE VARIANT =================
export async function deleteVariant(id: string) {
  try {
    await connectDB();

    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid variant id");
    }

    const variant = await ProductVariant.findById(id);
    if (!variant) throw new Error("Variant not found");

    await deleteImages(variant.images);

    const deleted = await ProductVariant.findByIdAndDelete(id).lean();

    return {
      success: true,
      message: "Variant deleted successfully",
      data: serialize({
        _id: deleted?._id,
        code: deleted?.code,
      }),
    };
  } catch (error: any) {
    throw new Error(error?.message || "Failed to delete variant");
  }
}

// ================= VARIANT CODE GENERATOR =================
async function generateVariantCode(productId: string) {
  await connectDB();

  const product = await Product.findById(productId).lean();
  if (!product) throw new Error("Product not found");

  const count = await ProductVariant.countDocuments({
    product_id: productId,
  });

  return `${product.code}-${count + 1}`;
}

// ================= GET VARIANT BY ID =================
export async function getVariantById(id: string) {
  try {
    await connectDB();

    if (!id) {
      throw new Error("Variant id required");
    }

    const variant = await ProductVariant.findById(id)
      .populate({
        path: "product_id",
        select: "name code",
      })
      .lean();

    if (!variant) {
      throw new Error("Variant not found");
    }

    return {
      success: true,
      data: serialize(variant),
    };
  } catch (error: any) {
    throw new Error(error?.message || "Failed to fetch variant");
  }
}

export async function getVariants({
  search = "",
  page = 1,
  limit = 20,
  product,
  category,
  style,
  type,
  in_stock,
}: any) {
  try {
    await connectDB();
    const skip = (page - 1) * limit;
    const match: any = {};

    if (search) {
      match.$or = [
        { name: { $regex: search, $options: "i" } },
        { code: { $regex: search, $options: "i" } },
      ].filter(Boolean);
    }

    if (in_stock === "true") match.in_stock = true;
    if (in_stock === "false") match.in_stock = false;

    const pipeline: any[] = [
      { $match: match },
      {
        $lookup: {
          from: "products",
          localField: "product_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
    ];

    // Cast IDs for filtering
    if (product && product !== "All") {
      pipeline.push({ $match: { "product._id": new Types.ObjectId(product) } });
    }
    if (category && category !== "All") {
      pipeline.push({
        $match: { "product.category": new Types.ObjectId(category) },
      });
    }
    if (style && style !== "All") {
      pipeline.push({ $match: { "product.style": new Types.ObjectId(style) } });
    }
    if (type && type !== "All") {
      pipeline.push({ $match: { "product.type": new Types.ObjectId(type) } });
    }

    const [totalResult, variantsRaw, masterDoc] = await Promise.all([
      ProductVariant.aggregate([...pipeline, { $count: "total" }]),
      ProductVariant.aggregate([
        ...pipeline,
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
      ]),
      Master.findOne().lean(),
    ]);

    const total = totalResult[0]?.total || 0;

    // Manual Name Mapping
    const variants = variantsRaw.map((v: any) => {
      const findName = (list: any[], id: any) =>
        list?.find((item: any) => item._id.toString() === id?.toString())?.name;

      return {
        ...v,
        product: {
          ...v.product,
          categoryName: findName(masterDoc?.categories, v.product.category),
          styleName: findName(masterDoc?.styles, v.product.style),
          typeName: findName(masterDoc?.types, v.product.type),
        },
      };
    });

    return {
      success: true,
      data: serialize({
        variants,
        total,
        pages: Math.ceil(total / limit),
        page,
      }),
    };
  } catch (error: any) {
    throw new Error(error?.message || "Failed to fetch variants");
  }
}
