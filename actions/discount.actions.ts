"use server";

import { connectDB } from "@/lib/mongodb";
import Discount from "@/models/discount.model";
import { serialize } from "@/lib/serialize";
import { revalidatePath } from "next/cache";

export async function createDiscount(data: any) {
  try {
    await connectDB();
    const created = await Discount.create(data);
    revalidatePath("/admin/discounts");
    return { success: true, data: serialize(created) };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function updateDiscount(id: string, data: any) {
  try {
    await connectDB();
    const updated = await Discount.findByIdAndUpdate(id, data, { new: true });
    revalidatePath("/admin/discounts");
    return { success: true, data: serialize(updated) };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function deleteDiscount(id: string) {
  try {
    await connectDB();
    await Discount.findByIdAndDelete(id);
    revalidatePath("/admin/discounts");
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

// ================= GET DISCOUNTS =================
export async function getDiscounts({
  search = "",
  page = 1,
  limit = 20,
  type,
  status,
}: {
  search?: string;
  page?: number;
  limit?: number;
  type?: string;
  status?: string;
}) {
  try {
    await connectDB();

    const query: any = {};

    // 🔍 SEARCH (name, value, startAt, endAt)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { value: isNaN(Number(search)) ? undefined : Number(search) },
        {
          startAt: {
            $gte: new Date(search),
            $lte: new Date(search),
          },
        },
        {
          endAt: {
            $gte: new Date(search),
            $lte: new Date(search),
          },
        },
      ].filter(Boolean);
    }

    // 🎯 TYPE FILTER
    if (type && type !== "All") {
      query.type = type;
    }

    // 🟢 STATUS FILTER
    if (status && status !== "All") {
      const now = new Date();

      if (status === "active") {
        query.isActive = true;
        query.startAt = { $lte: now };
        query.endAt = { $gte: now };
      }

      if (status === "inactive") {
        query.$or = [
          { isActive: false },
          { startAt: { $gt: now } },
          { endAt: { $lt: now } },
        ];
      }
    }

    const skip = (page - 1) * limit;

    const [discounts, total] = await Promise.all([
      Discount.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Discount.countDocuments(query),
    ]);

    return {
      success: true,
      data: serialize({
        discounts,
        total,
        pages: Math.ceil(total / limit),
        page,
      }),
    };
  } catch (error: any) {
    throw new Error(error?.message || "Failed to fetch discounts");
  }
}

// Used by Product Card / Client to calculate prices
export async function getActiveDiscounts() {
  try {
    await connectDB();
    const now = new Date();
    const discounts = await Discount.find({
      isActive: true,
      startAt: { $lte: now },
      endAt: { $gte: now },
    }).lean();
    return { success: true, data: serialize(discounts) };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

// ================= GET DISCOUNT BY ID =================
export async function getDiscountById(id: string) {
  try {
    await connectDB();

    if (!id) throw new Error("Discount id required");

    const discount = await Discount.findById(id).lean();

    if (!discount) throw new Error("Discount not found");

    return {
      success: true,
      data: serialize(discount),
    };
  } catch (error: any) {
    throw new Error(error?.message || "Failed to fetch discount");
  }
}
