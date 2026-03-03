"use server";

import { connectDB } from "@/lib/mongodb";
import Product from "@/models/product.model";
import Master from "@/models/master.model";
import Discount from "@/models/discount.model";
import { serialize } from "@/lib/serialize";
import mongoose from "mongoose";

/* ================= DISCOUNT HELPERS ================= */

function applyDiscount(price: number, percent: number) {
  return Math.round(price * (1 - percent / 100));
}

function resolveDiscountForProduct(product: any, activeDiscounts: any[]) {
  let productLevelDiscount: number | null = null;
  let variantDiscountMap: Record<string, number> = {};
  let hasVariantDiscount = false;

  for (const discount of activeDiscounts) {
    const value = discount.value;

    if (discount.type === "all") {
      productLevelDiscount = Math.max(productLevelDiscount || 0, value);
    }

    // CATEGORY
    if (
      discount.type === "category" &&
      discount.categories?.some(
        (id: any) => id.toString() === product.category?.toString(),
      )
    ) {
      productLevelDiscount = Math.max(productLevelDiscount || 0, value);
    }

    // STYLE
    if (
      discount.type === "style" &&
      discount.styles?.some(
        (id: any) => id.toString() === product.style?.toString(),
      )
    ) {
      productLevelDiscount = Math.max(productLevelDiscount || 0, value);
    }

    // TYPE
    if (
      discount.type === "type" &&
      discount.types?.some(
        (id: any) => id.toString() === product.type?.toString(),
      )
    ) {
      productLevelDiscount = Math.max(productLevelDiscount || 0, value);
    }

    if (
      discount.type === "product" &&
      discount.products?.some(
        (id: any) => id.toString() === product.id?.toString(),
      )
    ) {
      productLevelDiscount = Math.max(productLevelDiscount || 0, value);
    }

    if (discount.type === "variant") {
      for (const variant of product.variants || []) {
        const match = discount.variants?.some(
          (id: any) => id.toString() === variant._id?.toString(),
        );

        if (match) {
          variantDiscountMap[variant._id.toString()] = value;
          hasVariantDiscount = true;
        }
      }
    }
  }

  return {
    productLevelDiscount,
    variantDiscountMap,
    hasVariantDiscount,
  };
}

