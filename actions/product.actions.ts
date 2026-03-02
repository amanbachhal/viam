"use server";

import { connectDB } from "@/lib/mongodb";
import Product from "@/models/product.model";
import ProductVariant from "@/models/variant.model";
import { deleteImages } from "@/lib/image-cleanup";
import { serialize } from "@/lib/serialize";

// CREATE PRODUCT
export async function createProduct(data: any) {
  try {
    await connectDB();

    const created = await Product.create(data);

    return {
      success: true,
      message: "Product created successfully",
      data: serialize({
        _id: created._id,
        code: created.code,
        name: created.name,
      }),
    };
  } catch (error: any) {
    throw new Error(error?.message || "Failed to create product");
  }
}

// UPDATE PRODUCT
export async function updateProduct(id: string, data: any) {
  try {
    await connectDB();

    const updated = await Product.findByIdAndUpdate(id, data, {
      new: true,
    }).lean();

    if (!updated) {
      throw new Error("Product not found");
    }

    return {
      success: true,
      message: "Product updated successfully",
      data: serialize({
        _id: updated._id,
        code: updated.code,
        name: updated.name,
      }),
    };
  } catch (error: any) {
    throw new Error(error?.message || "Failed to update product");
  }
}

// DELETE PRODUCT (cascade variants + images)
export async function deleteProduct(productId: string) {
  try {
    await connectDB();

    const variants = await ProductVariant.find({
      product_id: productId,
    }).lean();

    for (const variant of variants) {
      await deleteImages(variant.images);
    }

    await ProductVariant.deleteMany({ product_id: productId });

    const deleted = await Product.findByIdAndDelete(productId).lean();

    if (!deleted) {
      throw new Error("Product not found");
    }

    return {
      success: true,
      message: "Product deleted successfully",
      data: serialize({
        _id: deleted._id,
        code: deleted.code,
      }),
    };
  } catch (error: any) {
    throw new Error(error?.message || "Failed to delete product");
  }
}

export async function getProducts({
  search = "",
  page = 1,
  limit = 20,
  category,
  style,
  type,
}: {
  search?: string;
  page?: number;
  limit?: number;
  category?: string;
  style?: string;
  type?: string;
}) {
  try {
    await connectDB();

    const query: any = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { code: { $regex: search, $options: "i" } },
      ];
    }

    if (category && category !== "All") query.category = category;
    if (style && style !== "All") query.style = style;
    if (type && type !== "All") query.type = type;

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find(query).skip(skip).limit(limit).lean(),
      Product.countDocuments(query),
    ]);

    return {
      success: true,
      data: serialize(products),
      total,
      pages: Math.ceil(total / limit),
      page,
    };
  } catch (error: any) {
    throw new Error(error?.message || "Failed to fetch products");
  }
}

export async function getProductById(productId: string) {
  try {
    await connectDB();

    if (!productId) {
      throw new Error("Product id required");
    }

    const product = await Product.findById(productId).lean();

    if (!product) {
      throw new Error("Product not found");
    }

    const variants = await ProductVariant.find({
      product_id: productId,
    })
      .sort({ createdAt: -1 })
      .lean();

    return {
      success: true,
      data: serialize({
        ...product,
        variants,
      }),
    };
  } catch (error: any) {
    throw new Error(error?.message || "Failed to fetch product");
  }
}

// ================= DROPDOWN PRODUCTS (FOR VARIANT FORM) =================
export async function getProductsForDropdown() {
  try {
    await connectDB();

    const products = await Product.find({})
      .select("_id name code")
      .sort({ name: 1 })
      .lean();

    return {
      success: true,
      data: serialize(
        products.map((p: any) => ({
          _id: p._id,
          name: p.name,
          code: p.code,
        })),
      ),
    };
  } catch (error: any) {
    throw new Error(error?.message || "Failed to fetch products");
  }
}
