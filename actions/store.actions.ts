"use server";

import { connectDB } from "@/lib/mongodb";
import Product from "@/models/product.model";
import Master from "@/models/master.model";
import { serialize } from "@/lib/serialize";
import mongoose from "mongoose";

/**
 * GET STORE PRODUCTS
 * Handles complex filtering, searching across products/variants,
 * and dynamic name resolution for Category/Style/Type.
 */
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

  // 1. CAST STRINGS TO OBJECTIDS
  // Aggregation $match requires strict types unlike .find()
  if (category && category !== "All") {
    productMatch.category = new mongoose.Types.ObjectId(category);
  }
  if (style && style !== "All") {
    productMatch.style = new mongoose.Types.ObjectId(style);
  }
  if (type && type !== "All") {
    productMatch.type = new mongoose.Types.ObjectId(type);
  }

  // Escape regex helper
  const escapeRegex = (str: string) =>
    str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const pipeline: any[] = [
    // FILTER BY PRODUCT FIELDS
    { $match: productMatch },

    // JOIN VARIANTS
    {
      $lookup: {
        from: "productvariants",
        localField: "_id",
        foreignField: "product_id",
        as: "variants",
      },
    },

    // PRODUCT MUST HAVE AT LEAST ONE VARIANT
    {
      $match: {
        "variants.0": { $exists: true },
      },
    },

    // SEARCH (PRODUCT + VARIANT)
    ...(search
      ? (() => {
          const escaped = escapeRegex(search.trim());
          const regex = new RegExp(escaped, "i");
          const numeric = Number(search);

          return [
            {
              $match: {
                $or: [
                  { name: regex },
                  { code: regex },
                  { description: regex },
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

    // STOCK + IN STOCK VARIANTS LOGIC
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

    // USE IN STOCK VARIANTS IF AVAILABLE
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

    // PRICE RANGE
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

    // SAFE IMAGE EXTRACTION
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

    // SORT (In Stock first, then newest)
    {
      $sort: {
        inStock: -1,
        createdAt: -1,
      },
    },
  ];

  // FETCH DATA + MASTER CONFIG CONCURRENTLY
  const [totalRes, productsRaw, masterDoc] = await Promise.all([
    Product.aggregate([...pipeline, { $count: "total" }]),
    Product.aggregate([
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
    ]),
    Master.findOne().lean(),
  ]);

  const total = totalRes[0]?.total || 0;

  // 2. RESOLVE NAMES FROM MASTER IDS
  const products = productsRaw.map((p: any) => {
    const findName = (list: any[], id: any) =>
      list?.find((item: any) => item._id.toString() === id?.toString())?.name;

    return {
      ...p,
      categoryName: findName(masterDoc?.categories, p.category),
      styleName: findName(masterDoc?.styles, p.style),
      typeName: findName(masterDoc?.types, p.type),
    };
  });

  return {
    success: true,
    data: serialize(products),
    total,
    page,
    pages: Math.ceil(total / limit),
    hasMore: page * limit < total,
  };
}

/**
 * GET PRODUCT DETAILS
 * Fetches single product, its variants, and resolves category name for related products.
 */
export async function getProductDetails(id: string) {
  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return { success: false, error: "Invalid product ID" };
    }

    // Parallel fetch: Current Product + Master Config
    const [productData, masterDoc] = await Promise.all([
      Product.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(id) } },
        {
          $lookup: {
            from: "productvariants",
            localField: "_id",
            foreignField: "product_id",
            as: "variants",
          },
        },
      ]),
      Master.findOne().lean(),
    ]);

    if (!productData || productData.length === 0) {
      return { success: false, error: "Product not found" };
    }

    const productRaw = productData[0];

    // Resolve names for the main product
    const findName = (list: any[], id: any) =>
      list?.find((item: any) => item._id.toString() === id?.toString())?.name;

    const product = {
      ...productRaw,
      categoryName: findName(masterDoc?.categories, productRaw.category),
      styleName: findName(masterDoc?.styles, productRaw.style),
      typeName: findName(masterDoc?.types, productRaw.type),
    };

    // Related products logic (Same category, populated names)
    const relatedProductsRaw = await Product.aggregate([
      {
        $match: {
          category: productRaw.category, // Already an ObjectId in productRaw
          _id: { $ne: productRaw._id },
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
      { $match: { "variants.0": { $exists: true } } },
      {
        $addFields: {
          inStock: { $anyElementTrue: "$variants.in_stock" },
          usableVariants: {
            $cond: [
              { $anyElementTrue: "$variants.in_stock" },
              {
                $filter: {
                  input: "$variants",
                  as: "v",
                  cond: { $eq: ["$$v.in_stock", true] },
                },
              },
              "$variants",
            ],
          },
        },
      },
      {
        $addFields: {
          minPrice: { $min: "$usableVariants.price" },
          image: {
            $arrayElemAt: [{ $arrayElemAt: ["$usableVariants.images", 0] }, 0],
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

    const related = relatedProductsRaw.map((rp: any) => ({
      ...rp,
      categoryName: findName(masterDoc?.categories, rp.category),
    }));

    return {
      success: true,
      data: {
        product: serialize(product),
        related: serialize(related),
      },
    };
  } catch (error) {
    console.error("Error fetching product details:", error);
    return { success: false, error: "Failed to fetch product" };
  }
}