/**
 * GET STORE PRODUCTS
 * Original functionality preserved + discount logic layered on top.
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
  const now = new Date();

  const activeDiscounts = await Discount.find({
    isActive: true,
    startAt: { $lte: now },
    endAt: { $gte: now },
  }).lean();

  const productMatch: any = {};

  if (category && category !== "All") {
    productMatch.category = new mongoose.Types.ObjectId(category);
  }
  if (style && style !== "All") {
    productMatch.style = new mongoose.Types.ObjectId(style);
  }
  if (type && type !== "All") {
    productMatch.type = new mongoose.Types.ObjectId(type);
  }

  const escapeRegex = (str: string) =>
    str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const pipeline: any[] = [
    { $match: productMatch },

    {
      $lookup: {
        from: "productvariants",
        localField: "_id",
        foreignField: "product_id",
        as: "variants",
      },
    },

    { $match: { "variants.0": { $exists: true } } },

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
        maxPrice: { $max: "$usableVariants.price" },
        priceSame: {
          $eq: [
            { $min: "$usableVariants.price" },
            { $max: "$usableVariants.price" },
          ],
        },
      },
    },

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

    { $sort: { inStock: -1, createdAt: -1 } },
  ];

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
          variants: 1,
          usableVariants: 1,
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

  const products = productsRaw.map((p: any) => {
    const findName = (list: any[], id: any) =>
      list?.find((item: any) => item._id.toString() === id?.toString())?.name;

    const baseProduct = {
      ...p,
      categoryName: findName(masterDoc?.categories, p.category),
      styleName: findName(masterDoc?.styles, p.style),
      typeName: findName(masterDoc?.types, p.type),
    };

    /* ===== APPLY DISCOUNT ===== */
    /* ===== APPLY DISCOUNT ===== */

    const { productLevelDiscount, variantDiscountMap } =
      resolveDiscountForProduct(baseProduct, activeDiscounts);

    let discountedMinPrice: number | null = null;
    let discountPercent: number | null = null;
    let showVariantTagOnly = false;

    // 1️⃣ PRODUCT LEVEL DISCOUNT
    if (productLevelDiscount) {
      discountPercent = productLevelDiscount;
      discountedMinPrice = applyDiscount(
        baseProduct.minPrice,
        productLevelDiscount,
      );
    }

    // 2️⃣ VARIANT LEVEL DISCOUNT (ONLY IF NO PRODUCT DISCOUNT)
    if (!productLevelDiscount) {
      const visibleVariant = baseProduct.usableVariants?.[0];

      if (visibleVariant) {
        const visibleVariantId = visibleVariant._id?.toString();
        const visibleVariantDiscount = variantDiscountMap[visibleVariantId];

        const anyVariantHasDiscount =
          Object.keys(variantDiscountMap).length > 0;

        if (visibleVariantDiscount) {
          // Visible variant has discount
          discountPercent = visibleVariantDiscount;
          discountedMinPrice = applyDiscount(
            visibleVariant.price,
            visibleVariantDiscount,
          );
        } else if (anyVariantHasDiscount) {
          // Some other variant has discount
          showVariantTagOnly = true;
        }
      }
    }

    console.log({
      name: baseProduct.name,
      productLevelDiscount,
      variantDiscountMap,
      visibleVariant: baseProduct.usableVariants?.[0]?._id,
    });

    return {
      ...baseProduct,
      discountPercent,
      discountedMinPrice,
      showVariantTagOnly,
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
 * Fully preserves original functionality + adds variant level discount logic.
 */
export async function getProductDetails(id: string) {
  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return { success: false, error: "Invalid product ID" };
    }

    const now = new Date();

    const [productData, masterDoc, activeDiscounts] = await Promise.all([
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
      Discount.find({
        isActive: true,
        startAt: { $lte: now },
        endAt: { $gte: now },
      }).lean(),
    ]);

    if (!productData || productData.length === 0) {
      return { success: false, error: "Product not found" };
    }

    const productRaw = productData[0];

    const findName = (list: any[], id: any) =>
      list?.find((item: any) => item._id.toString() === id?.toString())?.name;

    let product: any = {
      ...productRaw,
      categoryName: findName(masterDoc?.categories, productRaw.category),
      styleName: findName(masterDoc?.styles, productRaw.style),
      typeName: findName(masterDoc?.types, productRaw.type),
    };

    /* ===== APPLY DISCOUNT TO PRODUCT PAGE ===== */

    const discountInfo = resolveDiscountForProduct(
      { ...product, id: product._id },
      activeDiscounts,
    );

    /* ===== APPLY DISCOUNT TO PRODUCT PAGE ===== */

    const { productLevelDiscount, variantDiscountMap } =
      resolveDiscountForProduct(
        { ...product, id: product._id },
        activeDiscounts,
      );

    product.variants = product.variants.map((variant: any) => {
      let percent: number | null = null;

      // Product-level discount overrides
      if (productLevelDiscount) {
        percent = productLevelDiscount;
      }

      // Otherwise check variant-level
      if (!percent) {
        const variantPercent = variantDiscountMap?.[variant._id?.toString()];
        if (variantPercent) {
          percent = variantPercent;
        }
      }

      if (percent) {
        return {
          ...variant,
          discountPercent: percent,
          discountedPrice: applyDiscount(variant.price, percent),
        };
      }

      return {
        ...variant,
        discountPercent: null,
        discountedPrice: null,
      };
    });

    /* ===== RELATED PRODUCTS (UNCHANGED) ===== */

    const relatedProductsRaw = await Product.aggregate([
      {
        $match: {
          category: productRaw.category,
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
