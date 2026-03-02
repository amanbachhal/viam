"use server";

import { connectDB } from "@/lib/mongodb";
import Product from "@/models/product.model";
import { serialize } from "@/lib/serialize";
import mongoose from "mongoose";

export async function getStoreProducts({
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
  await connectDB();

  const skip = (page - 1) * limit;

  const productMatch: any = {};

  if (category && category !== "All") productMatch.category = category;
  if (style && style !== "All") productMatch.style = style;
  if (type && type !== "All") productMatch.type = type;

  // escape regex helper
  const escapeRegex = (str: string) =>
    str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const pipeline: any[] = [
    // ===== FILTER BY PRODUCT FIELDS =====
    { $match: productMatch },

    // ===== JOIN VARIANTS =====
    {
      $lookup: {
        from: "productvariants",
        localField: "_id",
        foreignField: "product_id",
        as: "variants",
      },
    },

    // ===== PRODUCT MUST HAVE AT LEAST ONE VARIANT =====
    {
      $match: {
        "variants.0": { $exists: true },
      },
    },

    // ===== SEARCH (PRODUCT + VARIANT) =====
    ...(search
      ? (() => {
          const escaped = escapeRegex(search.trim());
          const regex = new RegExp(escaped, "i");
          const numeric = Number(search);

          return [
            {
              $match: {
                $or: [
                  // PRODUCT SEARCH
                  { name: regex },
                  { code: regex },
                  { description: regex },

                  // VARIANT SEARCH (array-safe)
                  {
                    variants: {
                      $elemMatch: {
                        $or: [
                          { name: regex },
                          { code: regex },
                          ...(isNaN(numeric) ? [] : [{ price: numeric }]),
                        ],
                      },
                    },
                  },
                ],
              },
            },
          ];
        })()
      : []),

    // ===== STOCK + IN STOCK VARIANTS =====
    {
      $addFields: {
        inStock: {
          $anyElementTrue: "$variants.in_stock",
        },
        inStockVariants: {
          $filter: {
            input: "$variants",
            as: "v",
            cond: { $eq: ["$$v.in_stock", true] },
          },
        },
      },
    },

    // ===== USE IN STOCK VARIANTS IF AVAILABLE =====
    {
      $addFields: {
        usableVariants: {
          $cond: [
            { $gt: [{ $size: "$inStockVariants" }, 0] },
            "$inStockVariants",
            "$variants",
          ],
        },
      },
    },

    // ===== PRICE RANGE =====
    {
      $addFields: {
        minPrice: { $min: "$usableVariants.price" },
        maxPrice: { $max: "$usableVariants.price" },
        priceSame: {
          $eq: [
            { $min: "$usableVariants.price" },
            { $max: "$usableVariants.price" },
          ],
        },
      },
    },

    // ===== SAFE IMAGE EXTRACTION =====
    {
      $addFields: {
        image: {
          $let: {
            vars: {
              variantWithImage: {
                $first: {
                  $filter: {
                    input: "$usableVariants",
                    as: "v",
                    cond: { $gt: [{ $size: "$$v.images" }, 0] },
                  },
                },
              },
            },
            in: {
              $cond: [
                {
                  $gt: [
                    { $size: { $ifNull: ["$$variantWithImage.images", []] } },
                    0,
                  ],
                },
                { $arrayElemAt: ["$$variantWithImage.images", 0] },
                null,
              ],
            },
          },
        },
      },
    },

    // ===== SORT =====
    {
      $sort: {
        inStock: -1,
        createdAt: -1,
      },
    },
  ];

  // ===== TOTAL COUNT =====
  const totalRes = await Product.aggregate([...pipeline, { $count: "total" }]);

  const total = totalRes[0]?.total || 0;

  // ===== PAGINATED DATA =====
  const products = await Product.aggregate([
    ...pipeline,
    { $skip: skip },
    { $limit: limit },

    {
      $project: {
        id: "$_id",
        name: 1,
        code: 1,
        description: 1,
        category: 1,
        style: 1,
        type: 1,
        inStock: 1,
        image: { $ifNull: ["$image", null] },
        minPrice: 1,
        maxPrice: 1,
        priceSame: 1,
      },
    },
  ]);

  return {
    success: true,
    data: serialize(products),
    total,
    page,
    pages: Math.ceil(total / limit),
    hasMore: page * limit < total,
  };
}

export async function getProductDetails(id: string) {
  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return { success: false, error: "Invalid product ID" };
    }

    // 1. Fetch the main product and join its variants
    const productData = await Product.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      {
        $lookup: {
          from: "productvariants",
          localField: "_id",
          foreignField: "product_id",
          as: "variants",
        },
      },
    ]);

    if (!productData || productData.length === 0) {
      return { success: false, error: "Product not found" };
    }

    const product = productData[0];

    // 2. Fetch related products (same category, excluding current product)
    const relatedProducts = await Product.aggregate([
      {
        $match: {
          category: product.category,
          _id: { $ne: product._id },
        },
      },
      {
        $lookup: {
          from: "productvariants",
          localField: "_id",
          foreignField: "product_id",
          as: "variants",
        },
      },
      { $match: { "variants.0": { $exists: true } } }, // Must have variants
      {
        $addFields: {
          inStock: { $anyElementTrue: "$variants.in_stock" },
          inStockVariants: {
            $filter: {
              input: "$variants",
              as: "v",
              cond: { $eq: ["$$v.in_stock", true] },
            },
          },
        },
      },
      {
        $addFields: {
          usableVariants: {
            $cond: [
              { $gt: [{ $size: "$inStockVariants" }, 0] },
              "$inStockVariants",
              "$variants",
            ],
          },
        },
      },
      {
        $addFields: {
          minPrice: { $min: "$usableVariants.price" },
          image: {
            $let: {
              vars: {
                variantWithImage: {
                  $first: {
                    $filter: {
                      input: "$usableVariants",
                      as: "v",
                      cond: { $gt: [{ $size: "$$v.images" }, 0] },
                    },
                  },
                },
              },
              in: {
                $cond: [
                  {
                    $gt: [
                      { $size: { $ifNull: ["$$variantWithImage.images", []] } },
                      0,
                    ],
                  },
                  { $arrayElemAt: ["$$variantWithImage.images", 0] },
                  null,
                ],
              },
            },
          },
        },
      },
      { $limit: 4 },
      {
        $project: {
          id: "$_id",
          name: 1,
          category: 1,
          inStock: 1,
          image: { $ifNull: ["$image", null] },
          minPrice: 1,
        },
      },
    ]);

    return {
      success: true,
      data: {
        product: serialize(product),
        related: serialize(relatedProducts),
      },
    };
  } catch (error) {
    console.error("Error fetching product details:", error);
    return { success: false, error: "Failed to fetch product" };
  }
}
